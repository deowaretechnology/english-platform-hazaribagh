import { defineField, defineType } from 'sanity';
import { ComponentIcon } from '@sanity/icons';

export default defineType({
  name: 'module',
  title: 'Course Module',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'course',
      title: 'Course Reference',
      type: 'reference',
      to: [{ type: 'course' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Module Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'order',
      title: 'Module Order',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      courseTitle: 'course.title',
    },
    prepare({ title, courseTitle }) {
      return {
        title: title || 'Untitled Module',
        subtitle: courseTitle ? `In: ${courseTitle}` : 'No Course Linked',
      };
    },
  },
});
