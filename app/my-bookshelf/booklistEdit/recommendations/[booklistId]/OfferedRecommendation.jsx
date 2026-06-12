// app\my-bookshelf\booklistEdit\recommendations\[booklistId]\OfferedRecommendation.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OfferedRecommendation({ recommendations, booklistId }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState('');

  const refreshData = () => {
    router.refresh();
  };

  const handleAccept = async recommendationId => {
    try {
      const response = await fetch(`/api/recommendations/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommendationId }),
      });

      if (response.ok) {
        refreshData();
      } else {
        const data = await response.json().catch(() => null);
        setErrorMessage(
          data?.error || 'Failed to accept recommendation. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error accepting recommendation:', error);
      setErrorMessage('Failed to accept recommendation. Please try again.');
    }
  };

  const handleReject = async recommendationId => {
    try {
      const response = await fetch(`/api/recommendations/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommendationId }),
      });

      if (response.ok) {
        refreshData();
      } else {
        console.error('Failed to reject recommendation');
      }
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
    }
  };

  return (
    <div>
      {recommendations.length === 0 ? (
        <p>No offered recommendations.</p>
      ) : (
        <>
          <p className='mb-4'>
            Accepting a recommendation creates a copy in your collection and
            adds that copy to this booklist.
          </p>
          {errorMessage && <p className='mb-4 text-red-500'>{errorMessage}</p>}
          <ul className='space-y-4'>
            {recommendations.map(recommendation => (
              <li
                key={recommendation._id}
                className='bg-secondary text-accent p-4 rounded-lg shadow-md'
              >
                <Link
                  href={`/book/${recommendation?.bookId?._id}`}
                  className='text-yellow hover:text-orange'
                >
                  {recommendation?.bookId?.Name}
                </Link>
                <div className='flex flex-col md:flex-row md:justify-between items-start md:items-center mb-2'>
                  <span className='text-sm font-bold mb-2 md:mb-0'>
                    Recommended by:{' '}
                    {recommendation?.recommendedBy?.publicProfileName}
                  </span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-bold'>
                    <p className='text-accent mb-2'>
                      Reason: {recommendation?.recommendationReason}
                    </p>
                  </span>
                </div>
                <div className='flex flex-col md:flex-row md:justify-end items-center space-y-2 md:space-y-0 md:space-x-2'>
                  <button
                    onClick={() => handleAccept(recommendation?._id)}
                    className='px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-full md:w-auto'
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(recommendation?._id)}
                    className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-full md:w-auto'
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
