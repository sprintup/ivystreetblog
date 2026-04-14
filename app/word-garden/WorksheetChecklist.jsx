'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

function buildWorksheetChecklist(wordDetail) {
  return [
    `Say the definition for "${wordDetail.word}" together.`,
    `Relate "${wordDetail.word}" to something the child already knows.`,
    `Count the ${wordDetail.syllableCount} syllable${wordDetail.syllableCount === 1 ? '' : 's'}.`,
    `Model the onset and rime: ${wordDetail.onsetAndRime.onset || '-'} / ${wordDetail.onsetAndRime.rime || wordDetail.word}.`,
    `Ask the child to say "${wordDetail.word}".`,
    `Ask the child what "${wordDetail.word}" means.`,
    `Spell "${wordDetail.word}" for the child.`,
    `Have the child try to say all the sounds in "${wordDetail.word}" one at a time.`,
    `Say "${wordDetail.word}" again without one of the sounds and talk about what changed.`,
    `Build a different word from one of the sounds in "${wordDetail.word}".`,
    `Talk about related forms and related words for "${wordDetail.word}".`,
  ];
}

function getFallbackMorphemeEntries(wordDetail) {
  return wordDetail.morphologyExamples.map(example => ({
    form: example.form,
    sentence: example.sentence,
  }));
}

function getFallbackRelatedEntries(wordDetail) {
  return wordDetail.relatedWords.slice(0, 6).map(relatedWord => ({
    word: relatedWord.word,
    isLinkable: true,
  }));
}

function getWorksheetState(generatedContent) {
  return generatedContent ? 'generated' : 'ungenerated';
}

function getStateBadgeClass(worksheetState) {
  return worksheetState === 'generated'
    ? 'bg-green-500/20 text-green-700'
    : 'bg-slate-200 text-slate-700';
}

function getStateLabel(worksheetState) {
  return worksheetState === 'generated' ? 'Generated' : 'Ungenerated';
}

function getRelatedWordsHint(wordDetail, hasGeneratedRelatedWords) {
  if (hasGeneratedRelatedWords) {
    return 'Hint: these words connect by meaning. Talk about what idea they share.';
  }

  if (wordDetail.selectionType === 'letter') {
    return `Hint: these words all begin with the letter ${wordDetail.selectionSlug}.`;
  }

  return `Hint: listen for ${wordDetail.targetPhonemeLabel} in each word.`;
}

function buildWordHrefWithContext(
  acId,
  selectionType,
  selectionSlug,
  word,
  soundTableSelection = ''
) {
  const encodedWord = encodeURIComponent(word);
  return selectionType === 'letter'
    ? `/word-garden/${acId}/letter/${selectionSlug}/${encodedWord}`
    : `/word-garden/${acId}/phoneme/${selectionSlug}/${encodedWord}${
        soundTableSelection
          ? `?letter=${encodeURIComponent(soundTableSelection)}`
          : ''
      }`;
}

function buildPhonemeHref(acId, phonemeSlug, soundTableSelection = '') {
  if (!phonemeSlug) {
    return '';
  }

  return `/word-garden/${acId}/phoneme/${phonemeSlug}${
    soundTableSelection ? `?letter=${encodeURIComponent(soundTableSelection)}` : ''
  }`;
}

function getSoundPrompt(wordDetail) {
  if (wordDetail.selectionType === 'letter') {
    return `Ask: What letter does ${wordDetail.word} start with? Can you point to the ${wordDetail.selectionSlug} at the beginning?`;
  }

  return `Ask: What is the first sound in ${wordDetail.word}? Can you hear ${wordDetail.targetPhonemeLabel} somewhere in the word?`;
}

function buildWriteInRows(words, maxCount = 4) {
  return words.slice(0, maxCount);
}

