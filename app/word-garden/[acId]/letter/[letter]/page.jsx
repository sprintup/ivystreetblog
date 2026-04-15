import Link from 'next/link';
import { notFound } from 'next/navigation';
import LevelTwoIntro from '../../../LevelTwoIntro';
import WordCloud from '../../../WordCloud';
import { getAnonymousChildOrNotFound } from '../../../wordGardenServer';
import {
  calculateAgeInMonths,
  getLetterDifficultyLabel,
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
  const ageInMonths = calculateAgeInMonths(anonymousChild.birthYearMonth);
  const wordCloudWords = getLetterWordCloudWords(
    letter,
    anonymousChild.practicedWords
  );

  return (
    <section className='space-y-8 pb-24 md:pb-32'>
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

      <LevelTwoIntro topNote={`Expressive difficulty: ${getLetterDifficultyLabel(letter)}`} />

      <WordCloud
        acId={params.acId}
        selectionType='letter'
        selectionSlug={letter}
        words={wordCloudWords}
        ageInMonths={ageInMonths}
        emptySelectionMessage='No words matched this letter yet.'
      />
    </section>
  );
}
