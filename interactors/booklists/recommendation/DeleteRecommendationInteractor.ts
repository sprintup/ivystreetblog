// DeleteRecommendationInteractor.ts

import { BooklistRepository } from '@/repositories/BooklistRepository';
import { BaseInteractor } from '../../BaseInteractor';

/**
 * DeleteRecommendationInteractor
 *
 * As a user with a recommendation,
 * When I press delete on the recommendation,
 * Then that recommendation is deleted.
 *
 * @param {string} recommendationId - The ID of the recommendation to delete.
 * @returns {Promise<void>}
 */
export class DeleteRecommendationInteractor extends BaseInteractor {
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new DeleteRecommendationInteractor({
      booklistRepo,
    });
    return interactor;
  }

  async execute(recommendationId: string): Promise<void> {
    await this.booklistRepo.deleteRecommendation(recommendationId);
  }
}
