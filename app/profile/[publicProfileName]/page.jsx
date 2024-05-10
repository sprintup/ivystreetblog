// app/[publicProfileName]/page.jsx

import React from "react";
import {
  getUserByPublicProfileName,
  getPublicBooklists,
} from "@services/dataService";
import BooklistCard from "@components/BooklistCard";

export default async function PublicBookshelfPage({ params }) {
  const { publicProfileName } = params;

  try {
    const user = await getUserByPublicProfileName(publicProfileName);
    if (!user) {
      return <div>User not found.</div>;
    }

    const publicBooklists = await getPublicBooklists(user._id);

    return (
      <div className="bg-primary text-accent p-4 rounded-lg max-w-4xl mx-auto">
        <h1 className="text-2xl font-heading text-yellow mb-4">
          {publicProfileName}'s Public Bookshelf
        </h1>
        {publicBooklists.length === 0 ? (
          <p>No public booklists found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicBooklists.map((booklist) => (
              <BooklistCard key={booklist._id} booklist={booklist} />
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
