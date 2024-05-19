// app/api/books/route.js
import { ReadBooksFromUsersCollectionInteractor } from "@/interactors/book/ReadBooksFromUsersCollectionInteractor";

export async function POST(request) {
    try {
        const { page, limit, userEmail } = await request.json();

        const readBooksFromUsersCollectionInteractor = await ReadBooksFromUsersCollectionInteractor.create();
        const { books, totalBooks } = await readBooksFromUsersCollectionInteractor.execute(userEmail, page, limit);

        return new Response(JSON.stringify({ books, totalBooks }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching user books:", error);
        return new Response("Failed to fetch user books", { status: 500 });
    }
}