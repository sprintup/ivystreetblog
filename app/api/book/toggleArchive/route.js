// app/api/book/toggleArchive/route.js

import { ToggleBookArchiveInteractor } from '@interactors/book/ToggleBookArchiveInteractor';

export async function PUT(req) {
    const { bookId } = await req.json();

    try {
        const interactor = await ToggleBookArchiveInteractor.create();
        const book = await interactor.execute(bookId);
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