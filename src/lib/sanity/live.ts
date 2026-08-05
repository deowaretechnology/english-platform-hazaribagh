import { sanityClient } from './client';

export async function fetchLiveContent<T = any>(query: string, params: Record<string, any> = {}): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (err) {
    console.error('Sanity live fetch error:', err);
    throw err;
  }
}
