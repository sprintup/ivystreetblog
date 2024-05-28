// app/public-bookshelf/public-booklist/[id]/BooklistMasonry.jsx

'use client';

import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import BookDetailsPublicComponent from '@components/BookDetailsPublicComponent';
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
  const [userBooklistsForDropdown, setUserBooklistsForDropdown] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          // Fetch user booklists
          const booklistsResponse = await fetch(
            '/api/user/booklists-dropdown',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: session.user.email }),
            }
          );
          const booklistsDataIncludingPrivateBooklists =
            await booklistsResponse.json();
          setUserBooklistsForDropdown(booklistsDataIncludingPrivateBooklists);
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
            <BookDetailsPublicComponent book={book}>
              {session && (
                <div className='flex space-x-2 mt-4'>
                  <AddToReadingListButton book={book} />
                  <AddToBooklistButton
                    book={book}
                    signedInUserBooklists={userBooklistsForDropdown}
                  />
                </div>
              )}
            </BookDetailsPublicComponent>
          </div>
        ))}
      </Masonry>
    </div>
  );
}
