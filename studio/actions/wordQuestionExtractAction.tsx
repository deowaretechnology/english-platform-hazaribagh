// studio/actions/wordQuestionExtractAction.tsx
//
// A custom Sanity Studio document action, shown only on "test" documents.
// Flow:
//   1. Editor uploads a .docx to the "Question Word File" field and saves.
//   2. Editor clicks "Extract Questions from Word File" (this action).
//   3. We call the backend's read-only preview endpoint — it downloads
//      the file, parses it, and returns the questions. Nothing is
//      written to Sanity yet.
//   4. A dialog shows every parsed question with a checkbox. Editor can
//      uncheck any that look wrong.
//   5. On "Add Selected to Test", THIS component (running inside Studio,
//      using the editor's own authenticated session) patches the
//      document's questions[] array directly. The backend never needs
//      write access to Sanity for this feature.
//
// Register this in sanity.config.ts:
//
//   import {WordQuestionExtractAction} from './actions/wordQuestionExtractAction'
//
//   export default defineConfig({
//     // ...existing config
//     document: {
//       actions: (prev, context) =>
//         context.schemaType === 'test' ? [...prev, WordQuestionExtractAction] : prev,
//     },
//   })
//
// Env var (Sanity Studio only exposes vars prefixed SANITY_STUDIO_ to the
// browser bundle — set this in studio/.env):
//   SANITY_STUDIO_API_URL=https://english-platform-hazaribagh.onrender.com

import React, { useState } from 'react';
import { useClient } from 'sanity';
import type { DocumentActionComponent, DocumentActionProps } from 'sanity';
import { Box, Button, Card, Checkbox, Flex, Spinner, Stack, Text } from '@sanity/ui';

interface ParsedQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

const API_URL =
  (import.meta as any).env?.SANITY_STUDIO_API_URL || 'https://english-platform-hazaribagh.onrender.com';

function stripDraftPrefix(id: string): string {
  return id.replace(/^drafts\./, '');
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export const WordQuestionExtractAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { id, type } = props;
  const client = useClient({ apiVersion: '2024-01-01' });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [adding, setAdding] = useState(false);
  const [addedCount, setAddedCount] = useState<number | null>(null);

  if (type !== 'test') return null;

  async function handleExtract() {
    setDialogOpen(true);
    setLoading(true);
    setError(null);
    setAddedCount(null);

    try {
      const res = await fetch(`${API_URL}/api/sanity/extract-questions-preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId: stripDraftPrefix(id) }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Extraction failed.');
        setQuestions([]);
        return;
      }

      setQuestions(data.questions);
      const initial: Record<number, boolean> = {};
      data.questions.forEach((_: ParsedQuestion, i: number) => {
        initial[i] = true;
      });
      setSelected(initial);
    } catch (e) {
      setError('Could not reach the server. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmAdd() {
    const toAdd = questions
      .filter((_, i) => selected[i])
      .map((q) => ({
        _type: 'questionCard',
        _key: randomKey(),
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
      }));

    if (toAdd.length === 0) return;

    setAdding(true);
    setError(null);
    try {
      await client
        .patch(stripDraftPrefix(id))
        .setIfMissing({ questions: [] })
        .insert('after', 'questions[-1]', toAdd)
        .commit();

      setAddedCount(toAdd.length);
      setQuestions([]);
    } catch (e) {
      setError('Failed to add questions to the test. Please try again.');
    } finally {
      setAdding(false);
    }
  }

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return {
    label: 'Extract Questions from Word File',
    onHandle: handleExtract,
    dialog: dialogOpen && {
      type: 'dialog',
      onClose: () => setDialogOpen(false),
      header: 'Extract Questions from Word File',
      content: (
        <Box padding={4}>
          {loading && (
            <Flex align="center" justify="center" padding={4} gap={3}>
              <Spinner muted />
              <Text>Reading and parsing your Word file...</Text>
            </Flex>
          )}

          {!loading && error && (
            <Card padding={3} radius={2} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          )}

          {!loading && !error && addedCount !== null && (
            <Card padding={3} radius={2} tone="positive">
              <Text size={1}>
                ✅ Added {addedCount} question{addedCount === 1 ? '' : 's'} to this test. Scroll down to the
                Questions field to review them, then Publish when ready.
              </Text>
            </Card>
          )}

          {!loading && !error && addedCount === null && questions.length > 0 && (
            <Stack space={4}>
              <Text size={1} muted>
                {questions.length} question{questions.length === 1 ? '' : 's'} found. Uncheck any you don't want
                to add, then confirm below.
              </Text>

              <Stack space={3}>
                {questions.map((q, i) => (
                  <Card key={i} padding={3} radius={2} shadow={1} tone={selected[i] ? 'default' : 'transparent'}>
                    <Flex align="flex-start" gap={3}>
                      <Checkbox
                        checked={!!selected[i]}
                        onChange={() => setSelected((s) => ({ ...s, [i]: !s[i] }))}
                      />
                      <Box flex={1}>
                        <Text weight="semibold" size={1}>
                          Q{i + 1}. {q.questionText}
                        </Text>
                        <Stack space={1} marginTop={3}>
                          <Text size={1}>A) {q.optionA}</Text>
                          <Text size={1}>B) {q.optionB}</Text>
                          <Text size={1}>C) {q.optionC}</Text>
                          <Text size={1}>D) {q.optionD}</Text>
                        </Stack>
                        <Box marginTop={2}>
                          <Text size={1} weight="semibold">
                            Correct Answer: Option {q.correctAnswer}
                          </Text>
                        </Box>
                      </Box>
                    </Flex>
                  </Card>
                ))}
              </Stack>

              <Button
                text={adding ? 'Adding...' : `Add ${selectedCount} Selected Question${selectedCount === 1 ? '' : 's'} to Test`}
                tone="positive"
                disabled={adding || selectedCount === 0}
                onClick={handleConfirmAdd}
              />
            </Stack>
          )}
        </Box>
      ),
    },
  };
};