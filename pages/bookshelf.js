// pages/bookshelf.js
import React, { useState } from "react";
import BookDetails from "../components/BookDetails";
import BookModal from "../components/BookModal";
import Shelf from "../components/Shelf";
import Layout from "../components/Layout";
import booklistDataMock from "../data/booklistDataMock";

const Bookshelf = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const openBookModal = (book) => {
    setSelectedBook(book);
    setIsBookModalOpen(true);
  };

  const closeBookModal = () => {
    setSelectedBook(null);
    setIsBookModalOpen(false);
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-4">Bookshelf</h1>
      {booklistDataMock.map((booklist) => (
        <Shelf
          key={booklist.id}
          booklist={booklist}
          onBookClick={openBookModal}
        />
      ))}

      <BookModal
        isOpen={isBookModalOpen}
        onClose={closeBookModal}
        book={selectedBook}
      />
    </Layout>
  );
};

export default Bookshelf;
