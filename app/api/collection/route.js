// app/api/collection/route.js
import { ReadBooksFromUserCollectionPaginatedInteractor } from '@interactors/book/ReadBooksFromUserCollectionPaginatedInteractor';
import { requireSessionUser } from '@/utils/authSession';

export async function POST(request) {
  try {
    const { userEmail, unauthorizedResponse } = await requireSessionUser();
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const { page, limit } = await request.json();
    const requestedPage = Number.parseInt(page, 10);
    const requestedLimit = Number.parseInt(limit, 10);
    const safePage = Number.isFinite(requestedPage)
      ? Math.max(requestedPage, 1)
      : 1;
    const safeLimit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 50)
      : 5;

    const readBooksFromUsersCollectionInteractor =
      await ReadBooksFromUserCollectionPaginatedInteractor.create();
    const { books, totalBooks } =
      await readBooksFromUsersCollectionInteractor.execute(
        userEmail,
        safePage,
        safeLimit
      );

    return new Response(JSON.stringify({ books, totalBooks }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching user books:', error);
    return new Response('Failed to fetch user books', { status: 500 });
  }
}
