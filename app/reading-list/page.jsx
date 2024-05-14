// app/reading-list/page.jsx

import React from "react";
import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { getUserByEmail, getBooksByIds } from "@services/dataService";
import ToReadBook from "./ToReadBook";
import FinishedBook from "./FinishedBook";

export default async function ReadingListPage() {
  const session = await getServerSession(options);

  if (!session) {
    return <div>Please log in to view your reading list.</div>;
  }

  return <ReadingList session={session} />;
}

async function ReadingList({ session }) {
  const user = await getUserByEmail(session.user.email);
  const toReadBooks = user.trackedBooks.filter(
    (book) => book.status === "to-read"
  );
  const finishedBooks = user.trackedBooks.filter(
    (book) => book.status === "finished"
  );

  const toReadBookIds = toReadBooks.map((book) => book.bookId);
  const finishedBookIds = finishedBooks.map((book) => book.bookId);

  const toReadBookDetails = await getBooksByIds(toReadBookIds);
  const finishedBookDetails = await getBooksByIds(finishedBookIds);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Reading List</h1>
      <div className="mb-2">
        <h2 className="text-2xl font-bold mb-4">To Read</h2>
        {toReadBookDetails.length === 0 ? (
          <p>No books in your "To Read" list.</p>
        ) : (
          <ul className="space-y-4 mb-8">
            {toReadBookDetails.map((book) => (
              <ToReadBook
                key={book._id}
                book={book}
                trackedBook={toReadBooks.find(
                  (trackedBook) =>
                    trackedBook.bookId.toString() === book._id.toString()
                )}
              />
            ))}
          </ul>
        )}
      </div>
      <hr></hr>
      <div className="mt-2">
        <h2 className="text-2xl font-bold mb-4">Finished Books</h2>
        {finishedBookDetails.length === 0 ? (
          <p>No books in your "Finished Books" list.</p>
        ) : (
          <ul className="space-y-4">
            {finishedBookDetails.map((book) => (
              <FinishedBook
                key={book._id}
                book={book}
                trackedBook={finishedBooks.find(
                  (trackedBook) =>
                    trackedBook.bookId.toString() === book._id.toString()
                )}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
