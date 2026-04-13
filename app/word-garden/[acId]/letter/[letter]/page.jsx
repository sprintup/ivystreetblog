import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAnonymousChildOrNotFound } from '../../../wordGardenServer';
import {
  getLetterLabel,
  getLetterWordCloudWords,
} from '@/utils/wordGardenData';

function normalizeLetter(letter) {
  return String(letter || '').trim().charAt(0).toUpperCase();
}

export default async function WordGardenLetterLevelTwoPage({ params }) {
  const letter = normalizeLetter(params.letter);

  if (!/^[A-Z]$/.test(letter)) {
    notFound();
  }

  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}/letter/${letter}`
  );
  const wordCloudWords = getLetterWordCloudWords(
    letter,
    anonymousChild.practicedWords
  );

  return (
    <section className='space-y-8'>
      <div className='flex flex-wrap items-center gap-3 text-sm text-accent'>
        <Link href='/word-garden' className='text-yellow hover:text-orange'>
          Word Garden
        </Link>
        <span>/</span>
        <Link
          href={`/word-garden/${params.acId}`}
          className='text-yellow hover:text-orange'
        >
          Sound Table
        </Link>
        <span>/</span>
        <span>{getLetterLabel(letter)}</span>
      </div>

      <div className='rounded-[2rem] bg-secondary/80 border border-accent/20 p-8 shadow-xl'>
        <p className='text-sm uppercase tracking-[0.35em] text-yellow mb-3'>
          Level 2
        </p>
        <h1 className='text-4xl text-white mb-3'>Word Cloud For {letter}</h1>
        <p className='text-accent max-w-3xl'>
          These words begin with the letter {letter}. Words you have already
          clicked shrink a little to make room for less-practiced choices.
        </p>
      </div>

      {wordCloudWords.length === 0 ? (
        <div className='rounded-3xl border border-dashed border-accent/30 bg-primary/40 p-8 text-accent'>
          No words matched this letter yet.
        </div>
      ) : (
        <div className='rounded-[2rem] bg-primary/40 border border-accent/20 p-6 md:p-10 shadow-lg'>
          <div className='flex flex-wrap items-center gap-4 leading-loose'>
            {wordCloudWords.map(wordEntry => (
              <Link
                key={wordEntry.normalizedWord}
                href={`/word-garden/${params.acId}/letter/${letter}/${encodeURIComponent(
                  wordEntry.word
                )}`}
                className={`no-underline font-bold text-yellow hover:text-orange transition ${wordEntry.sizeClass}`}
              >
                {wordEntry.word}
                {wordEntry.practiceCount > 0 ? (
                  <span className='ml-2 align-middle rounded-full bg-secondary/80 px-2 py-1 text-xs text-accent'>
                    x{wordEntry.practiceCount}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
