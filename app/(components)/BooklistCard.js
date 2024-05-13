// components/BooklistCard.jsx

import React from "react";
import Link from "next/link";

export default function BooklistCard({ booklist }) {
  return (
    <div className="bg-secondary text-accent p-4 rounded-lg shadow-md">
      <Link href={`/booklist/${booklist._id}`}>
        <h2 className="text-xl text-yellow mb-2">{booklist.title}</h2>
      </Link>
      <p className="text-sm mb-2">{booklist.description}</p>
      <p className="text-xs text-gray-300">Books: {booklist.bookIds.length}</p>
    </div>
  );
}
