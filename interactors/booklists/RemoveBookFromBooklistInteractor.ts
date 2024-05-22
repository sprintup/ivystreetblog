import { BaseInteractor } from '@interactors/BaseInteractor';
import { IBooklist } from '@/domain/models';
import { BookRepository } from '@/repositories/BookRepository';

/**
 * @class RemoveBookFromBooklistInteractor
 *
 * As a user,
 * When I have the editBooklist page open and I remove a book from the booklist,
 * Then that book should be removed from the booklist.
 *
 * @method execute
 * @param {string} booklistId - The ID of the booklist from which the book should be removed.
 * @param {string} bookId - The ID of the book to be removed from the booklist.
 * @returns {Promise<IBooklist | null>} A promise that resolves to the updated booklist or null if not found.
 */
export class RemoveBookFromBooklistInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new RemoveBookFromBooklistInteractor({ bookRepo });
    return interactor;
  }

  async execute(booklistId: string, bookId: string): Promise<IBooklist | null> {
    return this.bookRepo.removeBookFromBooklist(booklistId, bookId);
  }
}
