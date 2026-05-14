# SpeechLab PWA — UI Kit

A React recreation of the SpeechLab mobile app, the one product Webroids actually ships. Six screens, click-through navigation, real components.

## Run

Open `index.html` directly — it loads React, Babel, and the kit's JSX scripts inline. No build step.

## What's in the box

| File | Purpose |
|---|---|
| `index.html` | Mounts the app inside an iOS frame |
| `tokens.css` | Re-exports root design tokens scoped to the kit |
| `ios-frame.jsx` | Device bezel (status bar, home indicator) |
| `primitives.jsx` | `VLRing`, `VLArcGauge`, `LabelCaps`, `Pill`, `Button`, `Icon`, `FabMic` |
| `nav.jsx` | `BottomNav` with mic FAB + screen routing |
| `screens.jsx` | All six screens |
| `data.js` | Sample data — topics, frameworks, recordings, scores |
| `app.jsx` | Root component + screen state |

## Screens

1. **Home** — greeting, Today's Drill card, streak tiles, config controls, Recent list
2. **Record** — full-screen dark, coral mic with halo, waveform, timer
3. **Feedback** — arc gauge, voice timeline, sub-score rings, coaching items, metric tiles
4. **Library** — recording list with score rings + category/duration pills
5. **Frameworks** — coloured glyph + tagline + description per framework
6. **Trends** — score / WPM / filler-ratio line charts, top fillers list

## Click-through

- Tap any pill or recent recording on **Home** → goes to **Feedback** for that recording
- Tap **mic FAB** or "Aufnahme starten" → **Record** screen (timed; live waveform; tap stop to finish)
- After Record → returns to **Feedback** with a fresh result
- Bottom nav switches between the four main tabs

## Notes

- Audio is mocked — the waveform/timer animate without real mic capture
- Whisper/Claude responses use static sample data in `data.js`
- Score colours follow VLRing rules: ≥80 sage, ≥60 amber, &lt;60 coral
