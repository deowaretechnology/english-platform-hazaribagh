import { defineField, defineType } from 'sanity';
import { BookIcon } from '@sanity/icons';

export default defineType({
  name: 'course',
  title: 'Course & Batch',
  type: 'document',
  icon: BookIcon,
  groups: [
    { name: 'content', title: 'Course Content' },
    { name: 'pricing', title: 'Pricing & Schedule' },
    { name: 'media', title: 'Media & Badge' },
    { name: 'settings', title: 'Visibility & Settings' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Course Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'classLevel',
      title: 'Class Target',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Class 8', value: '8' },
          { title: 'Class 9', value: '9' },
          { title: 'Class 10 (JAC / CBSE Board)', value: '10' },
          { title: 'Class 11', value: '11' },
          { title: 'Class 12 (Board)', value: '12' },
          { title: 'All Classes', value: 'all' },
          { title: 'Competitive', value: 'Competitive' },
          { title: 'Spoken', value: 'Spoken' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
      rows: 3,
    }),
    defineField({
      name: 'mode',
      title: 'Learning Mode',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Offline Classroom (Hazaribagh)', value: 'Offline' },
          { title: 'Online Live', value: 'Online' },
          { title: 'Hybrid (Offline + Recorded)', value: 'Hybrid' },
        ],
      },
      initialValue: 'Offline',
    }),
    defineField({
      name: 'teacher',
      title: 'Faculty / Teacher Reference',
      type: 'reference',
      to: [{ type: 'teacher' }],
      group: 'content',
    }),
    defineField({
      name: 'features',
      title: 'Course Features (Bullet Points)',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    defineField({
      name: 'price',
      title: 'Course Price (INR)',
      type: 'number',
      group: 'pricing',
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price (INR)',
      type: 'number',
      group: 'pricing',
    }),
    defineField({
      name: 'batchTiming',
      title: 'Batch Schedule / Timing',
      type: 'string',
      group: 'pricing',
      initialValue: 'Morning: 07:00 AM - 08:30 AM',
    }),
    defineField({
      name: 'duration',
      title: 'Course Duration',
      type: 'string',
      group: 'pricing',
      initialValue: '1 Year Board Program',
    }),
    defineField({
      name: 'language',
      title: 'Medium of Instruction',
      type: 'string',
      group: 'pricing',
      initialValue: 'Bilingual (English / Hindi)',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Course Banner / Thumbnail',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'badge',
      title: 'Badge (e.g. Popular, Target 2026)',
      type: 'string',
      group: 'media',
    }),
    defineField({
      name: 'ctaText',
      title: 'Enrollment CTA Button Text',
      type: 'string',
      group: 'settings',
      initialValue: 'Enroll in Batch',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'settings',
      initialValue: 1,
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'classLevel',
      media: 'thumbnail',
      price: 'price',
    },
    prepare({ title, subtitle, media, price }) {
      return {
        title: title || 'Untitled Course',
        subtitle: `Class ${subtitle || '10'} • ₹${price || 3499}`,
        media,
      };
    },
  },
});
