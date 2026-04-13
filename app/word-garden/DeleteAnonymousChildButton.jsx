'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteAnonymousChildButton({ acId, displayName }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${displayName}? This removes the anonymous child profile and practice history.`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/word-garden/children/${acId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Unable to delete anonymous child.');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting anonymous child:', error);
      setErrorMessage('Unable to delete this anonymous child right now.');
      setIsDeleting(false);
      return;
    }

    setIsDeleting(false);
  }

  return (
    <div className='space-y-2'>
      <button
        type='button'
        onClick={handleDelete}
        disabled={isDeleting}
        className='rounded-full border border-red-300/40 px-4 py-2 text-sm font-semibold text-red-200 transition hover:border-red-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
      {errorMessage ? <p className='text-sm text-red-300'>{errorMessage}</p> : null}
    </div>
  );
}
