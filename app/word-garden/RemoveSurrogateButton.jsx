'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RemoveSurrogateButton({
  acId,
  surrogateUserId,
  surrogateName,
}) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleRemove() {
    const confirmed = window.confirm(
      `Remove ${surrogateName} from this AC? They will lose access to the sound table and practice history.`
    );

    if (!confirmed) {
      return;
    }

    setIsRemoving(true);
    setErrorMessage('');

    try {
      const response = await fetch(
        `/api/word-garden/children/${acId}/surrogates/${surrogateUserId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Unable to remove surrogate access.');
      }

      router.refresh();
    } catch (error) {
      console.error('Error removing surrogate access:', error);
      setErrorMessage('Unable to remove this surrogate right now.');
      setIsRemoving(false);
      return;
    }

    setIsRemoving(false);
  }

  return (
    <div className='text-right'>
      <button
        type='button'
        onClick={handleRemove}
        disabled={isRemoving}
        className='rounded-full border border-red-300/40 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:border-red-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isRemoving ? 'Removing...' : 'Remove'}
      </button>
      {errorMessage ? <p className='mt-2 text-xs text-red-300'>{errorMessage}</p> : null}
    </div>
  );
}
