// UpdateBookInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IBook } from "@gateways/models";

interface UpdateBookData {
  [key: string]: any;
}

/**
 * UpdateBookInteractor
 *
 * As a user,
 * When I update a book in a booklist,
 * Then the new book information is saved.
 *
 * @param {string} booklistId - The ID of the booklist containing the book to update.
 * @param {string} bookId - The ID of the book to update.
 * @param {UpdateBookData} updatedData - The updated data for the book.
 * @returns {Promise<IBook | null>} A promise that resolves to the updated book or null if not found.
 */
export class UpdateBookInteractor extends BaseInteractor {
  async execute(booklistId: string, bookId: string, updatedData: UpdateBookData): Promise<IBook | null> {
    try {
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        console.error("No booklist found with the provided booklistId:", booklistId);
        return null;
      }

      const book = await this.Book.findByIdAndUpdate(
        bookId,
        { $set: updatedData },
        { new: true }
      );
      if (!book) {
        console.error("No book found with the provided bookId:", bookId);
        return null;
      }

      return this.convertToPlainObject(book) as IBook;
    } catch (error) {
      console.error("Error updating book in booklist:", error);
      throw error;
    }
  }
}