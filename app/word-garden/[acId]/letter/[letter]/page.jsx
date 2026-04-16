import Link from 'next/link';
import { notFound } from 'next/navigation';
import LevelTwoIntro from '../../../LevelTwoIntro';
import WordCloud from '../../../WordCloud';
import { getAnonymousChildOrNotFound } from '../../../wordGardenServer';
import {
  calculateAgeInMonths,
  getLetterDifficultyLabel,
  getLetterLabel,
  getLetterWordMatchMode,
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
  const letterWordMatchMode = getLetterWordMatchMode(
    letter,
    anonymousChild.practicedWords
  );
  const wordCloudWords = getLetterWordCloudWords(
    letter,
    anonymousChild.practicedWords
  );
  const shouldShowAbstractByDefault =
    letterWordMatchMode === 'augmented'
      ? wordCloudWords.some(
          wordEntry =>
            wordEntry.letterSelectionMatchMode === 'startsWith' &&
            wordEntry.concreteness === 'abstract'
        )
      : undefined;

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

      <LevelTwoIntro
        selectionNote={getLetterLabel(letter)}
        topNote={`Expressive difficulty: ${getLetterDifficultyLabel(letter)}`}
      />

      <WordCloud
        acId={params.acId}
        defaultShowAbstract={shouldShowAbstractByDefault}
        selectionType='letter'
        selectionSlug={letter}
        selectionMessage={
          letterWordMatchMode === 'embedded'
            ? "The word list doesn't include any words that begin with this letter, but here are words with the letter embedded inside."
            : letterWordMatchMode === 'augmented'
              ? "The word list only includes a few words that begin with this letter, so it is augmented here with words that have the letter embedded inside."
            : ''
        }
        words={wordCloudWords}
        ageInMonths={ageInMonths}
        emptySelectionMessage='No words matched this letter yet.'
      />
    </section>
  );
}
