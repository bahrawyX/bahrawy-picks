export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';
/**
 * Walk up from `cwd` looking for a known lock file.
 * Falls back to `npm` if none found.
 */
export declare function detectPackageManager(cwd?: string): PackageManager;
/** Return the install command for a package manager */
export declare function installCmd(pm: PackageManager): string;
/** Return the dev install flag for a package manager */
export declare function devFlag(pm: PackageManager): string;
/** Return the npx-equivalent runner for a package manager */
export declare function runnerCmd(pm: PackageManager): string;
//# sourceMappingURL=detector.d.ts.map