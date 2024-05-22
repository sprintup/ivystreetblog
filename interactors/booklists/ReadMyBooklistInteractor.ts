// Read BooklistInteractor.ts

import { BooklistRepository } from '@/repositories/BooklistRepository';
import { BaseInteractor } from '../BaseInteractor';
import { IBooklist } from '@/domain/models';

/**
 * Read
 * BooklistInteractor
 *
 * As a user,
 * When I click the edit button on the booklist on the my-bookshelf page,
 * Then I can see that booklist along with the book details.
 *
 * @param {string} booklistId - The ID of the booklist to retrieve.
 * @returns {Promise<IBooklist | null>} A promise that resolves to the booklist object or null if not found.
 */
export class ReadPublicBooklistInteractor extends BaseInteractor {
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new ReadPublicBooklistInteractor({ booklistRepo });
    return interactor;
  }

  async execute(booklistId: string): Promise<IBooklist | null> {
    return this.booklistRepo.getBooklistByIdWithBooks(booklistId);
  }
}
