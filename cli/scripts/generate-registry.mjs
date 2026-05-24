#!/usr/bin/env node
// AUTO-GENERATE the CLI registry from the project's component files.
//
//   node cli/scripts/generate-registry.mjs
//
// For every entry in lib/registry.ts:
//   - find the source file at components/bahrawy/{slug}.tsx or
//     components/bahrawy/{slug}/ (folder + index)
//   - parse imports → classify into npm deps + shadcn deps
//   - emit a CLI RegistryEntry
//
// Writes the result to cli/src/lib/registry.ts.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..', '..')
const componentsDir = path.join(root, 'components', 'bahrawy')

// ── Parse lib/registry.ts ─────────────────────────────────────────────────
const libSrc = fs.readFileSync(path.join(root, 'lib', 'registry.ts'), 'utf-8')

// Match each `{ title: '…', slug: '…', description: '…' }` block.
const entryRe =
  /\{\s*title:\s*['"]([^'"]+)['"],\s*slug:\s*['"]([^'"]+)['"],\s*description:\s*([`'"])([\s\S]*?)\3\s*,?\s*\}/g

const entries = []
let m
while ((m = entryRe.exec(libSrc)) !== null) {
  entries.push({
    title: m[1],
    slug: m[2],
    description: m[4].replace(/\s+/g, ' ').trim(),
  })
}

// ── Find each component's files ───────────────────────────────────────────
function findFiles(slug) {
  const single = path.join(componentsDir, `${slug}.tsx`)
  const folder = path.join(componentsDir, slug)
  // Many text effects live in components/bahrawy/animations/{slug}.tsx
  // and are re-exported via the animations barrel.
  const inAnimations = path.join(componentsDir, 'animations', `${slug}.tsx`)
  if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
    const out = []
    const walk = (dir, rel = '') => {
      for (const f of fs.readdirSync(dir)) {
        const full = path.join(dir, f)
        const stat = fs.statSync(full)
        if (stat.isDirectory()) walk(full, path.join(rel, f))
        else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
          out.push(path.posix.join(slug, rel.replace(/\\/g, '/'), f))
        }
      }
    }
    walk(folder)
    return out
  }
  if (fs.existsSync(single)) return [`${slug}.tsx`]
  if (fs.existsSync(inAnimations)) return [`animations/${slug}.tsx`]
  return null
}

// ── Classify imports ──────────────────────────────────────────────────────
const SKIP = new Set([
  'react',
  'react-dom',
  'next/font/google',
  'next/image',
  'next/link',
  'next/dynamic',
  'next/navigation',
  'next/headers',
  'next/server',
])

function parseImports(file) {
  const c = fs.readFileSync(file, 'utf-8')
  const re = /from\s+['"]([^'"]+)['"]/g
  const out = new Set()
  let mm
  while ((mm = re.exec(c)) !== null) out.add(mm[1])
  return [...out]
}

function classify(imports) {
  const deps = new Set()
  const shadcn = new Set()
  for (const imp of imports) {
    if (imp.startsWith('@/components/ui/')) {
      shadcn.add(imp.replace('@/components/ui/', '').split('/')[0])
      continue
    }
    if (imp.startsWith('@/') || imp.startsWith('.')) continue
    const pkg = imp.startsWith('@')
      ? imp.split('/').slice(0, 2).join('/')
      : imp.split('/')[0]
    if (SKIP.has(pkg) || SKIP.has(imp)) continue
    deps.add(pkg)
  }
  return {
    dependencies: [...deps].sort(),
    shadcnComponents: [...shadcn].sort(),
  }
}

// ── Build CLI entries ─────────────────────────────────────────────────────
const out = []
let skipped = 0
for (const e of entries) {
  const files = findFiles(e.slug)
  if (!files || files.length === 0) {
    console.warn(`⚠  Skipping "${e.slug}" — no source file under components/bahrawy/`)
    skipped++
    continue
  }
  const all = new Set()
  for (const f of files) {
    const full = path.join(componentsDir, f)
    if (fs.existsSync(full)) parseImports(full).forEach((i) => all.add(i))
  }
  const { dependencies, shadcnComponents } = classify([...all])
  out.push({
    name: e.slug,
    title: e.title,
    description: e.description,
    files,
    dependencies,
    shadcnComponents,
  })
}

// ── Emit cli/src/lib/registry.ts ──────────────────────────────────────────
let src = `// AUTO-GENERATED — do not edit by hand.
// Regenerate via: node cli/scripts/generate-registry.mjs

export interface RegistryEntry {
  name: string
  title: string
  description: string
  files: string[]
  dependencies: string[]
  shadcnComponents: string[]
  devDependencies?: string[]
}

export const registry: RegistryEntry[] = [
`
for (const e of out) {
  src += `  {\n`
  src += `    name: ${JSON.stringify(e.name)},\n`
  src += `    title: ${JSON.stringify(e.title)},\n`
  src += `    description: ${JSON.stringify(e.description)},\n`
  src += `    files: ${JSON.stringify(e.files)},\n`
  src += `    dependencies: ${JSON.stringify(e.dependencies)},\n`
  src += `    shadcnComponents: ${JSON.stringify(e.shadcnComponents)},\n`
  src += `  },\n`
}
src += `]

/**
 * Shared files every Bahrawy component depends on.
 * Copied once if they don't already exist.
 */
export const sharedFiles = [
  { src: 'lib/utils.ts', dest: 'lib/utils.ts' },
]

export const GITHUB_RAW_BASE =
  'https://raw.githubusercontent.com/bahrawyX/bahrawy-picks/main'

export function getEntry(name: string): RegistryEntry | undefined {
  return registry.find((e) => e.name === name)
}
`

fs.writeFileSync(path.join(root, 'cli', 'src', 'lib', 'registry.ts'), src)
console.log(`✓ Wrote ${out.length} entries to cli/src/lib/registry.ts (skipped ${skipped})`)
