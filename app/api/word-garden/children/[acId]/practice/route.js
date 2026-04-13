import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { PracticeAnonymousChildWordInteractor } from '@/interactors/word-garden/PracticeAnonymousChildWordInteractor';

export async function POST(request, { params }) {
  const session = await getServerSession(options);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const {
    word,
    practiceIncrement = 1,
    checklistIncrement = 0,
  } = await request.json();

  if (!word || !word.trim()) {
    return new Response(JSON.stringify({ error: 'Word is required.' }), {
      status: 400,
    });
  }

  try {
    const practiceAnonymousChildWordInteractor =
      await PracticeAnonymousChildWordInteractor.create();
    const anonymousChild = await practiceAnonymousChildWordInteractor.execute(
      session.user.email,
      params.acId,
      word,
      practiceIncrement,
      checklistIncrement
    );

    if (!anonymousChild) {
      return new Response(JSON.stringify({ error: 'Anonymous child not found.' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(anonymousChild), { status: 200 });
  } catch (error) {
    console.error('Error updating anonymous child practice:', error);
    return new Response('Failed to update practice', { status: 500 });
  }
}
