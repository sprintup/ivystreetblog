// components/ReadingListBook.jsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ReadingListBook = ({ book, trackedBook }) => {
  const router = useRouter();
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const response = await fetch(`/api/reading-list/${book._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update book status");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };

  const handleRemoveBook = async () => {
    try {
      const response = await fetch(`/api/reading-list/${book._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove book");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  return (
    <li className="p-4 rounded-lg shadow-md bg-secondary flex items-center">
      <div className="flex-grow">
        <Link href={`/book/${book._id}`}>
          <h3 className="text-xl font-bold text-yellow">{book.Name}</h3>
        </Link>
        <p className="text-sm">by {book.Author}</p>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={trackedBook.status}
          onChange={handleStatusChange}
          className="px-2 py-1 rounded-md bg-primary text-yellow"
        >
          <option value="to-read">To Read</option>
          <option value="read">Read</option>
        </select>
        <button
          onClick={handleRemoveBook}
          className="px-2 py-1 rounded-md bg-red-500 text-white"
        >
          Remove
        </button>
      </div>
    </li>
  );
};

export default ReadingListBook;
