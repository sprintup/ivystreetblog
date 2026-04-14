'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

function getDefaultConcrete(ageInMonths) {
  return true;
}

function getDefaultAbstract(ageInMonths) {
  if (typeof ageInMonths !== 'number') {
    return false;
  }

  return ageInMonths >= 36;
}

function buildWordHref(
  acId,
  selectionType,
  selectionSlug,
  word,
  soundTableSelection = ''
) {
  const encodedWord = encodeURIComponent(word);

  if (selectionType === 'letter') {
    return `/word-garden/${acId}/letter/${selectionSlug}/${encodedWord}`;
  }

  return `/word-garden/${acId}/phoneme/${selectionSlug}/${encodedWord}${
    soundTableSelection
      ? `?letter=${encodeURIComponent(soundTableSelection)}`
      : ''
  }`;
}

export default function WordCloud({
  acId,
  selectionType,
  selectionSlug,
  words,
  ageInMonths = null,
  soundTableSelection = '',
  emptySelectionMessage = 'No words matched this selection yet.',
}) {
  const [showConcrete, setShowConcrete] = useState(() =>
    getDefaultConcrete(ageInMonths)
  );
  const [showAbstract, setShowAbstract] = useState(() =>
    getDefaultAbstract(ageInMonths)
  );
  const [showCompleted, setShowCompleted] = useState(false);

  const concreteCount = useMemo(
    () => words.filter(wordEntry => wordEntry.concreteness === 'concrete').length,
    [words]
  );
  const abstractCount = useMemo(
    () => words.filter(wordEntry => wordEntry.concreteness === 'abstract').length,
    [words]
  );
  const completedCount = useMemo(
    () => words.filter(wordEntry => (wordEntry.completedChecklistCount || 0) > 0).length,
    [words]
  );
  const filteredWords = useMemo(
    () =>
      words.filter(wordEntry => {
        const matchesConcreteness =
          wordEntry.concreteness === 'abstract' ? showAbstract : showConcrete;
        const isCompleted = (wordEntry.completedChecklistCount || 0) > 0;
        const matchesCompletion = showCompleted || !isCompleted;

        return matchesConcreteness && matchesCompletion;
      }),
    [showAbstract, showCompleted, showConcrete, words]
  );

  if (words.length === 0) {
    return (
      <div className='rounded-3xl border border-dashed border-accent/30 bg-primary/40 p-8 text-accent'>
        {emptySelectionMessage}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='rounded-3xl border border-accent/20 bg-primary/40 p-4'>
        <p className='mb-3 text-sm text-accent'>
          Abstract words are best for ages 3+.
        </p>
        <div className='flex flex-wrap items-center gap-4'>
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
        </div>
      </div>

      {filteredWords.length === 0 ? (
        <div className='rounded-3xl border border-dashed border-accent/30 bg-primary/40 p-8 text-accent'>
          No words match the current filter settings.
        </div>
      ) : (
        <div className='rounded-[2rem] bg-primary/40 border border-accent/20 p-6 md:p-10 shadow-lg'>
          <div className='flex flex-wrap items-center gap-4 leading-loose'>
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
                className={`no-underline font-bold text-yellow hover:text-orange transition ${wordEntry.sizeClass}`}
              >
                {wordEntry.word}
                {(wordEntry.completedChecklistCount || 0) > 0 ? (
                  <span
                    className='ml-2 align-middle rounded-full bg-green-600/80 px-2 py-1 text-xs text-white'
                    title='Completed'
                    aria-label='Completed'
                  >
                    ✓
                  </span>
                ) : wordEntry.practiceCount > 0 ? (
                  <span className='ml-2 align-middle rounded-full bg-secondary/80 px-2 py-1 text-xs text-accent'>
                    x{wordEntry.practiceCount}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
