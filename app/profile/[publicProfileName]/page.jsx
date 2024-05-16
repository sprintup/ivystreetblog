// app/[publicProfileName]/page.jsx

import React from "react";
import {
  getUserByPublicProfileName,
  getPublicBooklistsByUserId,
} from "@/interactors/_baseInteractor";
import Link from "next/link";
import styles from "./page.module.css";

export default async function PublicBookshelfPage({ params }) {
  const { publicProfileName } = params;

  try {
    const user = await getUserByPublicProfileName(publicProfileName);
    if (!user) {
      return <div>User not found.</div>;
    }

    const publicBooklists = await getPublicBooklistsByUserId(user._id);

    return (
      <div className="bg-primary text-accent p-4 rounded-lg max-w-4xl mx-auto">
        <h1 className="text-2xl text-yellow mb-4">
          {publicProfileName}'s Public Bookshelf
        </h1>
        {publicBooklists.length === 0 ? (
          <p>No public booklists found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicBooklists.map((booklist) => (
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
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching public bookshelf:", error);
    return <div>An error occurred. Please try again later.</div>;
  }
}
