import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
import { deskStructure } from './structure/deskStructure';
import { WordQuestionExtractAction } from './actions/wordQuestionExtractAction';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'yy1yyjmy';
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production';

export default defineConfig({
  name: 'default',
  title: 'English Platform Studio',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) =>
      context.schemaType === 'test' ? [...prev, WordQuestionExtractAction] : prev,
  },
});