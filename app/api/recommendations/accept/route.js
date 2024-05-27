// app\api\recommendations\accept\route.js
import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { UpdateRecommendationStatusInteractor } from '@/interactors/booklists/recommendation/UpdateRecommendationStatusInteractor';

export async function PUT(request) {
    const session = await getServerSession(options);

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { recommendationId } = await request.json();

    try {
        const updateRecommendationStatusInteractor = await UpdateRecommendationStatusInteractor.create();
        await updateRecommendationStatusInteractor.execute(recommendationId, 'accepted');

        return new Response(JSON.stringify({ message: 'Recommendation accepted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error accepting recommendation:', error);
        return new Response(JSON.stringify({ error: 'Failed to accept recommendation' }), { status: 500 });
    }
}