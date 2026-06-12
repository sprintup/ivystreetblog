import { BaseInteractor } from '@interactors/BaseInteractor';
import { IBooklist } from '@/domain/models';
import { BookRepository } from '@/repositories/BookRepository';

/**
 * @class CreateBookForBooklistInteractor
 *
 * As a user,
 * When I add an existing book to one of my booklists,
 * Then that book should be referenced by my booklist.
 *
 * @method execute
 * @param {string} userEmail - The email of the user adding the book.
 * @param {string} booklistId - The ID of the booklist to which the book is being added.
 * @param {string} bookId - The ID of the existing book to add.
 * @returns {Promise<IBooklist | null>} The updated booklist or null if it was not found.
 */
export class AddBookFromCollectionToBooklistInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new AddBookFromCollectionToBooklistInteractor({
      bookRepo,
    });
    return interactor;
  }

  async execute(
    userEmail: string,
    booklistId: string,
    bookId: string
  ): Promise<IBooklist | null> {
    return this.bookRepo.addOwnedBookToBooklist(userEmail, booklistId, bookId);
  }
}
