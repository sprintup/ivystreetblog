import { addBookToBooklist, updateBookInBooklist, deleteBook } from '@/interactors/_baseInteractor';

export async function POST(request) {
    try {
        const { BooklistId, Name, Author, BookOwner } = await request.json();
        const newBook = await addBookToBooklist(BooklistId, { Name, Author, BookOwner });
        if (newBook) {
            return new Response(JSON.stringify(newBook), { status: 201 });
        } else {
            return new Response(JSON.stringify({ error: "Failed to add book to booklist" }), { status: 400 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { bookId, booklistId, BookName, Series, Description, Author, Age, Publication_Date, Product_Details, Publisher, ISBN, Link, Source, BookOwner } = await request.json();
        const updatedBook = await updateBookInBooklist(booklistId, bookId, { BookName, Series, Description, Author, Age, Publication_Date, Product_Details, Publisher, ISBN, Link, Source, BookOwner });
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
        const { bookId, BooklistId } = await request.json();
        const deletedBook = await deleteBook(bookId, BooklistId);
        if (deletedBook) {
            return new Response(JSON.stringify({ message: "Book deleted successfully" }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Book not found" }), { status: 404 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}