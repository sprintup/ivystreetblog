import Link from 'next/link';
import AddAnonymousChildForm from './AddAnonymousChildForm';
import DeleteAnonymousChildButton from './DeleteAnonymousChildButton';
import RemoveSurrogateButton from './RemoveSurrogateButton';
import ShareAnonymousChildButton from './ShareAnonymousChildButton';
import { getWordGardenDashboardData } from './wordGardenServer';
import {
  calculateAgeInMonths,
  getWordGardenCompletionSummary,
} from '@/utils/wordGardenData';

function getSingleSearchParamValue(value) {
  if (Array.isArray(value)) {
    return value[0] || '';
  }

  return value || '';
}

function getShareBanner(searchParams) {
  const shareStatus = getSingleSearchParamValue(searchParams?.shareStatus);
  const sharedDisplayName = getSingleSearchParamValue(searchParams?.shared);

  if (shareStatus === 'added' && sharedDisplayName) {
    return {
      className: 'border-green-300/30 bg-green-500/10 text-green-100',
      message: `${sharedDisplayName} was added to your garden. You can open the sound table and continue practicing.`,
    };
  }

  if (shareStatus === 'already-added' && sharedDisplayName) {
    return {
      className: 'border-yellow/30 bg-yellow/10 text-yellow',
      message: `${sharedDisplayName} is already in your garden.`,
    };
  }

  if (shareStatus === 'invalid') {
    return {
      className: 'border-red-300/30 bg-red-500/10 text-red-100',
      message: 'That AC share link is no longer valid.',
    };
  }

  return null;
}

export default async function WordGardenDashboardPage({ searchParams }) {
  const { session, anonymousChildren } = await getWordGardenDashboardData();
  const sortedChildren = [...anonymousChildren].sort(
    (leftChild, rightChild) =>
      new Date(rightChild.updatedAt).getTime() - new Date(leftChild.updatedAt).getTime()
  );
  const shareBanner = getShareBanner(searchParams);

  return (
    <section className='space-y-10 pb-40'>
      <div className='grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,420px)]'>
        <div className='space-y-5'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-3xl font-bold text-white'>Your Garden</h2>
              <p className='text-accent mt-1'>
                Select a child to open the sound table and review their available sounds.
              </p>
              <div className='mt-4 flex flex-wrap gap-3 text-sm text-accent'>
                <span className='rounded-full border border-accent/30 px-4 py-2'>
                  Signed in as {session.user.name}
                </span>
                <span className='rounded-full border border-accent/30 px-4 py-2'>
                  Children in garden: {sortedChildren.length}
                </span>
              </div>
            </div>
          </div>

          {shareBanner ? (
            <div className={`rounded-3xl border p-4 text-sm ${shareBanner.className}`}>
              {shareBanner.message}
            </div>
          ) : null}

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
                const completionSummary = getWordGardenCompletionSummary(
                  anonymousChild.practicedWords
                );

                return (
                  <div
                    key={anonymousChild.acId}
                    className='flex h-full flex-col rounded-3xl bg-secondary/80 border border-accent/20 p-6 shadow-lg'
                  >
                    <article className='flex-1'>
                      <div className='flex items-start justify-between gap-4'>
                        <div>
                          <p className='text-xs uppercase tracking-[0.3em] text-accent/70'>
                            Anonymous Child
                          </p>
                          <h3 className='text-2xl text-yellow mt-2'>
                            {anonymousChild.displayName}
                          </h3>
                        </div>
                        <div className='flex flex-col items-end gap-2'>
                          <span className='rounded-full bg-primary/80 px-3 py-1 text-xs text-accent'>
                            {ageInMonths} months
                          </span>
                          <span className='rounded-full border border-accent/30 px-3 py-1 text-xs text-accent'>
                            {anonymousChild.isOriginator ? 'Originator' : 'Shared access'}
                          </span>
                        </div>
                      </div>
                      <dl className='mt-5 space-y-2 text-sm text-accent'>
                        <div className='flex justify-between gap-4'>
                          <dt>Birth month</dt>
                          <dd>{anonymousChild.birthYearMonth}</dd>
                        </div>
                        <div className='flex justify-between gap-4'>
                          <dt>Completed</dt>
                          <dd>
                            {completionSummary.completedCount}/
                            {completionSummary.remainingCount}
                          </dd>
                        </div>
                        <div className='flex justify-between gap-4'>
                          <dt>Last updated</dt>
                          <dd>{new Date(anonymousChild.updatedAt).toLocaleDateString()}</dd>
                        </div>
                      </dl>
                      {!anonymousChild.isOriginator ? (
                        <p className='mt-5 text-sm text-accent'>
                          Shared by {anonymousChild.originatorName}
                        </p>
                      ) : null}
                    </article>

                    <Link
                      href={`/word-garden/${anonymousChild.acId}`}
                      className='mt-6 inline-flex items-center justify-center rounded-full bg-yellow px-4 py-2 font-bold text-primary no-underline transition hover:bg-orange'
                    >
                      Open sound table
                    </Link>

                    {anonymousChild.isOriginator ? (
                      <div className='mt-5 space-y-4'>
                        <div className='flex flex-wrap items-start justify-between gap-3'>
                          <ShareAnonymousChildButton
                            sharePath={`/word-garden/share/${anonymousChild.shareToken}`}
                            displayName={anonymousChild.displayName}
                          />
                          <DeleteAnonymousChildButton
                            acId={anonymousChild.acId}
                            displayName={anonymousChild.displayName}
                          />
                        </div>

                        <div className='rounded-3xl border border-accent/20 bg-primary/50 p-4'>
                          <div className='flex items-center justify-between gap-3'>
                            <p className='text-xs uppercase tracking-[0.3em] text-accent/70'>
                              Surrogates
                            </p>
                            <span className='text-xs text-accent'>
                              {anonymousChild.surrogateCount} linked
                            </span>
                          </div>

                          {anonymousChild.surrogates.length === 0 ? (
                            <p className='mt-3 text-sm text-accent'>
                              No surrogate users are linked to this AC yet.
                            </p>
                          ) : (
                            <div className='mt-4 space-y-3'>
                              {anonymousChild.surrogates.map(surrogate => (
                                <div
                                  key={surrogate.userId}
                                  className='flex items-center justify-between gap-3 rounded-2xl border border-accent/15 bg-primary/60 p-3'
                                >
                                  <div className='min-w-0'>
                                    <p className='truncate text-sm font-semibold text-white'>
                                      {surrogate.name}
                                    </p>
                                    <p className='truncate text-xs text-accent'>
                                      {surrogate.email}
                                    </p>
                                  </div>
                                  <RemoveSurrogateButton
                                    acId={anonymousChild.acId}
                                    surrogateUserId={surrogate.userId}
                                    surrogateName={surrogate.name}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
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
