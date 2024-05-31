// app\booklist\[id]\RecommendBookToBooklistComponent.jsx

'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import UserBookCollectionComponent from '@components/UserBookCollectionComponent';
import { useRouter } from 'next/navigation';

export default function RecommendBookToBooklistComponent({ booklist }) {
  const { data: session } = useSession();
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState('');
  const [recommendationReason, setRecommendationReason] = useState('');
  const [showBookCollection, setShowBookCollection] = useState(true);
  const router = useRouter();

  const handleBookSelect = book => {
    setSelectedBook(book);
    setShowBookCollection(false);
  };

  const handleRecommendationReasonChange = e => {
    setRecommendationReason(e.target.value);
  };

  const handleRecommendBook = async () => {
    if (!selectedBook) {
      setMessage('Please select a book');
      return;
    }

    try {
      const response = await fetch(`/api/booklist/${booklist._id}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: selectedBook._id,
          recommendedBy: session.user.email,
          recommendationReason,
        }),
      });

      if (response.ok) {
        setMessage('Book recommendation sent successfully!');
        setSelectedBook(null);
        setRecommendationReason('');
        setShowBookCollection(true);
        router.refresh();
      } else {
        throw new Error('Failed to recommend book.');
      }
    } catch (error) {
      console.error('Error recommending book to the booklist:', error);
      setMessage('Failed to recommend book.');
    }
  };

  return (
    <div className='border border-yellow rounded-md p-4'>
      <h2 className='text-2xl'>
        Recommend Book to Booklist from My Collection
      </h2>
      <p className='mb-4'>
        1. Select a book from your collection that you want to recommend.
      </p>
      {showBookCollection ? (
        <UserBookCollectionComponent session={session}>
          {({ book }) => (
            <button
              onClick={() => handleBookSelect(book)}
              className='px-4 py-2 mt-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300'
            >
              Select Book
            </button>
          )}
        </UserBookCollectionComponent>
      ) : (
        <div className='relative inline-block text-left'>
          <div>
            <button
              type='button'
              className='inline-flex justify-center bg-yellow text-primary w-full rounded-md mt-2 px-3 py-1 text-sm'
              onClick={() => setShowBookCollection(true)}
            >
              Select a different book
              <svg
                className='-mr-1 ml-2 h-5 w-5'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
          {showBookCollection && (
            <div className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
              <UserBookCollectionComponent session={session}>
                {({ book }) => (
                  <button
                    onClick={() => handleBookSelect(book)}
                    className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  >
                    {book.Name}
                  </button>
                )}
              </UserBookCollectionComponent>
            </div>
          )}
        </div>
      )}
      {selectedBook && (
        <div className='mt-4'>
          <p>
            2. Add a comment for why the owner of the booklist should consider{' '}
            <u>{selectedBook.Name}</u> for their booklist named{' '}
            <b>{booklist.title}</b> that is about{' '}
            <i>"{booklist.description}"</i>.
          </p>
          <div className='relative mb-4'>
            <textarea
              value={recommendationReason}
              onChange={handleRecommendationReasonChange}
              placeholder='Enter recommendation reason'
              className='w-full px-3 py-1 pr-8 rounded-md bg-secondary text-yellow text-sm'
            ></textarea>
          </div>
          <button
            onClick={handleRecommendBook}
            className='mt-2 px-3 py-1 rounded-md bg-yellow text-primary text-lg w-full'
          >
            Recommend Book
          </button>
        </div>
      )}
      {message && <p className={`mt-1 text-xs text-yellow`}>{message}</p>}
    </div>
  );
}
