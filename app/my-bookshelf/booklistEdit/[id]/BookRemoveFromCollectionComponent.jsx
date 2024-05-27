'use client';
import { useState } from 'react';

export default function BookRemoveFromCollectionComponent({
  bookId,
  booklistId,
  onBookRemoved,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRemoveBookFromBooklist = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/booklist/${booklistId}/book`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
      });

      if (response.ok) {
        onBookRemoved();
        setMessage('Book removed from booklist successfully!');
      } else {
        console.error(
          'Error removing book from booklist:',
          response.statusText
        );
        setMessage('Failed to remove book from booklist. Please try again.');
      }
    } catch (error) {
      console.error('Error removing book from booklist:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleRemoveBookFromBooklist}
        className='px-4 py-2 mx-1 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-300'
        disabled={isLoading}
      >
        {isLoading ? 'Removing...' : 'Remove from Booklist'}
      </button>
      {message && (
        <p
          className={`text-sm ${
            message.includes('success') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
