import Link from 'next/link';
import LevelTwoIntro from '../../LevelTwoIntro';
import WordCloud from '../../WordCloud';
import { getAnonymousChildOrNotFound } from '../../wordGardenServer';
import {
  calculateAgeInMonths,
  getSelectionWordCloudWords,
  getUnlockedWordCloudWords,
} from '@/utils/wordGardenData';

function getBooleanSearchParamValue(value, fallbackValue) {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  if (normalizedValue === '1' || normalizedValue === 'true') {
    return true;
  }

  if (normalizedValue === '0' || normalizedValue === 'false') {
    return false;
  }

  return fallbackValue;
}

export default async function WordGardenAllWordsPage({ params, searchParams }) {
  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}/all`
  );
  const ageInMonths = calculateAgeInMonths(anonymousChild.birthYearMonth);
  const showUnlockedOnly = searchParams?.view === 'unlocked';
  const selectedCategory = Array.isArray(searchParams?.category)
    ? searchParams.category[0]
    : searchParams?.category || '';
  const defaultShowConcrete = getBooleanSearchParamValue(
    searchParams?.concrete,
    true
  );
  const defaultShowAbstract = getBooleanSearchParamValue(
    searchParams?.abstract,
    showUnlockedOnly ? false : undefined
  );
  const defaultShowCompleted = getBooleanSearchParamValue(
    searchParams?.completed,
    !showUnlockedOnly
  );
  const wordCloudWords = showUnlockedOnly
    ? getUnlockedWordCloudWords(ageInMonths, anonymousChild.practicedWords)
    : getSelectionWordCloudWords('all', 'all', anonymousChild.practicedWords);

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
        <span>{showUnlockedOnly ? 'All unlocked words' : 'All words'}</span>
      </div>

      <LevelTwoIntro
        acId={params.acId}
        selectionNote={showUnlockedOnly ? 'All unlocked words' : 'All words'}
      />

      <WordCloud
        key={`all-words-${showUnlockedOnly ? 'unlocked' : 'all'}-${selectedCategory || 'All'}-${
          defaultShowConcrete ? 'concrete-on' : 'concrete-off'
        }-${defaultShowAbstract ? 'abstract-on' : 'abstract-off'}-${
          defaultShowCompleted ? 'completed-on' : 'completed-off'
        }`}
        acId={params.acId}
        defaultCategory={selectedCategory || 'All'}
        defaultShowConcrete={defaultShowConcrete}
        selectionType='all'
        selectionSlug='all'
        defaultShowAbstract={defaultShowAbstract}
        defaultShowCompleted={defaultShowCompleted}
        hasCurrentWord={Boolean(anonymousChild.currentChecklistWord)}
        words={wordCloudWords}
        ageInMonths={ageInMonths}
        emptySelectionMessage='No words are ready yet.'
      />
    </section>
  );
}
