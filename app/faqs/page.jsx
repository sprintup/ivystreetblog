// app/faq/page.jsx

import React from 'react';
import Accordion from '@components/Accordion';
import {
  passkeysContent,
  homeScreenContent,
  whyGithubContent,
  submitIssuesContent,
  collaborateOnGitHubContent,
  useForOwnLibraryContent,
  whatIsProfileContent,
  whatIsReadingListContent,
  whatIsBookshelfContent,
  makeBooklistPublicContent,
  privateBooklistContent,
  whatIsACollectionContent,
  whatIsABooklistContent,
  parentalContent,
  whatIsIvyStreetBlogContent,
  whatIsRecommendationContent,
  howToRecommendContent,
} from './accordionContent';
import { version } from '@/app/utils/version';

export default function FAQPage() {
  return (
    <div className='flex flex-col items-center justify-center bg-primary py-8'>
      <div className='bg-secondary p-8 rounded-lg shadow-md w-full max-w-4xl mx-4'>
        <h2 className='text-3xl text-accent mb-6'>
          Frequently Asked Questions
        </h2>
        <div className='space-y-4'>
          <Accordion
            title='Welcome to Ivy Street Blog! What is this?'
            content={whatIsIvyStreetBlogContent}
            isOpenByDefault={true}
          />
          <Accordion title='Why GitHub?' content={whyGithubContent} />
          <Accordion
            title='Parental approval is required'
            content={parentalContent}
          />
          <Accordion
            title='What is a booklist?'
            content={whatIsABooklistContent}
          />
          <Accordion
            title='What is a collection?'
            content={whatIsACollectionContent}
          />
          <Accordion
            title='What is a private booklist?'
            content={privateBooklistContent}
          />
          <Accordion
            title='What does it mean to make a booklist public?'
            content={makeBooklistPublicContent}
          />
          <Accordion
            title='What is a bookshelf?'
            content={whatIsBookshelfContent}
          />
          <Accordion
            title='What is a reading list?'
            content={whatIsReadingListContent}
          />
          <Accordion
            title='What is a public profile name?'
            content={whatIsProfileContent}
          />
          <Accordion
            title='What is a book recommendation?'
            content={whatIsRecommendationContent}
          />
          <Accordion
            title='How do I recommend a book to a booklist?'
            content={howToRecommendContent}
          />
          <Accordion title='Setting up Passkeys' content={passkeysContent} />
          <Accordion title='Add to Home Screen' content={homeScreenContent} />
          <Accordion
            title='Submitting bugs or feature requests'
            content={submitIssuesContent}
          />

          <Accordion
            title='How to collaborate on GitHub?'
            content={collaborateOnGitHubContent}
          />
          <Accordion
            title='How to use this type of website for your own little free library?'
            content={useForOwnLibraryContent}
          />
        </div>
      </div>
      <div className='text-sm text-right mt-4'>V: {version}</div>
    </div>
  );
}
