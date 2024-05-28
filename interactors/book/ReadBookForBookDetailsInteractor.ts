// ReadBookForBookDetailsInteractor.ts

import { BookRepository } from '@/repositories/BookRepository';
import { BaseInteractor } from '../BaseInteractor';
import { IBook, IBooklist } from '@/domain/models';

/**
 * ReadBookForBookDetailsInteractor
 *
 * As a user,
 * When I view a book's details, such as when selecting the book title from within a booklist,
 * Then I see the details of that book including a populated list of all booklists with this book.
 *
 * @param {string[]} bookId - The ID of the books to retrieve.
 * @returns {[IBook | null, IBooklist[]]} A promise that resolves to an tuple of book details and an array of Booklists.
 */
export class ReadBookForBookDetailsInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new ReadBookForBookDetailsInteractor({ bookRepo });
    return interactor;
  }

  async execute(bookId: string): Promise<[IBook | null, IBooklist[]]> {
    const book = await this.bookRepo.getBookById(bookId);
    const booklists = await this.bookRepo.getBooklistsByBookId(bookId);
    return [
      (this.convertToPlainObject(book) as IBook) || null,
      this.convertToPlainObject(booklists) as IBooklist[],
    ];
  }
}
