import { IBookData } from "@/domain/interfaces";
import { BaseInteractor } from "@interactors/BaseInteractor";
import { IBooklist, IBook } from "@/domain/models";
import { BookRepository } from "@/repositories/BookRepository";


/**
 * @class CreateBookForBooklistInteractor
 *
 * As a user,
 * When I have the editBooklist page open and I add a book,
 * Then that book should be added to the books collection and be tracked by the booklist.
 *
 * @method execute
 * @param {string} userId - The ID of the user adding the book.
 * @param {string} booklistId - The ID of the booklist to which the book is being added.
 * @param {BookData} bookData - The details of the book to add.
 * @returns {Promise<IBook | null>} A promise that resolves to the added book or null if not found.
 */
export class CreateBookForBooklistInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new CreateBookForBooklistInteractor({bookRepo});
    return interactor;
  }

  async execute(userId: string, booklistId: string, bookData: IBookData): Promise<IBook | null> {
    return this.bookRepo.addNewBookToBooklistAndBooksCollection(booklistId, userId, bookData);
  }
}