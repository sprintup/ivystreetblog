import Link from 'next/link';
import LevelTwoIntro from '../../../LevelTwoIntro';
import WordCloud from '../../../WordCloud';
import { getAnonymousChildOrNotFound } from '../../../wordGardenServer';
import {
  LETTER_GROUPS,
  calculateAgeInMonths,
  getPhonemeTimingLabel,
  getTargetLabel,
  getUnlockedArpabetForMonths,
  getValidSoundTableLetterForPhoneme,
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
  const selectedCategory = Array.isArray(searchParams?.category)
    ? searchParams.category[0]
    : searchParams?.category || '';
  const wordCloudWords = getWordCloudWords(
    params.phonemeSlug,
    ageInMonths,
    anonymousChild.practicedWords
  );
  const phonemeStatusNote = getUnlockedArpabetForMonths(ageInMonths).includes(
    params.phonemeSlug
  )
    ? 'Developmentally appropriate'
    : 'Advanced for this age';
  const phonemeStatusNoteTone =
    phonemeStatusNote === 'Developmentally appropriate' ? 'ready' : 'advanced';
  const isPhonemeUnlocked = getUnlockedArpabetForMonths(ageInMonths).includes(
    params.phonemeSlug
  );
  const relatedPills = LETTER_GROUPS.filter(group =>
    (group.phonemes || []).some(
      phoneme => phoneme.phonemeSlug === params.phonemeSlug
    )
  ).map(group => ({
    key: `${params.phonemeSlug}-${group.letter}`,
    text: group.letter,
    href: `/word-garden/${params.acId}/letter/${group.letter}`,
    isUnlocked: isPhonemeUnlocked,
  }));
  const soundTableSelectionLabel = getValidSoundTableLetterForPhoneme(
    params.phonemeSlug,
    searchParams?.letter,
    ageInMonths,
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
        {soundTableSelectionLabel ? (
          <>
            <span>/</span>
            <span>{soundTableSelectionLabel}</span>
          </>
        ) : null}
        <span>/</span>
        <span>{getTargetLabel(params.phonemeSlug)}</span>
      </div>

      <LevelTwoIntro
        acId={params.acId}
        relatedPills={relatedPills}
        selectionNote={getTargetLabel(params.phonemeSlug)}
        topNote={`Typically learned: ${getPhonemeTimingLabel(params.phonemeSlug)}`}
        statusNote={phonemeStatusNote}
        statusNoteTone={phonemeStatusNoteTone}
      />

      <WordCloud
        key={`phoneme-${params.phonemeSlug}-${soundTableSelectionLabel || 'all'}-${
          selectedCategory || 'All'
        }`}
        acId={params.acId}
        defaultCategory={selectedCategory || 'All'}
        hasCurrentWord={Boolean(anonymousChild.currentChecklistWord)}
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
