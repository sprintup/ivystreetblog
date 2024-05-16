// DeleteBooklistInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IBooklist } from "@gateways/models";

/**
 * DeleteBooklistInteractor
 *
 * As a user,
 * When I remove a booklist from the my-bookshelf page,
 * Then that booklist is removed.
 *
 * @param {string} booklistId - The ID of the booklist to remove.
 * @returns {Promise<IBooklist | null>} A promise that resolves to the removed booklist or null if not found.
 */
export class DeleteBooklistInteractor extends BaseInteractor {
  async execute(booklistId: string): Promise<IBooklist | null> {
    try {
      // Find the booklist by ID and remove it
      const removedBooklist = await this.Booklist.findByIdAndDelete(booklistId);
      if (!removedBooklist) {
        console.error("No booklist found with the provided booklistId:", booklistId);
        return null;
      }

      // Remove the booklist reference from the user's bookListIds array
      await this.User.updateMany(
        { bookListIds: booklistId },
        { $pull: { bookListIds: booklistId } }
      );

      console.log("Booklist removed:", removedBooklist);
      return this.convertToPlainObject(removedBooklist) as IBooklist;
    } catch (error) {
      console.error("Error removing booklist:", error);
      throw error;
    }
  }
}