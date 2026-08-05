import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  if (!source) return '';
  try {
    return builder.image(source).auto('format').url();
  } catch (e) {
    return '';
  }
}
