import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { CreateUserInteractor } from '@interactors/user/CreateUserInteractor';
import { CreateAnonymousChildInteractor } from '@/interactors/word-garden/CreateAnonymousChildInteractor';
import { ReadWordGardenDashboardInteractor } from '@/interactors/word-garden/ReadWordGardenDashboardInteractor';
import { validateBirthYearMonth } from '@/utils/wordGardenData';

async function ensureUser(session) {
  const createUserInteractor = await CreateUserInteractor.create();

  return createUserInteractor.findOrCreateUser(
    session.user.login,
    session.user.name,
    session.user.email
  );
}

export async function GET() {
  const session = await getServerSession(options);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await ensureUser(session);
    const readWordGardenDashboardInteractor =
      await ReadWordGardenDashboardInteractor.create();
    const anonymousChildren = await readWordGardenDashboardInteractor.execute(
      session.user.email
    );

    return new Response(JSON.stringify(anonymousChildren || []), {
      status: 200,
    });
  } catch (error) {
    console.error('Error reading word garden dashboard:', error);
    return new Response('Failed to load word garden dashboard', {
      status: 500,
    });
  }
}

export async function POST(request) {
  const session = await getServerSession(options);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { displayName, birthYearMonth, waiverAccepted } = await request.json();
  const validationError = validateBirthYearMonth(birthYearMonth);

  if (!displayName || !displayName.trim()) {
    return new Response(JSON.stringify({ error: 'Display name is required.' }), {
      status: 400,
    });
  }

  if (!waiverAccepted) {
    return new Response(
      JSON.stringify({ error: 'You must accept the caregiver waiver.' }),
      { status: 400 }
    );
  }

  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), {
      status: 400,
    });
  }

  try {
    await ensureUser(session);

    const createAnonymousChildInteractor =
      await CreateAnonymousChildInteractor.create();
    const anonymousChild = await createAnonymousChildInteractor.execute(
      session.user.email,
      displayName.trim(),
      birthYearMonth,
      new Date()
    );

    if (!anonymousChild) {
      return new Response(JSON.stringify({ error: 'User not found.' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(anonymousChild), {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating anonymous child:', error);
    return new Response('Failed to create anonymous child', {
      status: 500,
    });
  }
}
