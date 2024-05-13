// app/reading-list/FinishedBook.jsx

"use client";

import React, { useState } from "react";
import ReviewForm from "./ReviewForm";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FinishedBook = ({ book, trackedBook }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

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

      if (response.ok) {
        setMessage("Book status updated successfully!");
        setTimeout(() => {
          setMessage("");
          router.refresh();
        }, 1000);
      } else {
        throw new Error("Failed to update book status");
      }
    } catch (error) {
      console.error("Error updating book status:", error);
      setMessage("Failed to update book status. Please try again.");
    }
  };

  const handleRemoveBook = async () => {
    try {
      const response = await fetch(`/api/reading-list/${book._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Book removed successfully!");
        setTimeout(() => {
          setMessage("");
          router.refresh();
        }, 1000);
      } else {
        throw new Error("Failed to remove book");
      }
    } catch (error) {
      console.error("Error removing book:", error);
      setMessage("Failed to remove book. Please try again.");
    }
  };

  return (
    <li className="p-4 rounded-lg shadow-md bg-secondary">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link href={`/book/${book._id}`}>
            <h3 className="text-xl font-bold text-yellow hover:text-orange">
              {book.Name}
            </h3>
          </Link>
          <p className="text-sm">by {book.Author}</p>
        </div>
        <div className="flex flex-col space-y-2">
          <select
            value={trackedBook.status}
            onChange={handleStatusChange}
            className="px-2 py-1 rounded-md bg-primary text-yellow"
          >
            <option value="to-read">To Read</option>
            <option value="finished">Finished</option>
          </select>
          <button
            onClick={handleRemoveBook}
            className="px-2 py-1 rounded-md bg-red-500 text-white"
          >
            Remove
          </button>
          <button
            onClick={toggleReviewForm}
            className="px-4 py-2 rounded-md bg-yellow text-primary"
          >
            {showReviewForm ? "Hide Review" : "Write a Review"}
          </button>
        </div>
      </div>
      {message && (
        <p
          className={`mb-4 text-lg ${
            message.includes("success") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
      {trackedBook.review && (
        <div className="mb-4">
          <p className="text-lg">
            <span className="font-bold">Review:</span> {trackedBook.review}
          </p>
          <p className="text-lg">
            <span className="font-bold">Perceived Difficulty:</span>{" "}
            {trackedBook.ratingPerceivedDifficulty}
          </p>
        </div>
      )}
      {showReviewForm && (
        <ReviewForm
          book={book}
          trackedBook={trackedBook}
          onClose={toggleReviewForm}
        />
      )}
    </li>
  );
};

export default FinishedBook;
