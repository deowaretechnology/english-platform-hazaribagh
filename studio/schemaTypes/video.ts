import { defineField, defineType } from 'sanity';
import { VideoIcon } from '@sanity/icons';

export default defineType({
  name: 'video',
  title: 'Video Lecture',
  type: 'document',
  icon: VideoIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Lecture Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'classLevel',
      title: 'Class Level',
      type: 'string',
      options: {
        list: ['8', '9', '10', '11', '12', 'all'],
      },
      initialValue: '10',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom Thumbnail (Optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'chapter',
      title: 'Chapter Name / Topic',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Lecture Summary & Key Rules',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      initialValue: '45 mins',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'classLevel',
      media: 'thumbnail',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled Video',
        subtitle: `Class ${subtitle || '10'}`,
        media,
      };
    },
  },
});
