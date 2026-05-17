import pc from 'picocolors';
import { registry } from '../lib/registry.js';
import { isInstalled } from '../lib/installer.js';
import { log } from '../lib/logger.js';
export function listCommand(opts) {
    const cwd = opts.cwd ?? process.cwd();
    console.log();
    log.bold('Bahrawy Components');
    console.log();
    // ── Table header ──────────────────────────────────────────────
    const nameWidth = 22;
    const descWidth = 60;
    console.log(`  ${pc.dim('Status')}  ${pc.dim('Name'.padEnd(nameWidth))} ${pc.dim('Description')}`);
    console.log(`  ${pc.dim('──────')}  ${pc.dim('─'.repeat(nameWidth))} ${pc.dim('─'.repeat(descWidth))}`);
    // ── Rows ──────────────────────────────────────────────────────
    for (const entry of registry) {
        const installed = isInstalled(entry.name, entry.files, cwd);
        const status = installed ? pc.green('  ✓   ') : pc.dim('  ·   ');
        const name = installed
            ? pc.green(entry.name.padEnd(nameWidth))
            : entry.name.padEnd(nameWidth);
        const desc = pc.dim(entry.description.length > descWidth
            ? entry.description.slice(0, descWidth - 1) + '…'
            : entry.description);
        console.log(`  ${status}  ${name} ${desc}`);
    }
    console.log();
    log.dim(`  Add a component: ${pc.bold('bahrawy add <name>')}`);
    console.log();
}
//# sourceMappingURL=list.js.map