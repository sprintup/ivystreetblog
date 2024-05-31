'use client';

import React from 'react';
import Link from 'next/link';
import RemoveButton from './RemoveButton';
import { useStatusChange } from './useStatusChange';

const ToReadBook = ({ book, trackedBook }) => {
  const { message, handleStatusChange } = useStatusChange(book);

  return (
    <li className='p-4 rounded-lg shadow-md bg-secondary'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <Link href={`/book/${book._id}`}>
            <h3 className='text-xl font-bold text-yellow hover:text-orange'>
              {book.Name}
            </h3>
          </Link>
          <p className='text-sm'>by {book.Author}</p>
        </div>
        <div className='flex flex-col space-y-2'>
          <select
            value={trackedBook.status}
            onChange={handleStatusChange}
            className='px-2 py-1 rounded-md bg-primary text-yellow'
          >
            <option value='to-read'>To Read</option>
            <option value='finished'>Finished</option>
          </select>
          <RemoveButton book={book} />
        </div>
      </div>
      {message && (
        <p
          className={`mb-4 text-lg ${
            message.includes('success') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </li>
  );
};

export default ToReadBook;
