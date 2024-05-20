// app/my-collection/page.jsx

import React from 'react';
import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { ReadBooksFromUserCollectionInteractor } from '@interactors/book/ReadBooksFromUserCollectionInteractor';
import UserCollectionMasonry from './UserCollectionMasonry';
import AddBookForm from './AddBookForm';

export default async function UserCollectionPage() {
  const session = await getServerSession(options);

  if (!session) {
    return <div>Please log in to view your collection.</div>;
  }

  const readBooksInteractor =
    await ReadBooksFromUserCollectionInteractor.create();
  const booksData = await readBooksInteractor.execute(session.user.email);

  if (!booksData) {
    return <div>No books found in your collection.</div>;
  }

  // Convert the Mongoose documents to plain objects
  const books = booksData.map(book => book.toObject());

  return (
    <div className='bg-primary text-accent p-4 rounded-lg'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl'>My Collection</h1>
      </div>
      <AddBookForm />
      <UserCollectionMasonry books={books} />
    </div>
  );
}
