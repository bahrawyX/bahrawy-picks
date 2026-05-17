import prompts from 'prompts'
import pc from 'picocolors'
import { registry, getEntry } from '../lib/registry.js'
import { checkShadcnSetup, installComponent } from '../lib/installer.js'
import { log } from '../lib/logger.js'

export interface AddOptions {
  force?: boolean
  cwd?: string
}

export async function addCommand(
  components: string[],
  opts: AddOptions
): Promise<void> {
  const cwd = opts.cwd ?? process.cwd()

  // ── 1. Pre-flight: check shadcn setup ─────────────────────────
  if (!checkShadcnSetup(cwd)) {
    log.warn(
      'No shadcn/ui setup detected (missing components.json).'
    )
    log.dim('  Run: npx shadcn@latest init')
    log.dim('  Then try again.')
    process.exit(1)
  }

  // ── 2. Interactive picker if no component specified ───────────
  if (components.length === 0) {
    const { selected } = await prompts(
      {
        type: 'multiselect',
        name: 'selected',
        message: 'Which components would you like to add?',
        choices: registry.map((entry) => ({
          title: `${entry.title} ${pc.dim(`— ${entry.description}`)}`,
          value: entry.name,
        })),
        hint: 'Space to select, Enter to confirm',
      },
      {
        onCancel: () => {
          log.dim('Cancelled.')
          process.exit(0)
        },
      }
    )

    if (!selected || selected.length === 0) {
      log.dim('No components selected.')
      return
    }

    components = selected
  }

  // ── 3. Validate all names first ───────────────────────────────
  const entries = components.map((name) => {
    const entry = getEntry(name)
    if (!entry) {
      log.error(`Component "${name}" not found in registry.`)
      log.dim(`  Run ${pc.bold('bahrawy list')} to see available components.`)
      process.exit(1)
    }
    return entry
  })

  // ── 4. Install each component ─────────────────────────────────
  for (const entry of entries) {
    console.log()
    log.bold(`── ${entry.title} ${'─'.repeat(Math.max(0, 50 - entry.title.length))}`)
    console.log()
    try {
      await installComponent(entry, cwd, { force: opts.force })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log.error(msg)
      process.exit(1)
    }
  }

  // ── 5. Done ───────────────────────────────────────────────────
  if (entries.length > 1) {
    console.log()
    log.success(
      `Done! ${entries.length} component(s) installed.`
    )
  }
}
