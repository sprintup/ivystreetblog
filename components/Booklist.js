import React from 'react';
import BookDetails from './BookDetails';

const Bookshelf = () => {
  // Placeholder for books data
  const books = [];

  return (
    <div className="bookshelf">
      {books.map((book) => (
        <BookDetails key={book.isbn} book={book} />
      ))}
    </div>
  );
};

export default Bookshelf;