'use client';

import { useEffect, useState } from 'react';
import StartedChecklistTile from './StartedChecklistTile';

function moveItem(items, fromIndex, toIndex) {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export default function StartedChecklistGrid({ acId, startedChecklists }) {
  const [orderedChecklists, setOrderedChecklists] = useState(startedChecklists);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setOrderedChecklists(startedChecklists);
  }, [startedChecklists]);

  async function persistOrder(nextChecklists, previousChecklists) {
    setOrderedChecklists(nextChecklists);
    setIsSavingOrder(true);
    setErrorMessage('');

    try {
      const response = await fetch(
        `/api/word-garden/children/${acId}/checklists/order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderedWords: nextChecklists.map(
              checklist => checklist.normalizedWord || checklist.word
            ),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Unable to save checklist order right now.');
      }
    } catch (error) {
      console.error('Error saving checklist order:', error);
      setOrderedChecklists(previousChecklists);
      setErrorMessage('Unable to save the new checklist order right now.');
    } finally {
      setIsSavingOrder(false);
    }
  }

  function handleMoveUp(index) {
    if (index === 0 || isSavingOrder) {
      return;
    }

    const previousChecklists = orderedChecklists;
    const nextChecklists = moveItem(orderedChecklists, index, index - 1);
    void persistOrder(nextChecklists, previousChecklists);
  }

  function handleMoveDown(index) {
    if (index >= orderedChecklists.length - 1 || isSavingOrder) {
      return;
    }

    const previousChecklists = orderedChecklists;
    const nextChecklists = moveItem(orderedChecklists, index, index + 1);
    void persistOrder(nextChecklists, previousChecklists);
  }

  return (
    <div className='space-y-4'>
      {errorMessage ? (
        <p className='text-sm text-red-300'>{errorMessage}</p>
      ) : null}
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {orderedChecklists.map((checklist, index) => (
          <StartedChecklistTile
            key={`${checklist.normalizedWord}-${checklist.selectionType}-${checklist.selectionSlug}`}
            acId={acId}
            checklist={checklist}
            href={checklist.href}
            isMoveUpDisabled={index === 0 || isSavingOrder}
            isMoveDownDisabled={index === orderedChecklists.length - 1 || isSavingOrder}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
          />
        ))}
      </div>
    </div>
  );
}
