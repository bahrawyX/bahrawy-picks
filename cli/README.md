# bahrawy

CLI for installing components from the Bahrawy / Picks library straight into a
shadcn-ready Next.js project.

## Use

```bash
# pick interactively from every available component
npx bahrawy add

# or name them
npx bahrawy add halo profile-card schema

# list everything
npx bahrawy list
```

`npx bahrawy add <name>` does, for each component:

1. Checks that your project has a shadcn setup (`components.json` or
   `components/ui` must exist — run `npx shadcn@latest init` first if not).
2. Downloads the component source from this repo via raw.githubusercontent
   into `components/bahrawy/<name>.tsx` (or `components/bahrawy/<name>/` for
   multi-file components).
3. Copies any missing shared files (`lib/utils.ts`, etc.).
4. Installs the npm dependencies it needs (`framer-motion`, `three`, `ogl`,
   `gsap`, etc.) using your detected package manager (bun / pnpm / yarn / npm).
5. Runs `shadcn add` for any required shadcn primitives.

## Develop

```bash
# regenerate the registry from the actual component files in ../components/bahrawy
npm run generate

# compile to dist/
npm run build

# run the local source against any directory (useful for testing)
npm run dev -- add halo --cwd /path/to/test-project
```

## Publish

The registry is auto-generated from the parent repo's `components/bahrawy/*`
on every build via the `prepublishOnly` hook, so the registry can't drift.

```bash
# from the repo root
cd cli

# bump the version
npm version patch  # or minor / major

# publish to npm (requires `npm login`)
npm publish --access public
```

After publishing, anyone can run `npx bahrawy add <component>` against the
latest published version.
