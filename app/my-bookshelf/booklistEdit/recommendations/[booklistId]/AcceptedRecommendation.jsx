// app\my-bookshelf\booklistEdit\recommendations\[booklistId]\AcceptedRecommendation.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AcceptedRecommendation({ recommendations }) {
  const router = useRouter();

  const refreshData = () => {
    router.refresh();
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

  const handleDeleteRecommendation = async recommendationId => {
    try {
      const response = await fetch(`/api/recommendations/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommendationId }),
      });

      if (response.ok) {
        refreshData();
      } else {
        console.error('Error deleting recommendation:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting recommendation:', error);
    }
  };

  return (
    <div>
      {recommendations.length === 0 ? (
        <p>No accepted recommendations.</p>
      ) : (
        <>
          <p className='mb-4'>
            The following recommendations have been accepted. To include the
            book in the booklist, please click the book link and add it to your
            booklist. Alternatively, you can manually copy the book details into
            your collection and then add it to your booklist, which would
            preserve the book if the book owner ever decides to delete the book.
          </p>

          <ul className='space-y-4'>
            {recommendations.map(recommendation => (
              <li
                key={recommendation._id}
                className='bg-secondary text-accent p-4 rounded-lg shadow-md'
              >
                <Link
                  href={`/book/${recommendation.bookId._id}`}
                  className='text-yellow hover:text-orange'
                >
                  {recommendation.bookId.Name}
                </Link>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-bold'>
                    Recommended by:{' '}
                    {recommendation.recommendedBy.publicProfileName}
                  </span>
                  <span className='text-green-500 font-bold'>Accepted</span>
                </div>
                <p className='text-accent mb-2'>
                  {recommendation.recommendationReason}
                </p>
                <div>
                  <button
                    onClick={() => handleReject(recommendation._id)}
                    className='px-2 py-1 bg-red-500 text-white rounded mr-2 hover:bg-red-600'
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteRecommendation(recommendation._id)
                    }
                    className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                  >
                    Delete
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
