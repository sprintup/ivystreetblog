'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getWorksheetGenerationPolicy } from '@/utils/wordGardenGenerationPolicy';

const REQUIRED_CHECKS_PER_PANE = 2;

function getWorksheetState(generatedContent, generationDisabled) {
  if (generatedContent) {
    return 'generated';
  }

  return generationDisabled ? 'disabled' : 'ungenerated';
}

function getStateBadgeClass(state) {
  if (state === 'generated') {
    return 'bg-green-500/20 text-green-700';
  }

  if (state === 'disabled') {
    return 'bg-amber-100 text-amber-800';
  }

  return 'bg-slate-200 text-slate-700';
}

function getStateLabel(state) {
  if (state === 'generated') {
    return 'Generated';
  }

  return state === 'disabled' ? 'Disabled' : 'Ungenerated';
}

function getChecklistStatusLabel(status) {
  if (status === 'complete') {
    return 'Complete';
  }

  return status === 'started' ? 'Started' : 'Start Checklist';
}

function getChecklistStatusClass(status) {
  if (status === 'complete') {
    return 'border-green-400/30 bg-green-500/10 text-green-200';
  }

  if (status === 'started') {
    return 'border-yellow/30 bg-yellow/10 text-yellow';
  }

  return 'border-accent/30 bg-white/5 text-accent';
}

function buildInitialCheckedState(panes) {
  return panes.reduce((state, pane) => {
    pane.items.forEach(item => {
      state[item.id] = false;
    });
    return state;
  }, {});
}

function buildCheckedStateFromSavedItems(panes, savedItemIds = []) {
  const savedItemIdSet = new Set(
    Array.isArray(savedItemIds)
      ? savedItemIds.map(itemId => String(itemId || '').trim()).filter(Boolean)
      : []
  );

  return panes.reduce((state, pane) => {
    pane.items.forEach(item => {
      state[item.id] = savedItemIdSet.has(item.id);
    });
    return state;
  }, {});
}

function buildFullyCheckedState(panes) {
  return panes.reduce((state, pane) => {
    pane.items.forEach(item => {
      state[item.id] = true;
    });
    return state;
  }, {});
}

function buildInitialRequiredPaneCollapseState(panes, checkedState = {}) {
  return panes.reduce((state, pane) => {
    if (!pane.required) {
      return state;
    }

    const checkedCount = pane.items.filter(item => checkedState[item.id]).length;
    state[pane.id] = checkedCount >= REQUIRED_CHECKS_PER_PANE;
    return state;
  }, {});
}

function getCheckedItemIdsFromState(checkedState = {}) {
  return Object.entries(checkedState)
    .filter(([, isChecked]) => Boolean(isChecked))
    .map(([itemId]) => itemId);
}

function buildWordHrefWithContext(acId, selectionType, selectionSlug, word, letter = '') {
  const encodedWord = encodeURIComponent(word);
  if (selectionType === 'all') {
    return `/word-garden/${acId}/all/${encodedWord}`;
  }

  return selectionType === 'letter'
    ? `/word-garden/${acId}/letter/${selectionSlug}/${encodedWord}`
    : `/word-garden/${acId}/phoneme/${selectionSlug}/${encodedWord}${
        letter ? `?letter=${encodeURIComponent(letter)}` : ''
      }`;
}

function buildPhonemeHref(acId, phonemeSlug, letter = '') {
  if (!phonemeSlug) {
    return '';
  }

  return `/word-garden/${acId}/phoneme/${phonemeSlug}${
    letter ? `?letter=${encodeURIComponent(letter)}` : ''
  }`;
}

function buildLetterHref(acId, letter) {
  const normalizedLetter = String(letter || '')
    .trim()
    .charAt(0)
    .toUpperCase();

  return normalizedLetter ? `/word-garden/${acId}/letter/${normalizedLetter}` : '';
}

function buildAllWordsCategoryHref(acId, category = '') {
  const normalizedCategory = String(category || '').trim();

  return normalizedCategory
    ? `/word-garden/${acId}/all?category=${encodeURIComponent(normalizedCategory)}`
    : `/word-garden/${acId}/all`;
}

function getSelectedLetterValue(wordDetail) {
  return String(
    wordDetail.uppercaseLetter ||
      wordDetail.selectionSlug ||
      wordDetail.word.charAt(0) ||
      ''
  )
    .trim()
    .charAt(0)
    .toUpperCase();
}

function isVowelLetter(letter) {
  return /^[AEIOU]$/.test(String(letter || '').toUpperCase());
}

function getSelectedLetterSound(wordDetail) {
  const targetLetter = getSelectedLetterValue(wordDetail);
  const matchingSoundRow = wordDetail.soundMapRows.find(
    row =>
      String(row.grapheme || '').toUpperCase().includes(targetLetter) &&
      row.phonemeLabel
  );

  return (
    matchingSoundRow?.phonemeLabel ||
    (wordDetail.selectionType === 'phoneme'
      ? wordDetail.targetPhonemeLabel
      : null) ||
    null
  );
}

function getOrthographicLetterSoundPhrase(wordDetail) {
  if (wordDetail.selectionType === 'phoneme') {
    return `${getAnalyticTargetSound(wordDetail)} sound`;
  }

  const targetLetter = getSelectedLetterValue(wordDetail);

  if (isVowelLetter(targetLetter)) {
    return `an open ${targetLetter} sound`;
  }

  const selectedLetterSound = getSelectedLetterSound(wordDetail);
  return selectedLetterSound ? `${selectedLetterSound} sound` : null;
}

function getFallbackLetterSoundPhrase(wordDetail) {
  const targetLetter = getSelectedLetterValue(wordDetail);

  return isVowelLetter(targetLetter)
    ? `an open ${targetLetter} sound`
    : `a ${targetLetter} sound`;
}

function getSelectedLetterSoundLinkData(wordDetail) {
  const targetLetter = getSelectedLetterValue(wordDetail);
  const matchingSoundRow = wordDetail.soundMapRows.find(
    row =>
      String(row.grapheme || '').toUpperCase().includes(targetLetter) &&
      row.phonemeLabel &&
      row.phonemeSlug
  );

  return matchingSoundRow
    ? {
        text: matchingSoundRow.phonemeLabel,
        phonemeSlug: matchingSoundRow.phonemeSlug,
      }
    : null;
}

function getPrimaryPhonemeRelationData(wordDetail) {
  if (wordDetail.selectionType === 'phoneme' && wordDetail.selectionSlug) {
    return {
      label: wordDetail.targetPhonemeLabel,
      phonemeSlug: wordDetail.selectionSlug,
    };
  }

  const firstMappedRow = (wordDetail.soundMapRows || []).find(row => {
    const phonemeSlug = getRowPhonemeSlugs(row)[0];
    return phonemeSlug && row.phonemeLabel;
  });

  return firstMappedRow
    ? {
        label: firstMappedRow.phonemeLabel,
        phonemeSlug: getRowPhonemeSlugs(firstMappedRow)[0],
      }
    : null;
}

function getAnalyticTargetSound(wordDetail) {
  return wordDetail.selectionType === 'phoneme'
    ? wordDetail.targetPhonemeLabel || 'the target sound'
    : getSelectedLetterSound(wordDetail);
}

function getOrthographicFocusRows(wordDetail) {
  if (wordDetail.selectionType !== 'phoneme') {
    return [];
  }

  const highlightedIndexes = getHighlightedPhonemeRowIndexes(
    wordDetail.soundMapRows,
    wordDetail.selectionSlug
  );

  return wordDetail.soundMapRows.filter((row, index) => highlightedIndexes.has(index));
}

function getOrthographicFocusDisplay(wordDetail) {
  if (wordDetail.selectionType !== 'phoneme') {
    return getSelectedLetterValue(wordDetail);
  }

  return (
    getOrthographicFocusRows(wordDetail)[0]?.displayGrapheme ||
    getOrthographicFocusRows(wordDetail)[0]?.grapheme ||
    getSelectedLetterValue(wordDetail)
  );
}

function getOrthographicFocusLabel(wordDetail) {
  const focusDisplay = getOrthographicFocusDisplay(wordDetail);
  const lettersOnly = String(focusDisplay || '').replace(/[^A-Za-z]/g, '');

  return lettersOnly.length > 1 ? 'letters' : 'letter';
}

function renderHighlightedOrthographicWord(wordDetail) {
  if (wordDetail.selectionType !== 'phoneme') {
    return renderHighlightedLetterWord(
      wordDetail.word,
      getSelectedLetterValue(wordDetail)
    );
  }

  const highlightedIndexes = getHighlightedPhonemeRowIndexes(
    wordDetail.soundMapRows,
    wordDetail.selectionSlug
  );

  if (highlightedIndexes.size === 0) {
    return wordDetail.word;
  }

  return wordDetail.soundMapRows.map((row, index) => (
    <span
      key={`${row.displayGrapheme || row.grapheme}-${index}-orthographic`}
      className={highlightedIndexes.has(index) ? 'text-yellow' : undefined}
    >
      {row.displayGrapheme || row.grapheme}
    </span>
  ));
}

function getRowPhonemeSlugs(row) {
  return Array.isArray(row?.phonemeSlugs)
    ? row.phonemeSlugs
    : row?.phonemeSlug
      ? [row.phonemeSlug]
      : [];
}

function getRowSupportedPhonemeSlugs(row) {
  return Array.isArray(row?.supportedPhonemeSlugs)
    ? row.supportedPhonemeSlugs
    : getRowPhonemeSlugs(row);
}

function getInitialLetterValue(wordDetail) {
  return String(wordDetail.initialLetter || wordDetail.word.charAt(0) || '')
    .trim()
    .charAt(0)
    .toUpperCase();
}

function getLetterArticle(letter) {
  return /^[AEFHILMNORSX]$/.test(String(letter || '').toUpperCase()) ? 'an' : 'a';
}

