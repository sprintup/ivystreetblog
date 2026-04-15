'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getWorksheetGenerationPolicy } from '@/utils/wordGardenGenerationPolicy';

const REQUIRED_CHECKS_PER_PANE = 2;
const HOMOGRAPH_NOTES = {
  bark: ['the sound a dog makes', 'the outside of a tree'],
  bat: ['an animal that flies at night', 'a stick used in sports'],
  can: ['to be able', 'a metal container'],
  duck: ['a bird', 'to bend down quickly'],
  jam: ['fruit spread', 'something stuck together, like traffic'],
  leaves: ['parts of a plant', 'goes away'],
  park: ['an outdoor place', 'to leave a car in one spot'],
  ring: ['jewelry', 'a bell or phone sound'],
  seal: ['an ocean animal', 'to close something tightly'],
  watch: ['something that tells time', 'to look carefully'],
  wave: ['moving water', 'a hand motion'],
};

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

function buildInitialCheckedState(panes) {
  return panes.reduce((state, pane) => {
    pane.items.forEach(item => {
      state[item.id] = false;
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

function getFallbackMorphemeEntries(wordDetail) {
  return wordDetail.morphologyExamples.map(example => ({
    form: example.form,
    sentence: example.sentence,
  }));
}

function getFallbackRelatedEntries(wordDetail) {
  return wordDetail.relatedWords.slice(0, 6).map(word => ({
    word: word.word,
    isLinkable: true,
  }));
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

function buildDefinitionLookupWords(wordDetail) {
  const seen = new Set();
  const words = [wordDetail.word];

  wordDetail.definitionTokens.forEach(token => {
    if (token.glossaryTerm && token.glossaryTerm.length > 3) {
      words.push(token.glossaryTerm);
    }
  });

  return words
    .filter(Boolean)
    .filter(word => {
      const normalized = String(word).toLowerCase();
      if (seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    })
    .slice(0, 8)
    .map(word => ({
      word,
      url: `https://www.merriam-webster.com/dictionary/${encodeURIComponent(word)}`,
    }));
}

function getRelatedWordsHint(wordDetail, hasGeneratedRelatedWords) {
  if (hasGeneratedRelatedWords) {
    return 'Hint: these words connect by meaning. Talk about what idea they share.';
  }
  if (wordDetail.selectionType === 'all') {
    return 'Hint: these words may connect by meaning, spelling pattern, or shared sounds.';
  }
  if (wordDetail.selectionType === 'letter') {
    return `Hint: these words all begin with the letter ${wordDetail.selectionSlug}.`;
  }
  return `Hint: listen for ${wordDetail.targetPhonemeLabel} in each word.`;
}

function getPhonologicalPrompt(wordDetail) {
  if (wordDetail.selectionType === 'all') {
    return `Ask: What is the first sound in ${wordDetail.word}? What other sounds do you hear in the word?`;
  }

  if (wordDetail.selectionType === 'letter') {
    return `Ask: What letter does ${wordDetail.word} start with? Can you point to the ${wordDetail.selectionSlug} at the beginning?`;
  }

  return `Ask: What is the first sound in ${wordDetail.word}? Can you hear ${wordDetail.targetPhonemeLabel} somewhere in the word?`;
}

function buildPanes(wordDetail) {
  const syllables = `${wordDetail.syllableCount} syllable${
    wordDetail.syllableCount === 1 ? '' : 's'
  }`;
  const firstSound =
    wordDetail.soundMapRows[0]?.phonemeLabel ||
    wordDetail.targetPhonemeLabel ||
    'the first sound';
  const upper = wordDetail.uppercaseLetter || wordDetail.word.charAt(0).toUpperCase();
  const lower = wordDetail.lowercaseLetter || upper.toLowerCase();

  return [
    {
      id: 'phonological',
      title: 'Phonological Processor',
      description: 'How the word sounds.',
      strategyTitle: 'Synthetic Approach',
      required: true,
      items: [
        { id: 'phonological-say', label: `Say "${wordDetail.word}" out loud.` },
        { id: 'phonological-repeat', label: `Ask the child to say "${wordDetail.word}".` },
        { id: 'phonological-syllables', label: `Count the ${syllables}.` },
      ],
    },
    {
      id: 'meaning',
      title: 'Meaning Processor',
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
      title: 'Orthographic Processor',
      description: 'How the word looks.',
      strategyTitle: 'Analytic Approach',
      required: true,
      items: [
        { id: 'orthographic-spell', label: `Spell "${wordDetail.word}" for the child.` },
        {
          id: 'orthographic-start',
          label: `"${wordDetail.word}" starts with ${upper}, which can make ${firstSound}.`,
        },
        { id: 'orthographic-forms', label: `Show both ${upper} and ${lower}.` },
      ],
    },
    {
      id: 'context',
      title: 'Context Processor',
      description: 'Inferring deeper meaning.',
      strategyTitle: 'Word Building And Related Words',
      required: true,
      items: [
        {
          id: 'context-known',
          label: `Relate "${wordDetail.word}" using a metaphor.`,
        },
        {
          id: 'context-homographs',
          label: `Discuss whether "${wordDetail.word}" has any homographs.`,
        },
        {
          id: 'context-related',
          label: `Talk about related forms and related words for "${wordDetail.word}".`,
        },
      ],
    },
    {
      id: 'optional',
      title: 'Optional (Best for ages over 3)',
      strategyTitle: 'Onset / Rime And Sound Map',
      required: false,
      items: [
        {
          id: 'optional-sounds',
          label: `Try to have the child say all the sounds in "${wordDetail.word}" one at a time.`,
        },
        {
          id: 'optional-onset-rime',
          label: `Model the onset and rime for "${wordDetail.word}": ${
            wordDetail.onsetAndRime.onset || '-'
          } / ${wordDetail.onsetAndRime.rime || wordDetail.word}.`,
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
  qrCodeUrl,
  soundTableSelection = '',
  wordDetail,
}) {
  const router = useRouter();
  const panes = useMemo(() => buildPanes(wordDetail), [wordDetail]);
  const generationPolicy = useMemo(
    () => getWorksheetGenerationPolicy(wordDetail.word),
    [wordDetail.word]
  );
  const isGenerationDisabled = generationPolicy.disabled;
  const [apiKey, setApiKey] = useState('');
  const [checkedItems, setCheckedItems] = useState(() => buildInitialCheckedState(panes));
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
  const [isResettingChecklist, setIsResettingChecklist] = useState(false);
  const [isContinueModalOpen, setIsContinueModalOpen] = useState(false);
  const [isCompletionSummaryOpen, setIsCompletionSummaryOpen] = useState(false);

  const state = getWorksheetState(generatedContent, isGenerationDisabled);
  const printableDefinition = generatedContent?.childFriendlyDefinition || wordDetail.definition;
  const morphemeEntries =
    state === 'generated'
      ? generatedContent?.morphemeSentences || []
      : getFallbackMorphemeEntries(wordDetail);
  const hasGeneratedRelatedWords = generatedContent?.relatedWordConnections?.length > 0;
  const relatedEntries = hasGeneratedRelatedWords
    ? generatedContent.relatedWordConnections.map(entry => ({
        word: entry.word,
        isLinkable: false,
      }))
    : getFallbackRelatedEntries(wordDetail);
  const relatedHint = getRelatedWordsHint(wordDetail, hasGeneratedRelatedWords);
  const relatedWords = relatedEntries.slice(0, 4);
  const similarRimeWords = wordDetail.similarRimeWords.slice(0, 4);
  const lookupWords = buildDefinitionLookupWords(wordDetail);
  const generatedHomographMeanings = Array.isArray(generatedContent?.homographMeanings)
    ? generatedContent.homographMeanings
        .map(meaning => String(meaning || '').trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];
  const homographMeanings =
    generatedHomographMeanings.length > 0
      ? generatedHomographMeanings
      : HOMOGRAPH_NOTES[String(wordDetail.word || '').trim().toLowerCase()] || [];
  const selectedLetter =
    soundTableSelection ||
    (wordDetail.selectionType === 'letter' ? wordDetail.selectionSlug : '');

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
  const completionLearningSummary = `You practiced how "${wordDetail.word}" sounds, what it means, how it looks, and how to infer deeper meaning from context and related words.`;
  const completionNextSteps =
    'Next, you will return to the sound table to choose another letter, sound, or word to explore.';

  const downloadWorksheet = useCallback(() => {
    const previousTitle = document.title;
    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };

    document.title = wordDetail.word;
    window.addEventListener('afterprint', restoreTitle);
    window.setTimeout(restoreTitle, 15000);
    window.print();
  }, [wordDetail.word]);

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
    if (!autoCheckFromQr || hasAppliedQrAutoCheck || isWordComplete) {
      return;
    }

    setCheckedItems(buildFullyCheckedState(panes));
    setCompletionSuccess(
      'Checklist pre-filled from the worksheet QR code. Press Complete Checklist when you are ready.'
    );
    setHasAppliedQrAutoCheck(true);
  }, [autoCheckFromQr, hasAppliedQrAutoCheck, isWordComplete, panes]);

  useEffect(() => {
    if (!generatedContent || hasTriggeredGeneratedPrint) {
      return undefined;
    }

    setHasTriggeredGeneratedPrint(true);
    setGenerationSuccess('Worksheet generated, ready to print');

    const printTimer = window.setTimeout(() => {
      downloadWorksheet();
    }, 350);

    return () => window.clearTimeout(printTimer);
  }, [downloadWorksheet, generatedContent, hasTriggeredGeneratedPrint]);

  function toggleItem(itemId) {
    setCheckedItems(current => ({ ...current, [itemId]: !current[itemId] }));
    setCompletionError('');
    setCompletionSuccess('');
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
      setCompletionSuccess('Checklist marked complete online.');
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
      setCompletionSuccess(
        'This word is ready for more work. Finish the checklist again when you are ready.'
      );
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
      <div className='overflow-x-auto pb-2'>
        <div className='flex min-w-max gap-3'>
        {wordDetail.soundMapRows.map((row, index) => {
          const href = buildPhonemeHref(acId, row.phonemeSlug, selectedLetter);
          const content = (
            <>
              <span className='text-3xl font-semibold lowercase tracking-wide text-white'>
                {row.grapheme}
              </span>
              <span className='mt-3 text-sm text-accent'>
                {row.phonemeLabel || 'listen closely'}
              </span>
            </>
          );

          return row.phonemeSlug ? (
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

  function isPronunciationTileHighlighted(row, index) {
    if (wordDetail.selectionType === 'phoneme') {
      return row.phonemeSlug === wordDetail.selectionSlug;
    }

    if (wordDetail.selectionType === 'letter') {
      const selectedLetterValue = String(wordDetail.selectionSlug || '').toUpperCase();
      return index === 0 || String(row.grapheme || '').toUpperCase().startsWith(selectedLetterValue);
    }

    return false;
  }

  function renderPrintPronunciationHelper() {
    return (
      <section className='worksheet-card'>
        <p className='worksheet-card-title'>Pronunciation Helper</p>
        <div className='worksheet-pronunciation-grid'>
          {wordDetail.soundMapRows.map((row, index) => {
            const isHighlighted = isPronunciationTileHighlighted(row, index);

            return (
              <div
                key={`${row.grapheme}-${index}-print`}
                className={`worksheet-pronunciation-tile ${
                  isHighlighted ? 'worksheet-pronunciation-tile-highlighted' : ''
                }`}
              >
                <span className='worksheet-pronunciation-grapheme'>{row.grapheme}</span>
                <span className='worksheet-pronunciation-phoneme'>
                  {row.phonemeLabel || 'listen'}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  function renderStrategy(paneId) {
    if (paneId === 'phonological') {
      return (
        <div className='grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]'>
          <section className='rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Synthetic Approach</p>
            <p className='mt-3 text-3xl font-semibold text-white'>{wordDetail.word}</p>
            <div className='mt-5'>{renderSoundTiles()}</div>
            <p className='mt-4 text-sm text-accent'>
              Keep the word horizontal and let the child match the grapheme to the
              sound below each box.
            </p>
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
            <div className='mt-4 flex flex-wrap gap-2'>
              {lookupWords.map(entry => (
                <a
                  key={entry.word}
                  href={entry.url}
                  className='rounded-full border border-accent/20 bg-secondary/80 px-3 py-2 text-sm text-yellow transition hover:border-yellow/40 hover:text-orange'
                >
                  {entry.word}
                </a>
              ))}
            </div>
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
        <div className='grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)]'>
          <section className='rounded-2xl bg-primary/40 p-5'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Analytic Approach</p>
            <div className='mt-4 rounded-3xl border border-accent/20 bg-secondary/80 p-5'>
              <p className='text-xs uppercase tracking-[0.3em] text-accent'>Start with the whole word</p>
              <p className='mt-3 text-4xl font-semibold tracking-[0.18em] text-white md:text-5xl'>
                <span className='text-yellow'>{wordDetail.word.charAt(0)}</span>
                {wordDetail.word.slice(1)}
              </p>
            </div>
            <p className='mt-4 text-accent'>
              {wordDetail.word} starts with {wordDetail.uppercaseLetter}, which can make{' '}
              {wordDetail.soundMapRows[0]?.phonemeLabel || 'the first sound'}.
            </p>
          </section>
          <section className='rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Letter Match</p>
            <div className='mt-4 grid gap-3 sm:grid-cols-2'>
              <div className='rounded-2xl border border-accent/20 bg-secondary/80 p-4 text-center'>
                <p className='text-xs uppercase tracking-[0.25em] text-accent'>Uppercase</p>
                <p className='mt-3 text-5xl font-semibold text-white'>{wordDetail.uppercaseLetter}</p>
              </div>
              <div className='rounded-2xl border border-accent/20 bg-secondary/80 p-4 text-center'>
                <p className='text-xs uppercase tracking-[0.25em] text-accent'>Lowercase</p>
                <p className='mt-3 text-5xl font-semibold lowercase text-white'>{wordDetail.lowercaseLetter}</p>
              </div>
            </div>
          </section>
        </div>
      );
    }

    if (paneId === 'context') {
      return (
        <div className='grid gap-4 xl:grid-cols-3'>
          <section className='rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Word Building</p>
            {morphemeEntries.length === 0 ? (
              <p className='mt-3 text-accent'>This word works best as a whole-word practice target.</p>
            ) : (
              <div className='mt-3 space-y-3'>
                {morphemeEntries.slice(0, 4).map(example => (
                  <div key={`${example.form}-${example.sentence}`} className='rounded-2xl bg-secondary/80 p-4'>
                    <p className='font-semibold text-yellow'>{example.form}</p>
                    <p className='mt-2 text-sm text-accent'>{example.sentence}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className='rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Related Words</p>
            <p className='mt-3 text-sm text-accent'>{relatedHint}</p>
            <div className='mt-3 space-y-3'>
              {relatedWords.length === 0 ? (
                <p className='text-accent'>No related words are ready yet.</p>
              ) : (
                relatedWords.map(entry => (
                  <div key={entry.word} className='rounded-2xl bg-secondary/80 p-4'>
                    {entry.isLinkable ? (
                      <Link
                        href={buildWordHrefWithContext(
                          acId,
                          wordDetail.selectionType,
                          wordDetail.selectionSlug,
                          entry.word,
                          selectedLetter
                        )}
                        className='text-yellow hover:text-orange'
                      >
                        {entry.word}
                      </Link>
                    ) : (
                      <span className='text-yellow'>{entry.word}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
          <section className='rounded-2xl bg-primary/40 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Homographs</p>
            {homographMeanings.length > 0 ? (
              <div className='mt-3 space-y-3'>
                <p className='text-accent'>{wordDetail.word} may connect to more than one meaning.</p>
                {homographMeanings.map(meaning => (
                  <div key={meaning} className='rounded-2xl border border-accent/20 bg-secondary/80 px-4 py-3 text-sm text-accent'>
                    {meaning}
                  </div>
                ))}
              </div>
            ) : (
              <p className='mt-3 text-accent'>
                No common homograph note is saved for this word yet. If the child
                already knows another meaning, compare the meanings together.
              </p>
            )}
          </section>
        </div>
      );
    }

    return (
      <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.9fr)]'>
        <section className='rounded-2xl bg-primary/40 p-4'>
          <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Onset / Rime</p>
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            <div className='rounded-2xl border border-accent/20 bg-secondary/80 p-4'>
              <p className='text-xs uppercase tracking-[0.25em] text-accent'>Onset</p>
              <p className='mt-3 text-3xl font-semibold text-white'>{wordDetail.onsetAndRime.onset || '-'}</p>
            </div>
            <div className='rounded-2xl border border-accent/20 bg-secondary/80 p-4'>
              <p className='text-xs uppercase tracking-[0.25em] text-accent'>Rime</p>
              <p className='mt-3 text-3xl font-semibold text-white'>{wordDetail.onsetAndRime.rime || '-'}</p>
            </div>
          </div>
          <div className='mt-4'>{renderSoundTiles()}</div>
        </section>
        <section className='rounded-2xl bg-primary/40 p-4'>
          <p className='text-xs uppercase tracking-[0.3em] text-yellow'>Build Another Word</p>
          <div className='mt-3 space-y-3'>
            {similarRimeWords.length === 0 ? (
              <p className='text-accent'>No close rime matches are ready in this lexicon yet.</p>
            ) : (
              similarRimeWords.map(entry => (
                <Link
                  key={entry.normalizedWord}
                  href={buildWordHrefWithContext(
                    acId,
                    wordDetail.selectionType,
                    wordDetail.selectionSlug,
                    entry.word,
                    selectedLetter
                  )}
                  className='block rounded-2xl bg-secondary/80 p-4 text-yellow hover:text-orange'
                >
                  {entry.word}
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    );
  }

  function renderPane(pane) {
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

    const body = (
      <>
        <ol className='mt-6 space-y-3'>
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
        <details className='mt-5 rounded-2xl border border-accent/20 bg-secondary/30 p-4'>
          <summary className='cursor-pointer text-sm font-semibold text-yellow'>
            {pane.strategyTitle}
          </summary>
          <div className='mt-4'>{renderStrategy(pane.id)}</div>
        </details>
      </>
    );

    if (!pane.required) {
      return (
        <details key={pane.id} className='rounded-3xl border border-accent/20 bg-primary/50 p-6 shadow-lg'>
          <summary className='flex cursor-pointer list-none flex-wrap items-start justify-between gap-4'>
            <div>
              <div className='flex flex-wrap items-center gap-3'>
                <h2 className='text-2xl text-yellow'>{pane.title}</h2>
                <span className='rounded-full border border-accent/20 bg-primary/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-accent'>
                  Optional
                </span>
              </div>
              <p className='mt-2 text-sm text-accent'>
                {pane.description ? `${pane.description} ` : ''}
                Not required for completion. Open for extra sound practice beyond the core 3-level flow.
              </p>
            </div>
            <span className={`rounded-full border px-3 py-2 text-sm font-semibold ${statusClass}`}>
              {status}
            </span>
          </summary>
          {body}
        </details>
      );
    }

    return (
      <article key={pane.id} className='rounded-3xl border border-accent/20 bg-primary/50 p-6 shadow-lg'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <div className='flex flex-wrap items-center gap-3'>
              <h2 className='text-2xl text-yellow'>{pane.title}</h2>
              <span className='rounded-full border border-yellow/20 bg-yellow/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-yellow'>
                Required
              </span>
            </div>
            <p className='mt-2 text-sm text-accent'>
              {pane.description}
            </p>
            <p className='mt-1 text-sm text-accent/90'>
              Choose any {REQUIRED_CHECKS_PER_PANE} of {pane.itemCount} items to complete this pane.
            </p>
          </div>
          <span className={`rounded-full border px-3 py-2 text-sm font-semibold ${statusClass}`}>
            {status}
          </span>
        </div>
        {body}
      </article>
    );
  }

  return (
    <>
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
        <div className='no-print space-y-6'>{paneProgress.map(renderPane)}</div>

        <aside className='no-print space-y-6 self-start xl:sticky xl:top-24'>
          <div className='rounded-3xl border border-accent/20 bg-primary/50 p-6 shadow-lg'>
            <p className='text-sm uppercase tracking-[0.3em] text-yellow'>Completion Rules</p>
            <h2 className='mt-3 text-2xl text-white'>Finish the 4 required panes</h2>
            <p className='mt-3 text-accent'>
              Complete any {REQUIRED_CHECKS_PER_PANE} items in each required pane. The
              optional pane does not count toward completion.
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
                  <input type='text' name='username' value='OpenAI Word Garden' readOnly autoComplete='username' className='sr-only' tabIndex={-1} />
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
                {generationSuccess ? (
                  <p className='text-sm text-green-700'>{generationSuccess}</p>
                ) : null}
              </div>
            ) : null}
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

      <div className='print-only worksheet-sheet'>
        <article className='worksheet-page bg-white text-slate-900'>
          <div className='worksheet-frame worksheet-front-page-frame'>
            <div className='worksheet-header'>
              <div className='min-w-0'>
                <p className='worksheet-kicker'>Word Garden Worksheet</p>
                <h3 className='worksheet-word'>{wordDetail.word}</h3>
                <p className='worksheet-definition'>{printableDefinition}</p>
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
                              <p className='font-semibold text-slate-900'>{pane.title}</p>
                              <p className='worksheet-pane-note'>
                                Check any {REQUIRED_CHECKS_PER_PANE}
                              </p>
                            </div>
                            <ol className='mt-2 space-y-1.5'>
                              {pane.items.map(item => (
                                <li key={item.id} className='worksheet-check-item'>
                                  <span className='worksheet-print-checkbox' />
                                  <span>{item.label}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        ))}
                    </div>
                  </section>

                  <section className='worksheet-card'>
                    <p className='worksheet-card-title'>Word Building</p>
                    {morphemeEntries.length === 0 ? (
                      <p className='worksheet-small-copy'>
                        Keep this as a whole-word practice target.
                      </p>
                    ) : (
                      <ul className='worksheet-detail-list'>
                        {morphemeEntries.slice(0, 3).map(entry => (
                          <li key={`${entry.form}-${entry.sentence}`}>
                            <strong>{entry.form}</strong>: {entry.sentence}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className='mt-4 worksheet-card-title'>Related Words</p>
                    <p className='worksheet-small-copy'>How are these words related?</p>
                    {relatedWords.length > 0 ? (
                      <ul className='mt-3 worksheet-write-in-list'>
                        {relatedWords.map(entry => (
                          <li key={entry.word} className='worksheet-write-in-item'>
                            <strong>{entry.word}</strong>
                            <span className='worksheet-write-line' />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='worksheet-small-copy'>No related words are ready yet.</p>
                    )}
                  </section>
                </div>

                <div className='worksheet-front-sidebar'>
                  {renderPrintPronunciationHelper()}

                  <section className='worksheet-card'>
                    <p className='worksheet-card-title'>
                      {panes.find(pane => pane.id === 'optional')?.title}
                    </p>
                    <ol className='space-y-1.5'>
                      {panes.find(pane => pane.id === 'optional')?.items.map(item => (
                        <li key={item.id} className='worksheet-check-item'>
                          <span className='worksheet-print-checkbox' />
                          <span>{item.label}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  {homographMeanings.length > 0 ? (
                    <section className='worksheet-card'>
                      <p className='worksheet-card-title'>Homographs</p>
                      <ul className='worksheet-detail-list'>
                        {homographMeanings.map(meaning => (
                          <li key={meaning}>{meaning}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  <section className='worksheet-inline-draw'>
                    <div className='worksheet-inline-draw-copy'>
                      <p className='worksheet-card-title'>
                        {generatedContent?.imageDataUrl ? 'Color Or Trace' : 'Draw Your Own Picture'}
                      </p>
                      <p className='worksheet-back-prompt'>
                        {generatedContent?.imageDataUrl
                          ? `Color the picture for "${wordDetail.word}" and say the word again while you work.`
                          : wordDetail.drawPrompt}
                      </p>
                      {!generatedContent?.imageDataUrl ? (
                        <p className='worksheet-small-copy'>
                          Use the definition above to help the child decide what to draw.
                        </p>
                      ) : null}
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
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
