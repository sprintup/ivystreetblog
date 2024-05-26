// UpdateRecommendationStatusInteractor.ts

import { BooklistRepository } from '@/repositories/BooklistRepository';
import { BaseInteractor } from '../../BaseInteractor';
import { IBooklist } from '@/domain/models';

/**
 * UpdateRecommendationStatusInteractor
 *
 * As a user reviewing a recommendation,
 * When I press the accept or reject button,
 * Then the status for that recommendation changes.
 *
 * @param {string} recommendationId - The ID of the recommendation to update.
 * @param {string} status - The new status of the recommendation ('accepted' or 'rejected').
 * @returns {Promise<IBooklist | null>} A promise that resolves to the updated booklist or null if not found.
 */
export class UpdateRecommendationStatusInteractor extends BaseInteractor {
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new UpdateRecommendationStatusInteractor({
      booklistRepo,
    });
    return interactor;
  }

  async execute(
    recommendationId: string,
    status: 'accepted' | 'rejected'
  ): Promise<IBooklist | null> {
    return this.booklistRepo.updateRecommendationStatus(
      recommendationId,
      status
    );
  }
}
