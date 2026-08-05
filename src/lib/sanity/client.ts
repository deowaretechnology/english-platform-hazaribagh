import { createClient } from '@sanity/client';

const getEnv = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[key] || '';
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  return '';
};

export const projectId = getEnv('VITE_SANITY_PROJECT_ID') || getEnv('SANITY_PROJECT_ID') || 'yy1yyjmy';
export const dataset = getEnv('VITE_SANITY_DATASET') || getEnv('SANITY_DATASET') || 'production';
export const apiVersion = getEnv('VITE_SANITY_API_VERSION') || getEnv('SANITY_API_VERSION') || '2024-01-01';
export const token = getEnv('VITE_SANITY_TOKEN') || getEnv('SANITY_TOKEN') || '';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: token || undefined,
  perspective: 'published',
});
