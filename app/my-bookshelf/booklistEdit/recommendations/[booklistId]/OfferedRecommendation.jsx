import React from 'react';
import Link from 'next/link';
import OfferedRecommendationActions from './OfferedRecommendationActions';

export default function OfferedRecommendation({ recommendation }) {
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
        <OfferedRecommendationActions recommendationId={recommendation._id} />
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
