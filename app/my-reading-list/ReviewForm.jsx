// app/my-reading-list/ReviewForm.jsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ReviewForm = ({ book, trackedBook, onClose }) => {
  const [review, setReview] = useState(trackedBook.review || '');
  const [ratingPerceivedDifficulty, setRatingPerceivedDifficulty] = useState(
    trackedBook.ratingPerceivedDifficulty || 1
  );
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/review/${book._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review, ratingPerceivedDifficulty }),
      });

      if (response.ok) {
        setMessage('Review updated successfully!');
        setTimeout(() => {
          onClose();
          router.refresh();
        }, 1000);
      } else {
        throw new Error('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      setMessage('Failed to update review. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <p className='mb-4 text-lg text-green-500'>{message}</p>}
      <div className='mb-4'>
        <label htmlFor='review' className='block text-lg mb-2'>
          Review:
        </label>
        <textarea
          id='review'
          value={review}
          onChange={e => setReview(e.target.value)}
          className='w-full px-4 py-2 rounded-md bg-white text-primary'
          rows={4}
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='ratingPerceivedDifficulty'
          className='block text-lg mb-2'
        >
          Perceived Difficulty:
        </label>
        <select
          id='ratingPerceivedDifficulty'
          value={ratingPerceivedDifficulty}
          onChange={e => setRatingPerceivedDifficulty(parseInt(e.target.value))}
          className='w-full px-4 py-2 rounded-md bg-white text-primary'
        >
          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
      <button
        type='submit'
        className='px-4 py-2 rounded-md bg-yellow text-primary'
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
