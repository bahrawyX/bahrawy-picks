import fs from 'fs-extra';
import path from 'node:path';
import { execSync } from 'node:child_process';
import ora from 'ora';
import pc from 'picocolors';
import { GITHUB_RAW_BASE, sharedFiles } from './registry.js';
import { detectPackageManager, installCmd, devFlag, runnerCmd } from './detector.js';
import { log } from './logger.js';
/** Resolve the user's components/bahrawy directory */
function componentsDir(cwd) {
    return path.join(cwd, 'components', 'bahrawy');
}
/** Check if shadcn is initialised (components.json or ui dir exists) */
export function checkShadcnSetup(cwd) {
    return (fs.existsSync(path.join(cwd, 'components.json')) ||
        fs.existsSync(path.join(cwd, 'components', 'ui')));
}
/** Check if a component file already exists locally */
export function isInstalled(name, files, cwd) {
    const dir = componentsDir(cwd);
    return files.some((f) => fs.existsSync(path.join(dir, f)));
}
/** Fetch a file from the GitHub raw URL */
async function fetchFile(remotePath) {
    const url = `${GITHUB_RAW_BASE}/components/bahrawy/${remotePath}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url} — ${res.status} ${res.statusText}`);
    }
    return res.text();
}
/** Fetch a shared/lib file from the GitHub raw URL */
async function fetchSharedFile(srcPath) {
    const url = `${GITHUB_RAW_BASE}/${srcPath}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url} — ${res.status} ${res.statusText}`);
    }
    return res.text();
}
/**
 * Install a single Bahrawy component into the user's project.
 *
 * Steps:
 * 1. Copy component files from GitHub
 * 2. Copy shared files (motion.ts, phone-utils.ts) if missing
 * 3. Install npm dependencies
 * 4. Run `shadcn add` for required shadcn components
 */
export async function installComponent(entry, cwd, opts = {}) {
    const pm = detectPackageManager(cwd);
    const dir = componentsDir(cwd);
    // ── 1. Check existing ─────────────────────────────────────────
    if (!opts.force && isInstalled(entry.name, entry.files, cwd)) {
        log.warn(`${entry.name} already exists. Use ${pc.bold('--force')} to overwrite.`);
        return;
    }
    // ── 2. Copy component files ───────────────────────────────────
    const spinner = ora(`Downloading ${pc.bold(entry.title)}...`).start();
    try {
        await fs.ensureDir(dir);
        for (const file of entry.files) {
            const content = await fetchFile(file);
            const dest = path.join(dir, file);
            await fs.writeFile(dest, content, 'utf-8');
        }
        spinner.succeed(`Downloaded ${pc.bold(entry.title)}`);
    }
    catch (err) {
        spinner.fail(`Failed to download ${entry.title}`);
        throw err;
    }
    // ── 3. Copy shared files ──────────────────────────────────────
    const sharedSpinner = ora('Checking shared files...').start();
    let copiedShared = 0;
    try {
        for (const { src, dest } of sharedFiles) {
            const destPath = path.join(cwd, dest);
            if (!fs.existsSync(destPath)) {
                const content = await fetchSharedFile(src);
                await fs.ensureDir(path.dirname(destPath));
                await fs.writeFile(destPath, content, 'utf-8');
                copiedShared++;
            }
        }
        if (copiedShared > 0) {
            sharedSpinner.succeed(`Copied ${copiedShared} shared file(s)`);
        }
        else {
            sharedSpinner.succeed('Shared files already present');
        }
    }
    catch (err) {
        sharedSpinner.fail('Failed to copy shared files');
        throw err;
    }
    // ── 4. Install npm dependencies ───────────────────────────────
    const allDeps = entry.dependencies;
    const allDevDeps = entry.devDependencies ?? [];
    if (allDeps.length > 0) {
        const depSpinner = ora('Installing dependencies...').start();
        try {
            const cmd = `${installCmd(pm)} ${allDeps.join(' ')}`;
            execSync(cmd, { cwd, stdio: 'pipe' });
            depSpinner.succeed(`Installed ${pc.dim(allDeps.join(', '))}`);
        }
        catch {
            depSpinner.fail('Failed to install dependencies');
            log.dim(`  Run manually: ${installCmd(pm)} ${allDeps.join(' ')}`);
        }
    }
    if (allDevDeps.length > 0) {
        const devSpinner = ora('Installing dev dependencies...').start();
        try {
            const cmd = `${installCmd(pm)} ${devFlag(pm)} ${allDevDeps.join(' ')}`;
            execSync(cmd, { cwd, stdio: 'pipe' });
            devSpinner.succeed(`Installed dev: ${pc.dim(allDevDeps.join(', '))}`);
        }
        catch {
            devSpinner.fail('Failed to install dev dependencies');
            log.dim(`  Run manually: ${installCmd(pm)} ${devFlag(pm)} ${allDevDeps.join(' ')}`);
        }
    }
    // ── 5. Install shadcn components ──────────────────────────────
    if (entry.shadcnComponents.length > 0) {
        const shadcnSpinner = ora('Adding shadcn/ui components...').start();
        try {
            const runner = runnerCmd(pm);
            const cmd = `${runner} shadcn@latest add ${entry.shadcnComponents.join(' ')} -y`;
            execSync(cmd, { cwd, stdio: 'pipe' });
            shadcnSpinner.succeed(`Added shadcn: ${pc.dim(entry.shadcnComponents.join(', '))}`);
        }
        catch {
            shadcnSpinner.fail('Failed to add shadcn components');
            log.dim(`  Run manually: npx shadcn@latest add ${entry.shadcnComponents.join(' ')}`);
        }
    }
    // ── 6. Summary ────────────────────────────────────────────────
    console.log();
    log.success(`${pc.bold(entry.title)} installed successfully!`);
    console.log();
    log.kv('Files:', entry.files.map((f) => `components/bahrawy/${f}`).join(', '));
    if (allDeps.length > 0) {
        log.kv('Dependencies:', allDeps.join(', '));
    }
    if (entry.shadcnComponents.length > 0) {
        log.kv('shadcn/ui:', entry.shadcnComponents.join(', '));
    }
    console.log();
    log.dim(`  Import: import { ${toPascalCase(entry.name)} } from "@/components/bahrawy/${entry.name}"`);
    console.log();
}
/** Convert kebab-case to PascalCase */
function toPascalCase(str) {
    return str
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('');
}
//# sourceMappingURL=installer.js.map