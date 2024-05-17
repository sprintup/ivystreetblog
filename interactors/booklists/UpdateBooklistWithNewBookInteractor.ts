import { BaseInteractor } from "../BaseInteractor";
import { IBooklist } from "@/domain/models";

/**
 * @class UpdateBooklistWithNewBookInteractor
 *
 * As a user,
 * When I go to any booklist,
 * Then I can add that book to any of my booklists and view all my booklists.
 */
export class UpdateBooklistWithNewBookInteractor extends BaseInteractor {
  /**
   * @method execute
   *
   * Adds a book to a booklist.
   *
   * @param {string} booklistId - The ID of the booklist to which the book is being added.
   * @param {string} bookId - The ID of the book to add.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async addBook(booklistId: string, bookId: string): Promise<void> {
    
  }

  /**
   * @method getBooklists
   *
   * Retrieves all booklists for a user.
   *
   * @param {string} userId - The ID of the user whose booklists are to be fetched.
   * @returns {Promise<IBooklist[]>} A promise that resolves to an array of the user's booklists.
   */
  async getBooklists(userId: string): Promise<IBooklist[]> {
    return this.booklistRepo.getBooklistsByUserId(userId);
  }
}
