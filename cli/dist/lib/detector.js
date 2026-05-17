import fs from 'node:fs';
import path from 'node:path';
const lockfiles = {
    'bun.lockb': 'bun',
    'bun.lock': 'bun',
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'package-lock.json': 'npm',
};
/**
 * Walk up from `cwd` looking for a known lock file.
 * Falls back to `npm` if none found.
 */
export function detectPackageManager(cwd = process.cwd()) {
    let dir = path.resolve(cwd);
    // eslint-disable-next-line no-constant-condition
    while (true) {
        for (const [file, pm] of Object.entries(lockfiles)) {
            if (fs.existsSync(path.join(dir, file))) {
                return pm;
            }
        }
        const parent = path.dirname(dir);
        if (parent === dir)
            break; // reached root
        dir = parent;
    }
    return 'npm';
}
/** Return the install command for a package manager */
export function installCmd(pm) {
    switch (pm) {
        case 'bun':
            return 'bun add';
        case 'pnpm':
            return 'pnpm add';
        case 'yarn':
            return 'yarn add';
        default:
            return 'npm install';
    }
}
/** Return the dev install flag for a package manager */
export function devFlag(pm) {
    switch (pm) {
        case 'bun':
        case 'yarn':
            return '--dev';
        default:
            return '-D';
    }
}
/** Return the npx-equivalent runner for a package manager */
export function runnerCmd(pm) {
    switch (pm) {
        case 'bun':
            return 'bunx';
        case 'pnpm':
            return 'pnpm dlx';
        case 'yarn':
            return 'npx';
        default:
            return 'npx';
    }
}
//# sourceMappingURL=detector.js.map