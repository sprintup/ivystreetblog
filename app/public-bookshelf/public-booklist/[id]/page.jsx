// app/public-bookshelf/public-booklist/[id]/page.jsx

import React from 'react';
import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import ShareButton from '@/app/(components)/ShareButton';
import Link from 'next/link';
import BooklistMasonry from './BooklistMasonry';
import AccordionWrapper from '@/app/(components)/AccordionWrapper';
import Accordion from '@/app/(components)/Accordion';
import {
  thisIsPublicBooklistContent,
  whatIsIvyStreetBlogContent,
  howToRecommendContent,
} from '@/app/faqs/accordionContent';
import RecommendBookToBooklistComponent from './RecommendBookToBooklistComponent';
import { revalidatePath } from 'next/cache';
import { ReadPublicBooklistInteractor } from '@interactors/booklists/public/ReadPublicBooklistInteractor';

async function fetchPublicBooklist(id) {
  'use server';
  try {
    const readPublicBooklistInteractor =
      await ReadPublicBooklistInteractor.create();
    const booklist = await readPublicBooklistInteractor.execute(id);
    if (booklist) {
      revalidatePath('/api/public-bookshelf/public-booklist');
    } else {
      throw new Error('Failed to fetch public booklist');
    }
    return booklist;
  } catch (error) {
    console.error('Error fetching public booklist:', error);
    return null;
  }
}

export default async function BooklistPage({ params }) {
  const { id } = params;
  const booklist = await fetchPublicBooklist(id);

  if (!booklist) {
    return <div>Booklist not found.</div>;
  }

  if (booklist.visibility !== 'public') {
    return <div>This booklist is not public.</div>;
  }

  const booklistOwner = booklist.booklistOwnerId;
  const books = booklist.bookIds;

  const session = await getServerSession(options);
  const userBooklists =
    session && booklistOwner ? booklistOwner.bookListIds : [];

  const isOwner = session && session.user.email === booklistOwner.email;

  return (
    <div className='bg-primary text-accent p-4 rounded-lg'>
      <div className='mb-4'>
        <h1 className='text-4xl font-bold mb-2'>Public Booklist</h1>
        <AccordionWrapper title='Show More Information'>
          <Accordion
            title='Welcome to Ivy Street Blog! What is this?'
            content={whatIsIvyStreetBlogContent}
            isOpenByDefault={true}
          />
          <Accordion
            title='This is a public booklist. What does that mean?'
            content={thisIsPublicBooklistContent}
          />
          <Accordion
            title='How do I recommend a book to a booklist?'
            content={howToRecommendContent}
          />
        </AccordionWrapper>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl'>{booklist.title}</h2>
          <div className='flex flex-col sm:flex-row items-center justify-end'>
            {isOwner && (
              <Link
                href={`/my-bookshelf/booklistEdit/${id}`}
                className='mb-4 sm:mb-0 sm:mr-4'
              >
                <button className='px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300'>
                  Edit
                </button>
              </Link>
            )}
            <ShareButton
              url={`${process.env.NEXTAUTH_URL}/public-bookshelf/public-booklist/${id}`}
            />
          </div>
        </div>
      </div>
      <div className='flex items-start mb-4'>
        <p className='text-lg'>{booklist.description}</p>
      </div>
      {booklistOwner && (
        <p className='text-sm mb-4'>
          Booklist curator:{' '}
          <Link
            href={`/profile/${booklistOwner.publicProfileName}`}
            className='text-yellow hover:text-orange'
          >
            {booklistOwner.publicProfileName}
          </Link>
        </p>
      )}
      <BooklistMasonry
        booklist={{ ...booklist, books }}
        userBooklists={userBooklists}
      />
      {booklist.openToRecommendations ? (
        session ? (
          <div className='mt-4'>
            <RecommendBookToBooklistComponent booklist={booklist} />
          </div>
        ) : (
          <p className='text-accent mt-4'>
            Please log in to recommend books to this booklist.
          </p>
        )
      ) : (
        <p className='text-accent mt-4'>
          This booklist is currently closed to recommendations.
        </p>
      )}
    </div>
  );
}
