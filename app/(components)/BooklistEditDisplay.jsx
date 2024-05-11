// app/booklistEdit/[id]/booksDisplay.jsx

"use client";
import { useState, useEffect } from "react";
import BookAddComponent from "./BookAddComponent";
import { useRouter } from "next/navigation";

const fetchBookDetails = async (bookId) => {
  try {
    const response = await fetch(`/api/book/${bookId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error fetching book details:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
};

export default function BooksDisplay({ booklistId }) {
  const [booklist, setBooklist] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchBooklist();
  }, [booklistId]);

  const fetchBooklist = async () => {
    try {
      const response = await fetch(`/api/booklist/${booklistId}`);
      if (response.ok) {
        const data = await response.json();
        setBooklist(data);
      } else {
        console.error("Error fetching booklist:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching booklist:", error);
    }
  };

  const handleBookChange = () => {
    // Refresh the booklist data after a book is added
    setSelectedBook(null);
    fetchBooklist();
  };

  const handleEditBook = (bookId) => {
    router.push(`/bookEdit/${booklistId}/${bookId}`);
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const response = await fetch(`/api/book`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId, booklistId }),
      });
      if (response.ok) {
        handleBookChange();
      } else {
        console.error("Error deleting book:", response.statusText);
        // setErrorMessage("Failed to delete book. Please try again."); TODO
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      // setErrorMessage("An error occurred. Please try again.");
    }
  };

  if (!booklist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl mb-4">
        {booklist.bookIds.length || 0}{" "}
        {booklist.bookIds.length === 1 ? "Book" : "Books"} in this Booklist
      </h3>
      {booklist.bookIds.map((bookId) => (
        <div key={bookId} className="flex justify-between items-center mb-4">
          <BookDetails bookId={bookId} fetchBookDetails={fetchBookDetails} />
          <button //TODO EDIT FUNCTIONALITY
            onClick={() => handleEditBook(bookId)}
            className="px-4 py-2 mx-1 bg-yellow text-primary font-bold rounded-lg hover:bg-orange transition duration-300"
          >
            Edit Book
          </button>
          <button
            onClick={() => handleDeleteBook(bookId)}
            className="px-4 py-2 mx-1 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-300"
          >
            Delete Book
          </button>
        </div>
      ))}
      <BookAddComponent
        booklistId={booklistId}
        onBookAdded={handleBookChange}
      />
    </div>
  );
}

function BookDetails({ bookId, fetchBookDetails }) {
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const data = await fetchBookDetails(bookId);
      setBook(data);
    };

    fetchBook();
  }, [bookId, fetchBookDetails]);

  if (!book) {
    return <div>Loading book details...</div>;
  }

  return (
    <div className="w-full px-3 mx-3 py-2 bg-secondary text-accent rounded-md">
      <div>
        <h4 className="text-xl font-bold mb-1">{book.Name}</h4>
        <p className="text-sm mb-2">Author: {book.Author}</p>
        {/* Display other book details */}
      </div>
    </div>
  );
}
