const DISABLED_WORKSHEET_GENERATION_WORDS = new Set([
  'bath',
  'blood',
  'brain',
  'heart',
  'lungs',
  'organs',
  'reproduction',
]);

function normalizeWorksheetGenerationWord(word) {
  return String(word || '').trim().toLowerCase();
}

export function getWorksheetGenerationPolicy(word) {
  const normalizedWord = normalizeWorksheetGenerationWord(word);
  return {
    disabled: DISABLED_WORKSHEET_GENERATION_WORDS.has(normalizedWord),
    normalizedWord,
  };
}

export function isWorksheetGenerationDisabled(word) {
  return getWorksheetGenerationPolicy(word).disabled;
}

export const WORKSHEET_GENERATION_DISABLED_WORDS = Array.from(
  DISABLED_WORKSHEET_GENERATION_WORDS
);
