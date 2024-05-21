// UpdateBookInteractor.ts

import { BookRepository } from '@/repositories/BookRepository';
import { BaseInteractor } from '../BaseInteractor';
import { IBook } from '@/domain/models';

interface UpdateBookData {
  [key: string]: any;
}

/**
 * UpdateBookInteractor
 *
 * As a user,
 * When I update a book,
 * Then the new book information is saved.
 *
 * @param {string} bookId - The ID of the book to update.
 * @param {UpdateBookData} updatedData - The updated data for the book.
 * @returns {Promise<IBook | null>} A promise that resolves to the updated book or null if not found.
 */
export class UpdateBookInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new UpdateBookInteractor({ bookRepo });
    return interactor;
  }

  async execute(
    bookId: string,
    updatedData: UpdateBookData
  ): Promise<IBook | null> {
    return this.bookRepo.updateBook(bookId, updatedData);
  }
}
