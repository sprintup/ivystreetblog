// components/BookDetailsPublic.jsx

import React from "react";
import Link from "next/link";

export default function BookDetailsPublic({ book }) {
  return (
    <div className="bg-secondary p-4 rounded-lg shadow-md flex flex-col">
      <Link href={`/book/${book._id}`}>
        <h2 className="text-xl font-bold text-yellow mb-2 hover:text-orange transition duration-200">
          {book.Name}
        </h2>
      </Link>
      {book.Author && (
        <p className="text-sm mb-1">
          <span className="font-bold">Author:</span> {book.Author}
        </p>
      )}
      {book.Description && (
        <div className="text-sm mb-2 flex-grow">
          <span className="font-bold">Description:</span>{" "}
          {book.Description.length > 200
            ? `${book.Description.slice(0, 200)}...`
            : book.Description}
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
      <div className="mt-4">
        <Link href={`/book/${book._id}`}>
          <button className="bg-yellow text-primary px-4 py-2 rounded-lg hover:bg-orange transition duration-200">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
