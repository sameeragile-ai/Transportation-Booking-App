# Velox Mobility Platform

Cross-platform on-demand transportation booking prototype & dispatch suite built with React 19, Vite, Tailwind CSS v4, Lucide Icons, and Motion.

---

## Deploying to Vercel

The project is fully pre-configured for one-click deployment on **Vercel** with dedicated SPA rewrites and production asset caching.

### Option 1: Deploy via Vercel Dashboard (Git)

1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel automatically detects the framework settings via `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**. Your app will be live with a production URL in ~45 seconds.

### Option 2: Deploy via Vercel CLI

In your terminal at the project root:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

---

## Configuration Details

- **`vercel.json`**: Configures single-page application (SPA) client-side routing rewrites (`/(.*) -> /index.html`) so refreshing or direct navigation never triggers a 404. Also enables immutable 1-year caching for production static assets (`/assets/*`).
- **`vite.config.ts`**: Configured with ESM-native `fileURLToPath` alias resolution (`@/*`) fully compatible with Node 18, 20, and 22 runtimes on Vercel.
