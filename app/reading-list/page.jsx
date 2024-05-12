// app/reading-list/page.jsx

import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserByEmail, getBooksByIds } from "@services/dataService";
import BookDetailsPublic from "@components/BookDetailsPublic";

export default async function ReadingListPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Please log in to view your reading list.</div>;
  }

  const user = await getUserByEmail(session.user.email);
  const trackedBooks = user.trackedBooks.filter(
    (book) => book.status === "to-read"
  );
  const bookIds = trackedBooks.map((book) => book.bookId);
  const books = await getBooksByIds(bookIds);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-yellow mb-8">My Reading List</h1>
      {books.length === 0 ? (
        <p>Your reading list is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <BookDetailsPublic key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
