'use client'

// MediaPipe landmark indices (face mesh v2 / 478-point model)
// https://developers.google.com/mediapipe/solutions/vision/face_landmarker
const LM = {
  UPPER_LIP:     13,
  LOWER_LIP:     14,
  MOUTH_LEFT:    61,
  MOUTH_RIGHT:   291,
  LEFT_EYE_TOP:  159,
  LEFT_EYE_BOT:  145,
  RIGHT_EYE_TOP: 386,
  RIGHT_EYE_BOT: 374,
  LEFT_BROW_IN:  107,
  LEFT_BROW_OUT: 55,
  LEFT_EYE_IN:   133,
  NOSE_TIP:      4,
  FOREHEAD:      10,
  CHIN:          152,
}

// Hand landmark: wrist = 0, index MCP = 5, middle MCP = 9, ring MCP = 13, pinky MCP = 17
const HAND_CENTER = 9 // middle finger MCP — stable reference point

export interface BodySample {
  t: number             // seconds from start
  faceVisible: boolean
  headYaw: number       // -1 (left) to 1 (right) — eye contact proxy
  headPitch: number     // -1 (down) to 1 (up)
  mouthOpen: number     // 0-1
  smile: number         // 0-1
  browRaise: number     // 0-1 (expressiveness)
  eyeOpen: number       // 0-1 avg both eyes
  lHand: boolean
  rHand: boolean
  lHandX: number        // normalized 0-1 position
  lHandY: number
  rHandX: number
  rHandY: number
}

export interface BodyAnalysisResult {
  samples: BodySample[]
  summary: {
    faceDetectedPct: number
    eyeContactPct: number        // face yaw near 0
    avgSmile: number
    avgBrowRaise: number
    gestureActivePct: number     // at least one hand visible
    gestureEnergy: number        // 0-1 hand movement variance
    dominantExpression: 'neutral' | 'happy' | 'focused' | 'expressive'
  }
}

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
const FACE_MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
const HAND_MODEL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

// Sample every N ms of video — lower = more accurate, slower
const SAMPLE_STEP_MS = 500

