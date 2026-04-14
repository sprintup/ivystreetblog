'use client';

import { useEffect, useState } from 'react';

export default function ShareAnonymousChildButton({ sharePath, displayName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    setShareUrl(new URL(sharePath, window.location.origin).toString());
  }, [sharePath]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyMessage('Link copied.');
      window.setTimeout(() => setCopyMessage(''), 2000);
    } catch (error) {
      console.error('Unable to copy AC share link:', error);
      setCopyMessage('Unable to copy link right now.');
    }
  }

  const qrCodeUrl = shareUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        shareUrl
      )}`
    : '';

  return (
    <div className='space-y-3'>
      <button
        type='button'
        onClick={() => setIsOpen(currentValue => !currentValue)}
        className='rounded-full border border-yellow/40 px-4 py-2 text-sm font-semibold text-yellow transition hover:border-yellow hover:text-white'
      >
        {isOpen ? 'Hide QR share' : 'Share AC with QR code'}
      </button>

      {isOpen ? (
        <div className='rounded-3xl border border-accent/20 bg-primary/60 p-4 text-sm text-accent'>
          <p className='font-semibold text-white'>
            Share {displayName} with a surrogate caregiver.
          </p>
          <p className='mt-2 leading-6'>
            Anyone who opens this QR code while signed in can add this AC to their
            garden.
          </p>
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt={`QR code to share ${displayName}`}
              className='mt-4 h-44 w-44 rounded-2xl bg-white p-3'
            />
          ) : null}
          <div className='mt-4 rounded-2xl border border-accent/20 bg-primary/70 p-3 break-all'>
            {shareUrl || sharePath}
          </div>
          <div className='mt-3 flex flex-wrap items-center gap-3'>
            <button
              type='button'
              onClick={handleCopyLink}
              disabled={!shareUrl}
              className='rounded-full border border-accent/30 px-4 py-2 font-semibold text-accent transition hover:border-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-60'
            >
              Copy link
            </button>
            {copyMessage ? <p className='text-sm text-yellow'>{copyMessage}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
