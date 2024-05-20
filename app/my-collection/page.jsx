// app/my-collection/page.jsx

import React from 'react';
import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { ReadBooksFromUserCollectionInteractor } from '@interactors/book/ReadBooksFromUserCollectionInteractor';
import UserCollectionMasonry from './UserCollectionMasonry';
import AddBookForm from './AddBookForm';
import Link from 'next/link';

export default async function UserCollectionPage({ searchParams }) {
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

  const books = booksData.map(book => book.toObject());

  const showArchived = searchParams.show === 'archived';

  const filteredBooks = books.filter(book => book.IsArchived === showArchived);

  return (
    <div className='bg-primary text-accent p-4 rounded-lg'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl'>My Collection</h1>
      </div>
      <div className='flex mb-4 items-center space-x-4'>
        <AddBookForm />
        <div className='bg-secondary text-yellow mb-2 px-4 py-2 rounded'>
          <Link
            href={`/my-collection?show=${showArchived ? 'active' : 'archived'}`}
            className='no-underline text-yellow'
          >
            {showArchived ? 'Show Active Books' : 'Show Archived Books'}
          </Link>
        </div>
      </div>
      <UserCollectionMasonry books={filteredBooks} />
    </div>
  );
}
