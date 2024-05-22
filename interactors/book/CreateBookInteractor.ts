import { IBookData } from '@/domain/interfaces';
import { BaseInteractor } from '@interactors/BaseInteractor';
import { IBook } from '@/domain/models';
import { BookRepository } from '@/repositories/BookRepository';

/**
 * @class CreateBookInteractor
 *
 * As a user,
 * When I want to add a new book to my collection,
 * Then I can create a new book without associating it with a booklist initially.
 *
 * @method execute
 * @param {string} userId - The ID of the user creating the book.
 * @param {IBookData} bookData - The details of the book to create.
 * @returns {Promise<IBook>} A promise that resolves to the created book.
 */
export class CreateBookInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new CreateBookInteractor({ bookRepo });
    return interactor;
  }

  async execute(userEmail: string, bookData: IBookData): Promise<IBook> {
    return this.bookRepo.createNewBook(userEmail, bookData);
  }
}
