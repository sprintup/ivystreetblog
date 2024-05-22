// app/public-bookshelf/page.jsx

import React from "react";
import { ReadPublicBookshelfInteractor } from "@interactors/booklists/ReadPublicBookshelfInteractor";
import Link from "next/link";
import styles from "./page.module.css";

export default async function PublicBooklistsPage() {
  const readPublicBookshelfInteractor =
    await ReadPublicBookshelfInteractor.create();
  const publicBooklists = await readPublicBookshelfInteractor.execute();

  return (
    <div>
      <h1 className="text-2xl mb-4">Public Bookshelf</h1>
      {publicBooklists.length === 0 ? (
        <p>No public booklists available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicBooklists.map(async (booklist) => {
            const booklistOwner = booklist.booklistOwnerId;

            return (
              <div
                key={booklist._id}
                className="bg-secondary p-4 rounded-lg shadow-md"
              >
                <Link href={`/booklist/${booklist._id}`}>
                  <h2 className="text-xl text-yellow mb-2">{booklist.title}</h2>
                </Link>
                <div className={styles.descriptionContainer}>
                  <p className={styles.descriptionText}>
                    {booklist.description}
                  </p>
                </div>
                <p className="text-xs mb-2">Books: {booklist.bookIds.length}</p>
                {booklistOwner && (
                  <p className="text-sm">
                    Booklist creator:{" "}
                    <Link
                      href={`/profile/${booklistOwner.publicProfileName}`}
                      className="text-yellow hover:text-orange"
                    >
                      {booklistOwner.publicProfileName}
                    </Link>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
