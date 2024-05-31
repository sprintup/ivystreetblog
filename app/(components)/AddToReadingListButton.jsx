// app/booklist/[id]/AddToReadingListButton.jsx

'use client';

import { useState } from 'react';

export default function AddToReadingListButton({ book }) {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddToReadingList = async () => {
    try {
      const response = await fetch('/api/user/tracked', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: book._id }),
      });

      if (response.ok) {
        setMessage('Added to reading list!');
        setIsSuccess(true);
      } else {
        throw new Error('Failed to add book.');
      }
    } catch (error) {
      console.error('Error adding book to reading list:', error);
      setMessage('Failed to add book.');
      setIsSuccess(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAddToReadingList}
        className='bg-yellow text-primary px-2 py-1 rounded-lg text-sm w-full'
      >
        Add to Reading List
      </button>
      {message && (
        <p
          className={`mt-1 text-xs ${
            isSuccess ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
