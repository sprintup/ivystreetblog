import { RecommendBookToBooklistInteractor } from "@/interactors/booklists/recommendation/RecommendBookToBooklistInteractor";
import { requireSessionUser } from '@/utils/authSession';

export async function POST(request, { params }) {
    const { userEmail, unauthorizedResponse } = await requireSessionUser();
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const booklistId = params.id;
        const { bookId, recommendationReason } = await request.json();
        const recommendBookInteractor = await RecommendBookToBooklistInteractor.create();
        const updatedBooklist = await recommendBookInteractor.execute(booklistId, userEmail, {
            bookId,
            recommendedBy: userEmail,
            recommendationReason,
        });
        if (updatedBooklist) {
            return new Response(JSON.stringify(updatedBooklist), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Failed to recommend book to booklist" }), { status: 400 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}
