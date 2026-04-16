import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import TrackWordVisit from '../../../../TrackWordVisit';
import WorksheetChecklist from '../../../../WorksheetChecklist';
import { getAnonymousChildOrNotFound } from '../../../../wordGardenServer';
import {
  calculateAgeInMonths,
  decodeWordParam,
  getLetterScopedPhonemeSlugs,
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

function renderHighlightedPhonemeWord(wordDetail, phonemeSlug) {
  const selectedSymbols = new Set(
    String(phonemeSlug || '')
      .split('__')
      .filter(Boolean)
  );
  const getRowPhonemeSlugs = row =>
    Array.isArray(row?.phonemeSlugs)
      ? row.phonemeSlugs
      : row?.phonemeSlug
        ? [row.phonemeSlug]
        : [];
  const getRowSupportedPhonemeSlugs = row =>
    Array.isArray(row?.supportedPhonemeSlugs)
      ? row.supportedPhonemeSlugs
      : getRowPhonemeSlugs(row);
  const exactHighlightedIndexes = wordDetail.soundMapRows.reduce((indexes, row, index) => {
    if (getRowPhonemeSlugs(row).some(symbol => selectedSymbols.has(symbol))) {
      indexes.push(index);
    }

    return indexes;
  }, []);
  const highlightedIndexes = new Set(
    exactHighlightedIndexes.length > 0
      ? exactHighlightedIndexes
      : wordDetail.soundMapRows.reduce((indexes, row, index) => {
          if (getRowSupportedPhonemeSlugs(row).some(symbol => selectedSymbols.has(symbol))) {
            indexes.push(index);
          }

          return indexes;
        }, [])
  );
  const hasHighlightedSegment = highlightedIndexes.size > 0;

  if (!hasHighlightedSegment) {
    return <span className='text-white'>{wordDetail.word}</span>;
  }

  return wordDetail.soundMapRows.map((row, index) => (
    <span
      key={`${row.grapheme}-${index}-highlight`}
      className={highlightedIndexes.has(index) ? 'text-yellow' : 'text-white'}
    >
      {row.displayGrapheme || row.grapheme}
    </span>
  ));
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
    anonymousChild.practicedWords
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

      <div className='no-print rounded-[2rem] bg-secondary/80 border border-accent/20 p-8 shadow-xl'>
        <div className='flex flex-wrap items-start justify-between gap-6'>
          <div className='max-w-3xl'>
            <h1 className='text-5xl text-white'>{wordDetail.word}</h1>
            <p className='text-lg text-accent mt-4 leading-8'>
              {wordDetail.definitionTokens.map((token, index) =>
                token.isLinkable ? (
                  <a
                    key={`${token.text}-${index}`}
                    href={token.dictionaryUrl}
                    className='font-normal text-accent underline decoration-dotted underline-offset-4 decoration-accent/70 hover:text-yellow hover:decoration-yellow'
                  >
                    {token.text}
                  </a>
                ) : (
                  <span key={`${token.text}-${index}`}>{token.text}</span>
                )
              )}
            </p>
            <div className='mt-6 flex flex-wrap gap-3 text-sm text-accent'>
              <span className='rounded-full border border-accent/30 px-4 py-2'>
                {wordDetail.syllableCount} syllable{wordDetail.syllableCount === 1 ? '' : 's'}
              </span>
              <span className='rounded-full border border-accent/30 px-4 py-2'>
                {wordDetail.concreteness === 'abstract' ? 'Abstract word' : 'Concrete word'}
              </span>
            </div>
          </div>
          <div className='min-w-[260px] rounded-3xl bg-primary/70 px-5 py-4 text-sm text-accent'>
            <p className='text-[11px] uppercase tracking-[0.25em] text-accent'>
              Target Sound
            </p>
            <p className='mt-2 text-3xl font-semibold text-yellow'>
              {getTargetLabel(params.phonemeSlug)}
            </p>
            <p className='mt-4 text-[11px] uppercase tracking-[0.25em] text-accent'>
              Sound In Word
            </p>
            <p className='mt-2 text-4xl font-semibold tracking-[0.08em]'>
              {renderHighlightedPhonemeWord(wordDetail, params.phonemeSlug)}
            </p>
            {wordDetail.category ? (
              <p className='mt-4'>Category: {wordDetail.category}</p>
            ) : null}
          </div>
        </div>
      </div>

      <WorksheetChecklist
        acId={params.acId}
        autoCheckFromQr={searchParams?.autocheck === '1'}
        letterScopedPhonemeSlugs={letterScopedPhonemeSlugs}
        qrCodeUrl={qrCodeUrl}
        soundTableSelection={selectedLetter}
        unlockedArpabet={getUnlockedArpabetForMonths(ageInMonths)}
        wordDetail={wordDetail}
      />
    </section>
  );
}
