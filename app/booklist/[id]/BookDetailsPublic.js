// app/booklist/[id]/BookDetailsPublic.js

import React from "react";
import Link from "next/link";

export default function BookPublicDetails({ book }) {
  if (!book) {
    return null;
  }

  return (
    <div className="bg-secondary p-4 rounded-lg shadow-md flex flex-col break-inside-avoid mb-2">
      <Link href={`/book/${book._id}`}>
        <h2 className="text-xl text-yellow mb-2 hover:underline">
          {book.Name}
        </h2>
      </Link>
      {book.Author && (
        <p className="text-sm mb-1">
          <span className="font-bold">Author:</span> {book.Author}
        </p>
      )}
      {book.Description && (
        <div className="text-sm mb-1 flex-grow pl-1 border-l-2 border-dotted border-accent-500">
          <span className="font-bold">Description:</span> {book.Description}
        </div>
      )}
      {book.Age && (
        <p className="text-sm mb-1">
          <span className="font-bold">Age:</span> {book.Age}
        </p>
      )}
      {book.Series && (
        <p className="text-sm mb-1">
          <span className="font-bold">Series:</span> {book.Series}
        </p>
      )}
      {book.Publication_Date && (
        <p className="text-sm mb-1">
          <span className="font-bold">Publication Date:</span>{" "}
          {book.Publication_Date}
        </p>
      )}
      {book.Publisher && (
        <p className="text-sm mb-1">
          <span className="font-bold">Publisher:</span> {book.Publisher}
        </p>
      )}
      {book.ISBN && (
        <p className="text-sm mb-1">
          <span className="font-bold">ISBN:</span> {book.ISBN}
        </p>
      )}
      {book.Source && (
        <p className="text-sm mb-1">
          <span className="font-bold">Source:</span> {book.Source}
        </p>
      )}
      {book.Link && (
        <p className="text-sm mb-1">
          <span className="font-bold">Link:</span>{" "}
          <a
            href={book.Link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow hover:underline"
          >
            {book.Link}
          </a>
        </p>
      )}
    </div>
  );
}
