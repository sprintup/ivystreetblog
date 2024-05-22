// app/booklist/[id]/BookDetailsPublicComponent.js

import React from 'react';
import Link from 'next/link';

export default function BookDetailsPublicComponent({ book, buttons }) {
  if (!book) {
    return null;
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, maxLength)}...`;
  };

  return (
    <div className='bg-secondary p-4 rounded-lg shadow-md flex flex-col break-inside-avoid mb-2'>
      <Link href={`/book/${book._id}`}>
        <h2 className='text-xl text-yellow mb-2 hover:underline cursor-pointer'>
          {book.Name}
        </h2>
      </Link>
      {book.Author && (
        <p className='text-sm mb-1'>
          <span className='font-bold'>Author:</span> {book.Author}
        </p>
      )}
      {book.Description && (
        <div className='text-sm mb-1 flex-grow pl-1 border-l-2 border-dotted border-accent-500'>
          <span className='font-bold'>Description:</span> {book.Description}
        </div>
      )}
      {book.Age && (
        <p className='text-sm mb-1'>
          <span className='font-bold'>Age:</span> {book.Age}
        </p>
      )}
      {book.Series && (
        <p className='text-sm mb-1'>
          <span className='font-bold'>Series:</span> {book.Series}
        </p>
      )}
      {book.Publication_Date && (
        <p className='text-sm mb-1'>
          <span className='font-bold'>Publication Date:</span>{' '}
          {book.Publication_Date}
        </p>
      )}
      {book.Publisher && (
        <p className='text-sm mb-1'>
          <span className='font-bold'>Publisher:</span> {book.Publisher}
        </p>
      )}
      {book.ISBN && (
        <p className='text-sm mb-1'>
          <span className='font-bold'>ISBN:</span> {book.ISBN}
        </p>
      )}
      {book.Source && (
        <p className='text-sm mb-1'>
          <span className='font-bold'>Source:</span> {book.Source}
        </p>
      )}
      {book.Link && (
        <p className='text-sm mb-1 break-all'>
          <span className='font-bold'>Link:</span>{' '}
          <a
            href={book.Link}
            target='_blank'
            rel='noopener noreferrer'
            className='text-yellow hover:underline'
            title={book.Link}
          >
            {truncateText(book.Link, 30)}
          </a>
        </p>
      )}
      {buttons && <div className='mt-4'>{buttons}</div>}
    </div>
  );
}
