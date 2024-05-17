import { BaseInteractor } from "../BaseInteractor";
import { IUser } from "@/domain/models";

/**
 * @class CreateTrackedBookInteractor
 *
 * As a user,
 * When I browse to any book,
 * Then I can add that book directly to my reading list, where I can track when I've finished it and leave a review.
 */
export class CreateTrackedBookInteractor extends BaseInteractor {
  /**
   * @method execute
   *
   * Adds a book to a user's tracked books.
   *
   * @param {string} userId - The ID of the user who is adding the book.
   * @param {string} bookId - The ID of the book to add.
   * @returns {Promise<IUser | null>} A promise that resolves to the updated user or null if not found.
   */
  async execute(userId: string, bookId: string): Promise<IUser | null> {
    return this.userRepo.addBookToTrackedBooks(userId, bookId)
  }
}
