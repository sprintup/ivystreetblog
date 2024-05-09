// app/bookshelf/page.jsx

import React, { Suspense } from "react";
import BookDetails from "@components/BookDetails";
import Shelf from "@components/Shelf";
import { getBooklists, createUser, getUserIdByEmail, removeUserBooklist } from "@services/dataService";
import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import BookModal from "@components/BookModal";
import Link from "next/link";

async function BookshelfData() {
  const session = await getServerSession(options);
  if (!session) {
    // Handle the case when the user is not authenticated
    // You can redirect to the login page or display an error message
    throw new Error("User not authenticated"); 
  }

  const exists = await getUserIdByEmail(session.user.email);
  if (!exists) {
    console.log("session: ", session)
    console.log(" login", session.user.login, " name", session.user.name, " email", session.user.email)
    await createUser(session.user.login, session.user.name, session.user.email);
    console.log("User created");
  } else {
    console.log("User found");
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
        <h3 className="text-lg font-accent">
          {session?.user?.name} has {booklists.length || 0} booklists
        </h3>
        <Link
          href="/booklistAdd"
          className="px-4 py-2 mb-2 bg-yellow text-primary font-bold rounded-lg hover:bg-orange transition duration-300 no-underline"
        >
          Add Booklist
        </Link>
      </div>
      {booklists.map((item) => (
        <div key={item.booklist._id} className="bg-secondary p-4 mb-4 rounded-lg flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold mb-1 mr-2">{item.booklist.title}</h4>
            <p className="text-sm mb-2 mr-2">{item.booklist.description}</p>
            <p className="text-xs">Visibility: {item.booklist.visibility}</p>
          </div>
          {item.booklistOwner === session.user.email && (
            <Link
              href={`/booklistEdit/${item.booklist._id}`}
              className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300 no-underline"
            >
              Edit
            </Link>
          )}
        </div>
      ))}
      <BookModal />
    </>
  );
}