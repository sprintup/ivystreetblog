import Link from 'next/link';
import CopyCurrentWordLinkButton from '../../CopyCurrentWordLinkButton';
import StartedChecklistTile from '../../StartedChecklistTile';
import { getAnonymousChildOrNotFound } from '../../wordGardenServer';
import {
  buildWordGardenWordPath,
  calculateAgeInMonths,
  getRecommendedWordTarget,
  getStartedChecklists,
} from '@/utils/wordGardenData';

export default async function WordGardenChecklistsPage({ params }) {
  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}/checklists`
  );
  const ageInMonths = calculateAgeInMonths(anonymousChild.birthYearMonth);
  const startedChecklists = getStartedChecklists(
    anonymousChild.practicedWords,
    anonymousChild.currentChecklistWord
  );
  const hasCurrentWord = Boolean(anonymousChild.currentChecklistWord);
  const currentWordUrl = `/word-garden/${params.acId}/current`;
  const recommendedTarget = getRecommendedWordTarget(
    ageInMonths,
    anonymousChild.practicedWords
  );
  const recommendedHref = recommendedTarget
    ? buildWordGardenWordPath(
        params.acId,
        recommendedTarget.selectionType,
        recommendedTarget.selectionSlug,
        recommendedTarget.word,
        recommendedTarget.selectionLetter
      )
    : '';

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
        <span>Checklists</span>
      </div>

      <div className='rounded-[2rem] border border-accent/20 bg-secondary/80 p-8 shadow-xl'>
        <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)]'>
          <div className='min-w-0 space-y-5'>
            <h1 className='text-4xl text-white'>Checklists</h1>
            <details className='rounded-3xl border border-accent/20 bg-primary/30 p-5'>
              <summary className='cursor-pointer text-sm font-semibold uppercase tracking-[0.25em] text-yellow'>
                Instructions
              </summary>
              <div className='mt-4 grid gap-4 text-accent md:grid-cols-2'>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4'>
                  <p className='text-sm font-semibold text-yellow'>Open Checklists</p>
                  <p className='mt-2'>
                    A checklist opens when you press <strong>Start Checklist</strong>{' '}
                    or check any box on a word page. The app remembers that open
                    state and any checks so you can come back later without
                    losing your place.
                  </p>
                </div>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4'>
                  <p className='text-sm font-semibold text-yellow'>Current Word</p>
                  <p className='mt-2'>
                    The <strong>current word</strong> is the one open checklist
                    that acts like your main focus. When that checklist is
                    finished, the app moves current-word status to another open
                    checklist when possible.
                  </p>
                </div>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4'>
                  <p className='text-sm font-semibold text-yellow'>Bookmarkable URL</p>
                  <p className='mt-2'>
                    Bookmark{' '}
                    <code className='rounded bg-primary/70 px-2 py-1 text-yellow'>
                      {currentWordUrl}
                    </code>{' '}
                    if you want a quick link that always opens the current
                    checklist. If there is no open checklist, that URL falls back
                    to a recommended word.
                  </p>
                </div>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4'>
                  <p className='text-sm font-semibold text-yellow'>What Counts</p>
                  <div className='mt-2 space-y-2'>
                    <p>
                      <strong>Not started</strong>: the checklist has not been opened yet.
                    </p>
                    <p>
                      <strong>Started</strong>: the checklist has been opened, so
                      the page saves your progress even if no boxes are checked yet.
                    </p>
                    <p>
                      <strong>Complete</strong>: you pressed{' '}
                      <strong>Complete Checklist</strong>.
                    </p>
                  </div>
                </div>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4 md:col-span-2'>
                  <p className='text-sm font-semibold text-yellow'>Getting Started</p>
                  <p className='mt-2'>
                    A good way to begin is to open a few checklists for words
                    that start with the same letters as the child&apos;s name, so
                    the practice set feels personal and easy to revisit.
                  </p>
                </div>
              </div>
            </details>
          </div>

          <aside>
            <p className='mb-3 text-sm uppercase tracking-[0.35em] text-yellow'>
              Child Details
            </p>
            <div className='min-w-[220px] rounded-3xl bg-primary/70 px-5 py-4 text-sm text-accent'>
              <p>Child: {anonymousChild.displayName}</p>
              <p>Age: {ageInMonths} months</p>
              <p>Birth month: {anonymousChild.birthYearMonth}</p>
              <p>Open checklists: {startedChecklists.length}</p>
            </div>
          </aside>
        </div>
      </div>

      <div className='rounded-3xl border border-accent/20 bg-primary/40 p-4 shadow-lg'>
        <div className='flex flex-wrap items-center gap-4'>
          <Link
            href={currentWordUrl}
            className={`rounded-full border px-4 py-2 font-semibold no-underline transition hover:text-white ${
              hasCurrentWord
                ? 'border-green-400/30 bg-green-500/10 text-green-200 hover:border-green-300/50'
                : 'border-accent/30 bg-white/5 text-accent hover:border-accent/50'
            }`}
          >
            Current word
          </Link>
          {recommendedHref ? (
            <Link
              href={recommendedHref}
              className='rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 font-semibold text-green-200 no-underline transition hover:border-green-300/50 hover:text-white'
            >
              Recommend
            </Link>
          ) : null}
          <CopyCurrentWordLinkButton path={currentWordUrl} />
        </div>
      </div>

      <div className='space-y-5'>
        {startedChecklists.length === 0 ? (
          <div className='rounded-3xl border border-dashed border-accent/30 bg-primary/40 p-8 text-accent'>
            No checklists are started yet. Open a word and press Start Checklist,
            or check any box, to start saving checklist progress here.
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {startedChecklists.map(checklist => {
              const href = buildWordGardenWordPath(
                params.acId,
                checklist.selectionType,
                checklist.selectionSlug,
                checklist.word,
                checklist.selectionLetter
              );

              return (
                <StartedChecklistTile
                  key={`${checklist.normalizedWord}-${checklist.selectionType}-${checklist.selectionSlug}`}
                  acId={params.acId}
                  checklist={checklist}
                  href={href}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
