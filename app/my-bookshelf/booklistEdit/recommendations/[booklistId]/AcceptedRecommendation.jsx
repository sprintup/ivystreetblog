import React from 'react';
import Link from 'next/link';

export default function AcceptedRecommendation({ recommendation }) {
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
        <span className='text-green-500 font-bold'>Accepted</span>
      </div>
      <p className='text-accent mb-2'>{recommendation.recommendationReason}</p>
    </li>
  );
}
