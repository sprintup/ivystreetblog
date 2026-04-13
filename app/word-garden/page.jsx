import Link from 'next/link';
import AddAnonymousChildForm from './AddAnonymousChildForm';
import DeleteAnonymousChildButton from './DeleteAnonymousChildButton';
import { getWordGardenDashboardData } from './wordGardenServer';
import { calculateAgeInMonths } from '@/utils/wordGardenData';

export default async function WordGardenDashboardPage() {
  const { session, anonymousChildren } = await getWordGardenDashboardData();
  const sortedChildren = [...anonymousChildren].sort(
    (leftChild, rightChild) =>
      new Date(rightChild.updatedAt).getTime() - new Date(leftChild.updatedAt).getTime()
  );

  return (
    <section className='space-y-10 pb-40'>
      <div className='rounded-[2rem] bg-gradient-to-br from-secondary via-primary to-primary border border-accent/20 p-8 shadow-xl'>
        <p className='text-sm uppercase tracking-[0.35em] text-yellow mb-3'>Word Garden</p>
        <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
          Grow sound-by-sound practice for the children in your care.
        </h1>
        <p className='max-w-3xl text-lg text-accent'>
          Build a private garden of anonymous child profiles, unlock age-appropriate phonemes, explore word clouds, and print practice worksheets that make it easier to talk about meaning, sounds, and spelling together.
        </p>
        <div className='mt-6 flex flex-wrap gap-3 text-sm text-accent'>
          <span className='rounded-full border border-accent/30 px-4 py-2'>
            Signed in as {session.user.name}
          </span>
          <span className='rounded-full border border-accent/30 px-4 py-2'>
            Children in garden: {sortedChildren.length}
          </span>
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,420px)]'>
        <div className='space-y-5'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-3xl font-bold text-white'>Your Garden</h2>
              <p className='text-accent mt-1'>
                Select a child to open Level 1 and review their available sounds.
              </p>
            </div>
          </div>

          {sortedChildren.length === 0 ? (
            <div className='rounded-3xl border border-dashed border-accent/30 bg-primary/40 p-8 text-center text-accent'>
              Add your first anonymous child to start building a Word Garden.
            </div>
          ) : (
            <div className='grid gap-5 md:grid-cols-2'>
              {sortedChildren.map(anonymousChild => {
                const ageInMonths = calculateAgeInMonths(
                  anonymousChild.birthYearMonth
                );
                const practicedWordCount = anonymousChild.practicedWords.length;

                return (
                  <div
                    key={anonymousChild.acId}
                    className='h-full rounded-3xl bg-secondary/80 border border-accent/20 p-6 shadow-lg'
                  >
                    <Link
                      href={`/word-garden/${anonymousChild.acId}`}
                      className='no-underline block transition hover:-translate-y-1 hover:border-yellow/50'
                    >
                      <article>
                        <div className='flex items-start justify-between gap-4'>
                          <div>
                            <p className='text-xs uppercase tracking-[0.3em] text-accent/70'>
                              Anonymous Child
                            </p>
                            <h3 className='text-2xl text-yellow mt-2'>
                              {anonymousChild.displayName}
                            </h3>
                          </div>
                          <span className='rounded-full bg-primary/80 px-3 py-1 text-xs text-accent'>
                            {ageInMonths} months
                          </span>
                        </div>
                        <dl className='mt-5 space-y-2 text-sm text-accent'>
                          <div className='flex justify-between gap-4'>
                            <dt>Birth month</dt>
                            <dd>{anonymousChild.birthYearMonth}</dd>
                          </div>
                          <div className='flex justify-between gap-4'>
                            <dt>Practiced words</dt>
                            <dd>{practicedWordCount}</dd>
                          </div>
                          <div className='flex justify-between gap-4'>
                            <dt>Last updated</dt>
                            <dd>{new Date(anonymousChild.updatedAt).toLocaleDateString()}</dd>
                          </div>
                        </dl>
                        <p className='mt-6 text-sm text-yellow'>
                          Open Level 1 sound table
                        </p>
                      </article>
                    </Link>
                    <div className='mt-5 flex items-center justify-end'>
                      <DeleteAnonymousChildButton
                        acId={anonymousChild.acId}
                        displayName={anonymousChild.displayName}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <AddAnonymousChildForm />
      </div>
    </section>
  );
}
