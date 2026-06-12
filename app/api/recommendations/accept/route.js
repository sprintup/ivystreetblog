// app\api\recommendations\accept\route.js
import { AcceptRecommendationInteractor } from '@/interactors/booklists/recommendation/AcceptRecommendationInteractor';
import { jsonErrorResponse, requireSessionUser } from '@/utils/authSession';

export async function PUT(request) {
  const { userEmail, unauthorizedResponse } = await requireSessionUser();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const { recommendationId } = await request.json();
    if (!recommendationId) {
      return jsonErrorResponse('Recommendation ID is required');
    }

    const acceptRecommendationInteractor =
      await AcceptRecommendationInteractor.create();
    const updatedBooklist = await acceptRecommendationInteractor.execute(
      userEmail,
      recommendationId
    );

    if (!updatedBooklist) {
      return jsonErrorResponse(
        'Recommendation not found or you do not own its booklist',
        404
      );
    }

    return new Response(
      JSON.stringify({
        message:
          'Recommendation accepted and added to your collection and booklist',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error accepting recommendation:', error);
    return jsonErrorResponse('Failed to accept recommendation', 500);
  }
}
