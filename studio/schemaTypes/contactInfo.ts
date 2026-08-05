import { defineField, defineType } from 'sanity';
import { MobileDeviceIcon } from '@sanity/icons';

export default defineType({
  name: 'contactInfo',
  title: 'Contact Information',
  type: 'document',
  icon: MobileDeviceIcon,
  fields: [
    defineField({
      name: 'instituteName',
      title: 'Institute Official Name',
      type: 'string',
      initialValue: 'English Platform Hazaribagh',
    }),
    defineField({
      name: 'phonePrimary',
      title: 'Primary Contact Number',
      type: 'string',
      initialValue: '+91 8969457707',
    }),
    defineField({
      name: 'phoneSecondary',
      title: 'Secondary Contact / WhatsApp',
      type: 'string',
      initialValue: '+91 9012345678',
    }),
    defineField({
      name: 'email',
      title: 'Official Email Address',
      type: 'string',
      initialValue: 'contact@englishplatformhazaribagh.com',
    }),
    defineField({
      name: 'address',
      title: 'Physical Center Address',
      type: 'text',
      rows: 2,
      initialValue: 'Babu Gaon Chowk, Main Road Korrah, Hazaribagh, Jharkhand 825301',
    }),
    defineField({
      name: 'googleMapsEmbedUrl',
      title: 'Google Maps Embed URL',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'timing',
      title: 'Center Operating Hours',
      type: 'string',
      initialValue: 'Mon - Sat: 06:00 AM - 07:00 PM | Sun: 08:00 AM - 01:00 PM',
    }),
  ],
  preview: {
    select: {
      title: 'instituteName',
      subtitle: 'phonePrimary',
    },
  },
});
