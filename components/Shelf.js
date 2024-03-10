// components/Shelf.js
import React from "react";
import Link from "next/link";
import styles from "./Shelf.module.css";

const Shelf = ({ booklist, onBookClick }) => {
  return (
    <div className={styles.shelf}>
      <h2 className={styles.shelfTitle}>
        <Link href={`/booklist/${booklist.id}`}>{booklist.title}</Link>
      </h2>
      <div className={styles.bookContainer}>
        {booklist.books.map((book) => (
          <div
            key={book.ISBN_13}
            className={styles.bookSpine}
            onClick={() => onBookClick(book)}
          >
            <div className={styles.bookDetails}>
              <span className={styles.title}>{book.Name}</span>
              <span className={styles.author}>{book.Author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shelf;
