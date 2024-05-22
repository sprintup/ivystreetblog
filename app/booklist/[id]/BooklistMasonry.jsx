// app/booklist/[id]/BooklistMasonry.jsx

'use client';

import React from 'react';
import Masonry from 'react-masonry-css';
import BookDetailsPublicComponent from '../../(components)/BookDetailsPublicComponent';
import AddToReadingListButton from '@components/AddToReadingListButton';
import AddToBooklistButton from '@components/AddToBooklistButton';
import { useSession } from 'next-auth/react';
import './BooklistMasonry.css';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export default function BooklistMasonry({ booklist, userBooklists }) {
  const { data: session } = useSession();

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className='my-masonry-grid'
      columnClassName='my-masonry-grid_column'
    >
      {booklist.books.map(book => (
        <div key={book._id}>
          <BookDetailsPublicComponent book={book} />
          {session && (
            <div className='flex space-x-2'>
              <AddToReadingListButton book={book} />
              <AddToBooklistButton book={book} userBooklists={userBooklists} />
            </div>
          )}
        </div>
      ))}
    </Masonry>
  );
}
