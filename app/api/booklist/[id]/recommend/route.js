import { RecommendBookToBooklistInteractor } from "@/interactors/booklists/recommendation/RecommendBookToBooklistInteractor";

export async function POST(request, { params }) {
    try {
        const booklistId = params.id;
        const { bookId, recommendedBy, recommendationReason } = await request.json();
        const recommendBookInteractor = await RecommendBookToBooklistInteractor.create();
        const updatedBooklist = await recommendBookInteractor.execute(booklistId, { bookId, recommendedBy, recommendationReason });
        if (updatedBooklist) {
            return new Response(JSON.stringify(updatedBooklist), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Failed to recommend book to booklist" }), { status: 400 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}