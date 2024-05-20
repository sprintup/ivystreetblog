// ReadBooksFromUsersCollectionInteractor.ts

import { BookRepository } from '@/repositories/BookRepository';
import { BaseInteractor } from '../BaseInteractor';
import { IBook } from '@/domain/models';

/**
 * ReadBooksFromUsersCollectionInteractor
 *
 * As a user,
 * When I view my collection of books from the edit booklist page,
 * Then I see the most recently modified 5 books.
 *
 * @param {string} userId - The ID of the user whose books to retrieve.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of books to retrieve per page.
 * @returns {Promise<{ books: IBook[], totalBooks: number }>} A promise that resolves to an object containing the book details and the total number of books.
 */
export class ReadBooksFromUserCollectionPaginatedInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new ReadBooksFromUserCollectionPaginatedInteractor({
      bookRepo,
    });
    return interactor;
  }

  async execute(
    userEmail: string,
    page: number,
    limit: number
  ): Promise<{ books: IBook[]; totalBooks: number }> {
    return this.bookRepo.getUserBooksPaginated(userEmail, page, limit);
  }
}
