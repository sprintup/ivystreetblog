// components/AddToReadingListButton.jsx

'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AddToReadingListButton({ book }) {
  const { data: session } = useSession();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToReadingList = async () => {
    setIsAdding(true);

    try {
      const response = await fetch('/api/reading-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: session.user.email,
          bookId: book._id,
        }),
      });

      if (response.ok) {
        setIsAdded(true);
      } else {
        console.error(
          'Error adding book to reading list:',
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error adding book to reading list:', error);
    }

    setIsAdding(false);
  };

  return (
    <button
      onClick={handleAddToReadingList}
      disabled={isAdding || isAdded}
      className={`px-4 py-2 mt-2 ${
        isAdded ? 'bg-green-500' : 'bg-blue-500'
      } text-white font-bold rounded-lg ${
        isAdding ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
      } transition duration-300`}
    >
      {isAdded ? 'Added to Reading List' : 'Add to Reading List'}
    </button>
  );
}
