import { defineField, defineType } from 'sanity';
import { SearchIcon } from '@sanity/icons';

export default defineType({
  name: 'seoSettings',
  title: 'Global SEO Settings',
  type: 'document',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Default Meta Title',
      type: 'string',
      initialValue: 'English Platform Hazaribagh — Best JAC & CBSE English Coaching',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      initialValue: 'Join English Platform Hazaribagh with R. K. Verma Sir for 100% board exam preparation, Sunday OMR test series, and free PDF notes.',
    }),
    defineField({
      name: 'keywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'English Platform Hazaribagh',
        'R K Verma Sir English',
        'JAC Board English Class 10',
        'CBSE Class 12 English Hazaribagh',
        'Best English Coaching Korrah Hazaribagh',
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (OpenGraph)',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'metaTitle',
    },
  },
});
