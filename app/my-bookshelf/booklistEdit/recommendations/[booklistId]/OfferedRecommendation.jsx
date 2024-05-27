// app\my-bookshelf\booklistEdit\recommendations\[booklistId]\OfferedRecommendation.jsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function OfferedRecommendation({
  recommendation,
  onActionComplete,
}) {
  const handleAccept = async () => {
    try {
      const response = await fetch(`/api/recommendations/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommendationId: recommendation._id }),
      });

      if (response.ok) {
        onActionComplete();
      } else {
        console.error('Failed to accept recommendation');
      }
    } catch (error) {
      console.error('Error accepting recommendation:', error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`/api/recommendations/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommendationId: recommendation._id }),
      });

      if (response.ok) {
        onActionComplete();
      } else {
        console.error('Failed to reject recommendation');
      }
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
    }
  };

  return (
    <li className='bg-secondary text-accent p-4 rounded-lg shadow-md'>
      <Link
        href={`/book/${recommendation.bookId._id}`}
        className='text-yellow hover:text-orange'
      >
        Recommended Book: {recommendation.bookId.Name}
      </Link>
      <div className='flex justify-between items-center mb-2'>
        <span className='text-sm font-bold'>
          Recommended by: {recommendation.recommendedBy.publicProfileName}
        </span>
        <div>
          <button
            onClick={handleAccept}
            className='px-2 py-1 bg-green-500 text-white rounded mr-2 hover:bg-green-600'
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600'
          >
            Reject
          </button>
        </div>
      </div>
      <div className='flex justify-between items-center mb-2'>
        <span className='text-sm font-bold'>
          <p className='text-accent mb-2'>
            Reason: {recommendation.recommendationReason}
          </p>
        </span>
      </div>
    </li>
  );
}
