// interactors/booklists/ReadBooklistsInteractor.ts

import { BaseInteractor } from "@interactors/BaseInteractor";
import { IBooklist } from "@gateways/models";

/**
 * ReadBooklistsInteractor
 *
 * As a user,
 * When I go to my bookshelf page,
 * Then I see all my booklists.
 *
 * @param {string} userEmail - The email of the user.
 * @returns {Promise<IBooklist[]>} A promise that resolves to an array of booklists assigned to the user.
 */
export class ReadBooklistsInteractor extends BaseInteractor {
  static async create() {
    const interactor = new ReadBooklistsInteractor();
    await interactor.initializeModels();
    return interactor;
  }

  async execute(userEmail: string): Promise<IBooklist[]> {
    try {
      const user = await this.User.findOne({ email: userEmail }).populate<{ bookListIds: IBooklist[] }>({
        path: 'bookListIds',
        model: this.Booklist.modelName,
      });
      if (!user) {
        console.error("No user found with the provided userEmail:", userEmail);
        return [];
      }

      const booklists: IBooklist[] = user.bookListIds;
      return booklists;
    } catch (error) {
      console.error("Error fetching booklists:", error);
      throw error;
    }
  }
}