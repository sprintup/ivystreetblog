// app/book/[id]/page.jsx

import React from 'react';
import { ReadBookForBookDetailsInteractor } from '@/interactors/book/ReadBookForBookDetailsInteractor';
import { ReadUserBooklistsInteractor } from '@interactors/user/ReadUserBooklistsInteractor';
import { Suspense } from 'react';
import AddToReadingListButton from '@components/AddToReadingListButton';
import AddToBooklistButton from '@components/AddToBooklistButton';
import BookImage from './BookImage';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { FaExternalLinkAlt } from 'react-icons/fa';
import ShareButton from '@components/ShareButton';

const ImagePlaceholder = () => (
  <div className='w-48 h-64 bg-gray-200 animate-pulse'></div>
);

export default async function BookPage({ params }) {
  const { id } = params;
  const readBookForBookDetailsInteractor =
    await ReadBookForBookDetailsInteractor.create();
  const [book, booklists] = await readBookForBookDetailsInteractor.execute(id);

  if (!book) {
    return <div>Book not found.</div>;
  }

  const session = await getServerSession(options);
  let userBooklistsForDropdown = [];
  if (session) {
    const interactor = await ReadUserBooklistsInteractor.create();
    userBooklistsForDropdown = await interactor.execute(session?.user?.email);
  }

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    book.Name
  )}+by+${encodeURIComponent(book.Author)}`;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='flex flex-col'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-3xl font-bold text-yellow'>
            <a
              href={googleSearchUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline'
            >
              {book.Name} <FaExternalLinkAlt className='inline-block ml-1' />
            </a>
          </h1>
          <div className='sm:hidden'>
            <ShareButton url={`${process.env.NEXTAUTH_URL}/book/${book._id}`} />
          </div>
        </div>
        <p className='text-sm text-gray-400 mb-4'>
          Click to view Google search for book
        </p>
        <div className='flex flex-col sm:flex-row'>
          <div className='sm:w-2/3 sm:pr-8'>
            {book.Author && (
              <p className='text-lg mb-2'>
                <span className='font-bold'>Author:</span> {book.Author}
              </p>
            )}
            {book.Description && (
              <div className='text-base mb-4 pl-2 border-l-2 border-dotted border-accent-500'>
                <span className='font-bold'>Description:</span>{' '}
                {book.Description}
              </div>
            )}
            {book.Age && (
              <p className='text-base mb-2'>
                <span className='font-bold'>Age:</span> {book.Age}
              </p>
            )}
            {book.Series && (
              <p className='text-base mb-2'>
                <span className='font-bold'>Series:</span> {book.Series}
              </p>
            )}
            {book.Publication_Date && (
              <p className='text-base mb-2'>
                <span className='font-bold'>Publication Date:</span>{' '}
                {book.Publication_Date}
              </p>
            )}
            {book.Publisher && (
              <p className='text-base mb-2'>
                <span className='font-bold'>Publisher:</span> {book.Publisher}
              </p>
            )}
            {book.ISBN && (
              <p className='text-base mb-2'>
                <span className='font-bold'>ISBN:</span> {book.ISBN}
              </p>
            )}
            {book.Source && (
              <p className='text-base mb-2'>
                <span className='font-bold'>Source:</span> {book.Source}
              </p>
            )}
            {book.Link && (
              <p className='text-base mb-2'>
                <span className='font-bold'>Link:</span>{' '}
                <a
                  href={book.Link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-yellow hover:underline'
                >
                  {book.Link}
                </a>
              </p>
            )}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4'>
              {book.BookOwner && (
                <div className='flex items-center mb-2 sm:mb-0'>
                  <span className='font-bold mr-2'>Book Owner:</span>
                  <Link
                    href={`/profile/${book.BookOwner.publicProfileName}`}
                    className='text-yellow hover:text-orange text-base hover:underline'
                  >
                    {book.BookOwner.publicProfileName}
                  </Link>
                </div>
              )}
              <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2'>
                {session && session.user.email === book?.BookOwner?.email && (
                  <Link
                    href={`/my-collection/bookEdit/${book._id}`}
                    className='px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300'
                  >
                    Edit Book
                  </Link>
                )}
                <div className='hidden sm:block'>
                  <ShareButton
                    url={`${process.env.NEXTAUTH_URL}/book/${book._id}`}
                  />
                </div>
              </div>
            </div>
            <div className='mt-8'>
              {session && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <AddToReadingListButton book={book} />
                  <AddToBooklistButton
                    book={book}
                    signedInUserBooklists={userBooklistsForDropdown}
                  />
                </div>
              )}
            </div>
            {booklists.length > 0 && (
              <div className='mt-8'>
                <h2 className='text-xl font-bold mb-4'>
                  Booklists containing this book:
                </h2>
                <ul>
                  {booklists.map(booklist => (
                    <li key={booklist._id} className='mb-2'>
                      <Link
                        href={`/public-bookshelf/public-booklist/${booklist._id}`}
                        className='text-yellow hover:text-orange'
                      >
                        {booklist.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className='sm:w-1/3 sm:pl-8 mt-8 sm:mt-0'>
            <Suspense fallback={<ImagePlaceholder />}>
              {book.Link && book.Link.includes('amazon') ? (
                <BookImage link={book.Link} />
              ) : (
                <div className='hidden sm:flex w-48 h-64 items-center justify-center border-2 border-dashed border-gray-400 rounded-lg'>
                  <p className='text-center text-sm'>
                    Add Amazon link for image
                  </p>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
