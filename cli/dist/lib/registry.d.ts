export interface RegistryEntry {
    name: string;
    title: string;
    description: string;
    files: string[];
    dependencies: string[];
    shadcnComponents: string[];
    devDependencies?: string[];
}
export declare const registry: RegistryEntry[];
/**
 * Shared files every Bahrawy component depends on.
 * Copied once if they don't already exist.
 */
export declare const sharedFiles: {
    src: string;
    dest: string;
}[];
export declare const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/bahrawyX/bahrawy-picks/main";
export declare function getEntry(name: string): RegistryEntry | undefined;
//# sourceMappingURL=registry.d.ts.map