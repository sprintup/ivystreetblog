'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function StartedChecklistTile({
  acId,
  checklist,
  href,
  isMoveUpDisabled = false,
  isMoveDownDisabled = false,
  onMoveUp = null,
  onMoveDown = null,
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleOpen() {
    router.push(href);
  }

  function handleTileKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  }

  async function handleDelete() {
    setIsDeleteModalOpen(false);

    setIsDeleting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/word-garden/children/${acId}/practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: checklist.word,
          practiceIncrement: 0,
          checklistIncrement: 0,
          checklistCheckedItemIds: [],
          openChecklist: false,
          selectionType: checklist.selectionType,
          selectionSlug: checklist.selectionSlug,
          selectionLetter: checklist.selectionLetter || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to delete this checklist right now.');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting started checklist:', error);
      setErrorMessage('Unable to delete this word right now.');
      setIsDeleting(false);
      return;
    }

    setIsDeleting(false);
  }

  return (
    <>
      <div
        className={`rounded-3xl border p-5 shadow-lg transition ${
          checklist.isCurrentWord
            ? 'border-yellow/40 bg-secondary/90'
            : 'border-accent/20 bg-secondary/70'
        } cursor-pointer hover:border-yellow/40 hover:bg-secondary/90`}
        role='link'
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={handleTileKeyDown}
      >
        <div className='flex h-full flex-col gap-4'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0'>
              <h2 className='text-2xl text-white'>{checklist.word}</h2>
            </div>
            <div className='flex flex-wrap justify-end gap-2 text-sm'>
              {checklist.isCurrentWord ? (
                <span className='rounded-full bg-yellow/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow'>
                  Current
                </span>
              ) : null}
              <span className='rounded-full border border-accent/30 px-3 py-1 text-accent'>
                Started
              </span>
              <span className='rounded-full border border-accent/30 px-3 py-1 text-accent'>
                {checklist.checklistCheckedCount} checked
              </span>
              <span className='rounded-full border border-accent/30 px-3 py-1 text-accent'>
                x{checklist.practiceCount}
              </span>
            </div>
          </div>
          <p className='text-sm leading-6 text-accent'>{checklist.definition}</p>

          <div className='flex flex-wrap items-center justify-end gap-3'>
            <button
              type='button'
              onClick={event => {
                event.stopPropagation();
                onMoveUp?.();
              }}
              disabled={isMoveUpDisabled}
              className='rounded-full border border-accent/30 bg-white/5 px-3 py-1.5 text-xs font-semibold text-accent transition hover:border-accent/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
            >
              Move Up
            </button>
            <button
              type='button'
              onClick={event => {
                event.stopPropagation();
                onMoveDown?.();
              }}
              disabled={isMoveDownDisabled}
              className='rounded-full border border-accent/30 bg-white/5 px-3 py-1.5 text-xs font-semibold text-accent transition hover:border-accent/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
            >
              Move Down
            </button>
            <button
              type='button'
              onClick={event => {
                event.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
              disabled={isDeleting}
              className='rounded-full border border-red-300/40 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:border-red-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          {errorMessage ? <p className='text-xs text-red-300'>{errorMessage}</p> : null}
        </div>
      </div>

      {isDeleteModalOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4'>
          <div className='w-full max-w-lg rounded-3xl bg-white p-6 text-slate-900 shadow-2xl'>
            <p className='text-sm uppercase tracking-[0.3em] text-slate-500'>
              Delete Checklist
            </p>
            <h3 className='mt-3 text-2xl font-bold text-slate-900'>
              Remove {checklist.word}?
            </h3>
            <p className='mt-4 text-sm leading-6 text-slate-700'>
              This is a soft delete. The word stays in Word Garden, but its saved
              checklist state will be removed from the Checklists page.
            </p>
            <div className='mt-6 flex flex-wrap justify-end gap-3'>
              <button
                type='button'
                onClick={() => setIsDeleteModalOpen(false)}
                className='rounded-full bg-slate-200 px-4 py-2 font-bold text-slate-900'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleDelete}
                disabled={isDeleting}
                className='rounded-full bg-primary px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
