// interactors/book/ToggleBookArchiveInteractor.ts

import { BaseInteractor } from '@interactors/BaseInteractor';
import { IBook } from '@/domain/models';
import { BookRepository } from '@/repositories/BookRepository';

/**
 * @class ToggleBookArchiveInteractor
 *
 * As a user,
 * When I want to toggle the archive status of a book in my collection,
 * Then I can mark the book as archived or unarchived without removing it from the database.
 *
 * @method create
 * @returns {Promise<ToggleBookArchiveInteractor>} A promise that resolves to an instance of ToggleBookArchiveInteractor.
 */
export class ToggleBookArchiveInteractor extends BaseInteractor {
  /**
   * Creates an instance of ToggleBookArchiveInteractor.
   *
   * @returns {Promise<ToggleBookArchiveInteractor>} A promise that resolves to an instance of ToggleBookArchiveInteractor.
   */
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new ToggleBookArchiveInteractor({ bookRepo });
    return interactor;
  }

  /**
   * Toggles the archive status of a book in the user's collection.
   *
   * @param {string} bookId - The ID of the book to toggle the archive status.
   * @returns {Promise<IBook>} A promise that resolves to the updated book.
   */
  async execute(bookId: string): Promise<IBook> {
    return this.bookRepo.toggleBookArchiveInUserCollection(bookId);
  }
}
