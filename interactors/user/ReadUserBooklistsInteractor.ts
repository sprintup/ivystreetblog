// interactors/user/ReadUserBooklistsInteractor.ts

import { BaseInteractor } from '../BaseInteractor';
import { IBooklist } from '@/domain/models';
import { UserRepository } from '@/repositories/UserRepository';

/**
 * ReadUserBooklistsInteractor
 *
 * As a user,
 * When I view a book detail screen and press the dropdown to add to one of my booklists,
 * Then I can see my own booklists to add books to.
 *
 * @param {string} userEmail - The email of the user whose booklists are being retrieved.
 * @returns {Promise<IBooklist[]>} A promise that resolves to the user's booklists.
 */
export class ReadUserBooklistsInteractor extends BaseInteractor {
  static async create() {
    const userRepo = new UserRepository();
    await userRepo.initializeModels();
    const interactor = new ReadUserBooklistsInteractor({ userRepo });
    return interactor;
  }

  async execute(userEmail: string): Promise<IBooklist[]> {
    const result = await this.userRepo.getUserBooklistsByEmail(userEmail);
    return this.convertToPlainObject(result) as IBooklist[];
  }
}
