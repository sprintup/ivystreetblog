import Link from 'next/link';
import LevelTwoIntro from '../../LevelTwoIntro';
import WordCloud from '../../WordCloud';
import { getAnonymousChildOrNotFound } from '../../wordGardenServer';
import {
  calculateAgeInMonths,
  getSelectionWordCloudWords,
} from '@/utils/wordGardenData';

export default async function WordGardenAllWordsPage({ params }) {
  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}/all`
  );
  const ageInMonths = calculateAgeInMonths(anonymousChild.birthYearMonth);
  const wordCloudWords = getSelectionWordCloudWords(
    'all',
    'all',
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
        <span>All words</span>
      </div>

      <LevelTwoIntro />

      <WordCloud
        acId={params.acId}
        selectionType='all'
        selectionSlug='all'
        words={wordCloudWords}
        ageInMonths={ageInMonths}
        emptySelectionMessage='No words are ready yet.'
      />
    </section>
  );
}
