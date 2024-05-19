// DeleteBookInteractor.ts

import { BookRepository } from "@/repositories/BookRepository";
import { BaseInteractor } from "../BaseInteractor";
import { IBook } from "@/domain/models";

/**
 * DeleteBookInteractor
 *
 * As a user,
 * When I delete a book,
 * Then the book is removed from both my booklist as well as from the books collection.
 *
 * @param {string} bookId - The ID of the book to delete.
 * @param {string} booklistId - The ID of the booklist from which the book should be removed.
 * @returns {Promise<IBook | null>} A promise that resolves to the deleted book or null if not found.
 */
export class DeleteBookInteractor extends BaseInteractor {
  static async create() {
    const bookRepo = new BookRepository();
    await bookRepo.initializeModels();
    const interactor = new DeleteBookInteractor({bookRepo});
    return interactor;
  }

  async execute(bookId: string, booklistId: string): Promise<IBook | null> {
    return this.bookRepo.deleteBookFromBooklist(booklistId, bookId);
  }
}