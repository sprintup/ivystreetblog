// components/AddToBooklistButtonComponent.jsx

'use client';

import React, { useState } from 'react';

export default function AddToBooklistButtonComponent({ book, booklistId }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToBooklist = async () => {
    setIsAdding(true);

    try {
      const response = await fetch(`/api/booklist/${booklistId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: book._id }),
      });

      if (response.ok) {
        setIsAdded(true);
      } else {
        console.error('Error adding book to booklist:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding book to booklist:', error);
    }

    setIsAdding(false);
  };

  return (
    <button
      onClick={handleAddToBooklist}
      disabled={isAdding || isAdded}
      className={`px-4 py-2 mt-2 ${
        isAdded ? 'bg-green-500' : 'bg-blue-500'
      } text-white font-bold rounded-lg ${
        isAdding ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
      } transition duration-300`}
    >
      {isAdded ? 'Added to Booklist' : 'Add to Booklist'}
    </button>
  );
}
