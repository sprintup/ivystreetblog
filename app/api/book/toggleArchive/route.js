// app/api/book/toggleArchive/route.js

import { ToggleBookArchiveInteractor } from '@interactors/book/ToggleBookArchiveInteractor';
import { requireSessionUser } from '@/utils/authSession';

export async function PUT(req) {
    const { userEmail, unauthorizedResponse } = await requireSessionUser();
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const { bookId } = await req.json();

    try {
        const interactor = await ToggleBookArchiveInteractor.create();
        const book = await interactor.execute(userEmail, bookId);
        if (!book) {
            return new Response(JSON.stringify({ error: 'Book not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ message: 'Book archive status toggled successfully', book }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error toggling book archive:', error);
        return new Response(JSON.stringify({ error: 'An error occurred while toggling book archive' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
