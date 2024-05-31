'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AddBookForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [bookName, setBookName] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      return { redirect: '/api/auth/signin?callbackUrl=/my-bookshelf' };
    },
  });

  useEffect(() => {
    let timer;
    if (errorMessage || successMessage) {
      timer = setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddBookToCollection = async e => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!bookName) {
      setErrorMessage('Please provide a book name.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: bookName,
          Author: bookAuthor,
        }),
      });

      if (response.ok) {
        setBookName('');
        setBookAuthor('');
        setSuccessMessage('Book added to your collection successfully!');
        router.refresh();
        toggleExpanded();
      } else {
        console.error('Error adding book:', response.statusText);
        setErrorMessage('Failed to add book. Please try again.');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className='bg-secondary text-yellow px-4 py-2 rounded'
        onClick={toggleExpanded}
      >
        {isExpanded ? 'Collapse' : 'Add Book'}
      </button>
      <div className='mt-2'>
        {errorMessage && (
          <p className='text-red-500 mb-4 transition-opacity duration-500 ease-out opacity-100'>
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className='text-green-500 mb-4 transition-opacity duration-500 ease-out opacity-100'>
            {successMessage}
          </p>
        )}
      </div>
      {isExpanded && (
        <div className='mt-2 bg-primary text-accent p-4 rounded-lg w-full mx-auto'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl'>Add a book to my collection</h2>
          </div>
          <div>
            <form onSubmit={handleAddBookToCollection}>
              <div className='mb-4'>
                <label className='block text-lg mb-2'>
                  Book Name:
                  <input
                    type='text'
                    value={bookName}
                    onChange={e => setBookName(e.target.value)}
                    className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
                  />
                </label>
              </div>
              <div className='mb-4'>
                <label className='block text-lg mb-2'>
                  Book Author:
                  <input
                    type='text'
                    value={bookAuthor}
                    onChange={e => setBookAuthor(e.target.value)}
                    className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
                  />
                </label>
              </div>
              <button
                type='submit'
                className='px-4 py-2 bg-yellow text-primary font-bold rounded-lg hover:bg-orange transition duration-300'
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Book to Collection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
