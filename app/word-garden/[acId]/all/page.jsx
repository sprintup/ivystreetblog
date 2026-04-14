import Link from 'next/link';
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
    <section className='space-y-8'>
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

      <div className='rounded-[2rem] bg-secondary/80 border border-accent/20 p-8 shadow-xl'>
        <p className='text-sm uppercase tracking-[0.35em] text-yellow mb-3'>Level 2</p>
        <h1 className='text-4xl text-white mb-3'>Word Cloud For All Words</h1>
        <div className='max-w-3xl space-y-4 text-accent'>
          <p>
            Browse every available Word Garden target in one place. Children
            typically understand concrete words with tangible meanings more easily
            than abstract words.
          </p>
          <p>
            These words were selected for their academic nature, which supports
            children as they reach school, where communication is often more academic.
          </p>
          <p>
            Abstract words stay off until all concrete words in this set are learned.
            Words you have already clicked shrink a little to make room for
            less-practiced choices.
          </p>
        </div>
        <p className='mt-4 max-w-3xl text-sm leading-7 text-accent'>
          These words were pulled from Appendix B of{' '}
          <em>All About Words: Increasing Vocabulary in the Common Core Classroom, PreK-2</em>
          {' '}by Susan B. Neuman. View the source here:{' '}
          <a
            href='https://archive.org/details/allaboutwordsinc0000neum_u4h2/page/152/mode/2up'
            className='text-yellow underline decoration-dotted underline-offset-4 hover:text-orange'
          >
            Appendix B on Archive.org
          </a>
          .
        </p>
      </div>

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
