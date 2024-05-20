// app/my-collection/AddBookForm.jsx

'use client';

import React, { useState } from 'react';
import BookAddToCollectionComponent from '@components/BookAddToCollectionComponent';

export default function AddBookForm({ userBookCollection }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className='mb-4'>
      <button
        className='bg-secondary text-yellow px-4 py-2 rounded'
        onClick={toggleExpanded}
      >
        {isExpanded ? 'Collapse' : 'Add Book'}
      </button>
      {isExpanded && (
        <div className='mt-2'>
          <BookAddToCollectionComponent
            book={{}}
            userBookCollection={userBookCollection}
          />
        </div>
      )}
    </div>
  );
}
