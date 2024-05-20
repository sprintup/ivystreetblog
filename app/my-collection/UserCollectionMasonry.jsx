// app/my-collection/UserCollectionMasonry.jsx

'use client';

import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import Link from 'next/link';
import BookDetailsPublic from '@/app/(components)/BookDetailsPublicComponent';
import './UserCollectionMasonry.css';
import { useRouter } from 'next/navigation';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export default function UserCollectionMasonry({ books, setBooks }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  const handleDeleteBook = async () => {
    try {
      const response = await fetch(`/api/book`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: selectedBook._id }),
      });

      if (response.ok) {
        setSelectedBook(null);
        setIsPopupOpen(false);
        router.refresh();
      } else {
        console.error('Error removing book:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  const handleToggleArchiveBook = async bookId => {
    try {
      const response = await fetch(`/api/book/toggleArchive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: bookId }),
      });

      if (response.ok) {
        setIsPopupOpen(false);
        router.refresh();
      } else {
        console.error('Error toggling book archive:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling book archive:', error);
    }
  };

  const openPopup = book => {
    setSelectedBook(book);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedBook(null);
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
                  onClick={() => openPopup(book)}
                >
                  Delete
                </button>
                <button
                  className={`${
                    book.IsArchived ? 'bg-blue-500' : 'bg-gray-500'
                  } text-white px-2 py-1 rounded mb-2 text-sm md:text-base`}
                  onClick={() => handleToggleArchiveBook(book._id)}
                >
                  {book.IsArchived ? 'Unarchive' : 'Archive'}
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
            {!selectedBook.IsArchived && (
              <p className='mb-4 text-gray-700'>
                If you want to move the book out of your collection but keep it
                available on other users' reading lists and booklists, you can
                choose to archive the book instead.
              </p>
            )}
            <div className='flex flex-wrap justify-end'>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded mr-2 mb-2'
                onClick={handleDeleteBook}
              >
                Delete
              </button>
              {!selectedBook.IsArchived && (
                <button
                  className='bg-gray-500 text-white px-4 py-2 rounded mr-2 mb-2'
                  onClick={() => handleToggleArchiveBook(selectedBook._id)}
                >
                  Archive
                </button>
              )}
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
