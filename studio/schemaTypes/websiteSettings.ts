import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

export default defineType({
  name: 'websiteSettings',
  title: 'Website Global Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Website Title',
      type: 'string',
      initialValue: 'English Platform Hazaribagh',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Premier JAC & CBSE Board English Coaching Institute',
    }),
    defineField({
      name: 'logo',
      title: 'Institute Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon Icon',
      type: 'image',
    }),
    defineField({
      name: 'primaryColor',
      title: 'Primary Theme Color',
      type: 'string',
      initialValue: '#2563eb',
    }),
    defineField({
      name: 'maintenanceMode',
      title: 'Enable Maintenance Mode',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'siteTitle',
      subtitle: 'tagline',
    },
  },
});
