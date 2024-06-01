'use client';
// components/Accordion.jsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const AccordionFaqs = ({ title, content, isOpenByDefault = false }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const slugifiedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const accordionLink = `${pathname}#${slugifiedTitle}`;

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.origin + accordionLink
      );
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000); // Hide tooltip after 2 seconds
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === slugifiedTitle) {
      setIsOpen(true);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerOffset = 200; // Adjust this value to match your header's height
          const top =
            element.getBoundingClientRect().top +
            window.pageYOffset -
            document.documentElement.clientTop -
            headerOffset;
          window.scrollTo({
            top: top,
            behavior: 'smooth',
          });
        }
      }, 100); // Delay of 100ms
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === slugifiedTitle) {
        setIsOpen(true);
      }
    };

    if (router && router.events) {
      router.events.on('hashChangeComplete', handleHashChange);

      return () => {
        router.events.off('hashChangeComplete', handleHashChange);
      };
    }
  }, [router, slugifiedTitle]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === slugifiedTitle && isOpenByDefault) {
      setIsOpen(true);
    }
  }, [slugifiedTitle, isOpenByDefault]);

  return (
    <div className='accordion-item relative'>
      <div className='flex items-center justify-between'>
        <Link href={accordionLink} scroll={false}>
          <button
            className='w-full text-left focus:outline-none'
            onClick={toggleAccordion}
          >
            <h3
              className={`text-xl font-bold text-accent ${
                isOpen ? 'text-orange' : 'text-yellow'
              } hover:text-orange`}
            >
              {title}
            </h3>
          </button>
        </Link>
        <div className='relative'>
          <button
            className='text-primary bg-yellow px-2 py-1 rounded-md hover:bg-orange transition duration-300'
            onClick={copyLinkToClipboard}
          >
            Copy Link
          </button>
          {showTooltip && (
            <div className='absolute top-0 left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded'>
              Link copied!
            </div>
          )}
        </div>
      </div>
      <div
        className={`mt-2 ${isOpen ? 'block' : 'hidden'}`}
        id={slugifiedTitle}
      >
        {content}
      </div>
    </div>
  );
};

export default AccordionFaqs;
