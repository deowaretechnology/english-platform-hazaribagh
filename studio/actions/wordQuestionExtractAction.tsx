// studio/actions/wordQuestionExtractAction.tsx

import React, { useState } from 'react';
import { useClient } from 'sanity';
import type {
  DocumentActionComponent,
  DocumentActionProps,
} from 'sanity';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Spinner,
  Stack,
  Text,
} from '@sanity/ui';

interface ParsedQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

const API_URL =
  (import.meta as any).env?.SANITY_STUDIO_API_URL ||
  'https://english-platform-hazaribagh.onrender.com';

function randomKey(): string {
  return (
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36).slice(-4)
  );
}

export const WordQuestionExtractAction: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  const {
    id,
    type,
    draft,
    published,
  } = props;

  const client = useClient({
    apiVersion: '2024-01-01',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  const [adding, setAdding] = useState(false);
  const [addedCount, setAddedCount] = useState<number | null>(null);

  if (type !== 'test') {
    return null;
  }

  /*
   * IMPORTANT:
   *
   * Prefer the current draft document.
   * If no draft exists, use published document.
   *
   * Do NOT remove "drafts." from the ID.
   */
  const currentDocumentId =
    draft?._id ||
    published?._id ||
    id;

  console.log(
    '[Word Extract Action] Current document ID:',
    currentDocumentId
  );

  async function handleExtract() {
    setDialogOpen(true);
    setLoading(true);
    setError(null);
    setAddedCount(null);
    setQuestions([]);

    try {
      console.log(
        '[Word Extract Action] Sending testId:',
        currentDocumentId
      );

      const res = await fetch(
        `${API_URL}/api/sanity/extract-questions-preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testId: currentDocumentId,
          }),
        }
      );

      const data = await res.json();

      console.log(
        '[Word Extract Action] Backend response:',
        data
      );

      if (!res.ok || !data.success) {
        setError(
          data.error ||
            'Extraction failed. Please try again.'
        );

        setQuestions([]);
        return;
      }

      setQuestions(data.questions || []);

      const initial: Record<number, boolean> = {};

      (data.questions || []).forEach(
        (_: ParsedQuestion, index: number) => {
          initial[index] = true;
        }
      );

      setSelected(initial);
    } catch (error) {
      console.error(
        '[Word Extract Action] Request failed:',
        error
      );

      setError(
        'Could not reach the server. Check the backend URL and your internet connection.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmAdd() {
    const toAdd = questions
      .filter((_, index) => selected[index])
      .map((question) => ({
        _type: 'questionCard',
        _key: randomKey(),

        questionText: question.questionText,

        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,

        correctAnswer: question.correctAnswer,

        explanation: question.explanation || '',
        difficulty:
          question.difficulty || 'Medium',
      }));

    if (toAdd.length === 0) {
      setError(
        'Please select at least one question.'
      );
      return;
    }

    setAdding(true);
    setError(null);

    try {
      console.log(
        '[Word Extract Action] Adding questions to:',
        currentDocumentId
      );

      await client
        .patch(currentDocumentId)
        .setIfMissing({
          questions: [],
        })
        .insert(
          'after',
          'questions[-1]',
          toAdd
        )
        .commit();

      setAddedCount(toAdd.length);
      setQuestions([]);
      setSelected({});

      console.log(
        '[Word Extract Action] Successfully added:',
        toAdd.length
      );
    } catch (error) {
      console.error(
        '[Word Extract Action] Failed to add questions:',
        error
      );

      setError(
        'Failed to add questions to the test. Please try again.'
      );
    } finally {
      setAdding(false);
    }
  }

  const selectedCount = Object.values(
    selected
  ).filter(Boolean).length;

  return {
    label: 'Extract Questions from Word File',

    onHandle: handleExtract,

    dialog: dialogOpen && {
      type: 'dialog',

      onClose: () => {
        if (!loading && !adding) {
          setDialogOpen(false);
        }
      },

      header: 'Extract Questions from Word File',

      content: (
        <Box padding={4}>
          {/* Loading */}

          {loading && (
            <Flex
              align="center"
              justify="center"
              padding={5}
              gap={3}
            >
              <Spinner muted />

              <Text>
                Reading and parsing your Word file...
              </Text>
            </Flex>
          )}

          {/* Error */}

          {!loading && error && (
            <Card
              padding={4}
              radius={2}
              tone="critical"
            >
              <Stack space={3}>
                <Text
                  size={1}
                  weight="semibold"
                >
                  Extraction Error
                </Text>

                <Text size={1}>
                  {error}
                </Text>
              </Stack>
            </Card>
          )}

          {/* Successfully added */}

          {!loading &&
            !error &&
            addedCount !== null && (
              <Card
                padding={4}
                radius={2}
                tone="positive"
              >
                <Stack space={3}>
                  <Text
                    size={1}
                    weight="semibold"
                  >
                    Questions Added Successfully
                  </Text>

                  <Text size={1}>
                    Added {addedCount}{' '}
                    question
                    {addedCount === 1
                      ? ''
                      : 's'}{' '}
                    to this test.
                  </Text>

                  <Text size={1} muted>
                    Scroll down to the Questions
                    field, review the questions,
                    then Publish the document.
                  </Text>
                </Stack>
              </Card>
            )}

          {/* Questions Preview */}

          {!loading &&
            !error &&
            addedCount === null &&
            questions.length > 0 && (
              <Stack space={4}>
                <Text
                  size={1}
                  muted
                >
                  {questions.length}{' '}
                  question
                  {questions.length === 1
                    ? ''
                    : 's'}{' '}
                  found. Uncheck any question
                  you do not want to add.
                </Text>

                <Stack space={3}>
                  {questions.map(
                    (question, index) => (
                      <Card
                        key={index}
                        padding={4}
                        radius={2}
                        shadow={1}
                        tone={
                          selected[index]
                            ? 'default'
                            : 'transparent'
                        }
                      >
                        <Flex
                          align="flex-start"
                          gap={3}
                        >
                          <Checkbox
                            checked={
                              !!selected[index]
                            }
                            onChange={() =>
                              setSelected(
                                (state) => ({
                                  ...state,
                                  [index]:
                                    !state[index],
                                })
                              )
                            }
                          />

                          <Box flex={1}>
                            {/* Question */}

                            <Text
                              weight="semibold"
                              size={1}
                            >
                              Q{index + 1}.{' '}
                              {
                                question.questionText
                              }
                            </Text>

                            {/* Options */}

                            <Stack
                              space={2}
                              marginTop={3}
                            >
                              <Text size={1}>
                                A) {question.optionA}
                              </Text>

                              <Text size={1}>
                                B) {question.optionB}
                              </Text>

                              <Text size={1}>
                                C) {question.optionC}
                              </Text>

                              <Text size={1}>
                                D) {question.optionD}
                              </Text>
                            </Stack>

                            {/* Answer */}

                            <Box marginTop={3}>
                              <Text
                                size={1}
                                weight="semibold"
                              >
                                Correct Answer:
                                {' '}
                                Option{' '}
                                {
                                  question.correctAnswer
                                }
                              </Text>
                            </Box>

                            {/* Difficulty */}

                            {question.difficulty && (
                              <Box marginTop={2}>
                                <Text
                                  size={1}
                                  muted
                                >
                                  Difficulty:{' '}
                                  {
                                    question.difficulty
                                  }
                                </Text>
                              </Box>
                            )}
                          </Box>
                        </Flex>
                      </Card>
                    )
                  )}
                </Stack>

                {/* Add button */}

                <Button
                  text={
                    adding
                      ? 'Adding...'
                      : `Add ${selectedCount} Selected Question${
                          selectedCount === 1
                            ? ''
                            : 's'
                        } to Test`
                  }
                  tone="positive"
                  disabled={
                    adding ||
                    selectedCount === 0
                  }
                  onClick={
                    handleConfirmAdd
                  }
                />
              </Stack>
            )}

          {/* No questions */}

          {!loading &&
            !error &&
            addedCount === null &&
            questions.length === 0 && (
              <Card
                padding={4}
                radius={2}
              >
                <Text
                  size={1}
                  muted
                >
                  No questions were extracted
                  from the Word file.
                </Text>
              </Card>
            )}
        </Box>
      ),
    },
  };
};