// app/recommendations/[booklistId]/page.jsx

import React from 'react';
import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { ReadBooklistRecommendationsInteractor } from '@/interactors/booklists/recommendation/ReadBooklistRecommendationsInteractor';
import OfferedRecommendation from './OfferedRecommendation';
import AcceptedRecommendation from './AcceptedRecommendation';
import RejectedRecommendation from './RejectedRecommendation';
import Link from 'next/link';
import AccordionWrapper from '@/app/(components)/AccordionWrapper';
import Accordion from '@/app/(components)/Accordion';
import {
  acceptingRecommendationContent,
  whatIsReadingListContent,
  whatIsRecommendationContent,
} from '@/app/faqs/accordionContent';

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
      <h1 className='text-3xl font-bold mb-4'>
        Book recommendations for booklist:
        <Link
          href={`/public-bookshelf/public-booklist/${booklist._id}`}
          className='text-yellow hover:text-orange no-underline'
        >
          {' ' + booklist.title}
        </Link>
      </h1>
      <AccordionWrapper title='Show More Information'>
        <Accordion
          title='What is a recommendation?'
          content={whatIsRecommendationContent}
          isOpenByDefault={true}
        />
        <Accordion
          title='How to accept a recommendation?'
          content={acceptingRecommendationContent}
        />
      </AccordionWrapper>
      <p className='text-lg mb-8'>{booklist.description}</p>
      <div className='mb-8'>
        <h3 className='text-xl font-bold mb-4'>
          Books currently in this Booklist:
        </h3>
        <ul className='list-disc pl-6'>
          {booklist.bookIds.map(bookId => (
            <li key={bookId._id}>
              <Link
                href={`/book/${bookId._id}`}
                className='text-yellow hover:text-orange'
              >
                {bookId.Name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
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
            <div>
              <p className='mb-4'>
                The following recommendations have been accepted. To include the
                book in the booklist, please click the book link and add it to
                your booklist. Alternatively, you can copy the book details into
                your collection and then add it to your booklist, which would
                preserve the book if the book owner ever decides to delete the
                book.
              </p>
              <ul className='space-y-4'>
                {acceptedRecommendations.map(recommendation => (
                  <AcceptedRecommendation
                    key={recommendation._id}
                    recommendation={recommendation}
                  />
                ))}
              </ul>
            </div>
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
