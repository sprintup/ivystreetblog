// components/UserBookCollectionComponent.jsx

'use client';
import { useState, useEffect } from 'react';
import BookAddToCollectionComponent from '@components/BookAddToCollectionComponent';
import Link from 'next/link';

export default function UserBookCollectionComponent({ session, children }) {
  const [userBooks, setUserBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);
  const [totalBooks, setTotalBooks] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBooksPerPage(3);
      } else {
        setBooksPerPage(5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    fetchUserBooks();
  }, [currentPage, booksPerPage, session]);

  const fetchUserBooks = async () => {
    if (session) {
      try {
        const response = await fetch(`/api/collection`, {
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
          setTotalBooks(data.totalBooks);
        } else {
          console.error('Error fetching user books:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user books:', error);
      }
    }
  };

  const handleBookAdded = newBook => {
    setUserBooks(prevBooks => [newBook, ...prevBooks]);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(totalBooks / booksPerPage);

  return (
    <div className='mt-8'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-2xl'>My Book Collection</h3>
        <button
          className='bg-secondary text-yellow px-4 py-2 rounded'
          onClick={toggleExpanded}
        >
          {isExpanded ? 'Collapse' : 'Add book to my collection'}
        </button>
      </div>
      {isExpanded && (
        <div className='mb-4'>
          <BookAddToCollectionComponent onBookAdded={handleBookAdded} />
        </div>
      )}
      {userBooks.length === 0 ? (
        <p>You don't have any books in your collection yet.</p>
      ) : (
        <div>
          <div className='flex flex-wrap -mx-3'>
            {userBooks.map(book => (
              <div
                key={book._id}
                className='w-full sm:w-1/3 md:w-1/5 px-3 mb-4'
              >
                <div className='bg-secondary text-accent rounded-md p-4'>
                  <Link href={`/book/${book._id}`}>
                    <h4 className='text-lg text-yellow mb-1 hover:underline cursor-pointer'>
                      {book.Name}
                    </h4>
                  </Link>
                  <p className='text-sm'>Author: {book.Author}</p>
                  {children({ book })}
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
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
                    { length: totalPages },
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
                      disabled={currentPage === totalPages}
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
    </div>
  );
}
