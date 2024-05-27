// interactors/booklists/ReadBooklistRecommendationsInteractor.ts

import { BaseInteractor } from '@interactors/BaseInteractor';
import { IBookRecommendation } from '@/domain/models';
import { BooklistRepository } from '@/repositories/BooklistRepository';

/**
 * @class ReadBooklistRecommendationsInteractor
 *
 * As a logged in user with a booklist that has recommendations
 * When I click the recommendations link on the booklist edit page
 * Then I should see a list of book recommendations
 *
 * @method execute
 * @param {string} booklistId - The ID of the booklist.
 * @returns {Promise<IBookRecommendation[]>} A promise that resolves to an array of book recommendations.
 */
export class ReadBooklistRecommendationsInteractor extends BaseInteractor {
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new ReadBooklistRecommendationsInteractor({
      booklistRepo,
    });
    return interactor;
  }

  async execute(booklistId: string): Promise<IBookRecommendation[]> {
    const response = await this.booklistRepo.getBooklistRecommendations(
      booklistId
    );
    return this.convertToPlainObject(response) as IBookRecommendation[];
  }
}
