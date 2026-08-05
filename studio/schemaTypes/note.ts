import { defineField, defineType } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';

export default defineType({
  name: 'note',
  title: 'Study Note (PDF)',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Study Note Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'classLevel',
      title: 'Class Target',
      type: 'string',
      options: {
        list: ['8', '9', '10', '11', '12', 'all'],
      },
      initialValue: '10',
    }),
    defineField({
      name: 'subject',
      title: 'Subject / Category',
      type: 'string',
      initialValue: 'English Literature & Grammar',
    }),
    defineField({
      name: 'pdfFile',
      title: 'PDF File Upload',
      type: 'file',
      options: { accept: '.pdf' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'previewHighlights',
      title: 'PDF Highlights (Key Features)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'classLevel',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled Note',
        subtitle: `Class ${subtitle || '10'} PDF`,
      };
    },
  },
});
