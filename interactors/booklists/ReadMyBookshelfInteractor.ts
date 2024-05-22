// interactors/booklists/ReadBooklistsInteractor.ts

import { BaseInteractor } from "@interactors/BaseInteractor";
import { IBooklist } from "@/domain/models";
import { UserRepository } from "@/repositories/UserRepository";
import { BooklistRepository } from "@/repositories/BooklistRepository";

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
export class ReadMyBookshelfInteractor extends BaseInteractor {
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new ReadMyBookshelfInteractor({booklistRepo});
    return interactor;
  }

  async execute(userEmail: string): Promise<IBooklist[]> {
    return this.booklistRepo.getBooklistsByUserEmail(userEmail);
  }
}