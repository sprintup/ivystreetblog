// app/api/booklist/[id]/book/route.js

import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { addAnyBookToBooklist } from "@/interactors/_baseInteractor";

export async function POST(request, { params }) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id: booklistId } = params;
  const { bookId } = await request.json();

  try {
    await addAnyBookToBooklist(booklistId, bookId);
    return new Response("Book added to the booklist", { status: 200 });
  } catch (error) {
    console.error("Error adding book to the booklist:", error);
    return new Response("Failed to add book to the booklist", { status: 500 });
  }
}