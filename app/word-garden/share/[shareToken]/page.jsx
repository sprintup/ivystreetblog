import { redirect } from 'next/navigation';
import { AcceptSharedAnonymousChildInteractor } from '@/interactors/word-garden/AcceptSharedAnonymousChildInteractor';
import { requireWordGardenSession } from '../../wordGardenServer';

function buildDashboardRedirect(status, displayName = '') {
  const searchParams = new URLSearchParams();

  if (displayName) {
    searchParams.set('shared', displayName);
  }

  searchParams.set('shareStatus', status);

  return `/word-garden?${searchParams.toString()}`;
}

export default async function WordGardenSharePage({ params }) {
  const { session } = await requireWordGardenSession(
    `/word-garden/share/${params.shareToken}`
  );
  const acceptSharedAnonymousChildInteractor =
    await AcceptSharedAnonymousChildInteractor.create();
  const result = await acceptSharedAnonymousChildInteractor.execute(
    session.user.email,
    params.shareToken
  );

  if (!result.anonymousChild) {
    redirect(buildDashboardRedirect('invalid'));
  }

  redirect(
    buildDashboardRedirect(result.status, result.anonymousChild.displayName)
  );
}
