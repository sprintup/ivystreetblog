// app\api\recommendations\reject\route.js
import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { RejectRecommendationStatusInteractor } from '@/interactors/booklists/recommendation/RejectRecommendationStatusInteractor';

export async function PUT(request) {
    const session = await getServerSession(options);

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { recommendationId } = await request.json();
    console.log('recommendationId in route:', recommendationId);

    try {
        const updateRecommendationStatusInteractor = await RejectRecommendationStatusInteractor.create();
        await updateRecommendationStatusInteractor.execute(recommendationId);

        return new Response(JSON.stringify({ message: 'Recommendation rejected successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error rejecting recommendation:', error);
        return new Response(JSON.stringify({ error: 'Failed to reject recommendation' }), { status: 500 });
    }
}