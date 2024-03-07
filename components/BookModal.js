// components/BookModal.js
import React from "react";

const BookModal = ({ visible, onClose, booklist }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">{booklist?.title}</h2>
        <p className="text-lg mb-4">{booklist?.description}</p>
        <ul>
          {booklist?.books.map((book) => (
            <li key={book.isbn} className="mb-2">
              <span className="font-bold">{book.title}</span> by {book.author}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 bg-accent text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookModal;
