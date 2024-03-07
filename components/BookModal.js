// components/BookModal.js
import React from "react";
import Modal from "react-modal";
import styles from "./BookModal.module.css";

const BookModal = ({ isOpen, onClose, book }) => {
  if (!isOpen || !book) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Book Modal"
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalContent}>
        <img
          src={book.coverImage || "/placeholder-image.jpg"}
          alt={book.title}
          className={styles.modalImage}
        />
        <h2 className={styles.modalTitle}>{book.title}</h2>
        <p className={styles.modalAuthor}>by {book.author}</p>
        <p className={styles.modalIsbn}>ISBN: {book.isbn}</p>
        <p className={styles.modalDescription}>{book.description}</p>
        <a
          href={book.buyLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.modalBuyLink}
        >
          Buy Now
        </a>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default BookModal;
