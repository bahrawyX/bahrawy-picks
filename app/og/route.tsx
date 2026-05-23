import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { registry } from '@/components/showcase/registry'
import { getCategoryLabel } from '@/lib/seo'

export const runtime = 'edge'

const CATEGORY_ACCENT: Record<string, string> = {
  form: '#22D3EE',
  overlay: '#A78BFA',
  card: '#F472B6',
  data: '#34D399',
  layout: '#60A5FA',
  navigation: '#FBBF24',
  hero: '#FB923C',
  section: '#A78BFA',
  pricing: '#F472B6',
  footer: '#94A3B8',
  text: '#22D3EE',
  motion: '#A78BFA',
  scroll: '#34D399',
  cursor: '#F472B6',
  'gsap-section': '#FB923C',
  background: '#60A5FA',
  decoration: '#FBBF24',
  ui: '#94A3B8',
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const slug = searchParams.get('slug') ?? ''

  const entry = registry.find((e) => e.slug === slug && e.kind !== 'soon')
  const name = entry?.name ?? 'Bahrawy'
  const description =
    (entry && 'description' in entry ? entry.description : null) ??
    'Beautifully crafted React components.'
  const category = entry?.category ?? 'ui'
  const categoryLabel = getCategoryLabel(category)
  const accent = CATEGORY_ACCENT[category] ?? '#A78BFA'
  const deps =
    entry && 'dependencies' in entry ? entry.dependencies.slice(0, 3) : []

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
          backgroundImage: `radial-gradient(120% 100% at 20% 20%, ${accent}44 0%, transparent 55%), radial-gradient(140% 100% at 90% 90%, ${accent}22 0%, transparent 55%)`,
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top row */}
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
              gap: 14,
              fontSize: 24,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                fontSize: 24,
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
              fontSize: 18,
              color: accent,
              fontWeight: 600,
              padding: '8px 16px',
              border: `1px solid ${accent}55`,
              borderRadius: 999,
              background: `${accent}11`,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {categoryLabel}
          </div>
        </div>

        {/* Component name + description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: name.length > 18 ? 88 : 110,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -4,
              maxWidth: 1040,
              textShadow: `0 0 60px ${accent}66`,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.3,
              maxWidth: 1000,
              display: 'block',
              overflow: 'hidden',
            }}
          >
            {description.length > 180
              ? description.slice(0, 177) + '…'
              : description}
          </div>
        </div>

        {/* Bottom row */}
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
              gap: 10,
              alignItems: 'center',
            }}
          >
            {deps.length > 0 ? (
              deps.map((dep) => (
                <div
                  key={dep}
                  style={{
                    display: 'flex',
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.55)',
                    padding: '6px 12px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)',
                    fontFamily: 'monospace',
                  }}
                >
                  {dep}
                </div>
              ))
            ) : (
              <div
                style={{
                  display: 'flex',
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                no dependencies
              </div>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 500,
            }}
          >
            bahrawy.me/components/{slug || ''}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
