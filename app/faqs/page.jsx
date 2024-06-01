// app/faq/page.jsx

import React from 'react';
import AccordionFaqs from '@components/AccordionFaqs';
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
  getStartedContent,
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
          <AccordionFaqs
            title='Welcome to Ivy Street Blog! What is this?'
            content={whatIsIvyStreetBlogContent}
            isOpenByDefault={true}
          />
          <AccordionFaqs
            title='How do I get started?'
            content={getStartedContent}
          />
          <AccordionFaqs title='Why GitHub?' content={whyGithubContent} />
          <AccordionFaqs
            title='Parental approval is required'
            content={parentalContent}
          />
          <AccordionFaqs
            title='What is a booklist?'
            content={whatIsABooklistContent}
          />
          <AccordionFaqs
            title='What is a collection?'
            content={whatIsACollectionContent}
          />
          <AccordionFaqs
            title='What is a private booklist?'
            content={privateBooklistContent}
          />
          <AccordionFaqs
            title='What does it mean to make a booklist public?'
            content={makeBooklistPublicContent}
          />
          <AccordionFaqs
            title='What is a bookshelf?'
            content={whatIsBookshelfContent}
          />
          <AccordionFaqs
            title='What is a reading list?'
            content={whatIsReadingListContent}
          />
          <AccordionFaqs
            title='What is a public profile name?'
            content={whatIsProfileContent}
          />
          <AccordionFaqs
            title='What is a book recommendation?'
            content={whatIsRecommendationContent}
          />
          <AccordionFaqs
            title='How do I recommend a book to a booklist?'
            content={howToRecommendContent}
          />
          <AccordionFaqs
            title='Setting up Passkeys'
            content={passkeysContent}
          />
          <AccordionFaqs
            title='Add to Home Screen'
            content={homeScreenContent}
          />
          <AccordionFaqs
            title='Submitting bugs or feature requests'
            content={submitIssuesContent}
          />

          <AccordionFaqs
            title='How to collaborate on GitHub?'
            content={collaborateOnGitHubContent}
          />
          <AccordionFaqs
            title='How to use this type of website for your own little free library?'
            content={useForOwnLibraryContent}
          />
        </div>
      </div>
      <div className='text-sm text-right mt-4'>V: {version}</div>
    </div>
  );
}
