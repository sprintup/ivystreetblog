// app/api/book/[id]/route.js

import { ReadBookInteractor } from "@/interactors/book/ReadBooksForReadingListInteractor"

export async function GET(request, { params }) {
  try {
    const bookId = params.id;
    const readBookInteractor = await ReadBookInteractor.create();
    const book = await readBookInteractor.execute(bookId);
    if (book) {
      return new Response(JSON.stringify(book), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Book not found" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
  }
}

