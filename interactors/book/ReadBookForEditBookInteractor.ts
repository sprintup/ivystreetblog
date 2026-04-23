// ReadBookForEditBookInteractor.ts

import { BookRepository } from '@/repositories/BookRepository';
import { BaseInteractor } from '../BaseInteractor';
import { IBook } from '@/domain/models';

/**
 * ReadBookForEditBookInteractor
 *
 * As a user,
 * When I view the reading list,
 * Then I see the details of those books.
 *
 * @param {string} userEmail - The email of the current user.
 * @param {string} bookId - The ID of the book to retrieve.
 * @returns {Promise<IBook | null>} A promise that resolves to the owned book details.
 */
export class ReadBookForEditBookInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new ReadBookForEditBookInteractor({ bookRepo });
    return interactor;
  }

  async execute(userEmail: string, bookId: string): Promise<IBook | null> {
    return this.bookRepo.getOwnedBookById(userEmail, bookId);
  }
}
