// RejectRecommendationStatusInteractor.ts

import { BooklistRepository } from '@/repositories/BooklistRepository';
import { BaseInteractor } from '../../BaseInteractor';
import { IBooklist } from '@/domain/models';

/**
 * RejectRecommendationStatusInteractor
 *
 * As a user reviewing a recommendation,
 * When I press the reject button,
 * Then the status for that recommendation changes.
 *
 * @param {string} recommendationId - The ID of the recommendation to update.
 * @param {string} status - The new status of the recommendation ('accepted' or 'rejected').
 * @returns {Promise<IBooklist | null>} A promise that resolves to the updated booklist or null if not found.
 */
export class RejectRecommendationStatusInteractor extends BaseInteractor {
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new RejectRecommendationStatusInteractor({
      booklistRepo,
    });
    return interactor;
  }

  async execute(recommendationId: string): Promise<IBooklist | null> {
    const result = await this.booklistRepo.rejectRecommendationStatus(
      recommendationId
    );
    return this.convertToPlainObject(result) as IBooklist | null;
  }
}
