import { ReadMyBookShelfInteractor } from '@/interactors/booklists/private/ReadMyBookShelfInteractor';

export async function POST(request) {
    const { userEmail } = await request.json();

    if (!userEmail) {
        return new Response(JSON.stringify({ error: 'User email is required' }), {
            status: 400,
        });
    }

    try {
        const readBooklistsInteractor = await ReadMyBookShelfInteractor.create();
        const booklists = await readBooklistsInteractor.execute(userEmail);


        if (booklists) {
            return new Response(JSON.stringify(booklists), {
                status: 200,
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        } else {
            console.error('No booklists found for the provided email:', userEmail);
            return new Response(
                JSON.stringify({ error: 'No booklists found for the provided email' }),
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error in API route:', error);
        return new Response(JSON.stringify({ error: error.toString() }), {
            status: 500,
        });
    }
}