import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage:
            'radial-gradient(120% 100% at 30% 20%, rgba(167,139,250,0.4) 0%, transparent 60%), radial-gradient(120% 100% at 80% 90%, rgba(96,165,250,0.25) 0%, transparent 55%)',
          color: '#ffffff',
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: -4,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        B
      </div>
    ),
    { ...size },
  )
}
