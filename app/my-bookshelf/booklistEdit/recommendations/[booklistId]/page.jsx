// app/recommendations/[booklistId]/page.jsx

import React from 'react';
import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { ReadBooklistRecommendationsInteractor } from '@/interactors/booklists/recommendation/ReadBooklistRecommendationsInteractor';
import OfferedRecommendation from './OfferedRecommendation';
import AcceptedRecommendation from './AcceptedRecommendation';
import RejectedRecommendation from './RejectedRecommendation';
import Link from 'next/link';

export default async function BooklistRecommendationsPage({ params }) {
  const { booklistId } = params;
  const session = await getServerSession(options);

  if (!session) {
    return <div>Please log in to view booklist recommendations.</div>;
  }

  const readBooklistRecommendationsInteractor =
    await ReadBooklistRecommendationsInteractor.create();
  const { booklist, recommendations } =
    await readBooklistRecommendationsInteractor.execute(booklistId);

  if (!booklist) {
    return <div>Booklist not found.</div>;
  }

  const offeredRecommendations = recommendations.filter(
    recommendation => recommendation.status === 'offered'
  );
  const acceptedRecommendations = recommendations.filter(
    recommendation => recommendation.status === 'accepted'
  );
  const rejectedRecommendations = recommendations.filter(
    recommendation => recommendation.status === 'rejected'
  );

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h1 className='text-4xl font-bold mb-4'>Book Recommendations For:</h1>
      <Link
        href={`/public-bookshelf/public-booklist/${booklist._id}`}
        className='text-3xl font-bold mb-8 text-yellow hover:text-orange no-underline'
      >
        {booklist.title}
      </Link>
      <p className='text-lg mb-8'>{booklist.description}</p>
      <div className='space-y-8'>
        <div>
          <h3 className='text-2xl font-bold mb-4'>Offered Recommendations</h3>
          {offeredRecommendations.length === 0 ? (
            <p>No offered recommendations.</p>
          ) : (
            <ul className='space-y-4'>
              {offeredRecommendations.map(recommendation => (
                <OfferedRecommendation
                  key={recommendation._id}
                  recommendation={recommendation}
                />
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className='text-2xl font-bold mb-4'>Accepted Recommendations</h3>
          {acceptedRecommendations.length === 0 ? (
            <p>No accepted recommendations.</p>
          ) : (
            <ul className='space-y-4'>
              {acceptedRecommendations.map(recommendation => (
                <AcceptedRecommendation
                  key={recommendation._id}
                  recommendation={recommendation}
                />
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className='text-2xl font-bold mb-4'>Rejected Recommendations</h3>
          {rejectedRecommendations.length === 0 ? (
            <p>No rejected recommendations.</p>
          ) : (
            <ul className='space-y-4'>
              {rejectedRecommendations.map(recommendation => (
                <RejectedRecommendation
                  key={recommendation._id}
                  recommendation={recommendation}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
