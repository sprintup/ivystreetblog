'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AccordionWrapper from '@/app/(components)/AccordionWrapper';
import Accordion from '@/app/(components)/Accordion';
import {
  whatIsABooklistContent,
  whatIsProfileContent,
  privateBooklistContent,
  makeBooklistPublicContent,
} from '@/app/faqs/accordionContent';

export default function BooklistPage() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      return { redirect: '/api/auth/signin?callbackUrl=/my-bookshelf' };
    },
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [openToRecommendations, setOpenForRecommendations] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddBooklist = async () => {
    const booklist = {
      Id: Date.now(),
      title,
      description,
      bookIds: [],
      visibility,
      openToRecommendations,
    };
    console.log('Adding booklist:', booklist);
    try {
      const response = await fetch('/api/booklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: session.user.email, booklist }),
      });

      if (response.ok) {
        console.log('Booklist added');
        // Reset the form fields after successful addition
        setTitle('');
        setDescription('');
        setVisibility('public');
        setOpenForRecommendations(false);
        // Redirect to the /my-bookshelf page and reload it
        router.push('/my-bookshelf');
        router.refresh();
      } else {
        console.error('Error adding booklist');
        setErrorMessage('Failed to add booklist. Please try again.');
      }
    } catch (error) {
      console.error('Error adding booklist:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className='bg-primary text-accent p-4 rounded-lg max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl'>Add a new booklist</h2>
      </div>
      <AccordionWrapper title='Show More Information'>
        <Accordion
          title='What is a booklist?'
          content={whatIsABooklistContent}
          isOpenByDefault={true}
        />
        <Accordion
          title='What does it mean to make a booklist public?'
          content={makeBooklistPublicContent}
        />
        <Accordion
          title='What is a public profile name?'
          content={whatIsProfileContent}
        />
        <Accordion
          title='What does it mean to make a booklist private?'
          content={privateBooklistContent}
        />
      </AccordionWrapper>
      {errorMessage && <p className='text-red-500 mb-4'>{errorMessage}</p>}
      <div className='mb-4'>
        <label className='block text-lg mb-2'>
          Title:
          <input
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
          />
        </label>
      </div>
      <div className='mb-4'>
        <label className='block text-lg mb-2'>
          Description:
          <textarea
            type='text'
            value={description}
            onChange={e => setDescription(e.target.value)}
            className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
          />
          <p className='text-sm text-gray-500'>
            Use the booklist description to describe who the booklist is for
            generally (remember, no personally identifiable information), like
            anyone interested in learning about poetry or a certain theory or
            genre. You can also use this field to describe recommendations
            you're seeking in this booklist.
          </p>
        </label>
      </div>
      <div className='mb-4'>
        <label className='block text-lg mb-2'>
          Visibility:
          <select
            value={visibility}
            onChange={e => setVisibility(e.target.value)}
            className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
          >
            <option value='public'>Public</option>
            <option value='private'>Private</option>
          </select>
        </label>
      </div>
      <div className='mb-4'>
        <label className='flex items-center text-lg'>
          <input
            type='checkbox'
            checked={openToRecommendations}
            onChange={e => setOpenForRecommendations(e.target.checked)}
            className='mr-2'
          />
          Open for recommendations
        </label>
      </div>
      <div className='flex justify-end'>
        <button
          onClick={handleAddBooklist}
          className='px-4 py-2 bg-yellow text-primary font-bold rounded-lg hover:bg-orange transition duration-300'
        >
          Add Booklist
        </button>
      </div>
    </div>
  );
}
