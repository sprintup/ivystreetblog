'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function BookAddToCollectionComponent({ onBookAdded }) {
  const [bookName, setBookName] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      return { redirect: '/api/auth/signin?callbackUrl=/my-bookshelf' };
    },
  });

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
        const newBook = await response.json();
        setBookName('');
        setBookAuthor('');
        setSuccessMessage('Book added to your collection successfully!');
        onBookAdded(newBook);
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
    <div className='bg-primary text-accent p-4 rounded-lg max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl'>Add a book to my collection</h2>
      </div>
      <div>
        {errorMessage && <p className='text-red-500 mb-4'>{errorMessage}</p>}
        {successMessage && (
          <p className='text-green-500 mb-4'>{successMessage}</p>
        )}
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
  );
}
