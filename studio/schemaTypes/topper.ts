import { defineField, defineType } from 'sanity';
import { StarIcon } from '@sanity/icons';

export default defineType({
  name: 'topper',
  title: 'Topper Student',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Topper Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'achievement',
      title: 'Achievement / Marks Percentage',
      type: 'string',
      description: 'e.g. 96.8% in JAC Class 10 Board Exam',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'classTag',
      title: 'Class Tag',
      type: 'string',
      initialValue: 'Class 10',
    }),
    defineField({
      name: 'year',
      title: 'Passing Year',
      type: 'string',
      initialValue: '2025',
    }),
    defineField({
      name: 'photo',
      title: 'Topper Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'school',
      title: 'School Name (Hazaribagh / Jharkhand)',
      type: 'string',
      initialValue: 'Hazaribagh District High School',
    }),
    defineField({
      name: 'quote',
      title: 'Message to Juniors / Review',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'achievement',
      media: 'photo',
    },
  },
});
