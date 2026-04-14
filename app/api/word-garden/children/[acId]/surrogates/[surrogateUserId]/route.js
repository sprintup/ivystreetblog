import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { RemoveAnonymousChildSurrogateInteractor } from '@/interactors/word-garden/RemoveAnonymousChildSurrogateInteractor';

export async function DELETE(_request, { params }) {
  const session = await getServerSession(options);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const removeAnonymousChildSurrogateInteractor =
      await RemoveAnonymousChildSurrogateInteractor.create();
    const wasRemoved = await removeAnonymousChildSurrogateInteractor.execute(
      session.user.email,
      params.acId,
      params.surrogateUserId
    );

    if (!wasRemoved) {
      return new Response(
        JSON.stringify({ error: 'Unable to remove surrogate access.' }),
        { status: 404 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error removing anonymous child surrogate:', error);
    return new Response('Failed to remove surrogate access', { status: 500 });
  }
}
