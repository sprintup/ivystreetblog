import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import TrackWordVisit from '../../../../TrackWordVisit';
import WorksheetChecklist from '../../../../WorksheetChecklist';
import { getAnonymousChildOrNotFound } from '../../../../wordGardenServer';
import {
  decodeWordParam,
  getLetterLabel,
  getWordDetailForSelection,
} from '@/utils/wordGardenData';

function normalizeLetter(letter) {
  return String(letter || '').trim().charAt(0).toUpperCase();
}

function getCurrentPageUrl(acId, letter, encodedWord) {
  const headerStore = headers();
  const protocol = headerStore.get('x-forwarded-proto') || 'http';
  const host =
    headerStore.get('x-forwarded-host') || headerStore.get('host') || 'localhost:3000';

  return `${protocol}://${host}/word-garden/${acId}/letter/${letter}/${encodedWord}`;
}

export default async function WordGardenLetterLevelThreePage({ params }) {
  const letter = normalizeLetter(params.letter);

  if (!/^[A-Z]$/.test(letter)) {
    notFound();
  }

  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}/letter/${letter}/${params.word}`
  );
  const decodedWord = decodeWordParam(params.word);
  const wordDetail = getWordDetailForSelection(
    'letter',
    letter,
    decodedWord,
    anonymousChild.practicedWords
  );

  if (!wordDetail) {
    notFound();
  }

  const currentPageUrl = getCurrentPageUrl(params.acId, letter, params.word);
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
          href={`/word-garden/${params.acId}/letter/${letter}`}
          className='text-yellow hover:text-orange'
        >
          {getLetterLabel(letter)}
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
                    target='_blank'
                    rel='noopener noreferrer'
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
        wordDetail={wordDetail}
      />
    </section>
  );
}
