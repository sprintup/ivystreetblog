// interactors\booklists\recommendation\AcceptRecommendationInteractor.ts

import { BooklistRepository } from '@/repositories/BooklistRepository';
import { BaseInteractor } from '../../BaseInteractor';
import { IBooklist } from '@/domain/models';

/**
 * AcceptRecommendationInteractor
 *
 * As a user who has received an offered recommendation status,
 * When I press accept,
 * Then I clone the book, add it to my collection, and add that book to my booklist.
 *
 * @param {string} recommendationId - The ID of the recommendation to accept.
 * @returns {Promise<IBooklist | null>} A promise that resolves to the updated booklist or null if not found.
 */
export class AcceptRecommendationInteractor extends BaseInteractor {
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new AcceptRecommendationInteractor({
      booklistRepo,
    });
    return interactor;
  }

  async execute(recommendationId: string): Promise<IBooklist | null> {
    return this.booklistRepo.acceptRecommendation(recommendationId);
  }
}
