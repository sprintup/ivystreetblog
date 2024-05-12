// app/api/user/tracked/route.js

import { addBookToTrackedBooks, getUserIdByEmail } from "@services/dataService";
import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";

export async function POST(request) {
  const session = await getServerSession(options);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { bookId } = await request.json();

  try {
    const userId = await getUserIdByEmail(session.user.email);
    if (!userId) {
      return new Response("User not found", { status: 404 });
    }

    await addBookToTrackedBooks(userId, bookId);
    return new Response("Book added to tracked books", { status: 200 });
  } catch (error) {
    console.error("Error adding book to tracked books:", error);
    return new Response("Failed to add book to tracked books", { status: 500 });
  }
}
