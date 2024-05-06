import React from "react";

const BookDetails = ({ book }) => {
  return (
    <div className="book-details">
      <img src={book.coverImage} alt={book.title} />
      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
      <p>Publication Year: {book.publicationYear}</p>
      <p>ISBN: {book.isbn}</p>
      {/* Add more book details as needed */}
    </div>
  );
};

export default BookDetails;
