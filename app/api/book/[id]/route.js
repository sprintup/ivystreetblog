// app/api/book/[id]/route.js

import { ReadBookForEditBookInteractor } from "@/interactors/book/ReadBookForEditBookInteractor"

export async function GET(request, { params }) {
  try {
    const bookId = params.id;
    const readBookForEditBookInteractor = await ReadBookForEditBookInteractor.create();
    const book = await readBookForEditBookInteractor.execute(bookId);
    if (book) {
      return new Response(JSON.stringify(book), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Book not found" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
  }
}

