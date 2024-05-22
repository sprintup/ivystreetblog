// app/api/user/booklists/route.js

import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';
import { ReadUserBooklistsInteractor } from '@interactors/user/ReadUserBooklistsInteractor';

export async function POST(request) {
    const session = await getServerSession(options);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { email } = await request.json();

    try {
        const interactor = await ReadUserBooklistsInteractor.create();
        const userBooklists = await interactor.execute(email);
        return new Response(JSON.stringify(userBooklists), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}