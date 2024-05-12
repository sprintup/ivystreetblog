// app/bookshelf/page.jsx

import React, { Suspense } from "react";
import BookDetails from "@components/BookDetails";
import Shelf from "@components/Shelf";
import {
  getBooklists,
  createUser,
  getUserIdByEmail,
  removeUserBooklist,
} from "@services/dataService";
import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import BookModal from "@components/BookModal";
import Link from "next/link";
import styles from "./page.module.css";

async function BookshelfData() {
  const session = await getServerSession(options);
  if (!session) {
    throw new Error("User not authenticated");
  }

  const exists = await getUserIdByEmail(session.user.email);
  if (!exists) {
    await createUser(session.user.login, session.user.name, session.user.email);
  }

  const booklists = await getBooklists(session.user.email);
  return { session, booklists };
}

export default async function Bookshelf() {
  const { session, booklists } = await BookshelfData();

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Bookshelf</h1>
      <Suspense fallback={<div>Loading booklists...</div>}>
        <BookshelfContent session={session} booklists={booklists} />
      </Suspense>
    </>
  );
}

function BookshelfContent({ session, booklists }) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg">
          {session?.user?.name} has {booklists.length || 0} booklists
        </h3>
        <Link
          href="/booklistAdd"
          className="px-4 py-2 mb-2 bg-yellow text-primary font-bold rounded-lg hover:bg-orange transition duration-300 no-underline"
        >
          Add Booklist
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {booklists.map((item) => (
          <div
            key={item.booklist._id}
            className={`${styles.booklistCard} bg-secondary p-4 rounded-lg shadow-md relative`}
          >
            <h4 className="text-xl font-bold mb-1 mr-2">
              {item.booklist.title}
            </h4>
            <div className={styles.descriptionContainer}>
              <p
                className={`${styles.descriptionText} text-sm mb-2 mr-2 border-l-2 border-solid border-dotted px-1`}
              >
                {item.booklist.description}
              </p>
            </div>
            <p className="text-xs mb-2">
              Visibility: {item.booklist.visibility}
            </p>
            <p className="text-xs">Books: {item.booklist.bookIds.length}</p>
            {item.booklistOwner === session.user.email && (
              <div className="absolute bottom-4 right-4 space-x-2">
                <Link
                  href={`/booklistEdit/${item.booklist._id}`}
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300 no-underline"
                >
                  Edit
                </Link>
                <Link
                  href={`/booklist/${item.booklist._id}`}
                  className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 no-underline"
                >
                  View
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
      <BookModal />
    </>
  );
}
