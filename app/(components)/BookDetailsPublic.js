// components/BookDetails.jsx

import React from "react";
import { getBookById } from "@services/dataService";

export default async function BookPublicDetails({ bookId }) {
    const book = await getBookById(bookId);

    if (!book) {
        return null;
    }

    return (
        <div className="bg-secondary p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-heading text-yellow mb-2">{book.Name}</h2>
            {book.Author && (
                <p className="text-sm mb-1">
                    <span className="font-bold">Author:</span> {book.Author}
                </p>
            )}
            {book.Description && (
                <p className="text-sm mb-1">
                    <span className="font-bold">Description:</span> {book.Description}
                </p>
            )}
            {book.Age && (
                <p className="text-sm mb-1">
                    <span className="font-bold">Age:</span> {book.Age}
                </p>
            )}
            {book.Series && (
                <p className="text-sm mb-1">
                    <span className="font-bold">Series:</span> {book.Series}
                </p>
            )}
            {book.Publication_Date && (
                <p className="text-sm mb-1">
                    <span className="font-bold">Publication Date:</span> {book.Publication_Date}
                </p>
            )}
            {book.Publisher && (
                <p className="text-sm mb-1">
                    <span className="font-bold">Publisher:</span> {book.Publisher}
                </p>
            )}
            {book.ISBN && (
                <p className="text-sm mb-1">
                    <span className="font-bold">ISBN:</span> {book.ISBN}
                </p>
            )}
            {book.Source && (
                <p className="text-sm mb-1">
                    <span className="font-bold">Source:</span> {book.Source}
                </p>
            )}
            {book.Link && (
                <p className="text-sm mb-1">
                    <span className="font-bold">Link:</span> {book.Link}
                </p>
            )}
        </div>
    );
}
