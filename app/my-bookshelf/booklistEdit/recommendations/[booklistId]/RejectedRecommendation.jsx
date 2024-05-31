'use client';
// RejectedRecommendation.jsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RejectedRecommendation({ recommendation }) {
  const router = useRouter();

  const handleDeleteRecommendation = async () => {
    try {
      const response = await fetch(`/api/recommendations/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommendationId: recommendation._id }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error('Error deleting recommendation:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting recommendation:', error);
    }
  };

  return (
    <li className='bg-secondary text-accent p-4 rounded-lg shadow-md'>
      <Link
        href={`/book/${recommendation.bookId._id}`}
        className='text-yellow hover:text-orange'
      >
        {recommendation.bookId.Name}
      </Link>
      <div className='flex justify-between items-center mb-2'>
        <span className='text-sm font-bold'>
          Recommended by: {recommendation.recommendedBy.publicProfileName}
        </span>
        <span className='text-red-500 font-bold'>Rejected</span>
      </div>
      <p className='text-accent mb-2'>{recommendation.recommendationReason}</p>
      <button
        className='bg-red-500 text-white px-2 py-1 rounded'
        onClick={handleDeleteRecommendation}
      >
        Delete
      </button>
    </li>
  );
}
