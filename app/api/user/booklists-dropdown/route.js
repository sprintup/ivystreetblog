// app/api/user/booklists/route.js

import { ReadUserBooklistsInteractor } from '@interactors/user/ReadUserBooklistsInteractor';
import { requireSessionUser } from '@/utils/authSession';

export async function POST(request) {
    const { userEmail, unauthorizedResponse } = await requireSessionUser();
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const interactor = await ReadUserBooklistsInteractor.create();
        const userBooklists = await interactor.execute(userEmail);
        return new Response(JSON.stringify(userBooklists), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}
