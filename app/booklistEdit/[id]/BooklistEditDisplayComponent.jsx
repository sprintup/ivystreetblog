'use client';
import { useState, useEffect } from 'react';
import UserBookCollectionComponent from './UserBookCollectionComponent';
import BookRemoveFromCollectionComponent from './BookRemoveFromCollectionComponent';

export default function BooklistEditDisplayComponent({ booklistId }) {
  const [booklist, setBooklist] = useState(null);

  useEffect(() => {
    fetchBooklist();
  }, [booklistId]);

  const fetchBooklist = async () => {
    try {
      const response = await fetch(`/api/booklist/${booklistId}/books`);
      if (response.ok) {
        const data = await response.json();
        setBooklist(data);
      } else {
        console.error('Error fetching booklist:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching booklist:', error);
    }
  };

  const handleBookChange = () => {
    // Refresh the booklist data after a book is added/removed
    fetchBooklist();
  };

  if (!booklist) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mt-8'>
      <h3 className='text-xl mb-4'>
        {booklist.bookIds.length || 0}{' '}
        {booklist.bookIds.length === 1 ? 'Book' : 'Books'} in this Booklist
      </h3>
      {booklist.bookIds.map(book => (
        <div key={book._id} className='flex justify-between items-center mb-4'>
          <BookDetails book={book} />
          <BookRemoveFromCollectionComponent
            bookId={book._id}
            booklistId={booklistId}
            onBookRemoved={handleBookChange}
          />
        </div>
      ))}
      <UserBookCollectionComponent
        booklistId={booklistId}
        onBookAdded={handleBookChange}
      />
    </div>
  );
}

function BookDetails({ book }) {
  if (!book) {
    return <div>Loading book details...</div>;
  }

  return (
    <div className='w-full px-3 mx-3 py-2 bg-secondary text-accent rounded-md'>
      <div>
        <h4 className='text-xl font-bold mb-1'>{book.Name}</h4>
        <p className='text-sm mb-2'>Author: {book.Author}</p>
        {book.Description && (
          <p className='text-sm mb-1'>Description: {book.Description}</p>
        )}
        {book.Age && <p className='text-sm mb-1'>Age: {book.Age}</p>}
        {book.Series && <p className='text-sm mb-1'>Series: {book.Series}</p>}
        {book.Publication_Date && (
          <p className='text-sm mb-1'>
            Publication Date: {book.Publication_Date}
          </p>
        )}
        {book.Publisher && (
          <p className='text-sm mb-1'>Publisher: {book.Publisher}</p>
        )}
        {book.ISBN && <p className='text-sm mb-1'>ISBN: {book.ISBN}</p>}
        {book.Link && <p className='text-sm mb-1'>Link: {book.Link}</p>}
        {book.Source && <p className='text-sm mb-1'>Source: {book.Source}</p>}
      </div>
    </div>
  );
}
