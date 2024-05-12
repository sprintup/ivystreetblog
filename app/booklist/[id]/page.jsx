// app/booklist/[id]/page.jsx

import React from "react";
import {
  getBooklistById,
  getUserById,
  getBooksByIds,
} from "@services/dataService";
import ShareButton from "@/app/(components)/ShareButton";
import Link from "next/link";
import BooklistMasonry from "./BooklistMasonry";

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
  const books = await getBooksByIds(booklist.bookIds);

  return (
    <div className="bg-primary text-accent p-4 rounded-lg">
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
      <BooklistMasonry booklist={{ ...booklist, books }} />
    </div>
  );
}
