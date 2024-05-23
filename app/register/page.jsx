'use client';
// app/register/page.jsx

import { useState } from 'react';
import Accordion from '@components/Accordion';
import Link from 'next/link';
import {
  githubContent,
  passkeysContent,
  homeScreenContent,
  parentalContent,
  whyGithubContent,
} from '@app/faqs/accordionContent';

export default function RegisterPage() {
  return (
    <div className='flex items-start justify-center bg-primary py-8'>
      <div className='bg-secondary p-8 rounded-lg shadow-md w-full max-w-4xl mx-4'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-start'>
          <div className='w-full md:w-2/3'>
            <h2 className='text-3xl text-accent mb-6'>Register</h2>
            <div className='space-y-4'>
              {/* GitHub Account */}
              <Accordion
                title='GitHub Account'
                content={githubContent}
                isOpenByDefault={true}
              />
              <Accordion title='Why GitHub?' content={whyGithubContent} />

              {/* Parental Approval */}
              <Accordion
                title='Attention Minors: Parent/Guardian Approval Required'
                content={parentalContent}
                isOpenByDefault={true}
              />

              {/* Passkeys */}
              <Accordion
                title='Setting up Passkeys'
                content={passkeysContent}
              />

              {/* Add to Home Screen */}
              <Accordion
                title='Add to Home Screen'
                content={homeScreenContent}
              />
            </div>
          </div>

          {/* Login Button and Bulleted List */}
          <div className='mt-8 md:mt-0 md:ml-8'>
            <ul className='text-accent text-sm mb-4 list-disc list-inside'>
              <li className='mb-2'>
                <span>
                  By registering, you agree to our{' '}
                  <Link
                    href='/terms'
                    rel='noopener noreferrer'
                    className='text-yellow hover:text-orange'
                  >
                    terms of use
                  </Link>
                  .
                </span>
              </li>
              <li className='mb-2'>
                Changing email in GitHub will result in a duplicate account
                being created.
              </li>
              <li className='mb-2'>
                More{' '}
                <Link href='/faqs' className='text-yellow hover:text-orange'>
                  FAQs
                </Link>{' '}
                are found in the footer.
              </li>
              <li className='mb-2'>
                When you log in, please set your public profile name.
              </li>
            </ul>
            <a
              href='/api/auth/signin'
              className='block w-full md:w-auto bg-yellow text-primary text-center font-bold py-2 px-4 rounded-md hover:bg-orange transition duration-300'
            >
              Log in with GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
