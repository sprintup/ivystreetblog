// pages/bookshelf.js
import React, { useState } from "react";
import BookDetails from "../components/BookDetails";
import BookModal from "../components/BookModal";
import BooklistModal from "../components/BooklistModal";
import Shelf from "../components/Shelf";
import Layout from "../components/Layout";
import booklistDataMock from "../data/booklistDataMock";

const Bookshelf = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBooklist, setSelectedBooklist] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isBooklistModalOpen, setIsBooklistModalOpen] = useState(false);

  const openBookModal = (book) => {
    setSelectedBook(book);
    setIsBookModalOpen(true);
  };

  const closeBookModal = () => {
    setSelectedBook(null);
    setIsBookModalOpen(false);
  };

  const openBooklistModal = (booklist) => {
    setSelectedBooklist(booklist);
    setIsBooklistModalOpen(true);
  };

  const closeBooklistModal = () => {
    setSelectedBooklist(null);
    setIsBooklistModalOpen(false);
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-4">Bookshelf</h1>
      {booklistDataMock.map((booklist) => (
        <Shelf
          key={booklist.id}
          booklist={booklist}
          onBookClick={openBookModal}
          onBooklistClick={openBooklistModal}
        />
      ))}

      <BookModal
        isOpen={isBookModalOpen}
        onClose={closeBookModal}
        book={selectedBook}
      />

      <BooklistModal
        isOpen={isBooklistModalOpen}
        onClose={closeBooklistModal}
        booklist={selectedBooklist}
      />
    </Layout>
  );
};

export default Bookshelf;
