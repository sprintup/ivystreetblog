// app/booklist/[id]/page.jsx

import React from 'react';
import { ReadPublicBooklistInteractor } from '@/interactors/booklists/ReadPublicBooklistInteractor';
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

export default async function BooklistPage({ params }) {
  const { id } = params;
  const readBooklistInteractor = await ReadPublicBooklistInteractor.create();
  let booklist = await readBooklistInteractor.execute(id);

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
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl'>{booklist.title}</h1>
        <ShareButton url={`${process.env.NEXTAUTH_URL}/booklist/${id}`} />
      </div>
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
    </div>
  );
}
