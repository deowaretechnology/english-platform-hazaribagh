import { defineArrayMember, defineField, defineType } from 'sanity';
import { TaskIcon } from '@sanity/icons';

export default defineType({
  name: 'test',
  title: 'Test Series / Exam',
  type: 'document',
  icon: TaskIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Test Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'classLevel',
      title: 'Class Target',
      type: 'string',
      options: {
        list: [
          { title: 'Class 8', value: '8' },
          { title: 'Class 9', value: '9' },
          { title: 'Class 10 (Board)', value: '10' },
          { title: 'Class 11', value: '11' },
          { title: 'Class 12 (Board)', value: '12' },
          { title: 'All Classes', value: 'all' },
        ],
      },
      initialValue: '10',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'durationMinutes',
      title: 'Duration (in Minutes)',
      type: 'number',
      initialValue: 30,
    }),
    defineField({
      name: 'type',
      title: 'Test Category',
      type: 'string',
      options: {
        list: [
          { title: 'Sunday Weekly OMR', value: 'Weekly OMR' },
          { title: 'Board Pattern Full Test', value: 'Board Pattern' },
          { title: 'Grammar Unit Test', value: 'Unit Test' },
          { title: 'Official Model Paper', value: 'Model Paper' },
        ],
      },
      initialValue: 'Weekly OMR',
    }),
    defineField({
      name: 'marks',
      title: 'Total Marks',
      type: 'number',
      initialValue: 50,
    }),
    defineField({
      name: 'date',
      title: 'Exam Date / Schedule Info',
      type: 'string',
      initialValue: 'Every Sunday, 10:00 AM',
    }),
    defineField({
      name: 'instructions',
      title: 'Description / Student Exam Instructions',
      type: 'text',
      rows: 3,
      initialValue: 'All questions are compulsory. Select the correct option for each question.',
    }),
    defineField({
      name: 'status',
      title: 'Test Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active / Live Now', value: 'Active' },
          { title: 'Upcoming Test', value: 'Upcoming' },
          { title: 'Closed / Archived', value: 'Closed' },
        ],
      },
      initialValue: 'Active',
    }),
    defineField({
      name: 'questionWordUpload',
      title: 'Question Word File (for bulk import)',
      description:
        'Upload a .docx file with questions in this format — Q1 / question text / Option A: .. / Option B: .. / Option C: .. / Option D: .. / Answer: A. After uploading, SAVE this document first, then use the "Extract Questions from Word File" button (top-right) to preview and add them below.',
      type: 'file',
      options: { accept: '.docx' },
    }),
    defineField({
      name: 'questions',
      title: 'Questions',
      description: 'Add multiple question cards to this test series. Cards can be dragged to reorder and collapsed for a clean editor experience.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'questionCard',
          title: 'Question Card',
          options: {
            collapsible: true,
            collapsed: true,
          },
          fields: [
            defineField({
              name: 'questionText',
              title: '1. Question Text',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'optionA',
              title: 'Option A',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'optionB',
              title: 'Option B',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'optionC',
              title: 'Option C',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'optionD',
              title: 'Option D',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'correctAnswer',
              title: '3. Correct Answer',
              type: 'string',
              options: {
                list: [
                  { title: 'Option A', value: 'A' },
                  { title: 'Option B', value: 'B' },
                  { title: 'Option C', value: 'C' },
                  { title: 'Option D', value: 'D' },
                ],
                layout: 'radio',
              },
              initialValue: 'A',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'explanation',
              title: '4. Explanation / Solution',
              type: 'text',
              rows: 2,
              description: 'Grammar rule or explanation shown after submission.',
            }),
            defineField({
              name: 'difficulty',
              title: '5. Difficulty Dropdown',
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
              correct: 'correctAnswer',
              difficulty: 'difficulty',
              optA: 'optionA',
            },
            prepare({ title, correct, difficulty }) {
              return {
                title: title ? (title.length > 55 ? title.substring(0, 55) + '...' : title) : 'Empty Question Card',
                subtitle: `Ans: Option ${correct || 'A'} • ${difficulty || 'Medium'}`,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      classLevel: 'classLevel',
      questions: 'questions',
      status: 'status',
    },
    prepare({ title, classLevel, questions, status }) {
      const qCount = Array.isArray(questions) ? questions.length : 0;
      return {
        title: title || 'Untitled Test',
        subtitle: `Class ${classLevel || '10'} • ${qCount} Questions • ${status || 'Active'}`,
      };
    },
  },
});