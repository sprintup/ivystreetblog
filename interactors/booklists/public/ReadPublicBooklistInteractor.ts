// Read BooklistInteractor.ts

import { BooklistRepository } from '@/repositories/BooklistRepository';
import { BaseInteractor } from '../../BaseInteractor';
import { IBooklist } from '@/domain/models';

/**
 * Read
 * BooklistInteractor
 *
 * As a user,
 * When I want to view a booklist by ID, such as after clicking the booklist from the public-bookshelf,
 * Then I can see that booklist.
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
    return this.booklistRepo.getPublicBooklistByIdWithUserAndUserBooklistsAndBooks(
      booklistId
    );
  }
}
