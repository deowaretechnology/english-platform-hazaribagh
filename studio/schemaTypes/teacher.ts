import { defineField, defineType } from 'sanity';
import { UsersIcon } from '@sanity/icons';

export default defineType({
  name: 'teacher',
  title: 'Faculty / Teacher',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'R. K. Verma Sir',
    }),
    defineField({
      name: 'designation',
      title: 'Designation / Title',
      type: 'string',
      initialValue: 'Founder & Senior English Educator',
    }),
    defineField({
      name: 'experience',
      title: 'Experience Years',
      type: 'string',
      initialValue: '15+ Years Teaching Experience',
    }),
    defineField({
      name: 'bio',
      title: 'Biography / Profile Summary',
      type: 'text',
      rows: 4,
      initialValue: 'Guided over 10,000+ students in Hazaribagh to achieve 90%+ marks in JAC and CBSE English Board examinations.',
    }),
    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'subjects',
      title: 'Specializations',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['English Grammar', 'JAC Board Prose & Poetry', 'Spoken English & Writing Skills'],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'designation',
      media: 'photo',
    },
  },
});
