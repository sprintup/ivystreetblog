// ReadPublicBookshelfOfUserInteractor.ts

import { BaseInteractor } from "../../BaseInteractor";
import { IBooklist } from "@gateways/models";

/**
 * ReadPublicBookshelfOfUserInteractor
 *
 * As a user,
 * When I go to any user's public profile page,
 * Then I should be able to see all the booklists associated with that user.
 *
 * @param {string} userId - The ID of the user whose public booklists are being retrieved.
 * @returns {Promise<IBooklist[]>} A promise that resolves to an array of public booklists associated with the user.
 */
export class ReadPublicBookshelfOfUserInteractor extends BaseInteractor {
  async execute(userId: string): Promise<IBooklist[]> {
    try {
      const user = await this.User.findById(userId).populate({
        path: "bookListIds",
        match: { visibility: "public" },
      });

      if (!user) {
        console.error("User not found with the provided userId:", userId);
        return [];
      }

      return this.convertToPlainObject(user.bookListIds) as IBooklist[];
    } catch (error) {
      console.error("Error getting public booklists:", error);
      throw error;
    }
  }
}