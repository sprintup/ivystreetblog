// app/api/public-bookshelf/public-booklist/route.js

import { ReadPublicBooklistInteractor } from '@/interactors/booklists/public/ReadPublicBooklistInteractor';

export async function POST(request) {
    const { id } = await request.json();
    console.log('id from api:', id);
    try {
        const readPublicBooklistInteractor =
            await ReadPublicBooklistInteractor.create();
        const booklist = await readPublicBooklistInteractor.execute(id);
        return new Response(JSON.stringify(booklist), {
            status: 200
        });
    } catch (error) {
        console.error('Error fetching public booklist:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Cache-Control': 'no-store',
            },
        });
    }
}