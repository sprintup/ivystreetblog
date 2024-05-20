'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditBook({ params }) {
  const { bookId } = params;
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [series, setSeries] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [publisher, setPublisher] = useState('');
  const [isbn, setIsbn] = useState('');
  const [link, setLink] = useState('');
  const [source, setSource] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/book/${params.bookId}`);
        if (response.ok) {
          const data = await response.json();
          setBookName(data.Name || '');
          setAuthor(data.Author || '');
          setDescription(data.Description || '');
          setAge(data.Age || '');
          setSeries(data.Series || '');
          setPublicationDate(data.Publication_Date || '');
          setPublisher(data.Publisher || '');
          setIsbn(data.ISBN || '');
          setLink(data.Link || '');
          setSource(data.Source || '');
        } else {
          console.error('Error fetching book:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleUpdateBook = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/book`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          BookName: bookName,
          Author: author,
          Description: description,
          Age: age,
          Series: series,
          Publication_Date: publicationDate,
          Publisher: publisher,
          ISBN: isbn,
          Link: link,
          Source: source,
        }),
      });
      if (response.ok) {
        router.push('/my-collection');
      } else {
        console.error('Error updating book:', response.statusText);
        setErrorMessage('Failed to update book. Please try again.');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className='mt-8'>
      <h4 className='text-lg text-yellow mb-4'>Edit Book</h4>
      {errorMessage && <p className='text-red-500 mb-4'>{errorMessage}</p>}
      <form onSubmit={handleUpdateBook}>
        <div className='mb-4'>
          <label className='block text-lg mb-2'>
            Book Name:
            <input
              type='text'
              value={bookName}
              onChange={e => setBookName(e.target.value)}
              className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-lg mb-2'>
            Author:
            <input
              type='text'
              value={author}
              onChange={e => setAuthor(e.target.value)}
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
            Age:
            <input
              type='text'
              value={age}
              onChange={e => setAge(e.target.value)}
              className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-lg mb-2'>
            Series:
            <input
              type='text'
              value={series}
              onChange={e => setSeries(e.target.value)}
              className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-lg mb-2'>
            Publication Date:
            <input
              type='text'
              value={publicationDate}
              onChange={e => setPublicationDate(e.target.value)}
              className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-lg mb-2'>
            Publisher:
            <input
              type='text'
              value={publisher}
              onChange={e => setPublisher(e.target.value)}
              className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-lg mb-2'>
            ISBN:
            <input
              type='text'
              value={isbn}
              onChange={e => setIsbn(e.target.value)}
              className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-lg mb-2'>
            Link:
            <input
              type='text'
              value={link}
              onChange={e => setLink(e.target.value)}
              className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-lg mb-2'>
            Source:
            <input
              type='text'
              value={source}
              onChange={e => setSource(e.target.value)}
              className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
            />
          </label>
        </div>
        <button
          type='submit'
          className='px-4 py-2 bg-yellow text-primary font-bold rounded-lg hover:bg-orange transition duration-300'
        >
          Update Book
        </button>
      </form>
    </div>
  );
}
