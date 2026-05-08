import { ImageResponse } from 'next/og'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: '#18181b',
          borderRadius: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: 108,
          fontWeight: 800,
          fontFamily: 'sans-serif',
          letterSpacing: '-4px',
        }}
      >
        S
      </div>
    ),
    { width: 192, height: 192 },
  )
}
