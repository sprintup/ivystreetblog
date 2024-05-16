// app/api/reading-list/[bookId]/route.js

import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { getUserByEmail, updateTrackedBooks } from "@/interactors/_baseInteractor";

export async function PUT(request, { params }) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { bookId } = params;
  const { status } = await request.json();

  const user = await getUserByEmail(session.user.email);
  const trackedBooks = user.trackedBooks.map((book) =>
    book.bookId.toString() === bookId ? { ...book, status } : book
  );

  await updateTrackedBooks(user._id, trackedBooks);

  return new Response("Book status updated", { status: 200 });
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { bookId } = params;

  const user = await getUserByEmail(session.user.email);
  const trackedBooks = user.trackedBooks.filter(
    (book) => book.bookId.toString() !== bookId
  );

  await updateTrackedBooks(user._id, trackedBooks);

  return new Response("Book removed from reading list", { status: 200 });
}
