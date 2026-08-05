import { defineField, defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons';

export default defineType({
  name: 'resourceLink',
  title: 'Resource Link',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Resource Title',
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
      name: 'url',
      title: 'External Target URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'classLevel',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled Resource Link',
        subtitle: `Class ${subtitle || '10'} Link`,
      };
    },
  },
});
