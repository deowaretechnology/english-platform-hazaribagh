// backend/lib/sanity/sanity.ts

import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN; // <-- MUST be set on Render

if (!projectId) {
  throw new Error('Missing SANITY_PROJECT_ID env var');
}

if (!token) {
  // Don't crash silently — this IS the bug you're chasing.
  // Without a token with at least "Editor" (or "Viewer" + draft access)
  // permissions, this client can NEVER see drafts.xxx documents.
  console.warn(
    '⚠️  SANITY_API_TOKEN is missing. Draft documents will NOT be readable — ' +
    'this will cause "Test document not found" errors whenever the editor ' +
    'has not published the test yet.'
  );
}

export const backendSanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,           // <-- required to read drafts.*
  useCdn: false,   // <-- MUST be false. CDN never serves drafts, and can serve stale published data.
  perspective: 'raw', // <-- ensures we get the exact document by _id (draft or published), not a merged view
});