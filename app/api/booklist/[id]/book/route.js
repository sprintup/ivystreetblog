import { AddBookFromCollectionToBooklistInteractor } from "@interactors/booklists/AddBookFromCollectionToBooklistInteractor";
import { RemoveBookFromBooklistInteractor } from "@interactors/booklists/RemoveBookFromBooklistInteractor";

export async function POST(request, { params }) {
    try {
        const { bookId } = await request.json();
        const { id: booklistId } = params;

        const addBookFromCollectionToBooklistInteractor = await AddBookFromCollectionToBooklistInteractor.create();
        const updatedBooklist = await addBookFromCollectionToBooklistInteractor.execute(booklistId, bookId);

        if (updatedBooklist) {
            return new Response(JSON.stringify(updatedBooklist), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Failed to add book to booklist" }), { status: 400 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { bookId } = await request.json();
        const { id: booklistId } = params;

        const removeBookFromBooklistInteractor = await RemoveBookFromBooklistInteractor.create();
        const updatedBooklist = await removeBookFromBooklistInteractor.execute(booklistId, bookId);

        if (updatedBooklist) {
            return new Response(JSON.stringify(updatedBooklist), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Failed to remove book from booklist" }), { status: 400 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}