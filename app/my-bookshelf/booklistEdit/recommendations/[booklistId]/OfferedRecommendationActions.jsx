'use client';

import React from 'react';

export default function OfferedRecommendationActions({
  recommendationId,
  onActionComplete,
}) {
  const handleAccept = async () => {
    try {
      const response = await fetch(`/api/recommendations/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommendationId }),
      });

      if (response.ok) {
        onActionComplete();
      } else {
        console.error('Failed to accept recommendation');
      }
    } catch (error) {
      console.error('Error accepting recommendation:', error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`/api/recommendations/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommendationId }),
      });

      if (response.ok) {
        onActionComplete();
      } else {
        console.error('Failed to reject recommendation');
      }
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
    }
  };

  return (
    <div>
      <button
        onClick={handleAccept}
        className='px-2 py-1 bg-green-500 text-white rounded mr-2 hover:bg-green-600'
      >
        Accept
      </button>
      <button
        onClick={handleReject}
        className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Reject
      </button>
    </div>
  );
}
