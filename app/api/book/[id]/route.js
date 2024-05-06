// app/api/book/[id]/route.js

import { getBookById } from '@services/dataService';

export async function GET(request, { params }) {
  try {
    const bookId = params.id;
    const book = await getBookById(bookId);
    if (book) {
      return new Response(JSON.stringify(book), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Book not found" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
  }
}

