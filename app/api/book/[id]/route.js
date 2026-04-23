// app/api/book/[id]/route.js

import { ReadBookForEditBookInteractor } from "@/interactors/book/ReadBookForEditBookInteractor"
import { requireSessionUser } from '@/utils/authSession';

export async function GET(request, { params }) {
  const { userEmail, unauthorizedResponse } = await requireSessionUser();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const bookId = params.id;
    const readBookForEditBookInteractor = await ReadBookForEditBookInteractor.create();
    const book = await readBookForEditBookInteractor.execute(userEmail, bookId);
    if (book) {
      return new Response(JSON.stringify(book), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Book not found" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
  }
}

