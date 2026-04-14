import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import TrackWordVisit from '../../../../TrackWordVisit';
import WorksheetChecklist from '../../../../WorksheetChecklist';
import { getAnonymousChildOrNotFound } from '../../../../wordGardenServer';
import {
  decodeWordParam,
  getTargetLabel,
  getWordDetail,
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

function getCurrentPageUrl(acId, phonemeSlug, encodedWord, selectedLetter) {
  const headerStore = headers();
  const protocol = headerStore.get('x-forwarded-proto') || 'http';
  const host =
    headerStore.get('x-forwarded-host') || headerStore.get('host') || 'localhost:3000';

  const query = selectedLetter
    ? `?letter=${encodeURIComponent(selectedLetter)}`
    : '';

  return `${protocol}://${host}/word-garden/${acId}/phoneme/${phonemeSlug}/${encodedWord}${query}`;
}

export default async function WordGardenLevelThreePage({ params, searchParams }) {
  const headerStore = headers();
  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}/phoneme/${params.phonemeSlug}/${params.word}`
  );
  const decodedWord = decodeWordParam(params.word);
  const wordDetail = getWordDetail(
    params.phonemeSlug,
    decodedWord,
    null,
    anonymousChild.practicedWords
  );

  if (!wordDetail) {
    notFound();
  }
  const selectedLetter =
    normalizeSelectedLetter(searchParams?.letter) ||
    getSelectedLetterFromReferer(headerStore);

  const currentPageUrl = getCurrentPageUrl(
    params.acId,
    params.phonemeSlug,
    params.word,
    selectedLetter
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
        <p className='text-sm uppercase tracking-[0.35em] text-yellow mb-3'>Level 3</p>
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
            </div>
          </div>
          <div className='rounded-3xl bg-primary/70 px-5 py-4 text-sm text-accent min-w-[220px]'>
            <p>Lowercase letter: {wordDetail.lowercaseLetter || '-'}</p>
            <p>Uppercase letter: {wordDetail.uppercaseLetter || '-'}</p>
            <p>Category: {wordDetail.category}</p>
          </div>
        </div>
      </div>

      <WorksheetChecklist
        acId={params.acId}
        qrCodeUrl={qrCodeUrl}
        soundTableSelection={selectedLetter}
        wordDetail={wordDetail}
      />
    </section>
  );
}
