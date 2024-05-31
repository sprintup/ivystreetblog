// app\api\recommendations\delete\route.js
import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { DeleteRecommendationInteractor } from '@/interactors/booklists/recommendation/DeleteRecommendationInteractor';

export async function DELETE(request) {
    const session = await getServerSession(options);

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { recommendationId } = await request.json();
    console.log('recommendationId in route:', recommendationId);

    try {
        const deleteRecommendationInteractor = await DeleteRecommendationInteractor.create();
        await deleteRecommendationInteractor.execute(recommendationId);

        return new Response(JSON.stringify({ message: 'Recommendation deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting recommendation:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete recommendation' }), { status: 500 });
    }
}