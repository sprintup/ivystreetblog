import { UpdateRecommendationStatusInteractor } from '@/interactors/booklists/recommendation/UpdateRecommendationStatusInteractor';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { recommendationId } = req.body;

        try {
            const updateRecommendationStatusInteractor = await UpdateRecommendationStatusInteractor.create();
            await updateRecommendationStatusInteractor.execute(recommendationId, 'accepted');

            res.status(200).json({ message: 'Recommendation accepted successfully' });
        } catch (error) {
            console.error('Error accepting recommendation:', error);
            res.status(500).json({ error: 'Failed to accept recommendation' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}