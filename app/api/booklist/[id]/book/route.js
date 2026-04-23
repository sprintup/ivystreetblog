import { AddBookFromCollectionToBooklistInteractor } from "@interactors/booklists/AddBookFromCollectionToBooklistInteractor";
import { RemoveBookFromBooklistInteractor } from "@interactors/booklists/RemoveBookFromBooklistInteractor";
import { revalidateTag } from 'next/cache';
import { BOOKLISTS_TAG } from '@domain/commons';
import { requireSessionUser } from '@/utils/authSession';

export async function POST(request, { params }) {
    const { userEmail, unauthorizedResponse } = await requireSessionUser();
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const { bookId } = await request.json();
        const { id: booklistId } = params;

        const addBookFromCollectionToBooklistInteractor = await AddBookFromCollectionToBooklistInteractor.create();
        const updatedBooklist = await addBookFromCollectionToBooklistInteractor.execute(userEmail, booklistId, bookId);

        if (updatedBooklist) {
            revalidateTag(BOOKLISTS_TAG);
            return new Response(JSON.stringify(updatedBooklist), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Failed to add book to booklist" }), { status: 400 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { userEmail, unauthorizedResponse } = await requireSessionUser();
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const { bookId } = await request.json();
        const { id: booklistId } = params;

        const removeBookFromBooklistInteractor = await RemoveBookFromBooklistInteractor.create();
        const updatedBooklist = await removeBookFromBooklistInteractor.execute(userEmail, booklistId, bookId);

        if (updatedBooklist) {
            return new Response(JSON.stringify(updatedBooklist), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Failed to remove book from booklist" }), { status: 400 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}
