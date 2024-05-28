// components/AddToBooklistButton.jsx

'use client';

import React, { useState } from 'react';

export default function AddToBooklistButton({ book, signedInUserBooklists }) {
  const [selectedBooklist, setSelectedBooklist] = useState('');
  const [message, setMessage] = useState('');

  const handleBooklistChange = e => {
    setSelectedBooklist(e.target.value);
  };

  const handleAddToBooklist = async () => {
    if (!selectedBooklist) {
      setMessage('Please select a booklist');
      return;
    }

    try {
      const response = await fetch(`/api/booklist/${selectedBooklist}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: book._id }),
      });

      if (response.ok) {
        setMessage('Book added successfully!');
      } else {
        throw new Error('Failed to add book.');
      }
    } catch (error) {
      console.error('Error adding book to the booklist:', error);
      setMessage('Failed to add book.');
    }
  };

  return (
    <div className='rounded-md px-2'>
      <div className='relative'>
        <select
          value={selectedBooklist}
          onChange={handleBooklistChange}
          className='w-full px-3 py-1 pr-8 border border-yellow rounded-md bg-secondary text-yellow text-sm appearance-none'
        >
          <option value=''>Select Booklist</option>
          {signedInUserBooklists.map(booklist => (
            <option key={booklist._id} value={booklist._id}>
              {booklist.title}
            </option>
          ))}
        </select>
        <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
          <svg
            className='w-4 h-4 text-yellow'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      </div>
      <button
        onClick={handleAddToBooklist}
        className='mt-2 px-3 py-1 rounded-md bg-yellow text-primary text-sm w-full'
      >
        Add To Booklist
      </button>
      {message && (
        <p
          className={`mt-1 text-xs ${
            selectedBooklist ? 'text-yellow' : 'text-tertiary'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
