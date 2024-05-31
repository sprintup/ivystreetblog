// app/my-reading-list/RemoveButton.jsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RemoveButton = ({ book }) => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRemoveBook = async () => {
    try {
      const response = await fetch(`/api/reading-list/${book._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Book removed successfully!');
        setTimeout(() => {
          setMessage('');
          router.refresh();
        }, 1000);
      } else {
        throw new Error('Failed to remove book');
      }
    } catch (error) {
      console.error('Error removing book:', error);
      setMessage('Failed to remove book. Please try again.');
    }
  };

  return (
    <>
      <button
        onClick={handleRemoveBook}
        className='px-2 py-1 rounded-md bg-red-500 text-white'
      >
        Remove
      </button>
      {message && (
        <p
          className={`mb-4 text-lg ${
            message.includes('success') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </>
  );
};

export default RemoveButton;
