// app/booklistEdit/[id]/page.jsx

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AccordionWrapper from '@components/AccordionWrapper';
import Accordion from '@components/Accordion';
import {
  privateBooklistContent as privateBooklistContent,
  makeBooklistPublicContent,
  whatIsABooklistContent,
  whatIsACollectionContent,
} from '@/app/faqs/accordionContent';
import BookRemoveFromCollectionComponent from './BookRemoveFromCollectionComponent';
import UserBookCollectionComponent from '@components/UserBookCollectionComponent';
import AddToBooklistButtonComponent from './AddToBooklistButtonComponent';

export default function EditBooklistPage({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [openToRecommendations, setOpenForRecommendations] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [booklistId, setBooklistId] = useState(params.id);
  const [booklist, setBooklist] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fetchBooklist = async () => {
    try {
      const response = await fetch(`/api/booklist/${params.id}/edit`);
      if (response.ok) {
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setVisibility(data.visibility);
        setOpenForRecommendations(data.openToRecommendations);
        setBooklist(data);
      } else {
        console.error('Error fetching booklist:', response.statusText);
        setErrorMessage('Failed to fetch booklist. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching booklist:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    fetchBooklist();
  }, [params.id]);

  const handleBookChange = () => {
    fetchBooklist();
  };

  const handleSubmitOfUpdateBooklistForm = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/booklist/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          visibility,
          openToRecommendations,
        }),
      });
      if (response.ok) {
        router.push('/my-bookshelf');
        router.refresh();
      } else {
        console.error('Error updating booklist:', response.statusText);
        setErrorMessage('Failed to update booklist. Please try again.');
      }
    } catch (error) {
      console.error('Error updating booklist:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };
  const handleDeleteBooklist = () => {
    setShowConfirmation(true);
  };
  const confirmDeleteBooklist = async () => {
    try {
      const response = await fetch(`/api/booklist/${params.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.push('/my-bookshelf');
        router.refresh();
      } else {
        console.error('Error deleting booklist:', response.statusText);
        setErrorMessage('Failed to delete booklist. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting booklist:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  if (!booklist) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-primary text-accent p-4 rounded-lg max-w-4xl mx-auto'>
      <div className='mb-4'>
        <div className='flex justify-between items-center mb-2'>
          <h2 className='text-2xl'>Edit Booklist</h2>
          <Link href={`/public-bookshelf/public-booklist/${params.id}`}>
            <button className='px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300'>
              View Public Booklist
            </button>
          </Link>
        </div>
        <AccordionWrapper title='Show More Information'>
          <Accordion
            title='What is a booklist?'
            content={whatIsABooklistContent}
            isOpenByDefault={true}
          />
          <Accordion
            title='What is a collection?'
            content={whatIsACollectionContent}
          />
          <Accordion
            title='What does it mean to make a booklist private?'
            content={privateBooklistContent}
          />
          <Accordion
            title='What does it mean to make a booklist public?'
            content={makeBooklistPublicContent}
          />
        </AccordionWrapper>
      </div>
      {errorMessage && <p className='text-red-500 mb-4'>{errorMessage}</p>}
      <form onSubmit={handleSubmitOfUpdateBooklistForm}>
        <div className='mb-4'>
          <label className='block text-lg mb-2'>
            Title:
            <input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-lg mb-2'>
            Description:
            <textarea
              type='text'
              value={description}
              onChange={e => setDescription(e.target.value)}
              className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
            />
            <p className='text-sm text-gray-500'>
              Use the booklist description to describe who the booklist is for
              generally (remember, no personally identifiable information), like
              anyone interested in learning about poetry or a certain theory or
              genre. You can also use this field to describe recommendations
              you're seeking in this booklist.
            </p>
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-lg mb-2'>
            Visibility:
            <select
              value={visibility}
              onChange={e => setVisibility(e.target.value)}
              className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
            >
              <option value='public'>Public</option>
              <option value='private'>Private</option>
            </select>
          </label>
        </div>
        <div className='mb-4 flex items-center'>
          <label className='flex items-center text-sm mr-4'>
            <input
              type='checkbox'
              checked={openToRecommendations}
              onChange={e => setOpenForRecommendations(e.target.checked)}
              className='mr-2'
            />
            Open for recommendations
          </label>
          {booklist.bookRecommendations.length > 0 ? (
            <div className='text-sm'>
              <Link
                href={`/my-bookshelf/booklistEdit/recommendations/${booklist._id}`}
              >
                <span className='text-yellow hover:text-orange'>
                  Recommendations: {booklist.bookRecommendations.length}
                </span>
              </Link>
            </div>
          ) : (
            <p
              className={`text-md ${
                booklist.openToRecommendations
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {booklist.openToRecommendations
                ? 'Open to recommendations'
                : 'Closed to recommendations'}
            </p>
          )}
        </div>
        <div className='flex justify-between'>
          <div className='flex space-x-2'>
            <button
              type='button'
              onClick={handleDeleteBooklist}
              className='px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-300'
            >
              Delete Booklist
            </button>
            {showConfirmation && (
              <div className='fixed inset-0 flex items-center justify-center z-50'>
                <div className='bg-white p-8 mx-4 md:mx-8 lg:mx-16 rounded shadow-lg'>
                  <h3 className='text-xl font-bold mb-4 text-gray-800'>
                    Confirm Booklist Deletion
                  </h3>
                  <p className='mb-4 text-gray-700'>
                    Are you sure you want to delete this booklist? Deleting the
                    booklist will not delete the books in your collection or
                    books you added from other booklists. However, deleting the
                    booklist will also delete any recommendations associated
                    with it. You can't undo this action.
                  </p>
                  <div className='flex justify-end'>
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className='px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg mr-2'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteBooklist}
                      className='px-4 py-2 bg-red-500 text-white font-bold rounded-lg'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
            <Link href={`/my-bookshelf`}>
              <button className='px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300'>
                Cancel
              </button>
            </Link>
            <button
              type='submit'
              className='px-4 py-2 bg-yellow text-primary font-bold rounded-lg hover:bg-orange transition duration-300'
            >
              Update Booklist
            </button>
          </div>
        </div>
      </form>
      <div className='mt-8'>
        {booklist.bookIds.length > 0 ? (
          <>
            <h3 className='text-xl mb-4'>
              {booklist.bookIds.length}{' '}
              {booklist.bookIds.length === 1 ? 'Book' : 'Books'} in this
              Booklist
            </h3>
            <p className='text-sm mb-4'>
              To add a book to your booklist, first add it to your collection
              below.
            </p>
          </>
        ) : (
          <p className='text-sm mb-4'>
            You don't have any books in this booklist yet. Add a book to your
            collection to start building your booklist.
          </p>
        )}
        {booklist.bookIds.map(book => (
          <div
            key={book._id}
            className='flex justify-between items-center mb-4'
          >
            <BookDetails book={book} />
            <div className='flex flex-col space-y-2 items-end'>
              {session && session.user.email === book?.BookOwner?.email && (
                <Link href={`/my-collection/bookEdit/${book._id}`}>
                  <button className='px-2 py-3 bg-blue-500 text-white text-xs rounded hover:bg-blue-600'>
                    Edit Book
                  </button>
                </Link>
              )}
              <BookRemoveFromCollectionComponent
                bookId={book._id}
                booklistId={booklistId}
                onBookRemoved={handleBookChange}
              />
            </div>
          </div>
        ))}
        <hr />
        <UserBookCollectionComponent session={session}>
          {({ book }) => (
            <AddToBooklistButtonComponent
              book={book}
              booklistId={booklistId}
              onBookAdded={handleBookChange}
            />
          )}
        </UserBookCollectionComponent>
      </div>
    </div>
  );
}

function BookDetails({ book }) {
  if (!book) {
    return <div>Loading book details...</div>;
  }

  return (
    <div className='w-full px-3 mx-3 py-2 bg-secondary text-accent rounded-md'>
      <div>
        <Link href={`/book/${book._id}`}>
          <h4 className='text-xl font-bold text-yellow mb-1 hover:text-orange transition duration-300'>
            {book.Name}
          </h4>
        </Link>
        <p className='text-sm mb-2'>Author: {book.Author}</p>
        {book.Description && (
          <p className='text-sm mb-1'>Description: {book.Description}</p>
        )}
        {book.Age && <p className='text-sm mb-1'>Age: {book.Age}</p>}
        {book.Series && <p className='text-sm mb-1'>Series: {book.Series}</p>}
        {book.Publication_Date && (
          <p className='text-sm mb-1'>
            Publication Date: {book.Publication_Date}
          </p>
        )}
        {book.Publisher && (
          <p className='text-sm mb-1'>Publisher: {book.Publisher}</p>
        )}
        {book.ISBN && <p className='text-sm mb-1'>ISBN: {book.ISBN}</p>}
        {book.Link && (
          <p className='text-xs mb-1'>
            Link:{' '}
            <a
              href={book.Link}
              target='_blank'
              rel='noopener noreferrer'
              className='text-yellow hover:underline overflow-hidden overflow-ellipsis whitespace-nowrap'
              title={book.Link}
            >
              {book.Link.length > 30
                ? `${book.Link.substring(0, 30)}...`
                : book.Link}
            </a>
          </p>
        )}
        {book.Source && <p className='text-sm mb-1'>Source: {book.Source}</p>}
      </div>
    </div>
  );
}
