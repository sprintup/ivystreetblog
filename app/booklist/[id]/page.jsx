// app/booklists/[id]/page.jsx

import React from "react";
import { getBooklistById } from "@services/dataService";
import BookDetailsPublic from "@components/BookDetailsPublic";

export default async function BooklistPage({ params }) {
  const { id } = params;
  const booklist = await getBooklistById(id);

  if (!booklist) {
    return <div>Booklist not found.</div>;
  }

  return (
    <div className="bg-primary text-accent p-4 rounded-lg max-w-7xl mx-auto">
      <h1 className="text-2xl font-heading text-yellow mb-4">{booklist.title}</h1>
      <p className="text-lg mb-4">{booklist.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {booklist.bookIds.map((bookId) => (
          <BookDetailsPublic key={bookId} bookId={bookId} />
        ))}
      </div>
    </div>
  );
}