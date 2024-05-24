// components/RecommendBookToBooklistButton.jsx

'use client';

import React, { useState, useEffect } from 'react';

export default function RecommendBookToBooklistButton({
  booklist,
  signedInUserBooks,
}) {
  const [selectedBook, setSelectedBook] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [recommendationReason, setRecommendationReason] = useState('');

  useEffect(() => {
    const filtered = signedInUserBooks.filter(book =>
      book.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchQuery, signedInUserBooks]);

  const handleBookChange = e => {
    setSelectedBook(e.target.value);
  };

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleRecommendationReasonChange = e => {
    setRecommendationReason(e.target.value);
  };

  const handleRecommendBook = async () => {
    if (!selectedBook) {
      setMessage('Please select a book');
      return;
    }

    try {
      const response = await fetch(`/api/booklist/${booklist._id}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: selectedBook, recommendationReason }),
      });

      if (response.ok) {
        setMessage('Book recommendation sent successfully!');
      } else {
        throw new Error('Failed to recommend book.');
      }
    } catch (error) {
      console.error('Error recommending book to the booklist:', error);
      setMessage('Failed to recommend book.');
    }
  };

  return (
    <div className='border border-yellow rounded-md p-4'>
      <div className='relative mb-4'>
        <input
          type='text'
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search your books'
          className='w-full px-3 py-1 pr-8 rounded-md bg-secondary text-yellow text-sm'
        />
      </div>
      <div className='relative mb-4'>
        <textarea
          value={recommendationReason}
          onChange={handleRecommendationReasonChange}
          placeholder='Enter recommendation reason'
          className='w-full px-3 py-1 pr-8 rounded-md bg-secondary text-yellow text-sm'
        ></textarea>
      </div>
      <div className='relative'>
        <select
          value={selectedBook}
          onChange={handleBookChange}
          className='w-full px-3 py-1 pr-8 rounded-md bg-secondary text-yellow text-sm appearance-none'
        >
          <option value=''>Select Book</option>
          {filteredBooks.map(book => (
            <option key={book._id} value={book._id}>
              {book.Name}
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
        onClick={handleRecommendBook}
        className='mt-4 px-3 py-1 rounded-md bg-yellow text-primary text-sm w-full'
      >
        Recommend Book
      </button>
      {message && <p className={`mt-1 text-xs text-yellow`}>{message}</p>}
    </div>
  );
}
