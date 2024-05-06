"use client";
import React, { useState } from "react";
import Modal from "react-modal";

const BookModal = ({ isOpen, onClose, book }) => {
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);

  if (!isOpen || !book) return null;

  const getBookCoverImage = (link) => {
    const regex = /\/dp\/(\w+)/;
    const match = link.match(regex);
    if (match && match[1]) {
      const asin = match[1];
      return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`;
    }
    return null;
  };

  const formatText = (text) => {
    return text.replace(/\n+/g, "");
  };

  const toggleProductDetails = () => {
    setIsProductDetailsOpen(!isProductDetailsOpen);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Book Modal"
      className="flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-4 rounded-lg max-w-4xl w-full">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{book.Name}</h2>
            <p className="text-lg mb-2">{book.Author}</p>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="md:grid md:grid-cols-3 md:gap-4">
          <div className="mb-4 md:mb-0 md:col-span-1">
            {getBookCoverImage(book.Link) && (
              <a href={book.Link} target="_blank" rel="noopener noreferrer">
                <img
                  src={getBookCoverImage(book.Link)}
                  alt={book.Name}
                  className="w-full h-auto mb-4 rounded md:w-48 md:h-64 md:object-cover cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                />
              </a>
            )}
            <p className="text-lg mb-2">Age: {book.Age}</p>
            <p className="text-lg mb-2">
              Publication Date: {book.Publication_Date}
            </p>
            {book.Best_Seller && (
              <p className="text-lg mb-2 text-blue-500">
                Best Seller: {book.Best_Seller}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <div className="mb-4">
              <h4 className="text-xl font-bold mb-2">Description:</h4>
              <p className="text-lg whitespace-pre-wrap">
                {formatText(book.Description)}
              </p>
            </div>
            <div className="mb-4">
              <h4
                className="text-xl font-bold mb-2 cursor-pointer"
                onClick={toggleProductDetails}
              >
                Product Details: {isProductDetailsOpen ? "▲" : "▼"}
              </h4>
              {isProductDetailsOpen && (
                <p className="text-lg whitespace-pre-wrap">
                  {formatText(book.Product_Details)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BookModal;
