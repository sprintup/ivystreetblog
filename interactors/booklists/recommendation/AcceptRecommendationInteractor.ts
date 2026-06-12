// interactors\booklists\recommendation\AcceptRecommendationInteractor.ts

import { BooklistRepository } from '@/repositories/BooklistRepository';
import { BaseInteractor } from '../../BaseInteractor';
import { IBooklist } from '@/domain/models';

/**
 * AcceptRecommendationInteractor
 *
 * As a user who has received an offered recommendation status,
 * When I press accept,
 * Then the book is copied into my collection and added to my booklist.
 *
 * @param {string} userEmail - The email of the booklist owner.
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

  async execute(
    userEmail: string,
    recommendationId: string
  ): Promise<IBooklist | null> {
    const result = await this.booklistRepo.acceptRecommendation(
      userEmail,
      recommendationId
    );
    return this.convertToPlainObject(result) as IBooklist | null;
  }
}