export async function analyzeBodyLanguage(
  videoBlob: Blob,
  onProgress: (pct: number) => void,
): Promise<BodyAnalysisResult> {
  // Dynamic import — MediaPipe is browser-only, large WASM
  const { FaceLandmarker, HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')

  onProgress(5)

  const filesetResolver = await FilesetResolver.forVisionTasks(WASM_URL)

  const [faceLandmarker, handLandmarker] = await Promise.all([
    FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: { modelAssetPath: FACE_MODEL, delegate: 'CPU' },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: false,
    }),
    HandLandmarker.createFromOptions(filesetResolver, {
      baseOptions: { modelAssetPath: HAND_MODEL, delegate: 'CPU' },
      runningMode: 'VIDEO',
      numHands: 2,
    }),
  ])

  onProgress(20)

  // Create hidden video element to seek through
  const url = URL.createObjectURL(videoBlob)
  const video = document.createElement('video')
  video.src = url
  video.muted = true
  video.playsInline = true
  video.crossOrigin = 'anonymous'

  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve()
    video.onerror = reject
    video.load()
  })

  // Wait for first decodeable frame so videoWidth/Height are known
  await new Promise<void>((resolve) => {
    if (video.readyState >= 2) { resolve(); return }
    video.onloadeddata = () => resolve()
  })

  // Canvas: draw each frame here before passing to MediaPipe
  // Prevents "detectForVideo on unrendered frame" crashes
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth || 640
  canvas.height = video.videoHeight || 480
  const ctx = canvas.getContext('2d')!

  const duration = video.duration * 1000 // ms
  const samples: BodySample[] = []
  const steps = Math.ceil(duration / SAMPLE_STEP_MS)
  let prevLHandPos: { x: number; y: number } | null = null
  let prevRHandPos: { x: number; y: number } | null = null
  let totalHandMove = 0
  let handMoveCount = 0

  for (let step = 0; step < steps; step++) {
    const timeMs = step * SAMPLE_STEP_MS
    video.currentTime = timeMs / 1000

    await new Promise<void>((resolve) => {
      const handler = () => { video.removeEventListener('seeked', handler); resolve() }
      video.addEventListener('seeked', handler)
    })

    // Draw current frame to canvas — ensures pixel data is available before inference
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const t = Math.round((timeMs / 1000) * 10) / 10
    // MediaPipe timestamp must be > 0 and strictly increasing
    const mpTs = timeMs + 1

    // Face
    let faceResult: Awaited<ReturnType<typeof faceLandmarker.detectForVideo>> | null = null
    try { faceResult = faceLandmarker.detectForVideo(canvas, mpTs) } catch { /* skip frame */ }
    const faceVisible = (faceResult?.faceLandmarks?.length ?? 0) > 0
    let headYaw = 0, headPitch = 0, mouthOpen = 0, smile = 0, browRaise = 0, eyeOpen = 0

    if (faceVisible && faceResult) {
      const lm = faceResult.faceLandmarks[0]!

      const ul = lm[LM.UPPER_LIP]!
      const ll = lm[LM.LOWER_LIP]!
      const ml = lm[LM.MOUTH_LEFT]!
      const mr = lm[LM.MOUTH_RIGHT]!
      const letTop = lm[LM.LEFT_EYE_TOP]!
      const letBot = lm[LM.LEFT_EYE_BOT]!
      const retTop = lm[LM.RIGHT_EYE_TOP]!
      const retBot = lm[LM.RIGHT_EYE_BOT]!
      const lbIn  = lm[LM.LEFT_BROW_IN]!
      const lEyeIn = lm[LM.LEFT_EYE_IN]!
      const nose  = lm[LM.NOSE_TIP]!
      const fore  = lm[LM.FOREHEAD]!
      const chin  = lm[LM.CHIN]!

      // Mouth openness (normalized by face height)
      const faceH = Math.abs(fore.y - chin.y) || 0.001
      mouthOpen = Math.min(1, Math.abs(ll.y - ul.y) / (faceH * 0.15))

      // Smile: mouth corners higher than center (y axis inverted in normalized coords)
      const mouthCenterY = (ul.y + ll.y) / 2
      const cornerLift = mouthCenterY - (ml.y + mr.y) / 2
      smile = Math.min(1, Math.max(0, cornerLift * 20))

      // Brow raise: brow above eye
      const browEyeDist = Math.abs(lEyeIn.y - lbIn.y) / faceH
      browRaise = Math.min(1, Math.max(0, (browEyeDist - 0.12) * 8))

      // Eye openness
      const leftOpen  = Math.abs(letBot.y - letTop.y) / faceH
      const rightOpen = Math.abs(retBot.y - retTop.y) / faceH
      eyeOpen = Math.min(1, ((leftOpen + rightOpen) / 2) / 0.05)

      // Head yaw from nose x position (0.5 = center)
      headYaw = (nose.x - 0.5) * 2

      // Head pitch from nose y vs midpoint of forehead-chin
      const midY = (fore.y + chin.y) / 2
      headPitch = -((nose.y - midY) / (faceH * 0.5))
    }

    // Hands
    let handResult: Awaited<ReturnType<typeof handLandmarker.detectForVideo>> | null = null
    try { handResult = handLandmarker.detectForVideo(canvas, mpTs) } catch { /* skip frame */ }
    let lHand = false, rHand = false
    let lHandX = 0, lHandY = 0, rHandX = 0, rHandY = 0

    for (let h = 0; h < (handResult?.handedness?.length ?? 0); h++) {
      const side = handResult!.handedness[h]?.[0]?.categoryName
      const lm = handResult!.landmarks[h]
      if (!lm) continue
      const center = lm[HAND_CENTER]!
      if (side === 'Left') {
        lHand = true
        lHandX = center.x
        lHandY = center.y
        if (prevLHandPos) {
          const dx = center.x - prevLHandPos.x
          const dy = center.y - prevLHandPos.y
          totalHandMove += Math.sqrt(dx * dx + dy * dy)
          handMoveCount++
        }
        prevLHandPos = { x: center.x, y: center.y }
      } else {
        rHand = true
        rHandX = center.x
        rHandY = center.y
        if (prevRHandPos) {
          const dx = center.x - prevRHandPos.x
          const dy = center.y - prevRHandPos.y
          totalHandMove += Math.sqrt(dx * dx + dy * dy)
          handMoveCount++
        }
        prevRHandPos = { x: center.x, y: center.y }
      }
    }

    samples.push({
      t,
      faceVisible,
      headYaw: Math.round(headYaw * 100) / 100,
      headPitch: Math.round(headPitch * 100) / 100,
      mouthOpen: Math.round(mouthOpen * 100) / 100,
      smile: Math.round(smile * 100) / 100,
      browRaise: Math.round(browRaise * 100) / 100,
      eyeOpen: Math.round(eyeOpen * 100) / 100,
      lHand, rHand,
      lHandX: Math.round(lHandX * 100) / 100,
      lHandY: Math.round(lHandY * 100) / 100,
      rHandX: Math.round(rHandX * 100) / 100,
      rHandY: Math.round(rHandY * 100) / 100,
    })

    onProgress(20 + Math.round((step / steps) * 75))
  }

  // Cleanup
  faceLandmarker.close()
  handLandmarker.close()
  URL.revokeObjectURL(url)

  // Compute summary
  const n = samples.length || 1
  const faceCount = samples.filter((s) => s.faceVisible).length
  const eyeContactCount = samples.filter((s) => s.faceVisible && Math.abs(s.headYaw) < 0.25).length
  const gestureCount = samples.filter((s) => s.lHand || s.rHand).length
  const avgSmile = samples.reduce((a, s) => a + s.smile, 0) / n
  const avgBrow = samples.reduce((a, s) => a + s.browRaise, 0) / n
  const gestureEnergy = handMoveCount > 0 ? Math.min(1, (totalHandMove / handMoveCount) * 15) : 0

  let dominantExpression: BodyAnalysisResult['summary']['dominantExpression'] = 'neutral'
  if (avgSmile > 0.15) dominantExpression = 'happy'
  else if (avgBrow > 0.3) dominantExpression = 'expressive'
  else if (samples.filter((s) => s.faceVisible && s.browRaise < 0.1 && s.smile < 0.05).length / n > 0.6) dominantExpression = 'focused'

  onProgress(100)

  return {
    samples,
    summary: {
      faceDetectedPct: Math.round((faceCount / n) * 100),
      eyeContactPct: faceCount > 0 ? Math.round((eyeContactCount / faceCount) * 100) : 0,
      avgSmile: Math.round(avgSmile * 100) / 100,
      avgBrowRaise: Math.round(avgBrow * 100) / 100,
      gestureActivePct: Math.round((gestureCount / n) * 100),
      gestureEnergy: Math.round(gestureEnergy * 100) / 100,
      dominantExpression,
    },
  }
}
