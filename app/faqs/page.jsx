// app/faq/page.jsx

import React from 'react';
import Accordion from '../../components/Accordion';
import { passkeysContent } from '../accordionContent';

export default function FAQPage() {
  return (
    <div className='flex items-start justify-center bg-primary py-8'>
      <div className='bg-secondary p-8 rounded-lg shadow-md w-full max-w-4xl mx-4'>
        <h2 className='text-3xl text-accent mb-6'>
          Frequently Asked Questions
        </h2>
        <div className='space-y-4'>
          {/* Passkeys */}
          <Accordion title='Setting up Passkeys' content={passkeysContent} />

          {/* Add to Home Screen */}
          <Accordion title='Add to Home Screen' content={homeScreenContent} />
          {/* Add other FAQ items */}
        </div>
      </div>
    </div>
  );
}
