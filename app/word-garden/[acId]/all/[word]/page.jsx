import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import TrackWordVisit from '../../../TrackWordVisit';
import WordFocusHeader from '../../../WordFocusHeader';
import WorksheetChecklist from '../../../WorksheetChecklist';
import { getAnonymousChildOrNotFound } from '../../../wordGardenServer';
import {
  buildWordGardenWordPath,
  calculateAgeInMonths,
  decodeWordParam,
  getRecommendedWordTarget,
  getStartedChecklists,
  getUnlockedArpabetForMonths,
  getWordDetailForSelection,
} from '@/utils/wordGardenData';

function getCurrentPageUrl(acId, encodedWord, autoCheck = false) {
  const headerStore = headers();
  const protocol = headerStore.get('x-forwarded-proto') || 'http';
  const host =
    headerStore.get('x-forwarded-host') || headerStore.get('host') || 'localhost:3000';

  const query = autoCheck ? '?autocheck=1' : '';

  return `${protocol}://${host}/word-garden/${acId}/all/${encodedWord}${query}`;
}

export default async function WordGardenAllWordsDetailPage({ params, searchParams }) {
  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}/all/${params.word}`
  );
  const decodedWord = decodeWordParam(params.word);
  const ageInMonths = calculateAgeInMonths(anonymousChild.birthYearMonth);
  const wordDetail = getWordDetailForSelection(
    'all',
    'all',
    decodedWord,
    anonymousChild.practicedWords,
    anonymousChild.currentChecklistWord
  );

  if (!wordDetail) {
    notFound();
  }

  const recommendedTarget = getRecommendedWordTarget(
    ageInMonths,
    anonymousChild.practicedWords
  );
  const recommendHref = recommendedTarget
    ? buildWordGardenWordPath(
        params.acId,
        recommendedTarget.selectionType,
        recommendedTarget.selectionSlug,
        recommendedTarget.word,
        recommendedTarget.selectionLetter
      )
    : '';
  const openChecklistCount = getStartedChecklists(
    anonymousChild.practicedWords,
    anonymousChild.currentChecklistWord
  ).length;

  const currentPageUrl = getCurrentPageUrl(params.acId, params.word, true);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    currentPageUrl
  )}`;

  return (
    <section className='space-y-8'>
      <TrackWordVisit acId={params.acId} word={wordDetail.word} />

      <div className='no-print flex flex-wrap items-center gap-3 text-sm text-accent'>
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
        <Link
          href={`/word-garden/${params.acId}/all`}
          className='text-yellow hover:text-orange'
        >
          All words
        </Link>
        <span>/</span>
        <span>{wordDetail.word}</span>
      </div>

      <WordFocusHeader
        acId={params.acId}
        unlockedArpabet={getUnlockedArpabetForMonths(ageInMonths)}
        wordDetail={wordDetail}
      />

      <WorksheetChecklist
        acId={params.acId}
        autoCheckFromQr={searchParams?.autocheck === '1'}
        hasCurrentWord={Boolean(anonymousChild.currentChecklistWord)}
        openChecklistCount={openChecklistCount}
        qrCodeUrl={qrCodeUrl}
        recommendHref={recommendHref}
        unlockedArpabet={getUnlockedArpabetForMonths(ageInMonths)}
        wordDetail={wordDetail}
      />
    </section>
  );
}
