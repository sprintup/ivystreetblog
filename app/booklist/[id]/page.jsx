// app/booklists/[id]/page.jsx

import React from "react";
import { getBooklistById, getUserById } from "@services/dataService";
import BookDetailsPublic from "@components/BookDetailsPublic";
import ShareButton from "@/app/(components)/ShareButton";
import Link from "next/link";

export default async function BooklistPage({ params }) {
  const { id } = params;
  const booklist = await getBooklistById(id);

  if (!booklist) {
    return <div>Booklist not found.</div>;
  }

  if (booklist.visibility !== "public") {
    return <div>This booklist is not public.</div>;
  }

  const user = await getUserById(booklist.booklistOwnerId);

  return (
    <div className="bg-primary text-accent p-4 rounded-lg max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-yellow">{booklist.title}</h1>
        <ShareButton url={`${process.env.NEXTAUTH_URL}/booklist/${id}`} />
      </div>
      <p className="text-lg mb-4">{booklist.description}</p>
      {user && (
        <p className="text-sm mb-4">
          Booklist creator:{" "}
          <Link
            href={`/profile/${user.publicProfileName}`}
            className="text-yellow hover:text-orange"
          >
            {user.publicProfileName}
          </Link>
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {booklist.bookIds.map((bookId) => (
          <BookDetailsPublic key={bookId} bookId={bookId} />
        ))}
      </div>
    </div>
  );
}
