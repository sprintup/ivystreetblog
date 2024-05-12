// app/booklist/[id]/AddToReadingListButton.jsx

"use client";

import { useState } from "react";

export default function AddToReadingListButton({ book }) {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddToReadingList = async () => {
    try {
      const response = await fetch("/api/user/tracked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book._id }),
      });

      if (response.ok) {
        setMessage("Book added to your reading list!");
        setIsSuccess(true);
      } else {
        throw new Error("Failed to add book to your reading list.");
      }
    } catch (error) {
      console.error("Error adding book to reading list:", error);
      setMessage("Failed to add book to your reading list.");
      setIsSuccess(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAddToReadingList}
        className="bg-yellow text-primary px-4 py-2 rounded-lg mt-0 w-full"
      >
        Add to reading list
      </button>
      {message && (
        <p className={`mt-2 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
