'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';

const buildTimestamp = Date.now();
const formattedDateTime = new Date(buildTimestamp).toLocaleString();

const Footer = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrollPossible, setIsScrollPossible] = useState(false);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop > 0 && scrollTop + clientHeight < scrollHeight - 20) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrollPossible(scrollHeight > clientHeight);
      setIsScrolledToTop(scrollTop === 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const shouldShowDownwardArrow =
    isVisible && isScrollPossible && isScrolledToTop;

  return (
    <footer
      className={`py-4 fixed bottom-0 left-0 right-0 transition-opacity duration-300 bg-primary border-t-2 border-solid border-accent-100 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {shouldShowDownwardArrow && (
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full'>
          <div className='flex flex-col items-center'>
            <FaChevronDown className='text-yellow hover:text-orange focus:text-orange mb-1' />
          </div>
        </div>
      )}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-center items-center'>
          <div className='flex'>
            <div className='flex flex-col items-end border-r border-accent pr-4'>
              <Link
                href='/faqs'
                className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium'
              >
                FAQs
              </Link>
              <Link
                href='/terms'
                className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium'
              >
                Terms of service (5.23.2024)
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL}
                className='text-yellow hover:text-orange focus:text-orange block px-2 rounded-md text-base font-medium'
              >
                Edit on Github
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
        <div className='text-yellow text-sm text-right mt-2'>
          Last Updated: {formattedDateTime}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
