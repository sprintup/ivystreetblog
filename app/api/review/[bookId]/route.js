// app/api/review/[bookId]/route.js

import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { getUserByEmail, updateTrackedBooks } from "@/interactors/_baseInteractor";

export async function PUT(request, { params }) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { bookId } = params;
  const { review, ratingPerceivedDifficulty } = await request.json();

  const user = await getUserByEmail(session.user.email);
  const trackedBooks = user.trackedBooks.map((book) =>
    book.bookId.toString() === bookId
      ? { ...book, review, ratingPerceivedDifficulty }
      : book
  );

  await updateTrackedBooks(user._id, trackedBooks);

  return new Response("Review updated", { status: 200 });
}