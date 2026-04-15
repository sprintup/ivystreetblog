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

export default function WordCloud({
  acId,
  selectionType,
  selectionSlug,
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
  const concreteCount = concreteWords.length;
  const abstractCount = abstractWords.length;
  const concreteLearnedCount = useMemo(
    () =>
      concreteWords.filter(wordEntry => (wordEntry.completedChecklistCount || 0) > 0)
        .length,
    [concreteWords]
  );
  const allConcreteWordsLearned = useMemo(
    () =>
      concreteWords.length === 0 ||
      concreteWords.every(wordEntry => (wordEntry.completedChecklistCount || 0) > 0),
    [concreteWords]
  );
  const [showConcrete, setShowConcrete] = useState(() => getDefaultConcrete());
  const [showAbstract, setShowAbstract] = useState(() => allConcreteWordsLearned);
  const [showCompleted, setShowCompleted] = useState(false);
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
    <div className='space-y-4 pb-24 md:pb-32'>
      <div className='rounded-3xl border border-accent/20 bg-primary/40 p-4'>
        <details className='mb-4 rounded-3xl border border-accent/20 bg-secondary/30 p-4 text-accent'>
          <summary className='cursor-pointer text-sm font-semibold uppercase tracking-[0.3em] text-yellow'>
            Word Cloud Notes
          </summary>
          <div className='mt-4 space-y-2 text-sm text-accent'>
            <p>
              Concrete words usually come first because they have tangible meanings
              children can often understand more easily.
            </p>
            <p>
              These words were chosen for their academic nature so they can support
              children as they move into school, where communication becomes more academic.
            </p>
            <p>
              Abstract words start unchecked until the concrete words in this set are
              learned, but you can turn them on whenever you want.
            </p>
            <p>
              Concrete learned: {concreteLearnedCount} / {concreteCount || 0}
            </p>
          </div>
        </details>
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
        {!allConcreteWordsLearned ? (
          <p className='mt-3 text-sm text-yellow'>
            Abstract words are still off by default here, but you can choose to turn
            them on before the concrete set is complete.
          </p>
        ) : null}
      </div>

      {filteredWords.length === 0 ? (
        <div className='rounded-3xl border border-dashed border-accent/30 bg-primary/40 p-8 text-accent'>
          No words match the current filter settings.
        </div>
      ) : (
        <div className='rounded-[2rem] border border-accent/20 bg-primary/40 p-6 shadow-lg md:p-10'>
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
                className={`no-underline font-bold text-yellow transition hover:text-orange ${wordEntry.sizeClass}`}
              >
                {wordEntry.word}
                {(wordEntry.completedChecklistCount || 0) > 0 ? (
                  <>
                    <span
                      className='ml-2 align-middle rounded-full bg-green-600/80 px-2 py-1 text-xs text-white'
                      title='Completed'
                      aria-label='Completed'
                    >
                      Done
                    </span>
                    {wordEntry.practiceCount > 0 ? (
                      <span className='ml-2 align-middle rounded-full bg-secondary/80 px-2 py-1 text-xs text-accent'>
                        x{wordEntry.practiceCount}
                      </span>
                    ) : null}
                  </>
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
