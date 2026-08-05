import { defineField, defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons';

export default defineType({
  name: 'homepageSections',
  title: 'Homepage Section Controls',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Heading',
      type: 'string',
      initialValue: 'Master English Grammar & Literature for JAC & CBSE Boards',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Hazaribagh\'s top-rated institute for Class 8th to 12th Board exam excellence.',
    }),
    defineField({
      name: 'showToppersSection',
      title: 'Display Toppers Carousel',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showTestSeriesSection',
      title: 'Display Sunday OMR Test Series Section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showCoursesSection',
      title: 'Display Offline Batches Section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showVideoLectures',
      title: 'Display Recorded Video Lectures',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showNotesSection',
      title: 'Display PDF Study Notes Section',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
    },
    prepare({ title }) {
      return {
        title: title || 'Homepage Section Controls',
      };
    },
  },
});
