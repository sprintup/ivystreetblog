import React from 'react';
import Link from 'next/link';

export default function RejectedRecommendation({ recommendation }) {
  return (
    <li className='bg-secondary text-accent p-4 rounded-lg shadow-md'>
      <div className='flex justify-between items-center mb-2'>
        <span className='text-sm font-bold'>
          Recommended by: {recommendation.recommendedBy.publicProfileName}
        </span>
        <span className='text-red-500 font-bold'>Rejected</span>
      </div>
      <p className='text-accent mb-2'>{recommendation.recommendationReason}</p>
      <Link
        href={`/book/${recommendation.bookId._id}`}
        className='text-yellow hover:text-orange'
      >
        View Book: {recommendation.bookId.Name}
      </Link>
    </li>
  );
}
