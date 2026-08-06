import { createClient } from '@sanity/client';

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'yy1yyjmy';
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

// NOTE: There is intentionally NO token here.
// This client ships inside the browser bundle — anything set as `token`
// on it is visible to every visitor via devtools/network tab, no matter
// how it's read in (VITE_SANITY_TOKEN or otherwise). Never add one back.
//
// This client can only read PUBLISHED, public content. Anything that
// needs a token (draft previews, mutations, private datasets) must be
// done server-side in Express, where SANITY_TOKEN lives as a
// backend-only env var and is never bundled.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // published content only → CDN is fine, faster, and avoids per-request CORS/rate-limit issues
  perspective: 'published',
});