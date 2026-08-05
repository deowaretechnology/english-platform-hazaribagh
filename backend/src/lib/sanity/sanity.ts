import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID || 'yy1yyjmy';
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2024-01-01';
const token = process.env.SANITY_TOKEN || '';

export const backendSanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: token || undefined,
  perspective: 'published',
});
