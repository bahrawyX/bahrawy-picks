# Bahrawy Picks — Favicon Package
## "Tilted Stack" mark

### Files
- `favicon.svg` — master, vector, infinitely scalable (use this first)
- `favicon-mark.svg` — bars only, transparent bg, inherits `currentColor` for headers/logos
- `favicon-maskable.svg` — same design with safe-zone padding for iOS/Android masking
- `favicon-16.png` / `favicon-32.png` / `favicon-48.png` / `favicon-96.png` — classic favicons
- `apple-touch-icon.png` (180×180) — iOS home screen
- `android-chrome-192.png` / `android-chrome-512.png` — Android / PWA
- `favicon-1024.png` — master raster (social, OG, etc.)
- `site.webmanifest` — PWA manifest

### Install (Next.js / any web app)
Drop everything into your `public/` (or `app/`) folder, then in your root layout:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
<link rel="icon" href="/favicon-16.png" sizes="16x16" type="image/png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#0A0A0A" />
```

### Next.js App Router shortcut
Rename to match Next conventions and drop in `/app`:
- `favicon.svg` → `/app/icon.svg`
- `apple-touch-icon.png` → `/app/apple-icon.png`

Next will auto-generate the link tags.

### Colors
- Ink:   `#0A0A0A`
- Paper: `#F4F2EC`
- Lime:  `#E6FF5C`
