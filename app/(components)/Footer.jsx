'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop > 0 && scrollTop + clientHeight < scrollHeight - 20) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <footer
      className={`py-4 fixed bottom-0 left-0 right-0 transition-opacity duration-300 bg-primary ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-center items-center'>
          <div className='flex flex-col items-end border-r border-accent pr-4'>
            <Link
              href='/terms'
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium'
            >
              Terms of service (last updated 5.23.2024)
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL}
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium'
            >
              Edit on Github
            </Link>
            <Link
              href='/faqs'
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium'
            >
              FAQs
            </Link>
          </div>
          <div className='flex flex-col items-start pl-4'>
            <Link
              href='/public-bookshelf'
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium'
            >
              Public Bookshelf
            </Link>
            <Link
              href='/'
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium'
            >
              About
            </Link>
            <Link
              href='/resources'
              className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium'
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
