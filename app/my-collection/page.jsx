// app/my-collection/page.jsx

import React, { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { ReadBooksFromUserCollectionInteractor } from '@interactors/book/ReadBooksFromUserCollectionInteractor';
import UserCollectionMasonry from './UserCollectionMasonry';
import AddBookForm from './AddBookForm';
import Link from 'next/link';
import AccordionWrapper from '@/app/(components)/AccordionWrapper';
import Accordion from '@/app/(components)/Accordion';
import {
  deleteArchiveBookContent,
  whyAmazonLinksContent,
  whatIsABooklistContent,
  whatIsACollectionContent,
  whatIsReadingListContent,
} from '@/app/faqs/accordionContent';

async function CollectionData({ userEmail }) {
  const readBooksInteractor =
    await ReadBooksFromUserCollectionInteractor.create();
  const booksData = await readBooksInteractor.execute(userEmail);
  return booksData;
}

export default async function UserCollectionPage({ searchParams }) {
  const session = await getServerSession(options);

  if (!session) {
    return <div>Please log in to view your collection.</div>;
  }

  const booksData = await CollectionData({ userEmail: session.user.email });

  return (
    <Suspense fallback={<div>Loading collection...</div>}>
      <CollectionContent booksData={booksData} searchParams={searchParams} />
    </Suspense>
  );
}

function CollectionContent({ booksData, searchParams }) {
  if (!booksData) {
    return <div>No books found in your collection.</div>;
  }

  const showArchived = searchParams.show === 'archived';
  const filteredBooks = booksData.filter(
    book => book.IsArchived === showArchived
  );

  return (
    <div className='bg-primary text-accent p-4 rounded-lg'>
      <div className='mb-4'>
        <div className='flex justify-between items-center mb-2'>
          <h1 className='text-4xl font-bold mb-4'>My Collection</h1>
        </div>
        <AccordionWrapper title='Show More Information'>
          <Accordion
            title='What is a collection?'
            content={whatIsACollectionContent}
            isOpenByDefault={true}
          />
          <Accordion
            title='What is a booklist?'
            content={whatIsABooklistContent}
          />
          <Accordion
            title='What is a reading list?'
            content={whatIsReadingListContent}
          />
          <Accordion
            title='Why do we prefer Amazon links in book details?'
            content={whyAmazonLinksContent}
          />
          <Accordion
            title="What's the difference between deleting and archiving a book?"
            content={deleteArchiveBookContent}
          />
        </AccordionWrapper>
      </div>
      <div className='flex mb-4 items-start space-x-4'>
        <div className='bg-secondary text-yellow mb-2 px-4 py-2 rounded'>
          <Link
            href={`/my-collection?show=${showArchived ? 'active' : 'archived'}`}
            className='no-underline text-yellow'
          >
            {showArchived ? 'Show Active Books' : 'Show Archived Books'}
          </Link>
        </div>
        <AddBookForm />
      </div>
      <UserCollectionMasonry books={filteredBooks} />
    </div>
  );
}
