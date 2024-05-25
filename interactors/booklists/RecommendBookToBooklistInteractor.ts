// interactors/booklists/RecommendBookToBooklistInteractor.ts

import { BaseInteractor } from '@interactors/BaseInteractor';
import { IBooklist } from '@/domain/models';
import { BooklistRepository } from '@/repositories/BooklistRepository';
import { UserRepository } from '@/repositories/UserRepository';
import { RecommendBookData } from '@/domain/interfaces';

/**
 * @class RecommendBookToBooklistInteractor
 *
 * As a user,
 * When I recommend a book to a booklist,
 * Then that book recommendation should be added to the booklist.
 *
 * @method execute
 * @param {string} booklistId - The ID of the booklist to which the book is being recommended.
 * @param {RecommendBookData} recommendBookData - The details of the book recommendation.
 * @returns {Promise<IBooklist | null>} A promise that resolves to the updated booklist or null if not found.
 */
export class RecommendBookToBooklistInteractor extends BaseInteractor {
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new RecommendBookToBooklistInteractor({
      booklistRepo,
    });
    return interactor;
  }

  async execute(
    booklistId: string,
    recommendBookData: RecommendBookData
  ): Promise<IBooklist | null> {
    return this.booklistRepo.recommendBookToBooklist(
      booklistId,
      recommendBookData
    );
  }
}
