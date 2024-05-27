// app/public-bookshelf/public-booklist/[id]/page.jsx

import React from 'react';
import { ReadPublicBooklistInteractor } from '@/interactors/booklists/public/ReadPublicBooklistInteractor';
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
} from '@/app/faqs/accordionContent';
import RecommendBookToBooklistComponent from './RecommendBookToBooklistComponent';

export default async function BooklistPage({ params }) {
  const { id } = params;
  const readPublicBooklistInteractor =
    await ReadPublicBooklistInteractor.create();
  let booklist = await readPublicBooklistInteractor.execute(id);

  if (!booklist) {
    return <div>Booklist not found.</div>;
  }

  if (booklist.visibility !== 'public') {
    return <div>This booklist is not public.</div>;
  }
  booklist = booklist.toObject();

  const booklistOwner = booklist.booklistOwnerId;
  const books = booklist.bookIds;

  const session = await getServerSession(options);
  const userBooklists =
    session && booklistOwner ? booklistOwner.bookListIds : [];

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
        </AccordionWrapper>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl italic'>{booklist.title}</h2>
          <ShareButton
            url={`${process.env.NEXTAUTH_URL}/public-booklist/${id}`}
          />
        </div>
      </div>
      <p className='text-lg mb-4'>{booklist.description}</p>
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
      {session && (
        <div className='mt-4'>
          <RecommendBookToBooklistComponent booklist={booklist} />
        </div>
      )}
    </div>
  );
}
