// components/AddBook.js
import React, { useState } from "react";
import axios from "axios";

const AddBook = ({ onAddBook }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [customBook, setCustomBook] = useState({
    ID: Date.now(),
    Name: "",
    Series: "",
    Description: "",
    Author: "",
    Age: "",
    Publication_Date: "",
    Product_Details: "",
    Publisher: "",
    ISBN: "",
    Link: "",
  });

  const fetchSuggestions = async (e) => {
    e.preventDefault();
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `http://openlibrary.org/search.json?q=${query}&limit=5`,
        );
        setSuggestions(
          response.data.docs.map((doc) => ({
            title: doc.title,
            author: doc.author_name ? doc.author_name[0] : "Unknown",
            publishYear: doc.first_publish_year || "Unknown",
          })),
        );
      } catch (error) {
        console.error("Failed to fetch book suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectBook = (e, book) => {
    e.preventDefault();
    setCustomBook({
      ...customBook,
      Name: book.title,
      Author: book.author,
      Publication_Date: book.publishYear,
    });
  };

  const handleCustomBookChange = (e) => {
    setCustomBook({
      ...customBook,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddBook = () => {
    onAddBook(customBook);
    setCustomBook({
      ID: Date.now(),
      Name: "",
      Series: "",
      Description: "",
      Author: "",
      Age: "",
      Publication_Date: "",
      Product_Details: "",
      Publisher: "",
      ISBN: "",
      Link: "",
    });
  };

  const handleClearForm = (e) => {
    e.preventDefault();
    setCustomBook({
      ID: Date.now(),
      Name: "",
      Series: "",
      Description: "",
      Author: "",
      Age: "",
      Publication_Date: "",
      Product_Details: "",
      Publisher: "",
      ISBN: "",
      Link: "",
    });
  };

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="flex mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books..."
            className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
          />
          <button
            onClick={fetchSuggestions}
            className="ml-2 px-4 py-2 bg-primary text-white font-bold rounded hover:bg-primary-dark transition ease-in-out duration-150"
          >
            Search
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="space-y-2">
            {suggestions.map((book, index) => (
              <li
                key={index}
                className="bg-tertiary p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="text-xl font-bold">{book.title}</p>
                  <p className="text-lg">
                    {book.author} - {book.publishYear}
                  </p>
                </div>
                <button
                  onClick={(e) => handleSelectBook(e, book)}
                  className="px-4 py-2 bg-primary text-white font-bold rounded hover:bg-primary-dark transition ease-in-out duration-150"
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <div className="space-y-4">
          <input
            type="text"
            name="Name"
            value={customBook.Name}
            onChange={handleCustomBookChange}
            placeholder="Book Title"
            className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
          />
          <input
            type="text"
            name="Series"
            value={customBook.Series}
            onChange={handleCustomBookChange}
            placeholder="Series"
            className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
          />
          <textarea
            name="Description"
            value={customBook.Description}
            onChange={handleCustomBookChange}
            placeholder="Description"
            className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
          />
          <input
            type="text"
            name="Author"
            value={customBook.Author}
            onChange={handleCustomBookChange}
            placeholder="Author"
            className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
          />
          <input
            type="text"
            name="Age"
            value={customBook.Age}
            onChange={handleCustomBookChange}
            placeholder="Age"
            className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
          />
          <input
            type="text"
            name="Publication_Date"
            value={customBook.Publication_Date}
            onChange={handleCustomBookChange}
            placeholder="Publication Date"
            className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
          />
          <textarea
            name="Product_Details"
            value={customBook.Product_Details}
            onChange={handleCustomBookChange}
            placeholder="Product Details"
            className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
          />
          <input
            type="text"
            name="Publisher"
            value={customBook.Publisher}
            onChange={handleCustomBookChange}
            placeholder="Publisher"
            className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
          />
          <input
            type="text"
            name="ISBN"
            value={customBook.ISBN}
            onChange={handleCustomBookChange}
            placeholder="ISBN"
            className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
          />
          <input
            type="text"
            name="Link"
            value={customBook.Link}
            onChange={handleCustomBookChange}
            placeholder="Link"
            className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleClearForm}
            className="px-4 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 transition ease-in-out duration-150"
          >
            Clear
          </button>
          <button
            onClick={handleAddBook}
            className="px-4 py-2 bg-primary text-white font-bold rounded hover:bg-primary-dark transition ease-in-out duration-150"
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
