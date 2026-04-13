'use client';

import { useEffect, useRef } from 'react';

export default function TrackWordVisit({ acId, word }) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) {
      return;
    }

    hasTrackedRef.current = true;

    fetch(`/api/word-garden/children/${acId}/practice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word,
        practiceIncrement: 1,
        checklistIncrement: 0,
      }),
    }).catch(error => {
      console.error('Unable to track word visit:', error);
    });
  }, [acId, word]);

  return null;
}
