'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import BookAddToCollectionComponent from '@components/BookAddToCollectionComponent';
import { BOOKLISTS_TAG } from '@domain/commons';

export default function UserBookCollectionComponent({
  booklistId,
  onBookAdded,
}) {
  const { data: session } = useSession();
  const [userBooks, setUserBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);

  useEffect(() => {
    fetchUserBooks();
  }, []);

  const fetchUserBooks = async () => {
    try {
      const response = await fetch(`/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: currentPage,
          limit: booksPerPage,
          userEmail: session.user.email,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setUserBooks(data.books);
        // Update the total number of books if needed
      } else {
        console.error('Error fetching user books:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user books:', error);
    }
  };

  const handleAddBookToBooklist = async bookId => {
    try {
      const response = await fetch(`/api/booklist/${booklistId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
        next: { tags: [BOOKLISTS_TAG] },
      });
      if (response.ok) {
        onBookAdded();
      } else {
        console.error('Error adding book to booklist:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding book to booklist:', error);
    }
  };

  const handleBookAdded = newBook => {
    setUserBooks(prevBooks => [newBook, ...prevBooks]);
  };

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = userBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className='mt-8'>
      <h3 className='text-2xl mb-4'>My Book Collection</h3>
      {userBooks.length === 0 ? (
        <p>You don't have any books in your collection yet.</p>
      ) : (
        <div>
          <div className='flex flex-wrap -mx-3'>
            {currentBooks.map(book => (
              <div key={book._id} className='w-full sm:w-1/5 px-3 mb-4'>
                <div className='bg-secondary text-accent rounded-md p-4'>
                  <h4 className='text-lg font-bold mb-1'>{book.Name}</h4>
                  <p className='text-sm'>Author: {book.Author}</p>
                  <button
                    onClick={() => handleAddBookToBooklist(book._id)}
                    className='px-4 py-2 mt-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300'
                  >
                    Add to Booklist
                  </button>
                </div>
              </div>
            ))}
          </div>
          {userBooks.length > booksPerPage && (
            <div className='flex justify-center mt-4'>
              <nav aria-label='Pagination'>
                <ul className='flex items-center'>
                  <li>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className='px-3 py-2 rounded-l-md bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Prev
                    </button>
                  </li>
                  {Array.from(
                    { length: Math.ceil(userBooks.length / booksPerPage) },
                    (_, index) => index + 1
                  ).map(pageNumber => (
                    <li key={pageNumber}>
                      <button
                        onClick={() => paginate(pageNumber)}
                        className={`px-3 py-2 ${
                          pageNumber === currentPage
                            ? 'bg-yellow text-primary'
                            : 'bg-white text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(userBooks.length / booksPerPage)
                      }
                      className='px-3 py-2 rounded-r-md bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      )}
      <BookAddToCollectionComponent onBookAdded={handleBookAdded} />
    </div>
  );
}
