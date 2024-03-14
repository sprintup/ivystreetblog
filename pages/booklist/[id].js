// pages/booklist/[id].js
import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import booklistDataMock from "../../data/booklistDataMock";
import BookSuggestions from "../../components/AddBook";

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

  const handleEdit = () => {
    router.push(`/booklist/${id}/edit`);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-8 py-4 text-white bg-secondary">
        <div className="sticky top-0 bg-secondary py-4 z-10 flex justify-between items-center">
          <h2 className="text-3xl font-bold">{booklist.title}</h2>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-primary text-white font-bold rounded hover:bg-primary-dark transition ease-in-out duration-150"
          >
            Edit
          </button>
        </div>
        <div className="mb-4">
          <p className="text-xl">{booklist.description}</p>
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
                  <p className="text-lg mb-2">Age: {book.Age}</p>
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
                      onClick={() => toggleExpand(book.ID)}
                    >
                      Product Details: {expandedBook === book.ID ? "▲" : "▼"}
                    </h4>
                    {expandedBook === book.ID && (
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
