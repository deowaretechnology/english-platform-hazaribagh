// src/lib/docxText.ts
//
// Extracts plain text from a .docx buffer.
// Install: npm install mammoth

import mammoth from 'mammoth';

export async function extractTextFromDocxBuffer(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}