import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: -1,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        B
      </div>
    ),
    { ...size },
  )
}
