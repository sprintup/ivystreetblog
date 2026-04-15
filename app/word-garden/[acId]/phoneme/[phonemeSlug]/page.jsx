import Link from 'next/link';
import LevelTwoIntro from '../../../LevelTwoIntro';
import WordCloud from '../../../WordCloud';
import { getAnonymousChildOrNotFound } from '../../../wordGardenServer';
import {
  calculateAgeInMonths,
  getTargetLabel,
  getWordCloudWords,
} from '@/utils/wordGardenData';

export default async function WordGardenLevelTwoPage({
  params,
  searchParams,
}) {
  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}/phoneme/${params.phonemeSlug}`
  );
  const ageInMonths = calculateAgeInMonths(anonymousChild.birthYearMonth);
  const wordCloudWords = getWordCloudWords(
    params.phonemeSlug,
    ageInMonths,
    anonymousChild.practicedWords
  );
  const selectedLetter = String(searchParams?.letter || '')
    .trim()
    .charAt(0)
    .toUpperCase();
  const soundTableSelectionLabel = selectedLetter || '';

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
        {soundTableSelectionLabel ? (
          <>
            <span>/</span>
            <span>{soundTableSelectionLabel}</span>
          </>
        ) : null}
        <span>/</span>
        <span>{getTargetLabel(params.phonemeSlug)}</span>
      </div>

      <LevelTwoIntro />

      <WordCloud
        acId={params.acId}
        selectionType='phoneme'
        selectionSlug={params.phonemeSlug}
        words={wordCloudWords}
        ageInMonths={ageInMonths}
        soundTableSelection={soundTableSelectionLabel}
        emptySelectionMessage='No words matched this phoneme yet.'
      />
    </section>
  );
}
