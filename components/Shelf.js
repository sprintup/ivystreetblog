// components/Shelf.js
import React from "react";

const Shelf = ({ booklist, onBookClick, onBooklistClick }) => {
  return (
    <div className="mb-8">
      <h2
        className="text-2xl font-bold mb-2 cursor-pointer"
        onClick={() => onBooklistClick(booklist)}
      >
        {booklist.title}
      </h2>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-start">
          {booklist.books.map((book) => (
            <div
              key={book.isbn}
              className="book-spine relative flex flex-col items-center justify-center h-56 w-12 bg-gray-200 text-gray-800 border border-gray-400 rounded mx-2 p-2 cursor-pointer transform hover:scale-105 transition duration-300"
              onClick={() => onBookClick(book)}
            >
              <div className="book-title flex flex-col items-center justify-center text-center text-xs font-bold transform -rotate-90 origin-center">
                <span className="whitespace-nowrap">{book.title}</span>
                <span className="whitespace-nowrap text-xxs mt-1">
                  {book.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shelf;
