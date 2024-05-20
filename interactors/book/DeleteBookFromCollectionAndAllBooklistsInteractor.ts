// interactors\book\DeleteBookFromCollectionAndAllBooklistsInteractor.ts

import { BookRepository } from '@/repositories/BookRepository';
import { BaseInteractor } from '../BaseInteractor';
import { IBook } from '@/domain/models';

/**
 * DeleteBookFromCollectionAndAllBooklistsInteractor
 *
 * As a user,
 * When I delete a book in my collection,
 * Then the book is removed from both my collection as well as from all booklists and tracked books.
 *
 * @param {string} bookId - The ID of the book to delete.
 * @returns {Promise<IBook | null>} A promise that resolves to the deleted book or null if not found.
 */
export class DeleteBookFromCollectionAndAllBooklistsInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new DeleteBookFromCollectionAndAllBooklistsInteractor({
      bookRepo,
    });
    return interactor;
  }

  async execute(bookId: string): Promise<IBook | null> {
    return this.bookRepo.deleteBookFromCollectionAndBooklistsAndTrackedBooks(
      bookId
    );
  }
}
