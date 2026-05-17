import { type RegistryEntry } from './registry.js';
/** Check if shadcn is initialised (components.json or ui dir exists) */
export declare function checkShadcnSetup(cwd: string): boolean;
/** Check if a component file already exists locally */
export declare function isInstalled(name: string, files: string[], cwd: string): boolean;
/**
 * Install a single Bahrawy component into the user's project.
 *
 * Steps:
 * 1. Copy component files from GitHub
 * 2. Copy shared files (motion.ts, phone-utils.ts) if missing
 * 3. Install npm dependencies
 * 4. Run `shadcn add` for required shadcn components
 */
export declare function installComponent(entry: RegistryEntry, cwd: string, opts?: {
    force?: boolean;
}): Promise<void>;
//# sourceMappingURL=installer.d.ts.map