import { defineField, defineType } from 'sanity';
import { ImageIcon } from '@sanity/icons';

export default defineType({
  name: 'banner',
  title: 'Hero Banner',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'headline',
      title: 'Main Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'English Platform Hazaribagh',
    }),
    defineField({
      name: 'subheadline',
      title: 'Sub-headline / Tagline',
      type: 'text',
      rows: 2,
      initialValue: 'Master JAC & CBSE Board English Grammar, Literature & Essay Writing with R. K. Verma Sir.',
    }),
    defineField({
      name: 'ctaText',
      title: 'Primary CTA Button Text',
      type: 'string',
      initialValue: 'View Courses & Batches',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Primary CTA Link Target',
      type: 'string',
      initialValue: '/courses',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Hero Banner Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'isActive',
      title: 'Enable Banner',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      media: 'backgroundImage',
    },
  },
});
