// backend/lib/sanity/sanity.ts

import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
// Accept either name -- your Render env var is currently SANITY_TOKEN,
// SANITY_API_TOKEN is also supported in case you rename it later.
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_TOKEN;

const missing: string[] = [];
if (!projectId) missing.push('SANITY_PROJECT_ID');
if (!token) missing.push('SANITY_API_TOKEN (or SANITY_TOKEN)');

if (missing.length > 0) {
  // Do NOT throw here -- throwing at import time crashes the whole
  // server on boot (crash-loop on Render), taking down every route
  // including /health. Log loudly instead so requests fail individually
  // with a clear message, and /health stays reachable for debugging.
  console.error(
    `Missing required env var(s): ${missing.join(', ')}. ` +
    `Sanity-dependent routes (question extraction, test data) will fail ` +
    `until these are set in Render -> Environment.`
  );
}

export const backendSanityClient = createClient({
  projectId: projectId || 'MISSING_PROJECT_ID',
  dataset,
  apiVersion: '2024-01-01',
  token,           // required to read drafts.*
  useCdn: false,   // CDN never serves drafts, and can serve stale published data
  perspective: 'raw', // get the exact document by _id (draft or published), not a merged view
});

export const sanityConfigOk = missing.length === 0;