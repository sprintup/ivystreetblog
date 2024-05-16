// interactors\ReadBooklistsWithBookInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IBooklist } from "@/domain/models";

/**
 * ReadBooklistsWithBookInteractor
 *
 * As a user,
 * When I view a book's detail page,
 * I can see the booklists that contain the book.
 *
 * @param {string} bookId - The ID of the book to find the associated booklists.
 * @returns {Promise<IBooklist[]>} A promise that resolves to an array of booklists containing the book.
 */
export class ReadBooklistsWithBookInteractor extends BaseInteractor {
  async execute(bookId: string): Promise<IBooklist[]> {
    try {
      const booklists = await this.Booklist.find({ bookIds: bookId });
      return this.convertToPlainObject(booklists) as IBooklist[];
    } catch (error) {
      console.error("Error getting booklists by book ID:", error);
      throw error;
    }
  }
}