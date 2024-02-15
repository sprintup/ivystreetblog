import React from 'react';

const BookDetails = ({ book }) => {
  return (
    <div className="book-details">
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      {/* More details and Amazon Smile link */}
    </div>
  );
};

export default BookDetails;