// app/my-reading-list/page.jsx

import React from 'react';
import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { ReadUserForReadingListInteractor } from '@/interactors/user/ReadUserForReadingListInteractor';
import ToReadBook from './ToReadBook';
import FinishedBook from './FinishedBook';
import UserBookCollectionWrapper from './UserBookCollectionWrapper';
import AccordionWrapper from '@/app/(components)/AccordionWrapper';
import Accordion from '@/app/(components)/Accordion';
import {
  whatIsReadingListContent,
  whatIsACollectionContent,
} from '@/app/faqs/accordionContent';

export default async function ReadingListPage() {
  const session = await getServerSession(options);

  if (!session) {
    return <div>Please log in to view your reading list.</div>;
  }

  const readUserForReadingListInteractor =
    await ReadUserForReadingListInteractor.create();
  const user = await readUserForReadingListInteractor.execute(
    session.user.email
  );

  if (!user) {
    return <div>User not found.</div>;
  }

  const toReadBooks = user.trackedBooks.filter(
    book => book.status === 'to-read'
  );

  const finishedBooks = user.trackedBooks.filter(
    book => book.status === 'finished'
  );

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h1 className='text-4xl font-bold mb-4'>My Reading List</h1>
      <AccordionWrapper title='Show More Information'>
        <Accordion
          title='What is a reading list?'
          content={whatIsReadingListContent}
          isOpenByDefault={true}
        />
        <Accordion
          title='What is a collection?'
          content={whatIsACollectionContent}
        />
      </AccordionWrapper>
      <UserBookCollectionWrapper session={session} />
      <hr className='my-8' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <h2 className='text-2xl font-bold mb-4'>To Read</h2>
          {toReadBooks.length === 0 ? (
            <p>No books in your "To Read" list.</p>
          ) : (
            <ul className='space-y-4'>
              {toReadBooks.map(trackedBook => (
                <ToReadBook
                  key={trackedBook.bookId._id}
                  book={trackedBook.bookId}
                  trackedBook={trackedBook}
                />
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className='text-2xl font-bold mb-4'>Finished Books</h2>
          {finishedBooks.length === 0 ? (
            <p>No books in your "Finished Books" list.</p>
          ) : (
            <ul className='space-y-4'>
              {finishedBooks.map(trackedBook => (
                <FinishedBook
                  key={trackedBook.bookId._id}
                  book={trackedBook.bookId}
                  trackedBook={trackedBook}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
