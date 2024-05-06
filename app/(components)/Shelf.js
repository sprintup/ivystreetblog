import React from "react";
import Link from "next/link";

const Shelf = ({ booklist, onBookClick }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2 cursor-pointer text-yellow hover:text-orange focus:text-orange">
        <Link href={`/booklist/${booklist.id}`}>{booklist.title}</Link>
      </h2>
      <div className="flex justify-start">
        {booklist?.books?.map((book) => (
          <div
            key={book.ISBN_13}
            className="relative flex flex-col items-center justify-center h-56 w-12 bg-gray-200 text-gray-800 border border-gray-300 rounded-md mr-2 p-2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => onBookClick(book)}
          >
            <div className="flex flex-col items-center justify-center text-center transform -rotate-90 origin-center w-48 overflow-hidden">
              <span className="text-xs font-bold w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-center">
                {book.Name}
              </span>
              <span className="text-xs mt-1 w-full whitespace-nowrap overflow-hidden overflow-ellipsis">
                {book.Author}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shelf;
