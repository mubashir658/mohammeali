Vercel deploy notes

1. Project root

   - When creating the Vercel project, set the Root Directory to `mohammeali`.

2. Build settings

   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. Environment variables (add in Vercel Dashboard)

   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase anon/public key
   - Optional: `VITE_SUPABASE_PROJECT_ID`

   Add as Production and Preview scope. You can use the "Import .env" button and then remove any surrounding quotes.

4. Helpful checks

   - Locally run `npm install` then `npm run build` to confirm a `dist` folder is produced.
   - If you see 404s, confirm Vercel Project Root and that `dist` exists in build logs.

5. Advanced

   - `vercel.json` is included to force a static-build using `dist` and to route SPA paths to `index.html`.

6. Image optimization (recommended)

   - Large images slow initial load. I recommend generating optimized/resized images (WebP and smaller sizes) and using `srcset`/`picture`.
   - You can use `imagemin` or `sharp` locally. Example (after installing `imagemin-cli` and plugins):

      ```bash
      npx imagemin public/images/* --out-dir=public/images/optimized
      ```

   - Replace large source images (for example `src/assets/profile-photo.png`) with optimized WebP/JPEG versions and update imports.

