// interactors/booklists/ReadBooklistRecommendationsInteractor.ts

import { BaseInteractor } from '@interactors/BaseInteractor';
import { IBookRecommendation, IBooklist } from '@/domain/models';
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
 * @returns {Promise<{ booklist: IBooklist | null; recommendations: IBookRecommendation[] }>} A promise that resolves to an object containing the booklist and its recommendations.
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

  async execute(booklistId: string): Promise<{
    booklist: IBooklist | null;
    recommendations: IBookRecommendation[];
  }> {
    const response = await this.booklistRepo.getBooklistRecommendations(
      booklistId
    );

    const booklist = response.booklist
      ? this.convertToPlainObject(response.booklist)
      : null;

    if (booklist) {
      booklist.bookIds = booklist.bookIds.map((book: any) =>
        this.convertToPlainObject(book)
      );
    }

    const recommendations = response.recommendations.map(recommendation =>
      this.convertToPlainObject(recommendation)
    );

    return {
      booklist,
      recommendations,
    };
  }
}
