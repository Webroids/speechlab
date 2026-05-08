import { ImageResponse } from 'next/og'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: '#18181b',
          borderRadius: 112,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: 288,
          fontWeight: 800,
          fontFamily: 'sans-serif',
          letterSpacing: '-12px',
        }}
      >
        S
      </div>
    ),
    { width: 512, height: 512 },
  )
}
