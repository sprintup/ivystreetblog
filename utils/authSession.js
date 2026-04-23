import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';

export function jsonErrorResponse(message, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function requireSessionUser() {
  const session = await getServerSession(options);
  const userEmail = String(session?.user?.email || '').trim();

  if (!session || !userEmail) {
    return {
      session: null,
      userEmail: '',
      unauthorizedResponse: jsonErrorResponse('Unauthorized', 401),
    };
  }

  return {
    session,
    userEmail,
    unauthorizedResponse: null,
  };
}
