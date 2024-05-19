// app/booklistEdit/[id]/page.jsx

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BooklistEditDisplayComponent from './BooklistEditDisplayComponent';

export default function EditBooklistPage({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [errorMessage, setErrorMessage] = useState('');
  const [booklistId, setBooklistId] = useState(params.id);

  useEffect(() => {
    const fetchBooklist = async () => {
      try {
        const response = await fetch(`/api/booklist/${params.id}`);
        if (response.ok) {
          const booklist = await response.json();
          setTitle(booklist.title);
          setDescription(booklist.description);
          setVisibility(booklist.visibility);
        } else {
          console.error('Error fetching booklist:', response.statusText);
          setErrorMessage('Failed to fetch booklist. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching booklist:', error);
        setErrorMessage('An error occurred. Please try again.');
      }
    };

    fetchBooklist();
  }, [params.id]);

  const handleSubmitOfUpdateBooklistForm = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/booklist/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, visibility }),
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

  const handleDeleteBooklist = async () => {
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

  return (
    <div className='bg-primary text-accent p-4 rounded-lg max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl text-yellow'>Edit Booklist</h2>
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
        <div className='flex justify-between'>
          <button
            type='button'
            onClick={handleDeleteBooklist}
            className='px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-300'
          >
            Delete Booklist
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-yellow text-primary font-bold rounded-lg hover:bg-orange transition duration-300'
          >
            Update Booklist
          </button>
        </div>
      </form>
      <BooklistEditDisplayComponent booklistId={booklistId} />
    </div>
  );
}
