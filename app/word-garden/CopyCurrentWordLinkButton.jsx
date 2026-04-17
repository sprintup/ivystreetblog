'use client';

import { useState } from 'react';

export default function CopyCurrentWordLinkButton({
  path,
  label = 'Copy current word link',
}) {
  const [copyMessage, setCopyMessage] = useState('');

  async function handleCopy() {
    try {
      const shareUrl = new URL(path, window.location.origin).toString();
      await navigator.clipboard.writeText(shareUrl);
      setCopyMessage('Link copied.');
      window.setTimeout(() => setCopyMessage(''), 2000);
    } catch (error) {
      console.error('Unable to copy current word link:', error);
      setCopyMessage('Unable to copy link right now.');
    }
  }

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <button
        type='button'
        onClick={handleCopy}
        className='rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 font-semibold text-green-200 transition hover:border-green-300/50 hover:text-white'
      >
        {label}
      </button>
      {copyMessage ? <p className='text-sm text-green-200'>{copyMessage}</p> : null}
    </div>
  );
}
