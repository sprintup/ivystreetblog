// app/booklist/[id]/BooklistMasonry.jsx

'use client';

import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import BookDetailsPublicComponent from '../../(components)/BookDetailsPublicComponent';
import AddToReadingListButton from '@components/AddToReadingListButton';
import AddToBooklistButton from '@components/AddToBooklistButton';
import { useSession } from 'next-auth/react';
import './BooklistMasonry.css';

const breakpointColumnsObj = {
  default: 3,
  1100: 3,
  700: 2,
  500: 1,
};

export default function BooklistMasonry({ booklist }) {
  const { data: session } = useSession();
  const [userBooklists, setUserBooklists] = useState([]);
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          // Fetch user booklists
          const booklistsResponse = await fetch('/api/user/booklists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email }),
          });
          const booklistsData = await booklistsResponse.json();
          setUserBooklists(booklistsData);

          // Fetch user books
          const booksResponse = await fetch('/api/user/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email }),
          });
          const booksData = await booksResponse.json();
          setUserBooks(booksData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  return (
    <div>
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
                <AddToBooklistButton
                  book={book}
                  signedInUserBooklists={userBooklists}
                />
              </div>
            )}
          </div>
        ))}
      </Masonry>
    </div>
  );
}
