// app/reading-list/page.jsx

import React from "react";
import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { getUserByEmail, getBooksByIds } from "@services/dataService";
import ReadingListBook from "./ReadingListBook";

export default async function ReadingListPage() {
  const session = await getServerSession(options);

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
        <ul className="space-y-4">
          {books.map((book) => (
            <ReadingListBook
              key={book._id}
              book={book}
              trackedBook={trackedBooks.find(
                (trackedBook) =>
                  trackedBook.bookId.toString() === book._id.toString()
              )}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
