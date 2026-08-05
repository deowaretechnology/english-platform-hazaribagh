import { defineField, defineType } from 'sanity';
import { PlayIcon } from '@sanity/icons';

export default defineType({
  name: 'lesson',
  title: 'Lesson & Lecture',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'module',
      title: 'Module Reference',
      type: 'reference',
      to: [{ type: 'module' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Lesson Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video / YouTube Link',
      type: 'url',
    }),
    defineField({
      name: 'pdfFile',
      title: 'PDF Handout / Notes File',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'notes',
      title: 'Lesson Notes & Key Highlights',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'duration',
      title: 'Duration (e.g. 45 mins)',
      type: 'string',
    }),
    defineField({
      name: 'isFree',
      title: 'Free Preview Lesson',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Lesson Order',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      moduleTitle: 'module.title',
      isFree: 'isFree',
    },
    prepare({ title, moduleTitle, isFree }) {
      return {
        title: title || 'Untitled Lesson',
        subtitle: `${moduleTitle ? `Module: ${moduleTitle} • ` : ''}${isFree ? 'FREE PREVIEW' : 'PRO'}`,
      };
    },
  },
});
