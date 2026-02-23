# Deploy Fr-sona to Vercel

## Option A: Deploy from GitHub (recommended)

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account).
2. Click **Add New…** → **Project**.
3. **Import** the repo: `Samarth099/fr-sona-project` (or **fr-sona project** if you renamed it).
4. Vercel will detect the Vite app. Keep the defaults:
   - **Framework Preset:** Vite  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`
5. Click **Deploy**. Your app will be live at a `*.vercel.app` URL.

Future pushes to `main` will trigger automatic deployments.

---

## Option B: Deploy from the CLI

1. Log in to Vercel (once):
   ```bash
   vercel login
   ```
2. From the project root:
   ```bash
   cd fr-sona-project
   vercel
   ```
   Follow the prompts to link or create a project. Use **production** when asked.
3. To deploy to production:
   ```bash
   vercel --prod
   ```

Your live URL will be printed after the deploy finishes.
