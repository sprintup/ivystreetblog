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
        <h2 className={styles.modalTitle}>{book.Name}</h2>
        <p className={styles.modalSeries}>{book.Series}</p>
        <p className={styles.modalAuthor}>by {book.Author}</p>
        <p className={styles.modalAge}>{book.Age}</p>
        <p className={styles.modalRating}>
          Rating: {book.Rating_out_of_5} ({book.No_of_Ratings} ratings)
        </p>
        <p className={styles.modalPrice}>
          Price: {book.Price} (Before: {book.Price_Befor})
        </p>
        <p className={styles.modalCoverType}>Cover Type: {book.Cover_Type}</p>
        <p className={styles.modalPublicationDate}>
          Publication Date: {book.Publication_Date}
        </p>
        <div className={styles.modalDescription}>
          <h3>Description:</h3>
          <p>{book.Description}</p>
        </div>
        <div className={styles.modalProductDetails}>
          <h3>Product Details:</h3>
          <pre>{book.Product_Details}</pre>
        </div>
        {book.Best_Seller && (
          <p className={styles.modalBestSeller}>
            Best Seller: {book.Best_Seller}
          </p>
        )}
        <a
          href={book.Link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.modalLink}
        >
          View on Amazon
        </a>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default BookModal;
