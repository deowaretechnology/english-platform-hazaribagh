# Deployment Guide — Full Stack App & Sanity Studio

## 🌐 1. Deploying Main Web Application & Express Server

The main application includes an Express backend (`server.ts`) and React Vite frontend.

### Production Build
```bash
npm run build
```
This command bundles Vite frontend assets into `dist/` and builds the Node Express server into `dist/server.cjs`.

### Production Start
```bash
npm start
```
Starts Node server on port 3000 serving both API endpoints (`/api/*`) and static React SPA assets.

---

## 🎨 2. Deploying Sanity Studio

Sanity Studio can be deployed for free on Sanity's global CDN or hosted anywhere as static files.

### Deploy via Sanity CLI
```bash
npm run studio:deploy
```
This command uploads your studio bundle to `https://english-platform-hazaribagh.sanity.studio`.

---

## 🔒 3. CORS & Sanity Settings

Ensure your frontend origin URL (e.g. `http://localhost:3000` or production domain) is added to Sanity Management Console under **API -> CORS Origins** with **Allow Credentials** checked.
