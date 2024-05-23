import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='py-4'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-center items-center'>
          <div className='flex flex-col items-end border-r border-accent pr-4'>
            <Link
              href='/terms'
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium bg-primary'
            >
              Terms of service
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL}
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium bg-primary'
            >
              Edit on Github
            </Link>
            <Link
              href='/faqs'
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium bg-primary'
            >
              FAQs
            </Link>
          </div>
          <div className='flex flex-col items-start pl-4'>
            <Link
              href='/public-bookshelf'
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium bg-primary'
            >
              Public Bookshelf
            </Link>
            <Link
              href='/'
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium bg-primary'
            >
              About
            </Link>
            <Link
              href='/resources'
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium bg-primary'
            >
              Resources
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
