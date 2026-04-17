import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import TrackWordVisit from '../../../../TrackWordVisit';
import WordFocusHeader from '../../../../WordFocusHeader';
import WorksheetChecklist from '../../../../WorksheetChecklist';
import { getAnonymousChildOrNotFound } from '../../../../wordGardenServer';
import {
  buildWordGardenWordPath,
  calculateAgeInMonths,
  decodeWordParam,
  getLetterScopedPhonemeSlugs,
  getRecommendedWordTarget,
  getStartedChecklists,
  getTargetLabel,
  getValidSoundTableLetterForPhoneme,
  getWordDetail,
  getUnlockedArpabetForMonths,
} from '@/utils/wordGardenData';

function normalizeSelectedLetter(value) {
  return String(value || '')
    .trim()
    .charAt(0)
    .toUpperCase();
}

function getSelectedLetterFromReferer(headerStore) {
  const referer = headerStore.get('referer');

  if (!referer) {
    return '';
  }

  try {
    const refererUrl = new URL(referer);
    return normalizeSelectedLetter(refererUrl.searchParams.get('letter'));
  } catch {
    return '';
  }
}

function getCurrentPageUrl(
  acId,
  phonemeSlug,
  encodedWord,
  selectedLetter,
  autoCheck = false
) {
  const headerStore = headers();
  const protocol = headerStore.get('x-forwarded-proto') || 'http';
  const host =
    headerStore.get('x-forwarded-host') || headerStore.get('host') || 'localhost:3000';

  const queryParams = new URLSearchParams();

  if (selectedLetter) {
    queryParams.set('letter', selectedLetter);
  }

  if (autoCheck) {
    queryParams.set('autocheck', '1');
  }

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

  return `${protocol}://${host}/word-garden/${acId}/phoneme/${phonemeSlug}/${encodedWord}${query}`;
}

export default async function WordGardenLevelThreePage({ params, searchParams }) {
  const headerStore = headers();
  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}/phoneme/${params.phonemeSlug}/${params.word}`
  );
  const decodedWord = decodeWordParam(params.word);
  const ageInMonths = calculateAgeInMonths(anonymousChild.birthYearMonth);
  const wordDetail = getWordDetail(
    params.phonemeSlug,
    decodedWord,
    null,
    anonymousChild.practicedWords,
    anonymousChild.currentChecklistWord
  );

  if (!wordDetail) {
    notFound();
  }
  const requestedSelectedLetter =
    normalizeSelectedLetter(searchParams?.letter) ||
    getSelectedLetterFromReferer(headerStore);
  const selectedLetter = getValidSoundTableLetterForPhoneme(
    params.phonemeSlug,
    requestedSelectedLetter,
    ageInMonths,
    anonymousChild.practicedWords
  );
  const letterScopedPhonemeSlugs = selectedLetter
    ? getLetterScopedPhonemeSlugs(
        ageInMonths,
        anonymousChild.practicedWords,
        selectedLetter
      )
    : [];
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

  const currentPageUrl = getCurrentPageUrl(
    params.acId,
    params.phonemeSlug,
    params.word,
    selectedLetter,
    true
  );
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
        {selectedLetter ? (
          <>
            <span>/</span>
            <span>{selectedLetter}</span>
          </>
        ) : null}
        <span>/</span>
        <Link
          href={`/word-garden/${params.acId}/phoneme/${params.phonemeSlug}${selectedLetter ? `?letter=${encodeURIComponent(selectedLetter)}` : ''}`}
          className='text-yellow hover:text-orange'
        >
          {getTargetLabel(params.phonemeSlug)}
        </Link>
        <span>/</span>
        <span>{wordDetail.word}</span>
      </div>

      <WordFocusHeader
        acId={params.acId}
        focusLetter={selectedLetter}
        unlockedArpabet={getUnlockedArpabetForMonths(ageInMonths)}
        wordDetail={wordDetail}
      />

      <WorksheetChecklist
        acId={params.acId}
        autoCheckFromQr={searchParams?.autocheck === '1'}
        hasCurrentWord={Boolean(anonymousChild.currentChecklistWord)}
        openChecklistCount={openChecklistCount}
        letterScopedPhonemeSlugs={letterScopedPhonemeSlugs}
        qrCodeUrl={qrCodeUrl}
        recommendHref={recommendHref}
        soundTableSelection={selectedLetter}
        unlockedArpabet={getUnlockedArpabetForMonths(ageInMonths)}
        wordDetail={wordDetail}
      />
    </section>
  );
}