function getInitialLetterSoundData(wordDetail) {
  const firstSoundRow =
    (wordDetail.soundMapRows || []).find(row => row.phonemeLabel) || null;
  const initialLetter = getInitialLetterValue(wordDetail);

  if (firstSoundRow?.phonemeLabel) {
    const phonemeSlug = getRowPhonemeSlugs(firstSoundRow)[0] || null;

    return {
      label: firstSoundRow.phonemeLabel,
      promptLabel: firstSoundRow.phonemeLabel,
      phrase: `a ${firstSoundRow.phonemeLabel} sound`,
      phonemeSlug,
      letter: initialLetter,
    };
  }

  if (/^[AEIOU]$/.test(initialLetter)) {
    return {
      label: `open ${initialLetter}`,
      promptLabel: `the ${initialLetter} sound`,
      phrase: `an open ${initialLetter} sound`,
      phonemeSlug: null,
      letter: initialLetter,
    };
  }

  return {
    label: `${initialLetter}`,
    promptLabel: `${initialLetter} sound`,
    phrase: `a ${initialLetter} sound`,
    phonemeSlug: null,
    letter: initialLetter,
  };
}

function getHighlightedPhonemeRowIndexes(soundMapRows = [], selectionSlug = '') {
  const exactMatches = soundMapRows.reduce((indexes, row, index) => {
    if (getRowPhonemeSlugs(row).includes(selectionSlug)) {
      indexes.push(index);
    }

    return indexes;
  }, []);

  if (exactMatches.length > 0) {
    return new Set(exactMatches);
  }

  return new Set(
    soundMapRows.reduce((indexes, row, index) => {
      if (getRowSupportedPhonemeSlugs(row).includes(selectionSlug)) {
        indexes.push(index);
      }

      return indexes;
    }, [])
  );
}

function isPhonemeSlugUnlocked(phonemeSlug, unlockedPhonemeSet) {
  const symbols = String(phonemeSlug || '')
    .split('__')
    .filter(Boolean);

  return (
    symbols.length > 0 &&
    symbols.every(symbol => unlockedPhonemeSet.has(symbol))
  );
}

function getChecklistFocusLetterValue(wordDetail, selectedLetter = '') {
  return (
    String(selectedLetter || '').trim().charAt(0).toUpperCase() ||
    (wordDetail.selectionType === 'letter'
      ? getSelectedLetterValue(wordDetail)
      : '') ||
    getInitialLetterValue(wordDetail)
  );
}

function renderHighlightedLetterWord(word, selectedLetter) {
  const displayWord = String(word || '');
  const normalizedSelectedLetter = String(selectedLetter || '')
    .trim()
    .charAt(0)
    .toUpperCase();

  if (!normalizedSelectedLetter) {
    return displayWord;
  }

  return Array.from(displayWord).map((character, index) => (
    <span
      key={`${displayWord}-${character}-${index}`}
      className={
        /[A-Za-z]/.test(character) &&
        character.toUpperCase() === normalizedSelectedLetter
          ? 'text-yellow'
          : undefined
      }
    >
      {character}
    </span>
  ));
}

function getPhonologicalPrompt(wordDetail) {
  if (wordDetail.selectionType === 'all') {
    return `Ask: What is the first sound in ${wordDetail.word}? What other sounds do you hear in the word?`;
  }

  if (wordDetail.selectionType === 'letter') {
    return wordDetail.isEmbeddedLetterSelection
      ? `Ask: Can you find the letter ${wordDetail.selectionSlug} inside ${wordDetail.word}?`
      : `Ask: What letter does ${wordDetail.word} start with? Can you point to the ${wordDetail.selectionSlug} at the beginning?`;
  }

  return `Ask: What is the first sound in ${wordDetail.word}? Can you hear ${wordDetail.targetPhonemeLabel} somewhere in the word?`;
}

function buildPanes(wordDetail) {
  const syllables = `${wordDetail.syllableCount} syllable${
    wordDetail.syllableCount === 1 ? '' : 's'
  }`;
  const initialLetter = getInitialLetterValue(wordDetail);
  const initialLetterArticle = getLetterArticle(initialLetter);
  const initialLetterSoundData = getInitialLetterSoundData(wordDetail);
  const firstSoundChecklistLabel = `${wordDetail.word} starts with ${initialLetterArticle} ${initialLetter}, which makes ${initialLetterSoundData.phrase}. Can you say ${initialLetterSoundData.promptLabel}?`;
  const orthographicFocus = getOrthographicFocusDisplay(wordDetail);
  const upper =
    wordDetail.selectionType === 'phoneme'
      ? String(orthographicFocus || '').replace(/[^A-Za-z]/g, '').toUpperCase() ||
        wordDetail.word.charAt(0).toUpperCase()
      : wordDetail.uppercaseLetter || wordDetail.word.charAt(0).toUpperCase();
  const lower =
    wordDetail.selectionType === 'phoneme'
      ? String(orthographicFocus || '').replace(/[^A-Za-z]/g, '').toLowerCase() ||
        upper.toLowerCase()
      : wordDetail.lowercaseLetter || upper.toLowerCase();

  return [
    {
      id: 'phonological',
      title: 'Phonological',
      description: 'How the word sounds.',
      strategyTitle: 'Synthetic Approach',
      required: true,
      items: [
        {
          id: 'phonological-say',
          label: firstSoundChecklistLabel,
        },
        { id: 'phonological-repeat', label: `Ask the child to say "${wordDetail.word}".` },
        {
          id: 'phonological-syllables',
          label: `Segment and pronounce each syllable and ask the child how many syllables (${syllables}).`,
        },
      ],
    },
    {
      id: 'meaning',
      title: 'Meaning',
      description: 'What the word means.',
      strategyTitle: 'Clickable Definition',
      required: true,
      items: [
        {
          id: 'meaning-definition',
          label: `Say the definition of "${wordDetail.word}" together.`,
        },
        { id: 'meaning-sentence', label: `Say "${wordDetail.word}" as part of a sentence.` },
        { id: 'meaning-explain', label: `Ask the child what "${wordDetail.word}" means.` },
      ],
    },
    {
      id: 'orthographic',
      title: 'Orthographic',
      description: 'How the word looks.',
      strategyTitle: 'Analytic Approach',
      required: true,
      items: [
        {
          id: 'orthographic-start',
          label: (
            <>
              "{wordDetail.word}" starts with letter {initialLetter}, which looks like{' '}
              <strong className='worksheet-letter-emphasis uppercase'>{upper}</strong>{' '}
              in uppercase and{' '}
              <strong className='worksheet-letter-emphasis lowercase'>{lower}</strong>{' '}
              in lowercase.
            </>
          ),
        },
        {
          id: 'orthographic-spell',
          label: `Write or show the word "${wordDetail.word}" for the child.`,
        },
        {
          id: 'orthographic-write-draw',
          label: `Have the child write the word "${wordDetail.word}" and draw "${wordDetail.word}".`,
        },
      ],
    },
    {
      id: 'context',
      title: 'Context',
      description: 'Inferring deeper meaning.',
      strategyTitle: 'Related Words, Synonyms, Antonyms, Homonyms, Morphemes',
      required: true,
      items: [
        {
          id: 'context-category',
          label: `What are some words in the ${
            wordDetail.category ? `${wordDetail.category} category` : 'category'
          } that relate to "${wordDetail.word}"?`,
        },
        {
          id: 'context-connections',
          label: 'Discuss any synonyms, antonym, homonyms, morphemes.',
        },
        {
          id: 'context-known',
          label: `Relate "${wordDetail.word}" using a metaphor.`,
        },
      ],
    },
    {
      id: 'optional',
      title: 'Optional (ages 3+)',
      description: 'Extra practice with the same word. This section does not count toward completion.',
      strategyTitle: 'Sound Map And Onset / Rime',
      required: false,
      items: [
        {
          id: 'optional-sounds',
          label: `Try to have the child say all the sounds in "${wordDetail.word}" one at a time.`,
        },
        {
          id: 'optional-remove',
          label: `Say "${wordDetail.word}" again without one sound and discuss what changed.`,
        },
        {
          id: 'optional-build',
          label: `Build a different word from one of the sounds in "${wordDetail.word}".`,
        },
        {
          id: 'optional-onset-rime',
          label: `Model the onset and rime for "${wordDetail.word}": ${
            wordDetail.onsetAndRime.onset || '-'
          } / ${wordDetail.onsetAndRime.rime || wordDetail.word}.`,
        },
        {
          id: 'optional-sign',
          label: `Practice sign language for "${wordDetail.word}".`,
        },
      ],
    },
  ];
}

