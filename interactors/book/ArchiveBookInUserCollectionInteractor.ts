import { BaseInteractor } from '@interactors/BaseInteractor';
import { IBook } from '@/domain/models';
import { BookRepository } from '@/repositories/BookRepository';

/**
 * @class ArchiveBookInUserCollectionInteractor
 *
 * As a user,
 * When I want to archive a book in my collection,
 * Then I can mark the book as archived without removing it from the database.
 *
 * @method execute
 * @param {string} bookId - The ID of the book to archive.
 * @returns {Promise<IBook>} A promise that resolves to the archived book.
 */
export class ArchiveBookInUserCollectionInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new ArchiveBookInUserCollectionInteractor({ bookRepo });
    return interactor;
  }

  async execute(bookId: string): Promise<IBook> {
    return this.bookRepo.archiveBookInUserCollection(bookId);
  }
}
