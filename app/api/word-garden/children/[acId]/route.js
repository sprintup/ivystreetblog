import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { DeleteAnonymousChildInteractor } from '@/interactors/word-garden/DeleteAnonymousChildInteractor';
import { ReadAnonymousChildInteractor } from '@/interactors/word-garden/ReadAnonymousChildInteractor';

export async function GET(_request, { params }) {
  const session = await getServerSession(options);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const readAnonymousChildInteractor = await ReadAnonymousChildInteractor.create();
    const anonymousChild = await readAnonymousChildInteractor.execute(
      session.user.email,
      params.acId
    );

    if (!anonymousChild) {
      return new Response('Anonymous child not found', { status: 404 });
    }

    return new Response(JSON.stringify(anonymousChild), { status: 200 });
  } catch (error) {
    console.error('Error reading anonymous child:', error);
    return new Response('Failed to read anonymous child', { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const session = await getServerSession(options);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const deleteAnonymousChildInteractor =
      await DeleteAnonymousChildInteractor.create();
    const wasDeleted = await deleteAnonymousChildInteractor.execute(
      session.user.email,
      params.acId
    );

    if (!wasDeleted) {
      return new Response(
        JSON.stringify({ error: 'Anonymous child not found.' }),
        { status: 404 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting anonymous child:', error);
    return new Response('Failed to delete anonymous child', { status: 500 });
  }
}
