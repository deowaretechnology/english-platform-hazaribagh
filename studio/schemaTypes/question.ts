import { defineField, defineType } from 'sanity';
import { HelpCircleIcon } from '@sanity/icons';

export default defineType({
  name: 'question',
  title: 'Question',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'testRef',
      title: 'Linked Test',
      type: 'reference',
      to: [{ type: 'test' }],
      description: 'Select which test this question belongs to',
    }),
    defineField({
      name: 'questionText',
      title: 'Question Text',
      type: 'text',
      rows: 3,
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
      name: 'options',
      title: 'Multiple Choice Options (A, B, C, D)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
    defineField({
      name: 'correctOption',
      title: 'Correct Option Text or Index (0, 1, 2, 3 or Exact Text)',
      type: 'string',
      description: 'Either the exact text of the correct option or option index "0", "1", "2", "3"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'explanation',
      title: 'Detailed Solution / Grammar Rule Explanation',
      type: 'text',
      rows: 3,
      description: 'Displayed to student after submitting test in answer breakdown',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty Level',
      type: 'string',
      options: {
        list: [
          { title: 'Easy', value: 'Easy' },
          { title: 'Medium', value: 'Medium' },
          { title: 'Hard', value: 'Hard' },
        ],
      },
      initialValue: 'Medium',
    }),
  ],
  preview: {
    select: {
      title: 'questionText',
      testTitle: 'testRef.title',
      classLevel: 'classLevel',
    },
    prepare({ title, testTitle, classLevel }) {
      return {
        title: title ? (title.length > 60 ? title.substring(0, 60) + '...' : title) : 'Untitled Question',
        subtitle: `${testTitle ? `Test: ${testTitle}` : `Class ${classLevel || '10'}`}`,
      };
    },
  },
});
