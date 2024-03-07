// components/Shelf.js
import React from "react";
import styles from "./Shelf.module.css";

const Shelf = ({ booklist, onBookClick }) => {
  return (
    <div className={styles.shelf}>
      <h2 className={styles.shelfTitle} onClick={() => onBookClick(booklist)}>
        {booklist.title}
      </h2>
      <div className={styles.bookContainer}>
        {booklist.books.map((book) => (
          <div
            key={book.isbn}
            className={styles.bookSpine}
            onClick={() => onBookClick(book)}
          >
            <div className={styles.bookDetails}>
              <span className={styles.title}>{book.title}</span>
              <span className={styles.author}>{book.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shelf;
