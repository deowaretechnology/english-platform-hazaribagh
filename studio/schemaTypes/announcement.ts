import { defineField, defineType } from 'sanity';
import { BellIcon } from '@sanity/icons';

export default defineType({
  name: 'announcement',
  title: 'Announcement / Live Alert',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Announcement Details',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Notification Type',
      type: 'string',
      options: {
        list: [
          { title: 'Information (Blue)', value: 'info' },
          { title: 'Warning / Deadline (Yellow)', value: 'warning' },
          { title: 'Success / Batch Launch (Green)', value: 'success' },
          { title: 'Urgent Alert (Red)', value: 'urgent' },
        ],
      },
      initialValue: 'info',
    }),
    defineField({
      name: 'link',
      title: 'Optional Action Link',
      type: 'string',
    }),
    defineField({
      name: 'isActive',
      title: 'Active Banner',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date & Time',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      isActive: 'isActive',
    },
    prepare({ title, subtitle, isActive }) {
      return {
        title: title || 'Untitled Announcement',
        subtitle: `${subtitle?.toUpperCase() || 'INFO'} • ${isActive ? 'Active' : 'Disabled'}`,
      };
    },
  },
});
