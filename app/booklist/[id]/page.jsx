// app/booklist/[id]/page.jsx

import React from "react";
import { ReadBooklistInteractor } from "@interactors/booklists/ReadBooklistInteractor";
import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import ShareButton from "@/app/(components)/ShareButton";
import Link from "next/link";
import BooklistMasonry from "./BooklistMasonry";

export default async function BooklistPage({ params }) {
  const { id } = params;
  const readBooklistInteractor = await ReadBooklistInteractor.create();
  let booklist = await readBooklistInteractor.execute(id);

  if (!booklist) {
    return <div>Booklist not found.</div>;
  }

  if (booklist.visibility !== "public") {
    return <div>This booklist is not public.</div>;
  }
  booklist = booklist.toObject();

  const booklistOwner = booklist.booklistOwnerId;
  const books = booklist.bookIds;

  const session = await getServerSession(options);
  const userBooklists = session ? booklistOwner.bookListIds : [];

  return (
    <div className="bg-primary text-accent p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">{booklist.title}</h1>
        <ShareButton url={`${process.env.NEXTAUTH_URL}/booklist/${id}`} />
      </div>
      <p className="text-lg mb-4">{booklist.description}</p>
      {booklistOwner && (
        <p className="text-sm mb-4">
          Booklist creator:{" "}
          <Link
            href={`/profile/${booklistOwner.publicProfileName}`}
            className="text-yellow hover:text-orange"
          >
            {booklistOwner.publicProfileName}
          </Link>
        </p>
      )}
      <BooklistMasonry
        booklist={{ ...booklist, books }}
        userBooklists={userBooklists}
      />
    </div>
  );
}
