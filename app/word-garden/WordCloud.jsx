'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

function getDefaultConcrete() {
  return true;
}

function buildWordHref(
  acId,
  selectionType,
  selectionSlug,
  word,
  soundTableSelection = ''
) {
  const encodedWord = encodeURIComponent(word);

  if (selectionType === 'all') {
    return `/word-garden/${acId}/all/${encodedWord}`;
  }

  if (selectionType === 'letter') {
    return `/word-garden/${acId}/letter/${selectionSlug}/${encodedWord}`;
  }

  return `/word-garden/${acId}/phoneme/${selectionSlug}/${encodedWord}${
    soundTableSelection
      ? `?letter=${encodeURIComponent(soundTableSelection)}`
      : ''
  }`;
}

function renderLetterWordLabel(wordEntry, selectionSlug) {
  const displayWord = String(wordEntry.word || '');
  const selectedLetter = String(selectionSlug || '')
    .trim()
    .charAt(0);

  if (!selectedLetter) {
    return <span className='text-white'>{displayWord}</span>;
  }

  const normalizedSelectedLetter = selectedLetter.toUpperCase();
  const hasMatch = Array.from(displayWord).some(
    character =>
      /[A-Za-z]/.test(character) &&
      character.toUpperCase() === normalizedSelectedLetter
  );

  if (!hasMatch) {
    return <span className='text-white'>{displayWord}</span>;
  }

  return Array.from(displayWord).map((character, index) => (
    <span
      key={`${wordEntry.normalizedWord}-${character}-${index}`}
      className={
        /[A-Za-z]/.test(character) &&
        character.toUpperCase() === normalizedSelectedLetter
          ? 'text-yellow'
          : 'text-white'
      }
    >
      {character}
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

function getHighlightedPhonemeRowIndexes(soundMapRows, selectionSlug) {
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

function renderPhonemeWordLabel(wordEntry, selectionSlug) {
  const soundMapRows = Array.isArray(wordEntry.soundMapRows) ? wordEntry.soundMapRows : [];
  const highlightedIndexes = getHighlightedPhonemeRowIndexes(
    soundMapRows,
    selectionSlug
  );
  const hasHighlightedSegment = highlightedIndexes.size > 0;

  if (!hasHighlightedSegment) {
    return <span className='text-white'>{wordEntry.word}</span>;
  }

  return soundMapRows.map((row, index) => (
    <span
      key={`${wordEntry.normalizedWord}-${row.displayGrapheme || row.grapheme}-${index}`}
      className={highlightedIndexes.has(index) ? 'text-yellow' : 'text-white'}
    >
      {row.displayGrapheme || row.grapheme}
    </span>
  ));
}

function renderWordLabel(wordEntry, selectionType, selectionSlug) {
  if (selectionType === 'letter') {
    return renderLetterWordLabel(wordEntry, selectionSlug);
  }

  if (selectionType === 'phoneme') {
    return renderPhonemeWordLabel(wordEntry, selectionSlug);
  }

  return <span className='text-yellow'>{wordEntry.word}</span>;
}

export default function WordCloud({
  acId,
  defaultCategory = 'All',
  defaultShowAbstract,
  defaultShowCompleted = false,
  selectionType,
  selectionSlug,
  selectionMessage = '',
  words,
  soundTableSelection = '',
  emptySelectionMessage = 'No words matched this selection yet.',
}) {
  const concreteWords = useMemo(
    () => words.filter(wordEntry => wordEntry.concreteness === 'concrete'),
    [words]
  );
  const abstractWords = useMemo(
    () => words.filter(wordEntry => wordEntry.concreteness === 'abstract'),
    [words]
  );
  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          words
            .map(wordEntry => String(wordEntry.category || '').trim())
            .filter(Boolean)
        )
      ).sort((leftCategory, rightCategory) =>
        leftCategory.localeCompare(rightCategory)
      ),
    [words]
  );
  const normalizedDefaultCategory = useMemo(
    () =>
      selectionType === 'all' && categoryOptions.includes(String(defaultCategory || '').trim())
        ? String(defaultCategory || '').trim()
        : 'All',
    [categoryOptions, defaultCategory, selectionType]
  );
  const allConcreteWordsLearned = useMemo(
    () =>
      concreteWords.length === 0 ||
      concreteWords.every(wordEntry => (wordEntry.completedChecklistCount || 0) > 0),
    [concreteWords]
  );
  const [showConcrete, setShowConcrete] = useState(() => getDefaultConcrete());
  const [showAbstract, setShowAbstract] = useState(() =>
    typeof defaultShowAbstract === 'boolean'
      ? defaultShowAbstract && allConcreteWordsLearned
      : allConcreteWordsLearned
  );
  const [showCompleted, setShowCompleted] = useState(() => defaultShowCompleted);
  const [selectedCategory, setSelectedCategory] = useState(() => normalizedDefaultCategory);

  const filteredWords = useMemo(
    () =>
      words.filter(wordEntry => {
        const matchesConcreteness =
          wordEntry.concreteness === 'abstract' ? showAbstract : showConcrete;
        const isCompleted = (wordEntry.completedChecklistCount || 0) > 0;
        const matchesCompletion = showCompleted || !isCompleted;
        const matchesCategory =
          selectionType !== 'all' ||
          selectedCategory === 'All' ||
          String(wordEntry.category || '').trim() === selectedCategory;

        return matchesConcreteness && matchesCompletion && matchesCategory;
      }),
    [selectedCategory, selectionType, showAbstract, showCompleted, showConcrete, words]
  );
  const categoryScopedWords = useMemo(
    () =>
      words.filter(wordEntry => {
        return (
          selectionType !== 'all' ||
          selectedCategory === 'All' ||
          String(wordEntry.category || '').trim() === selectedCategory
        );
      }),
    [selectedCategory, selectionType, words]
  );
  const concreteCount = useMemo(
    () =>
      categoryScopedWords.filter(wordEntry => {
        const isCompleted = (wordEntry.completedChecklistCount || 0) > 0;
        const matchesCompletion = showCompleted || !isCompleted;

        return wordEntry.concreteness === 'concrete' && matchesCompletion;
      }).length,
    [categoryScopedWords, showCompleted]
  );
  const abstractCount = useMemo(
    () =>
      categoryScopedWords.filter(wordEntry => {
        const isCompleted = (wordEntry.completedChecklistCount || 0) > 0;
        const matchesCompletion = showCompleted || !isCompleted;

        return wordEntry.concreteness === 'abstract' && matchesCompletion;
      }).length,
    [categoryScopedWords, showCompleted]
  );
  const completedCount = useMemo(
    () =>
      categoryScopedWords.filter(wordEntry => {
        const matchesConcreteness =
          wordEntry.concreteness === 'abstract' ? showAbstract : showConcrete;

        return matchesConcreteness && (wordEntry.completedChecklistCount || 0) > 0;
      }).length,
    [categoryScopedWords, showAbstract, showConcrete]
  );

  if (words.length === 0) {
    return (
      <div className='rounded-3xl border border-dashed border-accent/30 bg-primary/40 p-8 text-accent'>
        {emptySelectionMessage}
      </div>
    );
  }

  return (
    <div className='space-y-4 pb-24 md:pb-32'>
      <div className='rounded-[2rem] border border-accent/20 bg-primary/40 p-6 shadow-lg md:p-10'>
        {selectionMessage ? (
          <div className='mb-6 rounded-2xl border border-yellow/20 bg-yellow/10 p-4 text-sm leading-6 text-accent'>
            {selectionMessage}
          </div>
        ) : null}
        <div className='mb-6 flex flex-wrap items-center gap-4'>
          <label className='flex items-center gap-2 text-sm text-accent'>
            <input
              type='checkbox'
              checked={showConcrete}
              onChange={event => setShowConcrete(event.target.checked)}
              className='h-4 w-4'
            />
            Concrete ({concreteCount})
          </label>
          <label className='flex items-center gap-2 text-sm text-accent'>
            <input
              type='checkbox'
              checked={showAbstract}
              onChange={event => setShowAbstract(event.target.checked)}
              className='h-4 w-4'
            />
            Abstract ({abstractCount})
          </label>
          <label className='flex items-center gap-2 text-sm text-accent'>
            <input
              type='checkbox'
              checked={showCompleted}
              onChange={event => setShowCompleted(event.target.checked)}
              className='h-4 w-4'
            />
            Completed ({completedCount})
          </label>
          {selectionType === 'all' && categoryOptions.length > 0 ? (
            <label className='flex items-center gap-2 text-sm text-accent'>
              <span>Category</span>
              <select
                value={selectedCategory}
                onChange={event => setSelectedCategory(event.target.value)}
                className='rounded-full border border-accent/30 bg-secondary/80 px-3 py-2 text-sm text-accent'
              >
                <option value='All'>All</option>
                {categoryOptions.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        {filteredWords.length === 0 ? (
          <div className='rounded-3xl border border-dashed border-accent/30 bg-primary/20 p-8 text-accent'>
            No words match the current filter settings.
          </div>
        ) : (
          <div className='flex flex-wrap items-center gap-2 leading-loose'>
            {filteredWords.map(wordEntry => (
              <Link
                key={wordEntry.normalizedWord}
                href={buildWordHref(
                  acId,
                  selectionType,
                  selectionSlug,
                  wordEntry.word,
                  soundTableSelection
                )}
                className='inline-flex flex-wrap items-center gap-2 rounded-full border border-accent/20 bg-secondary/80 px-3 py-2 no-underline font-bold shadow-sm transition hover:border-yellow/40 hover:bg-secondary/90 hover:opacity-90'
              >
                <span className={`leading-none ${wordEntry.sizeClass}`}>
                  {renderWordLabel(wordEntry, selectionType, selectionSlug)}
                </span>
                {(wordEntry.completedChecklistCount || 0) > 0 ? (
                  <>
                    <span
                      className='align-middle rounded-full bg-green-600/80 px-2 py-1 text-xs text-white'
                      title='Completed'
                      aria-label='Completed'
                    >
                      &#10003;
                    </span>
                    {wordEntry.practiceCount > 0 ? (
                      <span className='align-middle rounded-full bg-primary/70 px-2 py-1 text-xs text-accent'>
                        x{wordEntry.practiceCount}
                      </span>
                    ) : null}
                  </>
                ) : wordEntry.practiceCount > 0 ? (
                  <span className='align-middle rounded-full bg-primary/70 px-2 py-1 text-xs text-accent'>
                    x{wordEntry.practiceCount}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
