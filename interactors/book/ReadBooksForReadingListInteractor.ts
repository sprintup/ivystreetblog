// ReadBooksForReadingListInteractor.ts

import { BookRepository } from "@/repositories/BookRepository";
import { BaseInteractor } from "../BaseInteractor";
import { IBook } from "@/domain/models";

/**
 * ReadBooksForReadingListInteractor
 *
 * As a user,
 * When I view the reading list,
 * Then I see the details of those books.
 *
 * @param {string[]} bookIds - The IDs of the books to retrieve.
 * @returns {Promise<IBook[]>} A promise that resolves to an array of book details.
 */
export class ReadBooksForReadingListInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new ReadBooksForReadingListInteractor({bookRepo});
    return interactor;
  }

  async execute(bookIds: string[]): Promise<IBook[]> {
    return this.bookRepo.getBooksByIds(bookIds); 
  }
}