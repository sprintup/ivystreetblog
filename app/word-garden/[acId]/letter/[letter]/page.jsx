import Link from 'next/link';
import { notFound } from 'next/navigation';
import LevelTwoIntro from '../../../LevelTwoIntro';
import WordCloud from '../../../WordCloud';
import { getAnonymousChildOrNotFound } from '../../../wordGardenServer';
import {
  LETTER_GROUPS,
  calculateAgeInMonths,
  getLetterDifficultyLabel,
  getLetterDifficultyRank,
  getLetterLabel,
  getTargetLabel,
  getUnlockedArpabetForMonths,
  getLetterWordMatchMode,
  getLetterWordCloudWords,
} from '@/utils/wordGardenData';

function normalizeLetter(letter) {
  return String(letter || '').trim().charAt(0).toUpperCase();
}

export default async function WordGardenLetterLevelTwoPage({
  params,
  searchParams,
}) {
  const letter = normalizeLetter(params.letter);

  if (!/^[A-Z]$/.test(letter)) {
    notFound();
  }

  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}/letter/${letter}`
  );
  const ageInMonths = calculateAgeInMonths(anonymousChild.birthYearMonth);
  const selectedCategory = Array.isArray(searchParams?.category)
    ? searchParams.category[0]
    : searchParams?.category || '';
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
  const expressiveDifficulty = getLetterDifficultyLabel(letter);
  const expressiveDifficultyRank = getLetterDifficultyRank(letter);
  const expressiveDifficultyTone =
    expressiveDifficultyRank === 1
      ? 'ready'
      : expressiveDifficultyRank === 2
        ? 'advanced'
        : 'hard';
  const unlockedPhonemeSet = new Set(getUnlockedArpabetForMonths(ageInMonths));
  const relatedPills = (LETTER_GROUPS.find(group => group.letter === letter)?.phonemes || [])
    .filter(
      (phoneme, index, phonemes) =>
        phoneme?.phonemeSlug &&
        phonemes.findIndex(
          candidate => candidate.phonemeSlug === phoneme.phonemeSlug
        ) === index
    )
    .map(phoneme => ({
      key: `${letter}-${phoneme.phonemeSlug}`,
      text: getTargetLabel(phoneme.phonemeSlug),
      href: `/word-garden/${params.acId}/phoneme/${phoneme.phonemeSlug}?letter=${letter}`,
      isUnlocked: String(phoneme.phonemeSlug || '')
        .split('__')
        .filter(Boolean)
        .every(symbol => unlockedPhonemeSet.has(symbol)),
    }));

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
        acId={params.acId}
        relatedPills={relatedPills}
        selectionNote={getLetterLabel(letter)}
        statusNote={expressiveDifficulty}
        statusNoteTone={expressiveDifficultyTone}
      />

      <WordCloud
        key={`letter-${letter}-${selectedCategory || 'All'}`}
        acId={params.acId}
        defaultCategory={selectedCategory || 'All'}
        defaultShowAbstract={shouldShowAbstractByDefault}
        hasCurrentWord={Boolean(anonymousChild.currentChecklistWord)}
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
