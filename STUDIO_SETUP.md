# Sanity Studio Setup & Configuration Guide

This directory (`/studio`) contains the complete Sanity Studio v4 configuration for **English Platform Hazaribagh**.

## 🛠️ Features Included

- **20 Complete Content Schemas**: Courses, Modules, Lessons, Tests, Questions, FAQs, Testimonials, Toppers, Videos, Notes, Announcements, Banner, Gallery, Teachers, Admission Info, Contact Info, Website Settings, SEO Settings, Homepage Sections, Resource Links.
- **Custom Desk Structure**: Clean navigation tree with Singleton Document management (`studio/structure/deskStructure.ts`).
- **Vision Tool**: Built-in GROQ query editor for live content testing.
- **Media & Assets**: Support for image hotspot cropping and PDF study note uploads.
- **Environment Driven**: Seamlessly reads project credentials from environment variables (`SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `SANITY_TOKEN`).

---

## 🏃 Running the Studio

### Local Development
From the project root:
```bash
npm run studio
```
Or inside the `/studio` directory:
```bash
cd studio
npm run dev
```

The Studio will start at: **`http://localhost:3333`**

---

## 🔑 Environment Variables
Create a `.env` or `.env.local` inside `studio/` (or rely on parent `.env`):

```env
SANITY_PROJECT_ID="yy1yyjmy"
SANITY_DATASET="production"
SANITY_API_VERSION="2024-01-01"
SANITY_TOKEN="your_optional_write_token"
```

---

## 🏗️ Building & Deploying Studio

To build production static assets for Sanity Studio:
```bash
npm run studio:build
```

To deploy directly to Sanity hosting (`*.sanity.studio`):
```bash
npm run studio:deploy
```
