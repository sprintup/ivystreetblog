// app\booklist\[id]\RecommendBookToBooklistComponent.jsx

'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import UserBookCollectionComponent from '@components/UserBookCollectionComponent';

export default function RecommendBookToBooklistComponent({ booklist }) {
  const { data: session } = useSession();
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState('');
  const [recommendationReason, setRecommendationReason] = useState('');

  const handleBookSelect = book => {
    setSelectedBook(book);
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
      {selectedBook && (
        <div className='mt-4'>
          <p>
            2. Add a comment for why the owner of the booklist should consider
            <u> {selectedBook.Name}</u> for their booklist named{' '}
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
            className='mt-2 px-3 py-1 rounded-md bg-yellow text-primary text-sm w-full'
          >
            Recommend Book
          </button>
        </div>
      )}
      {message && <p className={`mt-1 text-xs text-yellow`}>{message}</p>}
    </div>
  );
}