export default function WorksheetChecklist({
  acId,
  autoCheckFromQr = false,
  hasCurrentWord = false,
  openChecklistCount = 0,
  letterScopedPhonemeSlugs = [],
  qrCodeUrl,
  recommendHref = '',
  soundTableSelection = '',
  unlockedArpabet = [],
  wordDetail,
}) {
  const router = useRouter();
  const panes = useMemo(() => buildPanes(wordDetail), [wordDetail]);
  const unlockedArpabetSet = useMemo(
    () => new Set((unlockedArpabet || []).map(symbol => String(symbol || '').trim())),
    [unlockedArpabet]
  );
  const letterScopedPhonemeSlugSet = useMemo(
    () =>
      new Set(
        (letterScopedPhonemeSlugs || [])
          .map(slug => String(slug || '').trim())
          .filter(Boolean)
      ),
    [letterScopedPhonemeSlugs]
  );
  const generationPolicy = useMemo(
    () => getWorksheetGenerationPolicy(wordDetail.word),
    [wordDetail.word]
  );
  const isGenerationDisabled = generationPolicy.disabled;
  const [apiKey, setApiKey] = useState('');
  const [checkedItems, setCheckedItems] = useState(() =>
    buildCheckedStateFromSavedItems(panes, wordDetail.checklistCheckedItemIds)
  );
  const [collapsedRequiredPanes, setCollapsedRequiredPanes] = useState(() =>
    buildInitialRequiredPaneCollapseState(
      panes,
      buildCheckedStateFromSavedItems(panes, wordDetail.checklistCheckedItemIds)
    )
  );
  const [completionError, setCompletionError] = useState('');
  const [completionSuccess, setCompletionSuccess] = useState('');
  const [generationError, setGenerationError] = useState('');
  const [generationSuccess, setGenerationSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [hasTriggeredGeneratedPrint, setHasTriggeredGeneratedPrint] =
    useState(false);
  const [hasAppliedQrAutoCheck, setHasAppliedQrAutoCheck] = useState(false);
  const [isWordComplete, setIsWordComplete] = useState(
    () => (wordDetail.completedChecklistCount || 0) > 0
  );
  const [isChecklistOpen, setIsChecklistOpen] = useState(
    () => wordDetail.checklistStatus === 'started'
  );
  const [isCurrentWord, setIsCurrentWord] = useState(() => Boolean(wordDetail.isCurrentWord));
  const [isStartingChecklist, setIsStartingChecklist] = useState(false);
  const [isResettingChecklist, setIsResettingChecklist] = useState(false);
  const [isResetStartedChecklist, setIsResetStartedChecklist] = useState(false);
  const [isSettingCurrentWord, setIsSettingCurrentWord] = useState(false);
  const [isContinueModalOpen, setIsContinueModalOpen] = useState(false);
  const [isResetStartedModalOpen, setIsResetStartedModalOpen] = useState(false);
  const [isCompletionSummaryOpen, setIsCompletionSummaryOpen] = useState(false);
  const [isPrintableImageReady, setIsPrintableImageReady] = useState(true);
  const checklistSaveQueueRef = useRef(Promise.resolve());
  const previousRequiredPaneCompletionRef = useRef({});

  const state = getWorksheetState(generatedContent, isGenerationDisabled);
  const printableDefinition = generatedContent?.childFriendlyDefinition || wordDetail.definition;
  const hasGeneratedImage = Boolean(generatedContent?.imageDataUrl);
  const generatedSynonymEntries = Array.isArray(generatedContent?.relatedWordConnections)
    ? generatedContent.relatedWordConnections
        .map(entry => ({
          word: String(entry?.word || '').trim(),
          reason: String(entry?.reason || '').trim(),
        }))
        .filter(entry => entry.word)
        .slice(0, 3)
    : [];
  const generatedAntonymEntries = Array.isArray(generatedContent?.antonymConnections)
    ? generatedContent.antonymConnections
        .map(entry => ({
          word: String(entry?.word || '').trim(),
          reason: String(entry?.reason || '').trim(),
        }))
        .filter(entry => entry.word)
        .slice(0, 3)
    : [];
  const generatedHomographMeanings = Array.isArray(generatedContent?.homographMeanings)
    ? generatedContent.homographMeanings
        .map(meaning => String(meaning || '').trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];
  const generatedMorphemeEntries = Array.isArray(generatedContent?.morphemeSentences)
    ? generatedContent.morphemeSentences
        .map(entry => ({
          form: String(entry?.form || '').trim(),
          sentence: String(entry?.sentence || '').trim(),
        }))
        .filter(entry => entry.form && entry.sentence)
        .slice(0, 3)
    : [];
  const hasGeneratedLanguageExamples =
    generatedSynonymEntries.length > 0 ||
    generatedAntonymEntries.length > 0 ||
    generatedHomographMeanings.length > 0 ||
    generatedMorphemeEntries.length > 0;
  const selectedLetter =
    soundTableSelection ||
    (wordDetail.selectionType === 'letter' ? wordDetail.selectionSlug : '');
  const categoryHref = buildAllWordsCategoryHref(acId, wordDetail.category);
  const firstLetter = String(wordDetail.initialLetter || wordDetail.word.charAt(0) || '')
    .trim()
    .charAt(0)
    .toUpperCase();
  const firstLetterHref = firstLetter ? buildLetterHref(acId, firstLetter) : '';
  const primaryPhonemeRelation =
    wordDetail.primaryRelationPhoneme || getPrimaryPhonemeRelationData(wordDetail);
  const primaryPhonemeHref = primaryPhonemeRelation
    ? buildPhonemeHref(
        acId,
        primaryPhonemeRelation.phonemeSlug,
        selectedLetter || firstLetter
      )
    : '';
  const categoryRelationLeadWord =
    wordDetail.categoryRelatedWordExample?.word || 'Another word';
  const firstLetterRelationLeadWord =
    wordDetail.firstLetterRelatedWordExample?.word || 'Another word';
  const phonemeRelationLeadWord =
    wordDetail.primaryPhonemeRelatedWordExample?.word || 'Another word';
  const hasCategoryRelationSentence = Boolean(wordDetail.categoryRelatedWordExample?.word);
  const hasFirstLetterRelationSentence = Boolean(
    wordDetail.firstLetterRelatedWordExample?.word
  );
  const hasPhonemeRelationSentence = Boolean(
    wordDetail.primaryPhonemeRelatedWordExample?.word && primaryPhonemeRelation?.label
  );
  const orthographicTargetHref =
    wordDetail.selectionType === 'phoneme'
      ? buildPhonemeHref(acId, wordDetail.selectionSlug, selectedLetter)
      : buildLetterHref(acId, getSelectedLetterValue(wordDetail));
  const selectedLetterSoundLink = getSelectedLetterSoundLinkData(wordDetail);
  const fallbackLetterSoundPhrase = getFallbackLetterSoundPhrase(wordDetail);

  const paneProgress = panes.map(pane => {
    const checkedCount = pane.items.filter(item => checkedItems[item.id]).length;
    return {
      ...pane,
      checkedCount,
      itemCount: pane.items.length,
      isComplete: pane.required
        ? checkedCount >= REQUIRED_CHECKS_PER_PANE
        : checkedCount > 0,
    };
  });
  const requiredPaneProgress = paneProgress.filter(pane => pane.required);
  const requiredChecksComplete = requiredPaneProgress.reduce(
    (sum, pane) => sum + Math.min(pane.checkedCount, REQUIRED_CHECKS_PER_PANE),
    0
  );
  const requiredCheckTotal = requiredPaneProgress.length * REQUIRED_CHECKS_PER_PANE;
  const readyToComplete = requiredPaneProgress.every(pane => pane.isComplete);
  const incompletePaneNames = requiredPaneProgress
    .filter(pane => !pane.isComplete)
    .map(pane => pane.title);
  const checkedItemIds = getCheckedItemIdsFromState(checkedItems);
  const checklistStatus = isWordComplete
    ? 'complete'
    : isChecklistOpen
      ? 'started'
      : 'not-started';
  const hasActiveCurrentWord = Boolean(hasCurrentWord || isCurrentWord);
  const currentWordHref =
    checklistStatus === 'started'
      ? `/word-garden/${acId}/current`
      : `/word-garden/${acId}/current?exclude=${encodeURIComponent(wordDetail.word)}`;
  const currentWordLinkClass = hasActiveCurrentWord
    ? 'rounded-full border border-yellow/30 bg-yellow/10 px-4 py-2 text-sm font-semibold text-yellow no-underline transition hover:border-yellow/50 hover:text-orange'
    : 'rounded-full border border-accent/30 bg-white/5 px-4 py-2 text-sm font-semibold text-accent no-underline transition hover:border-accent/50 hover:text-white';
  const completionLearningSummary = `You practiced how "${wordDetail.word}" sounds, what it means, how it looks, and how to infer deeper meaning from context and related words.`;
  const completionNextSteps =
    'Next, you will return to the sound table to choose another letter, sound, or word to explore.';

  useEffect(() => {
    setCollapsedRequiredPanes(previousState => {
      const nextState = { ...previousState };
      let changed = false;

      requiredPaneProgress.forEach(pane => {
        const wasComplete = Boolean(previousRequiredPaneCompletionRef.current[pane.id]);

        if (!(pane.id in nextState)) {
          nextState[pane.id] = pane.isComplete;
          changed = true;
        } else if (pane.isComplete && !wasComplete) {
          nextState[pane.id] = true;
          changed = true;
        } else if (!pane.isComplete && wasComplete) {
          nextState[pane.id] = false;
          changed = true;
        }
      });

      previousRequiredPaneCompletionRef.current = Object.fromEntries(
        requiredPaneProgress.map(pane => [pane.id, pane.isComplete])
      );

      return changed ? nextState : previousState;
    });
  }, [requiredPaneProgress]);

  const queueChecklistProgressSave = useCallback(
    (
      nextCheckedState,
      {
        openChecklist = false,
        setAsCurrent = true,
        errorMessage = 'Unable to save checklist progress right now.',
      } = {}
    ) => {
      const nextCheckedItemIds = getCheckedItemIdsFromState(nextCheckedState);
      const nextChecklistOpen = Boolean(openChecklist || nextCheckedItemIds.length > 0);

      checklistSaveQueueRef.current = checklistSaveQueueRef.current
        .catch(() => null)
        .then(async () => {
          const response = await fetch(`/api/word-garden/children/${acId}/practice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              word: wordDetail.word,
              practiceIncrement: 0,
              checklistIncrement: 0,
              checklistCheckedItemIds: nextCheckedItemIds,
              openChecklist: nextChecklistOpen,
              selectionType: wordDetail.selectionType,
              selectionSlug: wordDetail.selectionSlug,
              selectionLetter:
                wordDetail.selectionType === 'phoneme' ? selectedLetter : '',
              setCurrentWord: setAsCurrent && nextChecklistOpen,
            }),
          });

          if (!response.ok) {
            throw new Error(errorMessage);
          }

          setIsChecklistOpen(nextChecklistOpen);
          setIsCurrentWord(nextChecklistOpen && setAsCurrent);
          router.refresh();
        })
        .catch(error => {
          console.error('Error saving checklist progress:', error);
          setCompletionError(error.message || errorMessage);
        });

      return checklistSaveQueueRef.current;
    },
    [
      acId,
      router,
      selectedLetter,
      wordDetail.selectionSlug,
      wordDetail.selectionType,
      wordDetail.word,
    ]
  );

  const downloadWorksheet = useCallback(() => {
    if (hasGeneratedImage && !isPrintableImageReady) {
      setGenerationSuccess('Finishing the worksheet image before printing...');
      return;
    }

    const previousTitle = document.title;
    const previousScrollX = window.scrollX;
    const previousScrollY = window.scrollY;
    let hasRestored = false;
    const restoreTitleAndScroll = () => {
      if (hasRestored) {
        return;
      }

      hasRestored = true;
      document.title = previousTitle;
      window.removeEventListener('afterprint', handleAfterPrint);
      window.scrollTo(previousScrollX, previousScrollY);
    };
    const handleAfterPrint = () => {
      window.setTimeout(restoreTitleAndScroll, 0);
    };

    document.title = wordDetail.word;
    window.addEventListener('afterprint', handleAfterPrint);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.print();
        });
      });
    }, 40);

    window.setTimeout(restoreTitleAndScroll, 15000);
  }, [hasGeneratedImage, isPrintableImageReady, wordDetail.word]);

  useEffect(() => {
    if (!generatedContent?.imageDataUrl) {
      setIsPrintableImageReady(true);
      return undefined;
    }

    setIsPrintableImageReady(false);

    const image = new Image();
    image.onload = () => setIsPrintableImageReady(true);
    image.onerror = () => setIsPrintableImageReady(true);
    image.src = generatedContent.imageDataUrl;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [generatedContent?.imageDataUrl]);

  useEffect(() => {
    if (!isCompletionSummaryOpen) {
      return undefined;
    }

    const redirectTimer = window.setTimeout(() => {
      router.replace(`/word-garden/${acId}`);
    }, 2600);

    return () => window.clearTimeout(redirectTimer);
  }, [acId, isCompletionSummaryOpen, router]);

  useEffect(() => {
    if (
      !autoCheckFromQr ||
      hasAppliedQrAutoCheck ||
      isWordComplete ||
      checkedItemIds.length > 0
    ) {
      return;
    }

    const fullyCheckedState = buildFullyCheckedState(panes);

    setCheckedItems(fullyCheckedState);
    setIsChecklistOpen(true);
    setIsCurrentWord(true);
    void queueChecklistProgressSave(fullyCheckedState, {
      openChecklist: true,
      setAsCurrent: true,
    });
    setCompletionSuccess(
      'Checklist pre-filled from the worksheet QR code. Press Complete Checklist when you are ready.'
    );
    setHasAppliedQrAutoCheck(true);
  }, [
    autoCheckFromQr,
    checkedItemIds.length,
    hasAppliedQrAutoCheck,
    isWordComplete,
    panes,
    queueChecklistProgressSave,
  ]);

  useEffect(() => {
    if (!generatedContent || hasTriggeredGeneratedPrint || !isPrintableImageReady) {
      return undefined;
    }

    setHasTriggeredGeneratedPrint(true);
    setGenerationSuccess('Worksheet generated, ready to print');

    const printTimer = window.setTimeout(() => {
      downloadWorksheet();
    }, 250);

    return () => window.clearTimeout(printTimer);
  }, [
    downloadWorksheet,
    generatedContent,
    hasTriggeredGeneratedPrint,
    isPrintableImageReady,
  ]);

  function toggleItem(itemId) {
    const nextCheckedItems = {
      ...checkedItems,
      [itemId]: !checkedItems[itemId],
    };
    const nextCheckedItemIds = getCheckedItemIdsFromState(nextCheckedItems);
    const shouldKeepChecklistOpen = isChecklistOpen || nextCheckedItemIds.length > 0;
    const shouldSetCurrentWord =
      isCurrentWord ||
      (!isChecklistOpen && openChecklistCount === 0 && !hasCurrentWord);

    setCheckedItems(nextCheckedItems);
    setIsChecklistOpen(shouldKeepChecklistOpen);
    setIsCurrentWord(shouldKeepChecklistOpen && shouldSetCurrentWord);
    void queueChecklistProgressSave(nextCheckedItems, {
      openChecklist: shouldKeepChecklistOpen,
      setAsCurrent: shouldSetCurrentWord,
    });
    setCompletionError('');
    setCompletionSuccess('');
  }

  async function handleStartChecklist() {
    if (isChecklistOpen || isWordComplete) {
      return;
    }

    const shouldSetCurrentWord = openChecklistCount === 0;

    setIsStartingChecklist(true);
    setCompletionError('');
    setCompletionSuccess('');

    try {
      const response = await fetch(`/api/word-garden/children/${acId}/practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: wordDetail.word,
          practiceIncrement: 0,
          checklistIncrement: 0,
          checklistCheckedItemIds: [],
          openChecklist: true,
          selectionType: wordDetail.selectionType,
          selectionSlug: wordDetail.selectionSlug,
          selectionLetter:
            wordDetail.selectionType === 'phoneme' ? selectedLetter : '',
          setCurrentWord: shouldSetCurrentWord,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to start this checklist right now.');
      }

      setIsChecklistOpen(true);
      setIsCurrentWord(shouldSetCurrentWord);
      setCompletionSuccess('Checklist started. Check items as you work.');
      router.refresh();
    } catch (error) {
      console.error('Error starting checklist:', error);
      setCompletionError('Unable to start this checklist right now.');
    } finally {
      setIsStartingChecklist(false);
    }
  }

  async function handleSetCurrentWord() {
    if (checklistStatus !== 'started' || isCurrentWord) {
      return;
    }

    setIsSettingCurrentWord(true);
    setCompletionError('');
    setCompletionSuccess('');

    try {
      const response = await fetch(`/api/word-garden/children/${acId}/practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: wordDetail.word,
          practiceIncrement: 0,
          checklistIncrement: 0,
          checklistCheckedItemIds: checkedItemIds,
          openChecklist: true,
          selectionType: wordDetail.selectionType,
          selectionSlug: wordDetail.selectionSlug,
          selectionLetter:
            wordDetail.selectionType === 'phoneme' ? selectedLetter : '',
          setCurrentWord: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to set the current word right now.');
      }

      setIsCurrentWord(true);
      setCompletionSuccess('This word is now set as the current word.');
      router.refresh();
    } catch (error) {
      console.error('Error setting current word:', error);
      setCompletionError('Unable to set the current word right now.');
    } finally {
      setIsSettingCurrentWord(false);
    }
  }

  async function handleResetStartedChecklist() {
    setIsResetStartedChecklist(true);
    setCompletionError('');
    setCompletionSuccess('');

    try {
      const response = await fetch(`/api/word-garden/children/${acId}/practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: wordDetail.word,
          practiceIncrement: 0,
          checklistIncrement: 0,
          checklistCheckedItemIds: [],
          openChecklist: false,
          selectionType: wordDetail.selectionType,
          selectionSlug: wordDetail.selectionSlug,
          selectionLetter:
            wordDetail.selectionType === 'phoneme' ? selectedLetter : '',
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to reset this checklist right now.');
      }

      setCheckedItems(buildInitialCheckedState(panes));
      setIsChecklistOpen(false);
      setIsCurrentWord(false);
      setIsResetStartedModalOpen(false);
      setCompletionSuccess('Checklist reset to not started.');
      router.refresh();
    } catch (error) {
      console.error('Error resetting started checklist:', error);
      setCompletionError('Unable to reset this checklist right now.');
    } finally {
      setIsResetStartedChecklist(false);
    }
  }

  async function handleGenerate(event) {
    event.preventDefault();
    setGenerationError('');
    setGenerationSuccess('');

    if (isGenerationDisabled) {
      setGenerationError(
        `Worksheet generation is disabled for "${wordDetail.word}".`
      );
      return;
    }

    if (generatedContent) {
      return;
    }

    if (!apiKey.trim()) {
      setGenerationError(
        'Add an OpenAI API key before generating worksheet content. You do not need a key to print the worksheet.'
      );
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/word-garden/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          word: wordDetail.word,
          category: wordDetail.category,
          focusLabel: wordDetail.focusLabel,
          definition: wordDetail.definition,
          morphologyExamples: wordDetail.morphologyExamples,
          relatedWords: wordDetail.relatedWords,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to generate worksheet content right now.');
      }

      setGeneratedContent({
        childFriendlyDefinition: data.childFriendlyDefinition || '',
        morphemeSentences: data.morphemeSentences || [],
        relatedWordConnections: data.relatedWordConnections || [],
        antonymConnections: data.antonymConnections || [],
        homographMeanings: data.homographMeanings || [],
        imageDataUrl: data.imageDataUrl || '',
      });
    } catch (error) {
      console.error('Error generating worksheet content:', error);
      setGenerationError(error.message || 'Unable to generate worksheet content right now.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCompleteOnline() {
    if (!readyToComplete) {
      setCompletionError(
        `Finish any ${REQUIRED_CHECKS_PER_PANE} items in each required pane before marking this word complete. Still missing: ${incompletePaneNames.join(
          ', '
        )}.`
      );
      return;
    }

    setIsSubmitting(true);
    setCompletionError('');
    setCompletionSuccess('');

    try {
      const response = await fetch(`/api/word-garden/children/${acId}/practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: wordDetail.word,
          practiceIncrement: 0,
          checklistIncrement: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to save worksheet completion.');
      }

      setIsWordComplete(true);
      setCheckedItems(buildInitialCheckedState(panes));
      setIsChecklistOpen(false);
      setIsCurrentWord(false);
      setCompletionSuccess('Checklist marked complete online.');
      router.refresh();
      setIsCompletionSummaryOpen(true);
    } catch (error) {
      console.error('Error completing worksheet online:', error);
      setCompletionError('Unable to save worksheet completion right now.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleContinueWorking() {
    setIsResettingChecklist(true);
    setCompletionError('');
    setCompletionSuccess('');

    try {
      const response = await fetch(`/api/word-garden/children/${acId}/practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: wordDetail.word,
          practiceIncrement: 0,
          checklistIncrement: 0,
          resetChecklist: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to reopen this word right now.');
      }

      setIsWordComplete(false);
      setCheckedItems(buildInitialCheckedState(panes));
      setIsChecklistOpen(false);
      setIsCurrentWord(false);
      setCompletionSuccess(
        'This word is ready for more work. Finish the checklist again when you are ready.'
      );
      router.refresh();
      setIsContinueModalOpen(false);
    } catch (error) {
      console.error('Error reopening completed word:', error);
      setCompletionError('Unable to reopen this word right now.');
    } finally {
      setIsResettingChecklist(false);
    }
  }

  function renderDefinitionText() {
    if (generatedContent?.childFriendlyDefinition) {
      return <p className='leading-7 text-accent'>{generatedContent.childFriendlyDefinition}</p>;
    }

    return (
      <p className='leading-7 text-accent'>
        {wordDetail.definitionTokens.map((token, index) =>
          token.isLinkable ? (
            <a
              key={`${token.text}-${index}`}
              href={token.dictionaryUrl}
              className='underline decoration-dotted underline-offset-4 decoration-accent/70 hover:text-yellow hover:decoration-yellow'
            >
              {token.text}
            </a>
          ) : (
            <span key={`${token.text}-${index}`}>{token.text}</span>
          )
        )}
      </p>
    );
  }

  function renderSoundTiles() {
    return (
      <div className='max-w-full overflow-x-auto pb-2'>
        <div className='flex min-w-max gap-3'>
          {wordDetail.soundMapRows.map((row, index) => {
            const rowPhonemeSlugs = getRowPhonemeSlugs(row);
            const isUnlocked = rowPhonemeSlugs.some(phonemeSlug =>
              isPhonemeSlugUnlocked(phonemeSlug, unlockedArpabetSet)
            );
            const hasSupportedPhoneme = rowPhonemeSlugs.length > 0;
            const linkedPhonemeSlug =
              wordDetail.selectionType === 'phoneme' &&
              rowPhonemeSlugs.includes(wordDetail.selectionSlug)
                ? wordDetail.selectionSlug
                : rowPhonemeSlugs[0] || '';
            const preservedLetter =
              hasSupportedPhoneme &&
              selectedLetter &&
              letterScopedPhonemeSlugSet.has(linkedPhonemeSlug)
                ? selectedLetter
                : '';
            const href = hasSupportedPhoneme
              ? buildPhonemeHref(acId, linkedPhonemeSlug, preservedLetter)
              : '';
            const content = (
              <>
                <span className='text-3xl font-semibold lowercase tracking-wide text-white'>
                  {row.grapheme}
                </span>
                <span
                  className={`mt-3 min-h-[1.25rem] text-sm font-medium ${
                    !hasSupportedPhoneme
                      ? 'text-accent'
                      : isUnlocked
                        ? 'text-yellow'
                        : 'text-slate-400'
                  }`}
                >
                  {row.phonemeLabel || ''}
                </span>
              </>
            );

            return hasSupportedPhoneme ? (
              <Link
                key={`${row.grapheme}-${index}`}
                href={href}
                className='flex min-w-[88px] flex-col items-center rounded-2xl border border-accent/20 bg-secondary/80 px-4 py-4 text-center no-underline transition hover:border-yellow/40 hover:bg-secondary'
              >
                {content}
              </Link>
            ) : (
              <div
                key={`${row.grapheme}-${index}`}
                className='flex min-w-[88px] flex-col items-center rounded-2xl border border-accent/20 bg-secondary/60 px-4 py-4 text-center'
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function isPronunciationTileHighlighted(row) {
    const focusLetter = getChecklistFocusLetterValue(wordDetail, selectedLetter);
    const rowPhonemeSlugs = getRowPhonemeSlugs(row);
    const highlightsLetter = Boolean(
      focusLetter &&
        String(row.grapheme || '')
          .toUpperCase()
          .includes(focusLetter)
    );
    const highlightsUnlockedPhoneme = rowPhonemeSlugs.some(phonemeSlug =>
      isPhonemeSlugUnlocked(phonemeSlug, unlockedArpabetSet)
    );

    return highlightsLetter || highlightsUnlockedPhoneme;
  }

  function renderPrintPronunciationTiles(extraClassName = '') {
    return (
      <div className={extraClassName}>
        <div className='worksheet-pronunciation-grid'>
          {wordDetail.soundMapRows.map((row, index) => {
            const isHighlighted = isPronunciationTileHighlighted(row);

            return (
              <div
                key={`${row.grapheme}-${index}-print`}
                className={`worksheet-pronunciation-tile ${
                  isHighlighted ? 'worksheet-pronunciation-tile-highlighted' : ''
                }`}
              >
                <span className='worksheet-pronunciation-grapheme'>{row.grapheme}</span>
                <span className='worksheet-pronunciation-phoneme'>{row.phonemeLabel || 'listen'}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderStrategy(paneId) {
    if (paneId === 'phonological') {
      return (
        <div className='min-w-0 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]'>
          <section className='min-w-0 rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Synthetic Approach</p>
            <p className='mt-3 text-sm text-accent'>
              Start with the phonemes/letters and build up to word.
            </p>
            <p className='mt-3 text-3xl font-semibold text-white'>{wordDetail.word}</p>
            <p className='mt-2 text-sm text-accent'>
              Have the child pronounce yellow phonemes. Click for other examples
              of this phoneme.
            </p>
            <div className='mt-5 min-w-0'>{renderSoundTiles()}</div>
          </section>
          <section className='rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Sound Support</p>
            <p className='mt-3 text-accent'>{getPhonologicalPrompt(wordDetail)}</p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <span className='rounded-full border border-accent/20 px-3 py-2 text-sm text-accent'>
                {wordDetail.syllableCount} syllable{wordDetail.syllableCount === 1 ? '' : 's'}
              </span>
              <span className='rounded-full border border-accent/20 px-3 py-2 text-sm text-accent'>
                Onset: {wordDetail.onsetAndRime.onset || '-'}
              </span>
              <span className='rounded-full border border-accent/20 px-3 py-2 text-sm text-accent'>
                Rime: {wordDetail.onsetAndRime.rime || '-'}
              </span>
            </div>
          </section>
        </div>
      );
    }

    if (paneId === 'meaning') {
      return (
        <div className='grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)]'>
          <section className='rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Clickable Definition</p>
            <div className='mt-3'>{renderDefinitionText()}</div>
          </section>
          <section className='rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Sentence Support</p>
            <p className='mt-3 text-accent'>
              Try a sentence frame like: "{wordDetail.word} means..." or "I can use{' '}
              {wordDetail.word} when..."
            </p>
            <p className='mt-4 text-sm text-accent/90'>
              After you model a sentence, ask the child to explain the word in their
              own words.
            </p>
          </section>
        </div>
      );
    }

    if (paneId === 'orthographic') {
      return (
        <div className='min-w-0 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)]'>
          <section className='min-w-0 rounded-2xl bg-primary/40 p-5'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Analytic Approach</p>
            <p className='mt-3 text-sm text-accent'>
              Start with whole word and break down into phonemes/letters.
            </p>
            <div className='mt-4 max-w-full overflow-x-auto pb-2'>
              <div className='min-w-[20rem] rounded-3xl border border-accent/20 bg-secondary/80 p-5'>
                <p className='whitespace-nowrap text-4xl font-semibold tracking-[0.18em] text-white md:text-5xl'>
                  {renderHighlightedOrthographicWord(wordDetail)}
                </p>
              </div>
            </div>
            <p className='mt-4 text-accent'>{renderOrthographicExplanation()}</p>
          </section>
          <section className='rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>
              {wordDetail.selectionType === 'phoneme' ? 'Target Letters' : 'Letter Match'}
            </p>
            <div className='mt-4 grid gap-3 sm:grid-cols-2'>
              {[
                {
                  label: 'Uppercase',
                  value: wordDetail.uppercaseLetter,
                  valueClass: 'mt-3 text-5xl font-semibold text-white',
                },
                {
                  label: 'Lowercase',
                  value: wordDetail.lowercaseLetter,
                  valueClass: 'mt-3 text-5xl font-semibold lowercase text-white',
                },
              ].map(card =>
                orthographicTargetHref ? (
                  <Link
                    key={card.label}
                    href={orthographicTargetHref}
                    className='rounded-2xl border border-accent/20 bg-secondary/80 p-4 text-center no-underline transition hover:border-yellow/40 hover:bg-secondary'
                  >
                    <p className='text-xs uppercase tracking-[0.25em] text-accent'>{card.label}</p>
                    <p className={card.valueClass}>{card.value}</p>
                  </Link>
                ) : (
                  <div
                    key={card.label}
                    className='rounded-2xl border border-accent/20 bg-secondary/80 p-4 text-center'
                  >
                    <p className='text-xs uppercase tracking-[0.25em] text-accent'>{card.label}</p>
                    <p className={card.valueClass}>{card.value}</p>
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      );
    }

    if (paneId === 'context') {
      return (
        <div className='grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]'>
          <section className='rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Related Words</p>
            <p className='mt-3 text-sm text-accent'>
              Explore how this word connects to other words by category, first
              letter, and sound.
            </p>
            <div className='mt-3 space-y-3'>
              <div className='rounded-2xl bg-secondary/80 p-4 text-sm text-accent'>
                The word &apos;<span className='text-yellow'>{categoryRelationLeadWord}</span>
                &apos; is related to the word &apos;{wordDetail.word}&apos; by the category{' '}
                <Link
                  href={categoryHref}
                  className='text-yellow underline decoration-dotted underline-offset-4 hover:text-orange'
                >
                  {wordDetail.category}
                </Link>
                .
              </div>
              <div className='rounded-2xl bg-secondary/80 p-4 text-sm text-accent'>
                The word &apos;<span className='text-yellow'>{firstLetterRelationLeadWord}</span>
                &apos; is related to the word &apos;{wordDetail.word}&apos; by the first letter{' '}
                {firstLetterHref ? (
                  <Link
                    href={firstLetterHref}
                    className='text-yellow underline decoration-dotted underline-offset-4 hover:text-orange'
                  >
                    {firstLetter}
                  </Link>
                ) : (
                  <span className='text-yellow'>{firstLetter || '-'}</span>
                )}
                .
              </div>
              <div className='rounded-2xl bg-secondary/80 p-4 text-sm text-accent'>
                The word &apos;<span className='text-yellow'>{phonemeRelationLeadWord}</span>
                &apos; is related to the word &apos;{wordDetail.word}&apos; by the sound{' '}
                {primaryPhonemeRelation && primaryPhonemeHref ? (
                  <Link
                    href={primaryPhonemeHref}
                    className='text-yellow underline decoration-dotted underline-offset-4 hover:text-orange'
                  >
                    {primaryPhonemeRelation.label}
                  </Link>
                ) : (
                  <span className='text-yellow'>
                    {primaryPhonemeRelation?.label || 'sound'}
                  </span>
                )}
                .
              </div>
            </div>
          </section>
          <section className='rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>
              Synonyms, Antonyms, Homonyms, Morphemes
            </p>
            <div className='mt-3 space-y-3'>
              <div className='rounded-2xl bg-secondary/80 p-4'>
                <p className='font-semibold text-yellow'>Synonyms</p>
                <p className='mt-2 text-sm text-accent'>
                  Synonyms are words with similar meanings.
                </p>
              </div>
              <div className='rounded-2xl bg-secondary/80 p-4'>
                <p className='font-semibold text-yellow'>Antonyms</p>
                <p className='mt-2 text-sm text-accent'>
                  Antonyms are words with opposite meanings.
                </p>
              </div>
              <div className='rounded-2xl bg-secondary/80 p-4'>
                <p className='font-semibold text-yellow'>Homonyms</p>
                <p className='mt-2 text-sm text-accent'>
                  Homonyms can sound the same or look the same but mean different things.
                </p>
              </div>
              <div className='rounded-2xl bg-secondary/80 p-4'>
                <p className='font-semibold text-yellow'>Morphemes</p>
                <p className='mt-2 text-sm text-accent'>
                  Morphemes are small decorations to words that make them more precise.
                </p>
              </div>
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className='min-w-0 space-y-4'>
        <section className='min-w-0 rounded-2xl bg-primary/40 p-4'>
          <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Sound Map</p>
          <div className='mt-4 min-w-0'>{renderSoundTiles()}</div>
        </section>
        <section className='min-w-0 rounded-2xl bg-primary/40 p-4'>
          <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Onset / Rime</p>
          <div className='mt-4 max-w-full overflow-x-auto pb-2'>
            <div className='flex min-w-max gap-3'>
              <div className='min-w-[180px] rounded-2xl border border-accent/20 bg-secondary/80 p-4'>
                <p className='text-xs uppercase tracking-[0.25em] text-accent'>Onset</p>
                <p className='mt-3 text-3xl font-semibold text-white'>{wordDetail.onsetAndRime.onset || '-'}</p>
              </div>
              <div className='min-w-[180px] rounded-2xl border border-accent/20 bg-secondary/80 p-4'>
                <p className='text-xs uppercase tracking-[0.25em] text-accent'>Rime</p>
                <p className='mt-3 text-3xl font-semibold text-white'>{wordDetail.onsetAndRime.rime || '-'}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  function getPaneStatusMeta(pane) {
    const status = pane.required
      ? pane.isComplete
        ? 'Complete'
        : `${Math.min(pane.checkedCount, REQUIRED_CHECKS_PER_PANE)}/${REQUIRED_CHECKS_PER_PANE} needed`
      : `${pane.checkedCount}/${pane.itemCount} checked`;

    const statusClass = pane.required
      ? pane.isComplete
        ? 'border-green-400/30 bg-green-500/10 text-green-200'
        : pane.checkedCount > 0
          ? 'border-yellow/30 bg-yellow/10 text-yellow'
          : 'border-accent/20 bg-primary/40 text-accent'
      : pane.checkedCount > 0
        ? 'border-sky-400/30 bg-sky-500/10 text-sky-200'
        : 'border-accent/20 bg-primary/40 text-accent';

    return { status, statusClass };
  }

  function renderOrthographicExplanation() {
    if (wordDetail.selectionType === 'phoneme') {
      return (
        <>
          {wordDetail.word} includes {getOrthographicFocusLabel(wordDetail)}{' '}
          {getOrthographicFocusDisplay(wordDetail)}, which can make{' '}
          <Link
            href={buildPhonemeHref(acId, wordDetail.selectionSlug, selectedLetter)}
            className='text-yellow underline decoration-dotted underline-offset-4 hover:text-orange'
          >
            {getAnalyticTargetSound(wordDetail)}
          </Link>{' '}
          sound.
        </>
      );
    }

    const leadText = wordDetail.isEmbeddedLetterSelection
      ? `${wordDetail.word} has the letter ${getSelectedLetterValue(wordDetail)} inside it, `
      : `${wordDetail.word} starts with letter ${wordDetail.uppercaseLetter}, `;

    if (selectedLetterSoundLink) {
      return (
        <>
          {leadText}
          which can make{' '}
          <Link
            href={buildPhonemeHref(acId, selectedLetterSoundLink.phonemeSlug, selectedLetter)}
            className='text-yellow underline decoration-dotted underline-offset-4 hover:text-orange'
          >
            {selectedLetterSoundLink.text}
          </Link>{' '}
          sound.
        </>
      );
    }

    return (
      <>
        {leadText}and{' '}
        <Link
          href={buildLetterHref(acId, getSelectedLetterValue(wordDetail))}
          className='text-yellow underline decoration-dotted underline-offset-4 hover:text-orange'
        >
          {getSelectedLetterValue(wordDetail)}
        </Link>{' '}
        can make {fallbackLetterSoundPhrase}.
      </>
    );
  }

  function renderChecklistSection(pane, showDivider = false) {
    const { status, statusClass } = getPaneStatusMeta(pane);
    const content = (
      <>
        {pane.description ? <p className='mt-2 text-sm text-accent'>{pane.description}</p> : null}
        <ol className='mt-5 space-y-3'>
          {pane.items.map(item => (
            <li key={item.id}>
              <label
                className={`flex w-full items-start gap-3 rounded-2xl bg-secondary/70 px-4 py-3 text-accent ${
                  isWordComplete ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                }`}
              >
                <input
                  type='checkbox'
                  checked={checkedItems[item.id] || false}
                  onChange={() => toggleItem(item.id)}
                  disabled={isWordComplete}
                  className='mt-1 h-4 w-4'
                />
                <span>{item.label}</span>
              </label>
            </li>
          ))}
        </ol>
        <details className='mt-5 min-w-0 rounded-2xl border border-accent/20 bg-secondary/30 p-4'>
          <summary className='cursor-pointer text-sm font-semibold text-yellow'>
            {pane.strategyTitle}
          </summary>
          <div className='mt-4 min-w-0'>{renderStrategy(pane.id)}</div>
        </details>
      </>
    );

    if (!pane.required) {
      return (
        <section
          key={pane.id}
          className={`min-w-0 ${showDivider ? 'border-t border-accent/15 pt-6' : ''}`}
        >
          <details className='rounded-2xl border border-accent/20 bg-secondary/20 p-4'>
            <summary className='cursor-pointer list-none'>
              <div className='flex flex-wrap items-center gap-3'>
                <h3 className='text-xl text-yellow'>{pane.title}</h3>
                <span
                  className={`rounded-full border px-3 py-2 text-sm font-semibold ${statusClass}`}
                >
                  {status}
                </span>
              </div>
            </summary>
            <div className='mt-4'>{content}</div>
          </details>
        </section>
      );
    }

    return (
      <section
        key={pane.id}
        className={`min-w-0 ${showDivider ? 'border-t border-accent/15 pt-6' : ''}`}
      >
        <details
          open={!collapsedRequiredPanes[pane.id]}
          className='rounded-2xl border border-accent/20 bg-secondary/20 p-4'
        >
          <summary
            onClick={event => {
              event.preventDefault();
              setCollapsedRequiredPanes(previousState => ({
                ...previousState,
                [pane.id]: !previousState[pane.id],
              }));
            }}
            className='cursor-pointer list-none'
          >
            <div className='flex flex-wrap items-center gap-3'>
              <h3 className='text-xl text-yellow'>{pane.title}</h3>
              <span className={`rounded-full border px-3 py-2 text-sm font-semibold ${statusClass}`}>
                {status}
              </span>
            </div>
          </summary>
          <div className='mt-4'>{content}</div>
        </details>
      </section>
    );
  }

  function renderCombinedChecklistPane() {
    const optionalPane = paneProgress.find(pane => !pane.required);

    return (
      <article className='min-w-0 rounded-3xl border border-accent/20 bg-primary/50 p-6 shadow-lg'>
        <div className='flex flex-wrap items-start gap-4'>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-3'>
              <h2 className='text-2xl text-yellow'>Checklist</h2>
              <span className='rounded-full border border-accent/20 bg-primary/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-accent'>
                4 Required
              </span>
              <span className='rounded-full border border-accent/20 bg-primary/40 px-3 py-2 text-sm font-semibold text-accent'>
                {requiredChecksComplete}/{requiredCheckTotal}
              </span>
            </div>
          </div>
        </div>

        <details className='mt-5 min-w-0 rounded-2xl border border-accent/20 bg-secondary/30 p-4'>
          <summary className='cursor-pointer text-sm font-semibold text-yellow'>
            Instructions
          </summary>
          <div className='mt-4 space-y-3 text-sm text-accent'>
            <p>
              Complete any {REQUIRED_CHECKS_PER_PANE} items in each required
              processor section.
            </p>
            <div className='space-y-3 rounded-2xl border border-accent/15 bg-primary/30 p-4'>
              {requiredPaneProgress.map(pane => (
                <div key={`${pane.id}-instruction`}>
                  <p className='font-semibold text-yellow'>{pane.title}</p>
                  <p className='mt-1'>{pane.description}</p>
                </div>
              ))}
            </div>
            <p>
              Open the strategy drawer inside each section when you want
              examples and support.
            </p>
            <p>
              Use the optional section when you have extra time and want more
              practice with the same word.
            </p>
            <p className='text-xs leading-6 text-accent/90'>
              Figure 1. The Four Processors Model. Adams, M. J. (2013).
              Modeling the connections between word recognition and reading. In
              D. E. Alvermann, N. J. Unrau, & R. B. Ruddell (Eds.),
              <em> Theoretical models and processes of reading </em>
              (6th ed., pp. 783-806). International Reading Association.
            </p>
          </div>
        </details>

        <div className='mt-6 space-y-6'>
          {requiredPaneProgress.map((pane, index) =>
            renderChecklistSection(pane, index > 0)
          )}
          {optionalPane ? renderChecklistSection(optionalPane, true) : null}
        </div>
      </article>
    );
  }

  function renderGeneratorPane() {
    return (
      <div className='rounded-3xl bg-white p-6 text-slate-900 shadow-xl'>
        <button
          type='button'
          onClick={() => setIsGeneratorOpen(current => !current)}
          className='flex w-full items-center justify-between gap-4 text-left'
          aria-expanded={isGeneratorOpen}
        >
          <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>Generate Worksheet</p>
          <div className='flex items-center gap-3'>
            <span className={`rounded-full px-3 py-1 text-sm font-bold ${getStateBadgeClass(state)}`}>
              {getStateLabel(state)}
            </span>
            <span className='text-xl leading-none text-slate-500'>{isGeneratorOpen ? '-' : '+'}</span>
          </div>
        </button>

        {isGeneratorOpen ? (
          <div className='mt-4 space-y-4'>
            <div className='space-y-3 text-sm text-slate-600'>
              <p>
                You do not need to generate content to print the worksheet, but
                generation will usually make the worksheet better by adding a
                child-friendly definition, stronger morphology support,
                related-word suggestions, and a coloring-page image.
              </p>
              {isGenerationDisabled ? (
                <p className='rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900'>
                  Worksheet generation is disabled for "{wordDetail.word}".
                  You can still download and print the worksheet without generation.
                </p>
              ) : null}
              <p>
                Each generation usually takes about a minute and costs about a
                nickel.
              </p>
              <p>
                To do generation, visit the{' '}
                <a
                  href='https://platform.openai.com/settings/organization/billing/overview'
                  className='text-primary underline decoration-dotted underline-offset-4'
                >
                  Billing page
                </a>
                , turn auto recharge off, and add a small credit to your
                account, such as $5.
              </p>
              <p>
                Then create an API key on the{' '}
                <a
                  href='https://platform.openai.com/settings/organization/api-keys'
                  className='text-primary underline decoration-dotted underline-offset-4'
                >
                  API keys page
                </a>
                . Copy the secret key value and store it securely.
              </p>
              <p>
                When you want to generate a worksheet, paste that key into the
                box below.
              </p>
              <p>
                After generation finishes, the print dialog will open
                automatically so you can download or print the worksheet.
              </p>
              <p>
                Example output:{' '}
                <a
                  href='/investigate.pdf'
                  className='text-primary underline decoration-dotted underline-offset-4'
                  target='_blank'
                  rel='noreferrer'
                >
                  investigate.pdf
                </a>
              </p>
            </div>
            <form onSubmit={handleGenerate} className='space-y-4'>
              <input
                type='text'
                name='username'
                value='OpenAI Word Garden'
                readOnly
                autoComplete='username'
                className='sr-only'
                tabIndex={-1}
              />
              {!isGenerationDisabled ? (
                <label className='block'>
                  <span className='mb-2 block text-sm font-medium text-slate-700'>OpenAI API key</span>
                  <input
                    type='password'
                    name='current-password'
                    value={apiKey}
                    onChange={event => setApiKey(event.target.value)}
                    autoComplete='current-password'
                    placeholder='sk-...'
                    className='w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900'
                  />
                </label>
              ) : null}
              <div className='flex flex-wrap gap-3'>
                <button
                  type='submit'
                  disabled={isGenerating || state === 'generated' || isGenerationDisabled}
                  className='rounded-full bg-primary px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {isGenerationDisabled
                    ? 'Generation Disabled'
                    : isGenerating
                      ? 'Generating...'
                      : state === 'generated'
                        ? 'Worksheet Generated'
                        : 'Generate Worksheet'}
                </button>
                <button
                  type='button'
                  onClick={downloadWorksheet}
                  className='rounded-full bg-slate-200 px-4 py-2 font-bold text-slate-900'
                >
                  Download Worksheet
                </button>
              </div>
            </form>
            {generationError ? <p className='text-sm text-red-700'>{generationError}</p> : null}
            {generationSuccess ? <p className='text-sm text-green-700'>{generationSuccess}</p> : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className='word-garden-print-root'>
      <div className='no-print mb-6 rounded-3xl border border-accent/20 bg-primary/40 p-5 shadow-lg'>
        <div className='flex flex-wrap items-center gap-3'>
          {isCurrentWord ? (
            <span className='rounded-full border border-accent/30 bg-white/5 px-4 py-2 text-sm font-semibold text-accent'>
              Current word
            </span>
          ) : (
            <Link
              href={currentWordHref}
              className={currentWordLinkClass}
            >
              Go to Current Word
            </Link>
          )}

          {recommendHref ? (
            <button
              type='button'
              onClick={() => router.push(recommendHref)}
              className='rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-200 transition hover:border-green-300/50 hover:text-white'
            >
              Recommend
            </button>
          ) : null}

          <Link
            href={`/word-garden/${acId}/checklists`}
            className='rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-200 no-underline transition hover:border-green-300/50 hover:text-white'
          >
            Checklists
          </Link>

          {checklistStatus === 'started' ? (
            <button
              type='button'
              onClick={() => setIsResetStartedModalOpen(true)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition hover:text-white ${getChecklistStatusClass(
                checklistStatus
              )}`}
            >
              {getChecklistStatusLabel(checklistStatus)}
            </button>
          ) : checklistStatus === 'not-started' ? (
            <button
              type='button'
              onClick={handleStartChecklist}
              disabled={isStartingChecklist}
              className='rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-200 transition hover:border-green-300/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isStartingChecklist ? 'Starting...' : getChecklistStatusLabel(checklistStatus)}
            </button>
          ) : (
            <span
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${getChecklistStatusClass(
                checklistStatus
              )}`}
            >
              {getChecklistStatusLabel(checklistStatus)}
            </span>
          )}

          <button
            type='button'
            onClick={handleSetCurrentWord}
            disabled={checklistStatus !== 'started' || isCurrentWord || isSettingCurrentWord}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              checklistStatus === 'started' && !isCurrentWord
                ? 'border-green-400/30 bg-green-500/10 text-green-200 hover:border-green-300/50 hover:text-white'
                : 'border-accent/30 bg-white/5 text-accent hover:border-accent/50 hover:text-white'
            }`}
          >
            {isSettingCurrentWord ? 'Setting...' : 'Set Current Word'}
          </button>
        </div>
      </div>

      {isWordComplete ? (
        <div className='no-print mb-6 rounded-3xl border border-yellow/40 bg-primary/50 p-5 shadow-lg'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <p className='text-sm uppercase tracking-[0.3em] text-yellow'>Completed Word</p>
              <p className='mt-2 text-accent'>This word is currently marked complete.</p>
            </div>
            <button
              type='button'
              onClick={() => setIsContinueModalOpen(true)}
              className='rounded-full bg-yellow px-4 py-2 font-bold text-primary'
            >
              Continue Working On This Word
            </button>
          </div>
        </div>
      ) : null}

      <div className='word-garden-worksheet-layout grid gap-8 pb-12 md:pb-16 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]'>
        <div className='no-print min-w-0 space-y-6'>
          {renderGeneratorPane()}
          {renderCombinedChecklistPane()}
        </div>

        <aside className='no-print space-y-6 self-start xl:sticky xl:top-24'>
          <div className='rounded-3xl border border-accent/20 bg-primary/50 p-6 shadow-lg'>
            <p className='text-sm uppercase tracking-[0.3em] text-yellow'>Completion Rules</p>
            <h2 className='mt-3 text-2xl text-white'>Finish the 4 required processors</h2>
            <p className='mt-3 text-accent'>
              Complete any {REQUIRED_CHECKS_PER_PANE} items in each required
              processor section. The optional section does not count toward
              completion.
            </p>
            <div className='mt-5 rounded-2xl bg-secondary/70 p-4'>
              <div className='flex items-center justify-between gap-4'>
                <p className='text-sm text-accent'>Required checks completed</p>
                <p className='text-lg font-semibold text-yellow'>
                  {requiredChecksComplete} / {requiredCheckTotal}
                </p>
              </div>
              <div className='mt-3 h-3 overflow-hidden rounded-full bg-primary/60'>
                <div
                  className='h-full rounded-full bg-yellow transition-all'
                  style={{
                    width: `${Math.min(100, (requiredChecksComplete / requiredCheckTotal) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className='mt-5 space-y-3'>
              {requiredPaneProgress.map(pane => (
                <div key={pane.id} className='flex items-center justify-between gap-4 rounded-2xl bg-secondary/70 px-4 py-3'>
                  <span className='text-accent'>{pane.title}</span>
                  <span className='text-sm font-semibold text-yellow'>
                    {Math.min(pane.checkedCount, REQUIRED_CHECKS_PER_PANE)}/{REQUIRED_CHECKS_PER_PANE}
                  </span>
                </div>
              ))}
            </div>
            <div className='mt-6 flex flex-wrap gap-3'>
              <button
                type='button'
                onClick={handleCompleteOnline}
                disabled={isSubmitting || isWordComplete || isCompletionSummaryOpen}
                className='rounded-full bg-yellow px-4 py-2 font-bold text-primary disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isSubmitting
                  ? 'Saving...'
                  : isWordComplete
                    ? 'Marked Complete'
                    : 'Complete Checklist'}
              </button>
              <button
                type='button'
                onClick={downloadWorksheet}
                className='rounded-full bg-secondary px-4 py-2 font-bold text-yellow'
              >
                Download Worksheet
              </button>
            </div>
            {completionError ? <p className='mt-4 text-sm text-red-300'>{completionError}</p> : null}
            {completionSuccess ? <p className='mt-4 text-sm text-green-300'>{completionSuccess}</p> : null}
          </div>

        </aside>
      </div>

      {isCompletionSummaryOpen ? (
        <div className='no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4'>
          <div className='w-full max-w-xl rounded-3xl bg-white p-6 text-slate-900 shadow-2xl'>
            <p className='text-sm uppercase tracking-[0.3em] text-green-700'>
              Checklist Complete
            </p>
            <h3 className='mt-3 text-2xl font-bold text-slate-900'>
              {wordDetail.word} is complete
            </h3>
            <p className='mt-4 text-sm leading-6 text-slate-700'>
              {completionLearningSummary}
            </p>
            <p className='mt-4 text-sm leading-6 text-slate-700'>
              {completionNextSteps}
            </p>
            <div className='mt-6 flex flex-wrap items-center justify-between gap-3'>
              <p className='text-sm font-medium text-green-700'>
                Returning to the sound table...
              </p>
              <button
                type='button'
                onClick={() => router.replace(`/word-garden/${acId}`)}
                className='rounded-full bg-primary px-4 py-2 font-bold text-white'
              >
                Go Now
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isContinueModalOpen ? (
        <div className='no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4'>
          <div className='w-full max-w-lg rounded-3xl bg-white p-6 text-slate-900 shadow-2xl'>
            <p className='text-sm uppercase tracking-[0.3em] text-slate-500'>Continue Working</p>
            <h3 className='mt-3 text-2xl font-bold text-slate-900'>Reopen {wordDetail.word}?</h3>
            <p className='mt-4 text-sm leading-6 text-slate-700'>
              This word is currently complete. If you continue working on it, the checklist
              will need to be finished again before it is complete.
            </p>
            <div className='mt-6 flex flex-wrap justify-end gap-3'>
              <button
                type='button'
                onClick={() => setIsContinueModalOpen(false)}
                className='rounded-full bg-slate-200 px-4 py-2 font-bold text-slate-900'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleContinueWorking}
                disabled={isResettingChecklist}
                className='rounded-full bg-primary px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isResettingChecklist ? 'Reopening...' : 'Continue Working'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isResetStartedModalOpen ? (
        <div className='no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4'>
          <div className='w-full max-w-lg rounded-3xl bg-white p-6 text-slate-900 shadow-2xl'>
            <p className='text-sm uppercase tracking-[0.3em] text-slate-500'>
              Reset Checklist
            </p>
            <h3 className='mt-3 text-2xl font-bold text-slate-900'>
              Set {wordDetail.word} to not started?
            </h3>
            <p className='mt-4 text-sm leading-6 text-slate-700'>
              This will clear the saved checkbox state for this word. You can
              always start it again later by checking any item.
            </p>
            <div className='mt-6 flex flex-wrap justify-end gap-3'>
              <button
                type='button'
                onClick={() => setIsResetStartedModalOpen(false)}
                className='rounded-full bg-slate-200 px-4 py-2 font-bold text-slate-900'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleResetStartedChecklist}
                disabled={isResetStartedChecklist}
                className='rounded-full bg-primary px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isResetStartedChecklist ? 'Resetting...' : 'Set To Not Started'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className='print-only worksheet-sheet'>
        <article
          className={`worksheet-page bg-white text-slate-900 ${
            hasGeneratedImage ? 'worksheet-page-generated' : ''
          }`}
        >
          <div className='worksheet-frame worksheet-front-page-frame'>
            <div className='worksheet-header'>
              <div className='min-w-0'>
                <h3 className='worksheet-word'>{wordDetail.word}</h3>
                <p className='worksheet-definition'>{printableDefinition}</p>
                {renderPrintPronunciationTiles('mt-3')}
              </div>
              <div className='worksheet-qr-block'>
                <img src={qrCodeUrl} alt={`QR code for ${wordDetail.word}`} className='worksheet-qr' />
                <p className='worksheet-qr-caption'>Scan to complete checklist online</p>
              </div>
            </div>

            <div className='worksheet-front-body worksheet-front-body-single-page'>
              <div className='worksheet-front-layout'>
                <div className='worksheet-front-main'>
                  <section className='worksheet-card'>
                    <p className='worksheet-card-title'>Required Panes</p>
                    <div className='worksheet-pane-grid'>
                      {panes
                        .filter(pane => pane.required)
                        .map(pane => (
                          <div key={pane.id} className='worksheet-pane-card'>
                            <div className='flex items-center justify-between gap-3'>
                              <p className='worksheet-pane-heading font-semibold text-slate-900'>
                                {pane.title}
                              </p>
                              <p className='worksheet-pane-note'>
                                Check any {REQUIRED_CHECKS_PER_PANE}
                              </p>
                            </div>
                            <ol className='worksheet-pane-checklist'>
                              {pane.items.map(item => (
                                <li key={item.id} className='worksheet-check-item'>
                                  <span className='worksheet-print-checkbox' />
                                  <span className='worksheet-print-task'>{item.label}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        ))}
                    </div>
                  </section>

                  <section className='worksheet-inline-draw worksheet-print-draw-row worksheet-card'>
                    <div className='worksheet-inline-draw-copy'>
                      <p className='worksheet-card-title'>
                        {generatedContent?.imageDataUrl ? 'Color Or Trace' : 'Draw Your Own Picture'}
                      </p>
                      <p className='worksheet-back-prompt'>
                        {generatedContent?.imageDataUrl
                          ? `Color the picture for "${wordDetail.word}" and say the word again while you work.`
                          : wordDetail.drawPrompt}
                      </p>
                    </div>

                    <div className='worksheet-inline-draw-box'>
                      {generatedContent?.imageDataUrl ? (
                        <img
                          src={generatedContent.imageDataUrl}
                          alt={`${wordDetail.word} coloring page`}
                          className='worksheet-drawing-image'
                        />
                      ) : (
                        <div className='worksheet-draw-placeholder' />
                      )}
                    </div>
                  </section>
                </div>

                <div className='worksheet-front-sidebar'>
                  <section className='worksheet-card'>
                    <p className='worksheet-card-title'>
                      {panes.find(pane => pane.id === 'optional')?.title}
                    </p>
                    <ol className='worksheet-print-checklist-grid worksheet-print-checklist-grid-optional'>
                      {panes.find(pane => pane.id === 'optional')?.items.map(item => (
                        <li key={item.id} className='worksheet-check-item'>
                          <span className='worksheet-print-checkbox' />
                          <span className='worksheet-print-task'>{item.label}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className='worksheet-card'>
                    <p className='worksheet-card-title'>Related Words</p>
                    {hasCategoryRelationSentence ||
                    hasFirstLetterRelationSentence ||
                    hasPhonemeRelationSentence ? (
                      <div className='mt-2 space-y-1.5'>
                        {hasCategoryRelationSentence ? (
                          <p className='worksheet-small-copy'>
                            The word &apos;<strong>{categoryRelationLeadWord}</strong>&apos; is
                            related to the word &apos;{wordDetail.word}&apos; by the category{' '}
                            <strong>{wordDetail.category}</strong>.
                          </p>
                        ) : null}
                        {hasFirstLetterRelationSentence ? (
                          <p className='worksheet-small-copy'>
                            The word &apos;<strong>{firstLetterRelationLeadWord}</strong>&apos; is
                            related to the word &apos;{wordDetail.word}&apos; by the first
                            letter <strong>{firstLetter || '-'}</strong>.
                          </p>
                        ) : null}
                        {hasPhonemeRelationSentence ? (
                          <p className='worksheet-small-copy'>
                            The word &apos;<strong>{phonemeRelationLeadWord}</strong>&apos; is
                            related to the word &apos;{wordDetail.word}&apos; by the sound{' '}
                            <strong>{primaryPhonemeRelation?.label}</strong>.
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <p className='worksheet-small-copy'>No related words are ready yet.</p>
                    )}
                  </section>

                  {hasGeneratedLanguageExamples ? (
                    <section className='worksheet-card'>
                      <p className='worksheet-card-title'>Synonyms, Antonyms, Homonyms, Morphemes</p>
                      <div className='mt-3 space-y-3'>
                        {generatedSynonymEntries.length > 0 ? (
                          <div>
                            <p className='font-semibold text-slate-900'>Synonyms</p>
                            <p className='worksheet-small-copy'>
                              Words with similar meanings.
                            </p>
                            <ul className='mt-2 worksheet-detail-list'>
                              {generatedSynonymEntries.slice(0, 2).map(entry => (
                                <li key={`${entry.word}-${entry.reason || 'synonym-print'}`}>
                                  <strong>{entry.word}</strong>
                                  {entry.reason ? `: ${entry.reason}` : ''}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {generatedAntonymEntries.length > 0 ? (
                          <div>
                            <p className='font-semibold text-slate-900'>Antonyms</p>
                            <p className='worksheet-small-copy'>
                              Words with opposite meanings.
                            </p>
                            <ul className='mt-2 worksheet-detail-list'>
                              {generatedAntonymEntries.slice(0, 2).map(entry => (
                                <li key={`${entry.word}-${entry.reason || 'antonym-print'}`}>
                                  <strong>{entry.word}</strong>
                                  {entry.reason ? `: ${entry.reason}` : ''}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {generatedHomographMeanings.length > 0 ? (
                          <div>
                            <p className='font-semibold text-slate-900'>Homonyms</p>
                            <p className='worksheet-small-copy'>
                              Words that can sound the same or look the same but mean different things.
                            </p>
                            <ul className='mt-2 worksheet-detail-list'>
                              {generatedHomographMeanings.slice(0, 2).map(meaning => (
                                <li key={meaning}>{meaning}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {generatedMorphemeEntries.length > 0 ? (
                          <div>
                            <p className='font-semibold text-slate-900'>Morphemes</p>
                            <p className='worksheet-small-copy'>
                              Small decorations to words that make them more precise.
                            </p>
                            <ul className='mt-2 worksheet-detail-list'>
                              {generatedMorphemeEntries.slice(0, 2).map(entry => (
                                <li key={`${entry.form}-${entry.sentence}`}>
                                  <strong>{entry.form}</strong>: {entry.sentence}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </section>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
