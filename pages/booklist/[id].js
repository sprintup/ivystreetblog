// pages/booklist/[id].js
import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import booklistDataMock from "../../data/booklistDataMock";

const BooklistPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const booklist = booklistDataMock.find(
    (booklist) => booklist.id === parseInt(id),
  );

  const [expandedBook, setExpandedBook] = useState(null);

  const formatText = (text) => {
    return text.replace(/\n+/g, "");
  };

  const toggleExpand = (bookId) => {
    if (expandedBook === bookId) {
      setExpandedBook(null);
    } else {
      setExpandedBook(bookId);
    }
  };

  const getBookCoverImage = (link) => {
    const regex = /\/dp\/(\w+)/;
    const match = link.match(regex);
    if (match && match[1]) {
      const asin = match[1];
      return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`;
    }
    return null;
  };

  if (!booklist) {
    return (
      <Layout>
        <h2 className="text-2xl font-bold mb-4">Booklist not found</h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 text-white bg-secondary">
        <div className="sticky top-0 bg-secondary py-4 mb-8 z-10">
          <h2 className="text-3xl font-bold mb-4">{booklist.title}</h2>
          <p className="text-xl text-secondary">{booklist.description}</p>
        </div>
        <ul className="space-y-8">
          {booklist.books.map((book) => (
            <li key={book.ISBN_13} className="bg-tertiary p-4 rounded-lg">
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">{book.Name}</h3>
                <p className="text-lg mb-2">{book.Author}</p>
              </div>
              <div className="md:grid md:grid-cols-3 md:gap-4">
                <div className="mb-4 md:mb-0 md:col-span-1">
                  {getBookCoverImage(book.Link) && (
                    <a
                      href={book.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={getBookCoverImage(book.Link)}
                        alt={book.Name}
                        className="w-full h-auto mb-4 rounded md:w-48 md:h-64 md:object-cover cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                      />
                    </a>
                  )}
                  <p className="text-lg mb-2">
                    Publication Date: {book.Publication_Date}
                  </p>
                  {book.Best_Seller && (
                    <p className="text-lg mb-2 text-accent">
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
                      onClick={() => toggleExpand(book.ISBN_13)}
                    >
                      Product Details:{" "}
                      {expandedBook === book.ISBN_13 ? "▲" : "▼"}
                    </h4>
                    {expandedBook === book.ISBN_13 && (
                      <p className="text-lg whitespace-pre-wrap">
                        {formatText(book.Product_Details)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default BooklistPage;
