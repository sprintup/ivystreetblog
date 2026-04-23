import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { getWorksheetGenerationPolicy } from '@/utils/wordGardenGenerationPolicy';

export const runtime = 'nodejs';
export const maxDuration = 60;

const OPENAI_BASE_URL = 'https://api.openai.com/v1';
const DEFINITION_MODEL = 'gpt-4.1-mini';
const IMAGE_MODEL = 'gpt-image-1-mini';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function getOpenAiErrorMessage(response) {
  const errorData = await response.json().catch(() => null);

  return (
    errorData?.error?.message ||
    `OpenAI request failed with status ${response.status}.`
  );
}

function parseJsonContent(content) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  const normalizedContent = content
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  try {
    return JSON.parse(normalizedContent);
  } catch (error) {
    console.error('Unable to parse OpenAI JSON content:', error);
    return null;
  }
}

export async function POST(request) {
  const session = await getServerSession(options);

  if (!session) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const {
    apiKey,
    word,
    category = 'Appendix B lexicon',
    focusLabel = 'word study',
    definition = '',
    morphologyExamples = [],
    relatedWords = [],
  } = await request.json();

  if (!apiKey || !String(apiKey).trim()) {
    return jsonResponse({ error: 'OpenAI API key is required.' }, 400);
  }

  if (!word || !String(word).trim()) {
    return jsonResponse({ error: 'Word is required.' }, 400);
  }

  const trimmedWord = String(word).trim();
  const trimmedCategory = String(category).trim() || 'Appendix B lexicon';
  const trimmedFocusLabel = String(focusLabel).trim() || 'word study';
  const trimmedDefinition = String(definition).trim();
  const generationPolicy = getWorksheetGenerationPolicy(trimmedWord);
  const normalizedMorphologyExamples = Array.isArray(morphologyExamples)
    ? morphologyExamples
        .map(example =>
          typeof example === 'string' ? example : example?.form || ''
        )
        .filter(Boolean)
        .slice(0, 6)
    : [];
  const normalizedRelatedWords = Array.isArray(relatedWords)
    ? relatedWords
        .map(wordEntry =>
          typeof wordEntry === 'string' ? wordEntry : wordEntry?.word || ''
        )
        .filter(Boolean)
        .slice(0, 6)
    : [];

  if (generationPolicy.disabled) {
    return jsonResponse(
      {
        error: `Worksheet generation is disabled for "${trimmedWord}".`,
      },
      403
    );
  }

  try {
    const definitionResponse = await fetch(
      `${OPENAI_BASE_URL}/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: DEFINITION_MODEL,
          messages: [
            {
              role: 'system',
              content:
                'You create printable word-study supports for caregivers and young children. Return only JSON that matches the requested schema. Keep the definition child-friendly, concrete, and under 28 words. Create an image prompt for a black-and-white coloring-page style illustration with thick outlines, a pure white background, no gray shading, no gray fill, no drop shadows, and no text. If morphology examples or same-target words are provided, use them only as context. For morphemeSentences, include only real, natural English forms that make semantic sense for the target word. Never mechanically add endings. If a target word does not naturally take an -ing, past-tense, or plural form in normal child-facing use, leave that form out. If no natural morphology examples fit, return an empty array. For relatedWordConnections, prefer 3 child-friendly synonyms or close meaning words for the target word; if true synonyms are not natural, use conceptually related words instead. For antonymConnections, include up to 3 child-friendly opposite-meaning words only when the target word has natural opposites a caregiver could discuss with a young child; otherwise return an empty array. Keep every synonym, antonym, homonym, and morpheme response age-appropriate for a young child, short enough to read aloud, and easy for a caregiver to discuss. Prohibit mature, scary, violent, sexual, or overly academic examples. Do not choose words only because they share a sound, phoneme, or first letter. For homographMeanings, include short child-friendly meanings only when the target word has a common same-spelling or same-sounding different-meaning match that would be useful to discuss; otherwise return an empty array. For categoryTypeAnswer, answer the question "<word> is a type of what in <category>?" in 2 to 4 simple words, with no punctuation; return an empty string if no natural short answer fits.',
            },
            {
              role: 'user',
              content: [
                `Word: ${trimmedWord}`,
                `Category: ${trimmedCategory}`,
                `Focus: ${trimmedFocusLabel}`,
                trimmedDefinition
                  ? `Current definition: ${trimmedDefinition}`
                  : null,
                normalizedMorphologyExamples.length > 0
                  ? `Fallback morphology ideas to validate or discard: ${normalizedMorphologyExamples.join(', ')}`
                  : null,
                normalizedRelatedWords.length > 0
                  ? `Same-target fallback words currently available in the worksheet: ${normalizedRelatedWords.join(', ')}`
                  : null,
              ]
                .filter(Boolean)
                .join('\n'),
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'word_garden_generation',
              strict: true,
              schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  childFriendlyDefinition: {
                    type: 'string',
                  },
                  categoryTypeAnswer: {
                    type: 'string',
                  },
                  imagePrompt: {
                    type: 'string',
                  },
                  morphemeSentences: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        form: {
                          type: 'string',
                        },
                        sentence: {
                          type: 'string',
                        },
                      },
                      required: ['form', 'sentence'],
                    },
                  },
                  relatedWordConnections: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        word: {
                          type: 'string',
                        },
                        reason: {
                          type: 'string',
                        },
                      },
                      required: ['word', 'reason'],
                    },
                  },
                  antonymConnections: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        word: {
                          type: 'string',
                        },
                        reason: {
                          type: 'string',
                        },
                      },
                      required: ['word', 'reason'],
                    },
                  },
                  homographMeanings: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },
                required: [
                  'childFriendlyDefinition',
                  'categoryTypeAnswer',
                  'imagePrompt',
                  'morphemeSentences',
                  'relatedWordConnections',
                  'antonymConnections',
                  'homographMeanings',
                ],
              },
            },
          },
        }),
      }
    );

    if (!definitionResponse.ok) {
      return jsonResponse(
        { error: await getOpenAiErrorMessage(definitionResponse) },
        definitionResponse.status
      );
    }

    const definitionPayload = await definitionResponse.json();
    const generatedContent = parseJsonContent(
      definitionPayload?.choices?.[0]?.message?.content
    );

    if (!generatedContent) {
      return jsonResponse(
        { error: 'OpenAI returned an unreadable definition response.' },
        502
      );
    }

    const imageResponse = await fetch(`${OPENAI_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt: generatedContent.imagePrompt,
        size: '1024x1024',
      }),
    });

    if (!imageResponse.ok) {
      return jsonResponse(
        { error: await getOpenAiErrorMessage(imageResponse) },
        imageResponse.status
      );
    }

    const imagePayload = await imageResponse.json();
    const imageBase64 = imagePayload?.data?.[0]?.b64_json;

    if (!imageBase64) {
      return jsonResponse(
        { error: 'OpenAI did not return an image for this word.' },
        502
      );
    }

    return jsonResponse({
      childFriendlyDefinition: generatedContent.childFriendlyDefinition,
      categoryTypeAnswer: generatedContent.categoryTypeAnswer || '',
      morphemeSentences: generatedContent.morphemeSentences || [],
      relatedWordConnections: generatedContent.relatedWordConnections || [],
      antonymConnections: generatedContent.antonymConnections || [],
      homographMeanings: generatedContent.homographMeanings || [],
      imagePrompt: generatedContent.imagePrompt,
      imageDataUrl: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error('Error generating Word Garden OpenAI content:', error);
    return jsonResponse(
      { error: 'Unable to reach OpenAI right now. Please try again.' },
      502
    );
  }
}