export default function WorksheetChecklist({
  acId,
  qrCodeUrl,
  soundTableSelection = '',
  wordDetail,
}) {
  const checklistItems = useMemo(() => buildWorksheetChecklist(wordDetail), [wordDetail]);
  const [apiKey, setApiKey] = useState('');
  const [checkedItems, setCheckedItems] = useState(() =>
    checklistItems.map(() => false)
  );
  const [completionError, setCompletionError] = useState('');
  const [completionSuccess, setCompletionSuccess] = useState('');
  const [generationError, setGenerationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isWordSoundsOpen, setIsWordSoundsOpen] = useState(false);
  const [isBuildAndConnectOpen, setIsBuildAndConnectOpen] = useState(false);
  const [isWordComplete, setIsWordComplete] = useState(
    () => (wordDetail.completedChecklistCount || 0) > 0
  );
  const [isResettingChecklist, setIsResettingChecklist] = useState(false);
  const [isContinueModalOpen, setIsContinueModalOpen] = useState(false);

  const allItemsChecked = useMemo(
    () => checkedItems.every(Boolean),
    [checkedItems]
  );
  const worksheetState = getWorksheetState(generatedContent);
  const printableDefinition =
    generatedContent?.childFriendlyDefinition || wordDetail.definition;
  const isGeneratedWorksheet = Boolean(generatedContent);
  const morphemeEntries =
    isGeneratedWorksheet
      ? generatedContent?.morphemeSentences || []
      : getFallbackMorphemeEntries(wordDetail);
  const shouldAskToValidateWordBuilding =
    worksheetState === 'ungenerated' && morphemeEntries.length > 0;
  const wordBuildingReviewPrompt = shouldAskToValidateWordBuilding
    ? 'Discuss if these look correct.'
    : '';
  const hasGeneratedRelatedWords =
    generatedContent?.relatedWordConnections?.length > 0;
  const relatedEntries =
    hasGeneratedRelatedWords
      ? generatedContent.relatedWordConnections.map(entry => ({
          word: entry.word,
          isLinkable: false,
        }))
      : getFallbackRelatedEntries(wordDetail);
  const similarRimeWords = wordDetail.similarRimeWords.slice(0, 6);
  const writeInRelatedWords = buildWriteInRows(relatedEntries, 4);
  const writeInRimeWords = buildWriteInRows(similarRimeWords, 4);
  const soundPrompt = getSoundPrompt(wordDetail);
  const relatedWordsHint = getRelatedWordsHint(
    wordDetail,
    hasGeneratedRelatedWords
  );
  const phonemeBreadcrumbSelection =
    soundTableSelection ||
    (wordDetail.selectionType === 'letter' ? wordDetail.selectionSlug : '');

  function toggleItem(index) {
    setCheckedItems(currentState =>
      currentState.map((itemIsChecked, currentIndex) =>
        currentIndex === index ? !itemIsChecked : itemIsChecked
      )
    );
    setCompletionError('');
    setCompletionSuccess('');
  }

  async function handleGenerate(event) {
    event.preventDefault();
    setGenerationError('');

    if (!apiKey.trim()) {
      setGenerationError('Add an OpenAI API key before generating a worksheet.');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/word-garden/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        throw new Error(
          data?.error || 'Unable to generate worksheet content right now.'
        );
      }

      setGeneratedContent({
        childFriendlyDefinition: data.childFriendlyDefinition || '',
        morphemeSentences: data.morphemeSentences || [],
        relatedWordConnections: data.relatedWordConnections || [],
        imagePrompt: data.imagePrompt || '',
        imageDataUrl: data.imageDataUrl || '',
      });
    } catch (error) {
      console.error('Error generating worksheet content:', error);
      setGenerationError(
        error.message || 'Unable to generate worksheet content right now.'
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCompleteOnline() {
    if (!allItemsChecked) {
      setCompletionError(
        'Check each worksheet item before marking this word complete online.'
      );
      return;
    }

    setIsSubmitting(true);
    setCompletionError('');
    setCompletionSuccess('');

    try {
      const response = await fetch(`/api/word-garden/children/${acId}/practice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
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
      setCheckedItems(checklistItems.map(() => false));
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

  return (
    <>
      {isWordComplete ? (
        <div className='no-print mb-6 rounded-3xl border border-yellow/40 bg-primary/50 p-5 shadow-lg'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <p className='text-sm uppercase tracking-[0.3em] text-yellow'>
                Completed Word
              </p>
              <p className='mt-2 text-accent'>
                This word is currently marked complete.
              </p>
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

      <div className='word-garden-worksheet-layout grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] pb-12 md:pb-16'>
        <div className='no-print space-y-8'>
          <article className='rounded-3xl bg-primary/50 border border-accent/20 p-6 shadow-lg'>
            <button
              type='button'
              onClick={() => setIsWordSoundsOpen(currentState => !currentState)}
              className='flex w-full items-center justify-between gap-4 text-left'
              aria-expanded={isWordSoundsOpen}
            >
              <h2 className='text-2xl text-yellow'>How The Word Sounds</h2>
              <span className='text-2xl leading-none text-accent'>
                {isWordSoundsOpen ? '-' : '+'}
              </span>
            </button>

            {isWordSoundsOpen ? (
              <>
                <div className='mt-4 grid gap-6 md:grid-cols-2'>
                  <div>
                    <h3 className='text-lg text-white mb-3'>Sound Map</h3>
                    <div className='flex flex-wrap gap-2 mb-3'>
                      {wordDetail.soundMapRows.map((row, index) => {
                        const phonemeHref = buildPhonemeHref(
                          acId,
                          row.phonemeSlug,
                          phonemeBreadcrumbSelection
                        );

                        return row.phonemeSlug ? (
                          <Link
                            key={`${row.phonemeLabel}-${index}`}
                            href={phonemeHref}
                            className='rounded-full bg-secondary px-3 py-2 text-sm text-yellow hover:text-orange'
                          >
                            {row.phonemeLabel}
                          </Link>
                        ) : (
                          <span
                            key={`${row.phonemeLabel}-${index}`}
                            className='rounded-full bg-secondary px-3 py-2 text-sm text-accent'
                          >
                            {row.phonemeLabel}
                          </span>
                        );
                      })}
                    </div>
                    <p className='text-accent'>{soundPrompt}</p>
                  </div>
                  <div>
                    <h3 className='text-lg text-white mb-3'>Onset / Rime</h3>
                    <p className='text-accent'>
                      Onset:{' '}
                      <span className='text-yellow'>
                        {wordDetail.onsetAndRime.onset || '-'}
                      </span>
                    </p>
                    <p className='text-accent'>
                      Rime:{' '}
                      <span className='text-yellow'>
                        {wordDetail.onsetAndRime.rime || '-'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className='mt-8 grid gap-6 md:grid-cols-2'>
                  <div>
                    <h3 className='text-lg text-white mb-3'>Synthetic Approach</h3>
                    <div className='space-y-2 text-accent'>
                      {wordDetail.soundMapRows.map((row, index) => {
                        const phonemeHref = buildPhonemeHref(
                          acId,
                          row.phonemeSlug,
                          phonemeBreadcrumbSelection
                        );

                        const rowContent = (
                          <>
                            <span className='font-bold text-yellow'>{row.grapheme}</span>
                            <span>{row.phonemeLabel || 'listen closely'}</span>
                          </>
                        );

                        return row.phonemeSlug ? (
                          <Link
                            key={`${row.grapheme}-${index}`}
                            href={phonemeHref}
                            className='flex items-center justify-between rounded-2xl bg-secondary/70 px-4 py-3 no-underline text-accent hover:bg-secondary'
                          >
                            {rowContent}
                          </Link>
                        ) : (
                          <div
                            key={`${row.grapheme}-${index}`}
                            className='flex items-center justify-between rounded-2xl bg-secondary/70 px-4 py-3'
                          >
                            {rowContent}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg text-white mb-3'>Analytic Approach</h3>
                    <div className='rounded-2xl bg-secondary/70 p-4 text-accent space-y-2'>
                      <p>Start with the whole word: {wordDetail.word}</p>
                      <p>
                        Look at the beginning:{' '}
                        {wordDetail.onsetAndRime.onset || 'vowel start'}
                      </p>
                      <p>
                        Look at the rest:{' '}
                        {wordDetail.onsetAndRime.rime || wordDetail.word}
                      </p>
                      <p>Say the whole word again and notice how the parts fit together.</p>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </article>

          <article className='rounded-3xl bg-primary/50 border border-accent/20 p-6 shadow-lg'>
            <button
              type='button'
              onClick={() =>
                setIsBuildAndConnectOpen(currentState => !currentState)
              }
              className='flex w-full items-center justify-between gap-4 text-left'
              aria-expanded={isBuildAndConnectOpen}
            >
              <h2 className='text-2xl text-yellow'>Build And Connect</h2>
              <span className='text-2xl leading-none text-accent'>
                {isBuildAndConnectOpen ? '-' : '+'}
              </span>
            </button>

            {isBuildAndConnectOpen ? (
              <div
                className={`mt-6 grid gap-6 ${
                  worksheetState === 'generated'
                    ? 'md:grid-cols-2 xl:grid-cols-3'
                    : 'md:grid-cols-2'
                }`}
              >
                <section className='rounded-2xl bg-secondary/70 p-4'>
                  <h3 className='text-lg text-white mb-3'>Word Building</h3>
                  <div className='space-y-3 text-accent'>
                    {shouldAskToValidateWordBuilding ? (
                      <p className='text-sm text-accent'>{wordBuildingReviewPrompt}</p>
                    ) : null}
                    {morphemeEntries.length === 0 ? (
                      <p>This word works best as a whole-word practice target.</p>
                    ) : (
                      morphemeEntries.slice(0, 4).map(example => (
                        <div
                          key={`${example.form}-${example.sentence}`}
                          className='rounded-2xl bg-primary/40 p-4'
                        >
                          <p className='font-bold text-yellow'>{example.form}</p>
                          <p className='mt-2'>{example.sentence}</p>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className='rounded-2xl bg-secondary/70 p-4'>
                  <h3 className='text-lg text-white mb-3'>How Are These Words Related?</h3>
                  <p className='mb-3 text-sm text-accent'>{relatedWordsHint}</p>
                  <div className='space-y-3'>
                    {writeInRelatedWords.length === 0 ? (
                      <p className='text-accent'>No related words are ready in this lexicon yet.</p>
                    ) : (
                      writeInRelatedWords.map(entry => (
                        <div
                          key={entry.word}
                          className='rounded-2xl bg-primary/40 p-4 text-accent'
                        >
                          {entry.isLinkable ? (
                            <Link
                              href={buildWordHrefWithContext(
                                acId,
                                wordDetail.selectionType,
                                wordDetail.selectionSlug,
                                entry.word,
                                phonemeBreadcrumbSelection
                              )}
                              className='text-yellow hover:text-orange'
                            >
                              {entry.word}
                            </Link>
                          ) : (
                            <span className='text-yellow'>{entry.word}</span>
                          )}
                          <div className='mt-3 border-b border-dashed border-accent/40' />
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {worksheetState === 'generated' ? (
                  <section className='rounded-2xl bg-secondary/70 p-4'>
                    <h3 className='text-lg text-white mb-3'>Similar Rimes</h3>
                    <div className='space-y-3'>
                      {writeInRimeWords.length === 0 ? (
                        <p className='text-accent'>No close rime matches are ready in this lexicon yet.</p>
                      ) : (
                        writeInRimeWords.map(entry => (
                          <div
                            key={entry.normalizedWord}
                            className='rounded-2xl bg-primary/40 p-4 text-accent'
                          >
                            <Link
                              href={buildWordHrefWithContext(
                                acId,
                                wordDetail.selectionType,
                                wordDetail.selectionSlug,
                                entry.word,
                                phonemeBreadcrumbSelection
                              )}
                              className='text-yellow hover:text-orange'
                            >
                              {entry.word}
                            </Link>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : null}
          </article>
        </div>

        <aside className='no-print space-y-6 self-start xl:sticky xl:top-24'>
          <div className='rounded-3xl bg-white p-6 shadow-xl text-slate-900'>
            <button
              type='button'
              onClick={() => setIsGeneratorOpen(currentState => !currentState)}
              className='flex w-full items-center justify-between gap-4 text-left'
              aria-expanded={isGeneratorOpen}
            >
              <div>
                <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
                  Generate Worksheet
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${getStateBadgeClass(
                    worksheetState
                  )}`}
                >
                  {getStateLabel(worksheetState)}
                </span>
                <span className='text-xl leading-none text-slate-500'>
                  {isGeneratorOpen ? '-' : '+'}
                </span>
              </div>
            </button>

            {isGeneratorOpen ? (
              <div className='mt-4 space-y-4'>
                <p className='text-sm text-slate-600'>
                  Add an OpenAI API key to generate a richer worksheet with a
                  child-friendly definition, stronger morphology support, related-word
                  suggestions, and a coloring-page image.
                </p>
                <p className='text-sm text-slate-600'>
                  Create a secret key in{' '}
                  <a
                    href='https://platform.openai.com/api-keys'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary underline'
                  >
                    OpenAI API keys
                  </a>
                  . If you want a one-time charge instead of leaving recurring usage
                  open, you can pre-purchase a small API balance using{' '}
                  <a
                    href='https://help.openai.com/en/articles/8264778-what-is-prepaid-billing'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary underline'
                  >
                    OpenAI prepaid billing
                  </a>
                  . The key is only used to generate worksheet content for this word.
                  We do not profit from your API key, and we do not store it in our
                  database. If your browser password manager offers to remember it,
                  that stays in your browser.
                </p>
                <p className='text-sm text-slate-500'>
                  For the cleanest PDF, save as PDF and turn off browser headers and
                  footers in the print dialog.
                </p>

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
                  <label className='block'>
                    <span className='block text-sm font-medium text-slate-700 mb-2'>
                      OpenAI API key
                    </span>
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

                  <div className='flex flex-wrap gap-3'>
                    <button
                      type='submit'
                      disabled={isGenerating}
                      className='rounded-full bg-primary px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60'
                    >
                      {isGenerating ? 'Generating...' : 'Generate Worksheet'}
                    </button>
                    <button
                      type='button'
                      onClick={() => window.print()}
                      className='rounded-full bg-slate-200 px-4 py-2 font-bold text-slate-900'
                    >
                      Print Worksheet
                    </button>
                  </div>
                </form>

                {generationError ? (
                  <p className='text-sm text-red-700'>{generationError}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className='rounded-3xl bg-primary/50 border border-accent/20 p-6 shadow-lg'>
            <h2 className='text-2xl text-yellow mb-4'>Checklist</h2>
            <ol className='space-y-3'>
              {checklistItems.map((checklistItem, index) => (
                <li key={checklistItem}>
                  <label className='flex w-full cursor-pointer items-start gap-3 rounded-2xl bg-secondary/70 px-4 py-3 text-accent'>
                    <input
                      type='checkbox'
                      checked={checkedItems[index]}
                      onChange={() => toggleItem(index)}
                      className='mt-1 h-4 w-4'
                    />
                    <span>{checklistItem}</span>
                  </label>
                </li>
              ))}
            </ol>

            <div className='mt-6 flex flex-wrap gap-3'>
              <button
                type='button'
                onClick={handleCompleteOnline}
                disabled={isSubmitting}
                className='rounded-full bg-yellow px-4 py-2 font-bold text-primary disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isSubmitting ? 'Saving...' : 'Complete Online'}
              </button>
            </div>

            {completionError ? (
              <p className='mt-4 text-sm text-red-300'>{completionError}</p>
            ) : null}
            {completionSuccess ? (
              <p className='mt-4 text-sm text-green-300'>{completionSuccess}</p>
            ) : null}
          </div>
        </aside>
      </div>

      {isContinueModalOpen ? (
        <div className='no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4'>
          <div className='w-full max-w-lg rounded-3xl bg-white p-6 text-slate-900 shadow-2xl'>
            <p className='text-sm uppercase tracking-[0.3em] text-slate-500'>
              Continue Working
            </p>
            <h3 className='mt-3 text-2xl font-bold text-slate-900'>
              Reopen {wordDetail.word}?
            </h3>
            <p className='mt-4 text-sm leading-6 text-slate-700'>
              This word is currently complete. If you continue working on it, the
              checklist will need to be finished again before it is complete.
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
                <img
                  src={qrCodeUrl}
                  alt={`QR code for ${wordDetail.word}`}
                  className='worksheet-qr'
                />
                <p className='worksheet-qr-caption'>
                  Scan to complete checklist online
                </p>
              </div>
            </div>

            <div
              className={`worksheet-front-body ${
                worksheetState === 'generated'
                  ? 'worksheet-front-body-generated'
                  : 'worksheet-front-body-ungenerated'
              }`}
            >
              <div className='worksheet-front-layout'>
                <section className='worksheet-card'>
                  <p className='worksheet-card-title'>Checklist</p>
                  <ol className='worksheet-checklist'>
                    {checklistItems.map(checklistItem => (
                      <li key={checklistItem} className='worksheet-check-item'>
                        <span className='worksheet-print-checkbox' />
                        <span>{checklistItem}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <div className='worksheet-front-sidebar'>
                  <section className='worksheet-card'>
                    <p className='worksheet-card-title'>Word Building</p>
                    {shouldAskToValidateWordBuilding ? (
                      <p className='worksheet-small-copy'>{wordBuildingReviewPrompt}</p>
                    ) : null}
                    {morphemeEntries.length === 0 ? (
                      <p className='worksheet-small-copy'>
                        Keep this as a whole-word practice target.
                      </p>
                    ) : (
                      <ul className='worksheet-detail-list'>
                        {morphemeEntries.slice(0, 4).map(entry => (
                          <li key={`${entry.form}-${entry.sentence}`}>
                            <strong>{entry.form}</strong>: {entry.sentence}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section className='worksheet-card'>
                    <p className='worksheet-card-title'>How Are These Words Related?</p>
                    <p className='worksheet-small-copy'>{relatedWordsHint}</p>
                    {writeInRelatedWords.length === 0 ? (
                      <p className='worksheet-small-copy'>No related words are ready yet.</p>
                    ) : (
                      <ul className='worksheet-write-in-list'>
                        {writeInRelatedWords.map(entry => (
                          <li key={entry.word} className='worksheet-write-in-item'>
                            <strong>{entry.word}</strong>
                            <span className='worksheet-write-line' />
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  {worksheetState === 'generated' ? (
                    <section className='worksheet-card'>
                      <p className='worksheet-card-title'>Similar Rimes</p>
                      {writeInRimeWords.length === 0 ? (
                        <p className='worksheet-small-copy'>
                          No close rime matches are ready in this lexicon yet.
                        </p>
                      ) : (
                        <ul className='worksheet-detail-list'>
                          {writeInRimeWords.map(entry => (
                            <li key={entry.normalizedWord}>{entry.word}</li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ) : null}
                </div>
              </div>

              {worksheetState === 'ungenerated' ? (
                <section className='worksheet-inline-draw'>
                  <div className='worksheet-inline-draw-copy'>
                    <p className='worksheet-card-title'>Draw Your Own Picture</p>
                    <p className='worksheet-back-prompt'>{wordDetail.drawPrompt}</p>
                    <p className='worksheet-small-copy'>
                      Use the definition above to help the child decide what to draw.
                    </p>
                  </div>

                  <div className='worksheet-inline-draw-box'>
                    <div className='worksheet-draw-placeholder' />
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </article>

        {worksheetState === 'generated' ? (
          <article className='worksheet-page bg-white text-slate-900'>
            <div className='worksheet-frame'>
              <div className='worksheet-header worksheet-header-no-qr'>
                <div className='min-w-0'>
                  <p className='worksheet-kicker'>Generated Coloring Page</p>
                  <h3 className='worksheet-word'>{wordDetail.word}</h3>
                  <p className='worksheet-definition'>{printableDefinition}</p>
                </div>
              </div>

              <div className='worksheet-back-copy'>
                <p className='worksheet-card-title'>Color Or Trace</p>
                <p className='worksheet-back-prompt'>
                  {`Color the picture for "${wordDetail.word}" and say the word again while you work.`}
                </p>
              </div>

              <div className='worksheet-draw-box'>
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
            </div>
          </article>
        ) : null}
      </div>
    </>
  );
}
