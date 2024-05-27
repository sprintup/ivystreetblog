// useStatusChange.js

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useStatusChange = (book) => {
    const [message, setMessage] = useState('');
    const router = useRouter();
    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            const response = await fetch(`/api/reading-list/${book._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setMessage('Book status updated successfully!');
                setTimeout(() => {
                    setMessage('');
                    router.refresh();
                }, 1000);
            } else {
                throw new Error('Failed to update book status');
            }
        } catch (error) {
            console.error('Error updating book status:', error);
            setMessage('Failed to update book status. Please try again.');
        }
    };

    return { message, handleStatusChange };
};
