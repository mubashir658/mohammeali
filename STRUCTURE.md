Project structure notes and safe refactor plan

Current layout (safe and Vite-friendly):

- `src/` — application source
  - `components/` — React components and `ui/` primitives
  - `pages/` — top-level routes/pages
  - `integrations/` — third-party clients (Supabase)
  - `hooks/`, `lib/`, `assets/` — helpers, hooks, static assets
- `public/` — static public assets
- `package.json`, `vite.config.ts`, `tsconfig.json` — build & paths

Notes:
- The project already uses the `@` alias to `src` (see `vite.config.ts` and `tsconfig.json`). Many imports rely on that alias — moving files will require updating imports or alias config.
- To keep the app stable, avoid bulk-moving files until imports are updated automatically.

Suggested, minimal tidy-up actions (safe):
- Keep current `src` layout but document conventions (this file).
- Add `vercel.json` (done) to pin build settings for Vercel deployments.
- Add `DEPLOY.md` with exact deploy steps and required env variables (created alongside).

If you want me to physically reorganize files (move, rename folders):
1. I will create a migration plan listing each move and the required import updates.
2. Run automated refactors to update imports (TS path replacements).
3. Run the build and tests locally to ensure no breakage.

Tell me if you want me to perform the physical refactor and I'll start with a small subset (for example, group `integrations` and `lib` into `src/services`).
