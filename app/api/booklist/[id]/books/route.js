// app/api/booklist/[id]/books/route.js

import { ReadPublicBooklistInteractor } from "@/interactors/booklists/ReadPublicBooklistInteractor";

export async function GET(request, { params }) {
    try {
        const booklistId = params.id;
        const readPublicBooklistInteractor = await ReadPublicBooklistInteractor.create();
        const booklist = await readPublicBooklistInteractor.execute(booklistId);

        if (booklist) {
            return new Response(JSON.stringify(booklist), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Booklist not found" }), { status: 404 });
        }
    } catch (error) {
        console.error("Error fetching booklist with books:", error);
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}