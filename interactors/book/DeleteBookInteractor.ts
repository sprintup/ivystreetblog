// DeleteBookInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IBook } from "@gateways/models";

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
  async execute(bookId: string, booklistId: string): Promise<IBook | null> {
    try {
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        console.error("No booklist found with the provided booklistId:", booklistId);
        return null;
      }

      const book = await this.Book.findByIdAndDelete(bookId);
      if (!book) {
        console.error("No book found with the provided bookId:", bookId);
        return null;
      }

      // Remove the book reference from the booklist's bookIds array
      booklist.bookIds = booklist.bookIds.filter((id) => id.toString() !== bookId);
      await booklist.save();

      console.log("Book deleted:", book);
      return this.convertToPlainObject(book) as IBook;
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  }
}