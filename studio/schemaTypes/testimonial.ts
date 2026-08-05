import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

export default defineType({
  name: 'testimonial',
  title: 'Student Testimonial',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'studentName',
      title: 'Student Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Board Exam Result / Role Tag',
      type: 'string',
      description: 'e.g., Class 10 JAC Board 96.4% District Rank 1',
    }),
    defineField({
      name: 'photo',
      title: 'Student Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'quote',
      title: 'Testimonial Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'batch',
      title: 'Enrolled Batch',
      type: 'string',
      initialValue: 'Target Batch 2025',
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating (1-5)',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5),
    }),
  ],
  preview: {
    select: {
      title: 'studentName',
      subtitle: 'role',
      media: 'photo',
    },
  },
});
