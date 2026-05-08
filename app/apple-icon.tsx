import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#18181b',
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 100,
          fontWeight: 800,
          fontFamily: 'sans-serif',
          letterSpacing: '-4px',
        }}
      >
        S
      </div>
    ),
    { ...size },
  )
}
