import { UpdateRecommendationStatusInteractor } from '@/interactors/booklists/recommendation/UpdateRecommendationStatusInteractor';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { recommendationId } = req.body;

        try {
            const updateRecommendationStatusInteractor = await UpdateRecommendationStatusInteractor.create();
            await updateRecommendationStatusInteractor.execute(recommendationId, 'rejected');

            res.status(200).json({ message: 'Recommendation rejected successfully' });
        } catch (error) {
            console.error('Error rejecting recommendation:', error);
            res.status(500).json({ error: 'Failed to reject recommendation' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}