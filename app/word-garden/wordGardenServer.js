import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { options } from '@auth/options';
import { CreateUserInteractor } from '@interactors/user/CreateUserInteractor';
import { ReadWordGardenDashboardInteractor } from '@/interactors/word-garden/ReadWordGardenDashboardInteractor';
import { ReadAnonymousChildInteractor } from '@/interactors/word-garden/ReadAnonymousChildInteractor';

function getSignInRedirect(callbackPath = '/word-garden') {
  return `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackPath)}`;
}

export async function requireWordGardenSession(callbackPath = '/word-garden') {
  const session = await getServerSession(options);

  if (!session) {
    redirect(getSignInRedirect(callbackPath));
  }

  const createUserInteractor = await CreateUserInteractor.create();
  const user = await createUserInteractor.findOrCreateUser(
    session.user.login,
    session.user.name,
    session.user.email
  );

  return { session, user };
}

export async function getWordGardenDashboardData() {
  const { session, user } = await requireWordGardenSession('/word-garden');
  const readWordGardenDashboardInteractor =
    await ReadWordGardenDashboardInteractor.create();
  const anonymousChildren = await readWordGardenDashboardInteractor.execute(
    session.user.email
  );

  return {
    session,
    user,
    anonymousChildren: anonymousChildren || [],
  };
}

export async function getAnonymousChildOrNotFound(acId, callbackPath = '/word-garden') {
  const { session } = await requireWordGardenSession(callbackPath);
  const readAnonymousChildInteractor = await ReadAnonymousChildInteractor.create();
  const anonymousChild = await readAnonymousChildInteractor.execute(
    session.user.email,
    acId
  );

  if (!anonymousChild) {
    redirect('/');
  }

  return {
    session,
    anonymousChild,
  };
}
