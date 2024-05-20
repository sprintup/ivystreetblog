// app/my-collection/UserCollectionMasonry.jsx

'use client';

import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import Link from 'next/link';
import BookDetailsPublic from '@/app/(components)/BookDetailsPublicComponent';
import './UserCollectionMasonry.css';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export default function UserCollectionMasonry({ books, setBooks }) {
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleDeleteBook = async () => {
    try {
      const response = await fetch(`/api/book`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: selectedBookId }),
      });

      if (response.ok) {
        setBooks(books.filter(book => book._id !== selectedBookId));
        setSelectedBookId(null);
        setIsPopupOpen(false);
      } else {
        console.error('Error removing book:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  const handleArchiveBook = async () => {
    try {
      const response = await fetch(`/api/book/archive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: selectedBookId }),
      });

      if (response.ok) {
        setBooks(books.filter(book => book._id !== selectedBookId));
        setSelectedBookId(null);
        setIsPopupOpen(false);
      } else {
        console.error('Error archiving book:', response.statusText);
      }
    } catch (error) {
      console.error('Error archiving book:', error);
    }
  };

  const openPopup = bookId => {
    setSelectedBookId(bookId);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedBookId(null);
    setIsPopupOpen(false);
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className='my-masonry-grid'
      columnClassName='my-masonry-grid_column'
    >
      {books.map(book => (
        <div key={book._id}>
          <BookDetailsPublic
            book={book}
            buttons={
              <div className='flex flex-wrap justify-end'>
                <Link href={`/bookEdit/${book._id}`}>
                  <button className='bg-yellow text-primary px-2 py-1 rounded mr-2 mb-2 text-sm md:text-base'>
                    Edit
                  </button>
                </Link>
                <button
                  className='bg-red-500 text-white px-2 py-1 rounded mr-2 mb-2 text-sm md:text-base'
                  onClick={() => openPopup(book._id)}
                >
                  Delete
                </button>
                <button
                  className='bg-gray-500 text-white px-2 py-1 rounded mb-2 text-sm md:text-base'
                  onClick={() => openPopup(book._id)}
                >
                  Archive
                </button>
              </div>
            }
          />
        </div>
      ))}

      {isPopupOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white p-8 mx-4 md:mx-8 lg:mx-16 rounded shadow-lg'>
            <h2 className='text-xl mb-4 text-gray-800'>Confirmation</h2>
            <p className='mb-4 text-gray-700'>
              Deleting a book from your collection will also delete it from all
              booklists and other people's reading lists.
            </p>
            <p className='mb-4 text-gray-700'>
              If you want to move the book out of your collection but keep it
              available on other users' reading lists and booklists, you can
              choose to archive the book instead.
            </p>
            <div className='flex flex-wrap justify-end'>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded mr-2 mb-2'
                onClick={handleDeleteBook}
              >
                Delete
              </button>
              <button
                className='bg-gray-500 text-white px-4 py-2 rounded mr-2 mb-2'
                onClick={handleArchiveBook}
              >
                Archive
              </button>
              <button
                className='bg-gray-300 text-gray-800 px-4 py-2 rounded mb-2'
                onClick={closePopup}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Masonry>
  );
}
