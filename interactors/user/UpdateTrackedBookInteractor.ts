import { IUser } from "@/domain/models";
import { BaseInteractor } from "../BaseInteractor";

/**
 * @class UpdateTrackedBookInteractor
 *
 * As a user,
 * When I browse to any book,
 * Then I can update my reading list.
 */
export class UpdateTrackedBookInteractor extends BaseInteractor {
    /**
     * @method execute
     *
     * Updates the tracked books for a user.
     *
     * @param {string} userId - The ID of the user whose tracked books are being updated.
     * @param {Array} updatedTrackedBooks - The updated list of tracked books.
     * @returns {Promise<IUser | null>} A promise that resolves to the updated user or null if not found.
     */
    async execute(userId: string, updatedTrackedBooks: Array<string>): Promise<IUser | null> {
      return this.userRepo.updateTrackedBooks(userId, updatedTrackedBooks);
    }
  }