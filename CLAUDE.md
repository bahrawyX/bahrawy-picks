# CLAUDE.md

Project-specific instructions for Claude Code.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript (strict)
- **Styling**: Tailwind CSS v3 — oklch() colors do NOT work, use standard Tailwind colors only
- **Animation**: Framer Motion v12
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Editor**: Monaco Editor (@monaco-editor/react)

## Project Structure

- `components/bahrawy/` — Reusable component library (barrel export via `index.ts`)
- `components/showcase/` — Demo page utilities (DocsPage, DemoCard, CodeBlock, ControlPanel, registry)
- `app/components/[slug]/page.tsx` — Individual component demo pages
- `lib/registry.ts` — CLI registry (title, slug, description)
- `components/showcase/registry.tsx` — Showcase registry (kind: ready/docs/soon, categories, dependencies)

## Component Conventions

- Always add `'use client'` at top of component files
- Animation components define their own spring/tween configs locally, NOT from `lib/motion.ts`
- Every component must be exported from `components/bahrawy/index.ts` (component + types)
- Every component needs entries in BOTH `lib/registry.ts` AND `components/showcase/registry.tsx`

## Theming

Surface tokens live in `app/globals.css` under `:root` (prefix `--picks-`). Components reference them as `var(--picks-*, <dark-fallback>)`, so with no overrides set everything renders the current dark look — the fallbacks ARE the old hardcoded values.

| Token | Default | Used for |
| --- | --- | --- |
| `--picks-surface` | `#09090b` | Page-ish background — status-dot "punch-out" rings (AvatarStatus, ProfileCard, AvatarGroup), ScrollRail edge masks |
| `--picks-surface-raised` | `#1c1c1e` | Raised panels / image placeholders |
| `--picks-fg` | `#ffffff` | Primary text / default loader & indicator color |
| `--picks-fg-muted` | `rgba(255, 255, 255, 0.65)` | Secondary / muted text (e.g. LoaderDots label) |
| `--picks-border` | `rgba(255, 255, 255, 0.08)` | Hairline borders |

Consumers override by redefining tokens on `:root` (or any ancestor — the vars cascade, so a scoped wrapper works too):

```css
.my-light-section {
  --picks-surface: #fafafa;
  --picks-fg: #111111;
}
```

- Full light mode is NOT supported yet — this is a foundation pass; many components still hardcode dark values.
- When adding new components, prefer `var(--picks-*, <dark-value>)` over raw hex for surface/fg/border colors.
- Per-instance prop overrides beat the tokens: `ringColor` (AvatarStatus), `maskColor` (ScrollRail), `color` (LoaderDots/ScrollProgress).

## Demo Page Pattern

Each component gets its own page at `app/components/{slug}/page.tsx`:

```
DocsPage > DocsSection > DemoCard + ControlPanel + CodeBlock
```

- Use `key={key}` on animated components to enable replay via `setKey(k => k + 1)`
- Set `once={false}` on scroll-triggered animations so key-based replay works
- Generate dynamic code snippets from current control state

## Flexbox Overflow Rules (CRITICAL)

When building flex layouts inside fixed-width containers (grid cells, cards, panels):

1. **Always add `min-w-0` on flex-1 children** — Without it, flex items won't shrink below their content's intrinsic width (especially `input[type=range]`). This is the #1 cause of content overflowing containers.
2. **Always add `overflow-hidden` on the flex container** — Safety net to clip anything that still overflows.
3. **Use `shrink-0` on fixed-width elements** (labels, values) to prevent them from being squished.
4. **Use `gap-2` not `gap-3`** in tight grid cells — saves 4px per gap that prevents overflow.
5. **Use `truncate` on labels** that might be long to prevent them from pushing other elements out.

Bad:
```tsx
<div className="flex items-center gap-3">
  <span className="shrink-0">{label}</span>
  <input type="range" className="flex-1" />  {/* Won't shrink! */}
  <span className="min-w-[3rem]">{value}</span>  {/* Can overflow */}
</div>
```

Good:
```tsx
<div className="flex items-center gap-2 overflow-hidden">
  <span className="shrink-0">{label}</span>
  <input type="range" className="min-w-0 flex-1" />  {/* min-w-0 = can shrink */}
  <span className="shrink-0">{value}</span>
</div>
```

## Registry Rules

- `lib/registry.ts`: Simple `{ title, slug, description }` — used by CLI
- `components/showcase/registry.tsx`: Full entry with `kind`, `id`, `category`, `dependencies`
  - `kind: 'ready'` — has Preview component + props table
  - `kind: 'docs'` — has dedicated demo page
  - `kind: 'soon'` — only shows slug + name + category (no description, no hasOptions, no dependencies)

## Known Issues

- `__tests__/bahrawy/spreadsheet-input.test.tsx` has a pre-existing TS error (`Property 'style' does not exist on type 'Element'`) — not related to component work
- dnd-kit causes harmless hydration mismatch warnings (`aria-describedby` IDs differ server vs client)
