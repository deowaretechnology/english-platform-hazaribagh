import { defineField, defineType } from 'sanity';
import { InfoOutlineIcon } from '@sanity/icons';

export default defineType({
  name: 'admissionInfo',
  title: 'Admission Information',
  type: 'document',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'batchYear',
      title: 'Current Academic Session',
      type: 'string',
      initialValue: '2025-2026 Board Batch',
    }),
    defineField({
      name: 'eligibility',
      title: 'Eligibility Criteria',
      type: 'text',
      rows: 3,
      initialValue: 'Students entering Class 8, 9, 10, 11, or 12 in JAC / CBSE Board schools.',
    }),
    defineField({
      name: 'feeStructure',
      title: 'Fee Structure Notes',
      type: 'text',
      rows: 4,
      initialValue: 'Affordable annual course fee with easy 2-part installment options and merit scholarships for top rankers.',
    }),
    defineField({
      name: 'documentsRequired',
      title: 'Documents Required for Admission',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'Aadhaar Card Copy',
        '2 Recent Passport Size Photographs',
        'Previous Class Report Card / Marksheet',
      ],
    }),
    defineField({
      name: 'contactHelpline',
      title: 'Admission Desk Phone Number',
      type: 'string',
      initialValue: '+91 8969457707',
    }),
    defineField({
      name: 'address',
      title: 'Center Address',
      type: 'text',
      rows: 2,
      initialValue: 'Near Babu Gaon Chowk, Korrah, Hazaribagh, Jharkhand - 825301',
    }),
  ],
  preview: {
    select: {
      title: 'batchYear',
      subtitle: 'contactHelpline',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Admission Guidelines',
        subtitle: `Helpline: ${subtitle || '+91 8969457707'}`,
      };
    },
  },
});
