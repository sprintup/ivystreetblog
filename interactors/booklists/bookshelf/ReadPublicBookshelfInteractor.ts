import { BaseInteractor } from "../../BaseInteractor";
import { IBooklist } from "@/domain/models";

/**
 * @class ReadPublicBookshelfInteractor
 *
 * As a user,
 * When I go to public-bookshelf,
 * Then I can see all the public booklists.
 */
export class ReadPublicBookshelfInteractor extends BaseInteractor {
  /**
   * @method execute
   *
   * Retrieves all public booklists.
   *
   * @returns {Promise<IBooklist[]>} A promise that resolves to an array of public booklists.
   */
  async execute(): Promise<IBooklist[]> {
    try {
      const publicBooklists = await this.Booklist.find({ visibility: "public" });
      return publicBooklists.map(this.convertToPlainObject) as IBooklist[];
    } catch (error) {
      console.error("Error getting public booklists:", error);
      throw error;
    }
  }
}
