import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { ReorderAnonymousChildChecklistInteractor } from '@/interactors/word-garden/ReorderAnonymousChildChecklistInteractor';

export async function POST(request, { params }) {
  const session = await getServerSession(options);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { orderedWords = [] } = await request.json();

  if (!Array.isArray(orderedWords)) {
    return new Response(JSON.stringify({ error: 'orderedWords must be an array.' }), {
      status: 400,
    });
  }

  try {
    const reorderAnonymousChildChecklistInteractor =
      await ReorderAnonymousChildChecklistInteractor.create();
    const anonymousChild = await reorderAnonymousChildChecklistInteractor.execute(
      session.user.email,
      params.acId,
      orderedWords
    );

    if (!anonymousChild) {
      return new Response(JSON.stringify({ error: 'Anonymous child not found.' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(anonymousChild), { status: 200 });
  } catch (error) {
    console.error('Error reordering started checklists:', error);
    return new Response('Failed to reorder started checklists', { status: 500 });
  }
}
