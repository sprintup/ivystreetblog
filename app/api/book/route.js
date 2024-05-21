import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { CreateBookInteractor } from "@interactors/book/CreateBookInteractor";
import { UpdateBookInteractor } from "@interactors/book/UpdateBookInteractor";
import { DeleteBookFromCollectionAndAllBooklistsInteractor } from "@/interactors/book/DeleteBookFromCollectionAndAllBooklistsInteractor";

export async function POST(request) {
    const session = await getServerSession(options);
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const createBookInteractor = await CreateBookInteractor.create();
    const { Name, Author } = await request.json();
    const userEmail = session.user.email;

    try {
        const newBook = await createBookInteractor.execute(userEmail, { Name, Author });
        return new Response(JSON.stringify(newBook), { status: 201 });
    } catch (error) {
        console.error("Error creating new book:", error);
        return new Response("Failed to create new book", { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { bookId, BookName, Series, Description, Author, Age, Publication_Date, Product_Details, Publisher, ISBN, Link, Source, BookOwner } = await request.json();
        const updateBookInteractor = await UpdateBookInteractor.create();
        const updatedBook = await updateBookInteractor.execute(bookId, { BookName, Series, Description, Author, Age, Publication_Date, Product_Details, Publisher, ISBN, Link, Source, BookOwner });
        if (updatedBook) {
            return new Response(JSON.stringify(updatedBook), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Book not found" }), { status: 404 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}

// TODO MAKE SURE ITS THE RIGHT USER
export async function DELETE(request) {
    try {
        const { bookId } = await request.json();
        const deleteBookInteractor = await DeleteBookFromCollectionAndAllBooklistsInteractor.create();
        await deleteBookInteractor.execute(bookId);
        return new Response(JSON.stringify({ message: "Book removed successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error removing book:", error);
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}