// components/AddToBooklistButton.jsx

"use client";

import React, { useState } from "react";

export default function AddToBooklistButton({ book, userBooklists }) {
  const [selectedBooklist, setSelectedBooklist] = useState("");
  const [message, setMessage] = useState("");

  const handleBooklistChange = (e) => {
    setSelectedBooklist(e.target.value);
  };

  const handleAddToBooklist = async () => {
    try {
      const response = await fetch(`/api/booklist/${selectedBooklist}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book._id }),
      });

      if (response.ok) {
        setMessage("Book added to the booklist successfully!");
      } else {
        throw new Error("Failed to add book to the booklist.");
      }
    } catch (error) {
      console.error("Error adding book to the booklist:", error);
      setMessage("Failed to add book to the booklist. Please try again.");
    }
  };

  return (
    <div>
      <select
        value={selectedBooklist}
        onChange={handleBooklistChange}
        className="my-2 px-2 py-1 rounded-md bg-primary text-yellow"
      >
        <option value="">Select Booklist</option>
        {userBooklists.map((booklist) => (
          <option key={booklist._id} value={booklist._id}>
            {booklist.title}
          </option>
        ))}
      </select>
      <button
        onClick={handleAddToBooklist}
        className="my-2 px-2 py-1 rounded-md bg-yellow text-primary"
      >
        Add To Booklist
      </button>
      {message && <p className="mt-2 text-sm text-yellow">{message}</p>}
    </div>
  );
}
