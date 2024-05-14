// components/AddToBooklistButton.jsx

"use client";

import React, { useState } from "react";

export default function AddToBooklistButton({ book, userBooklists }) {
  const [selectedBooklist, setSelectedBooklist] = useState("");

  const handleBooklistChange = (e) => {
    setSelectedBooklist(e.target.value);
  };

  const handleAddToBooklist = async () => {
    // Implement the logic to add the book to the selected booklist
    // You can make an API call here to update the booklist
    // Example: await addBookToBooklist(selectedBooklist, book);
  };

  return (
    <div>
      <select
        value={selectedBooklist}
        onChange={handleBooklistChange}
        className="px-2 py-1 rounded-md bg-primary text-yellow"
      >
        <option value="">Select Booklist</option>
        {userBooklists?.map((booklist) => (
          <option key={booklist._id} value={booklist._id}>
            {booklist.title}
          </option>
        ))}
      </select>
      <button
        onClick={handleAddToBooklist}
        className="px-2 py-1 rounded-md bg-yellow text-primary"
      >
        Add To Booklist
      </button>
    </div>
  );
}
