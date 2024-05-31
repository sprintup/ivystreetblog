// app/api/public-bookshelf/route.js

import { ReadPublicBookshelfInteractor } from '@/interactors/booklists/public/ReadPublicBookshelfInteractor';

export async function POST(request) {
    try {
        const readPublicBookshelfInteractor =
            await ReadPublicBookshelfInteractor.create();
        const publicBooklists = await readPublicBookshelfInteractor.execute();
        return new Response(JSON.stringify(publicBooklists), {
            status: 200,
            headers: {
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Error fetching public booklists:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Cache-Control': 'no-store',
            },
        });
    }
}