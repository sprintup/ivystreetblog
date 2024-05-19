// app/api/booklist/[id]/book/route.js

import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { addAnyBookToBooklist } from "@/interactors/_baseInteractor";

export async function POST(request) {
  try {
      const { BooklistId, Name, Author, BookOwner } = await request.json();
      const newBook = await addBookToBooklist(BooklistId, { Name, Author, BookOwner });
      if (newBook) {
          return new Response(JSON.stringify(newBook), { status: 201 });
      } else {
          return new Response(JSON.stringify({ error: "Failed to add book to booklist" }), { status: 400 });
      }
  } catch (error) {
      return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
  }
}