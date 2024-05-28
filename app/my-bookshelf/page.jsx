// app/my-bookshelf/page.jsx

import React, { Suspense } from 'react';
import { CreateUserInteractor } from '@interactors/user/CreateUserInteractor';
import { ReadMyBookShelfInteractor } from '@/interactors/booklists/private/ReadMyBookShelfInteractor';
import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import Link from 'next/link';
import styles from './page.module.css';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { BOOKS_TAG } from '@domain/commons';
import AccordionWrapper from '@/app/(components)/AccordionWrapper';
import Accordion from '@/app/(components)/Accordion';
import {
  privateBooklistContent,
  whatIsBookshelfContent,
  whatIsABooklistContent,
  makeBooklistPublicContent,
  whatIsRecommendationContent,
} from '@/app/faqs/accordionContent';

async function BookshelfData() {
  const session = await getServerSession(options);
  if (!session) {
    redirect('/');
  }

  const createUserInteractor = await CreateUserInteractor.create();
  const user = await createUserInteractor.findOrCreateUser(
    session.user.login,
    session.user.name,
    session.user.email
  );

  const readBooklistsInteractor = await ReadMyBookShelfInteractor.create();
  const booklists = await readBooklistsInteractor.execute(user.email);
  revalidateTag(BOOKS_TAG);
  return { session, booklists };
}

export default async function MyBookshelf() {
  const { session, booklists } = await BookshelfData();

  return (
    <>
      <h1 className='text-4xl font-bold mb-4'>My Bookshelf</h1>
      <AccordionWrapper title='Show More Information'>
        <Accordion
          title='What is a bookshelf?'
          content={whatIsBookshelfContent}
          isOpenByDefault={true}
        />
        <Accordion
          title='What is a booklist?'
          content={whatIsABooklistContent}
        />
        <Accordion
          title='What does it mean to make a booklist private?'
          content={privateBooklistContent}
        />
        <Accordion
          title='What does it mean to make a booklist public?'
          content={makeBooklistPublicContent}
        />
        <Accordion
          title='What is a book recommendation?'
          content={whatIsRecommendationContent}
        />
      </AccordionWrapper>
      <Suspense fallback={<div>Loading booklists...</div>}>
        <BookshelfContent session={session} booklists={booklists} />
      </Suspense>
    </>
  );
}

function BookshelfContent({ session, booklists }) {
  return (
    <>
      <div className='mb-4'>
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-lg'>
            {session?.user?.name} has {booklists.length || 0} booklists
          </h3>
          <Link
            href='/my-bookshelf/booklistAdd'
            className='px-4 py-2 bg-yellow text-primary font-bold rounded-lg hover:bg-orange transition duration-300 no-underline'
          >
            Add Booklist
          </Link>
        </div>
      </div>
      <div className='mt-2'>
        <p className='mb-2'>
          Public booklists will appear on the{' '}
          <Link
            href='/public-bookshelf'
            className='text-yellow hover:text-orange'
          >
            Public Booklists
          </Link>{' '}
          page, which can be accessed from the{' '}
          <Link href='/profile' className='text-yellow hover:text-orange'>
            Profile
          </Link>{' '}
          page.
        </p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {booklists
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .map(booklist => (
            <div
              key={booklist._id}
              className={`${styles.booklistCard} bg-secondary p-4 rounded-lg shadow-md relative`}
            >
              <h4 className='text-xl font-bold mb-1 mr-2'>{booklist.title}</h4>
              <div className={styles.descriptionContainer}>
                <p
                  className={`${styles.descriptionText} text-sm mb-2 mr-2 border-l-2 border-solid border-dotted px-1`}
                >
                  {booklist.description}
                </p>
              </div>
              <p className='text-xs my-2'>Books: {booklist.bookIds.length}</p>
              <p
                className={`text-xs mb-2 ${
                  booklist.visibility === 'public'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                Visibility: {booklist.visibility}
              </p>
              {booklist.bookRecommendations.length > 0 ? (
                <p className='text-xs mb-2'>
                  <Link
                    href={`/my-bookshelf/booklistEdit/recommendations/${booklist._id}`}
                  >
                    <span className='text-yellow hover:text-orange'>
                      Recommendations: {booklist.bookRecommendations.length}
                    </span>
                  </Link>
                </p>
              ) : (
                <p
                  className={`text-xs mb-2 ${
                    booklist.openToRecommendations
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {booklist.openToRecommendations
                    ? 'Open to recommendations'
                    : 'Closed to recommendations'}
                </p>
              )}
              <div className='absolute bottom-4 right-4 space-x-2'>
                <Link
                  href={`/my-bookshelf/booklistEdit/${booklist._id}`}
                  className='px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300 no-underline'
                >
                  Edit
                </Link>
                <Link
                  href={`/public-bookshelf/public-booklist/${booklist._id}`}
                  className='px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 no-underline'
                >
                  View
                </Link>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
