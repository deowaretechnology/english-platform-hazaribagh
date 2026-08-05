import { defineField, defineType } from 'sanity';
import { HelpCircleIcon } from '@sanity/icons';

export default defineType({
  name: 'faq',
  title: 'Frequently Asked Question (FAQ)',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General & Admissions', value: 'Admissions' },
          { title: 'Offline Batches', value: 'Batches' },
          { title: 'Sunday Test Series', value: 'Tests' },
          { title: 'Fee Structure & Scholarships', value: 'Fees' },
        ],
      },
      initialValue: 'Admissions',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
    },
  },
});
