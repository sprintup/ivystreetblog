// app/public-booklists/page.jsx

import React from "react";
import { getPublicBooklists } from "@services/dataService";
import Link from "next/link";
import styles from "./page.module.css";

export default async function PublicBooklistsPage() {
  const publicBooklists = await getPublicBooklists();

  return (
    <div>
      <h1 className="text-2xl font-heading text-yellow mb-4">
        Public Booklists
      </h1>
      {publicBooklists.length === 0 ? (
        <p>No public booklists available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {publicBooklists.map((booklist) => (
            <div
              key={booklist._id}
              className="bg-secondary p-4 rounded-lg shadow-md"
            >
              <Link href={`/booklists/${booklist._id}`}>
                <h2 className="text-xl font-heading text-yellow mb-2">
                  {booklist.title}
                </h2>
              </Link>
              <div className={styles.descriptionContainer}>
                <p className={styles.descriptionText}>{booklist.description}</p>
              </div>
              <p className="text-xs">Books: {booklist.bookIds.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
