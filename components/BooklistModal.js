// components/BooklistModal.js
import React from "react";
import Modal from "react-modal";
import styles from "./BooklistModal.module.css";

const BooklistModal = ({ isOpen, onClose, booklist }) => {
  if (!booklist) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Booklist Modal"
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{booklist.title}</h2>
        <p className={styles.modalDescription}>{booklist.description}</p>
        <ul className={styles.bookList}>
          {booklist.books.map((book) => (
            <li key={book.isbn} className={styles.bookItem}>
              <span className={styles.bookTitle}>{book.title}</span> by{" "}
              {book.author}
            </li>
          ))}
        </ul>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default BooklistModal;
