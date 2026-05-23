import { ImageResponse } from 'next/og'
import { registry } from '@/components/showcase/registry'

export const alt = 'Bahrawy — Beautifully crafted React components'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const count = registry.filter((e) => e.kind !== 'soon').length

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#050505',
          backgroundImage:
            'radial-gradient(120% 100% at 20% 20%, rgba(167,139,250,0.35) 0%, transparent 55%), radial-gradient(140% 100% at 90% 90%, rgba(96,165,250,0.25) 0%, transparent 55%), radial-gradient(80% 80% at 60% 50%, rgba(244,114,182,0.12) 0%, transparent 60%)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top row: wordmark + count */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                fontSize: 32,
                fontWeight: 800,
              }}
            >
              B
            </div>
            <span>Bahrawy</span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              color: 'rgba(255,255,255,0.55)',
              fontWeight: 500,
              padding: '10px 18px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            {count}+ components
          </div>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -3,
              maxWidth: 1000,
            }}
          >
            Beautifully crafted React components
          </div>
          <div
            style={{
              fontSize: 30,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.3,
              maxWidth: 880,
            }}
          >
            Animated, accessible, copy-paste-ready. Tailwind · Framer Motion · GSAP · Radix.
          </div>
        </div>

        {/* Bottom row: url */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: 22,
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 500,
          }}
        >
          <span>bahrawy.me</span>
          <span>Open source · MIT</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
