import { BaseInteractor } from "../../BaseInteractor";
import { IUser } from "@gateways/models";

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
    try {
      const user = await this.User.findOne({ _id: userId });
      if (!user) {
        console.error("No user found with the provided userId:", userId);
        return null;
      }

      // Check if the book is already in the user's trackedBooks
      const isBookTracked = user.trackedBooks.some(
        (trackedBook) => trackedBook.bookId.toString() === bookId.toString()
      );

      if (!isBookTracked) {
        // Add the book to the user's trackedBooks
        user.trackedBooks.push({
          bookId,
          status: "to-read",
          isFavorite: false,
          review: "",
          ratingPerceivedDifficulty: null,
          isWishlistItem: false,
          bookPriority: 0,
        });
        await user.save();
        console.log("Book added to user's tracked books:", bookId);
      } else {
        console.log("Book is already in the user's tracked books:", bookId);
      }

      return this.convertToPlainObject(user) as IUser;
    } catch (error) {
      console.error("Error adding book to user's tracked books:", error);
      throw error;
    }
  }
}
