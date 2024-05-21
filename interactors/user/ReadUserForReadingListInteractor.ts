import { IUser } from '@/domain/models';
import { BaseInteractor } from '../BaseInteractor';
import { UserRepository } from '@/repositories/UserRepository';

/**
 * @class ReadUserForReadingListInteractor
 *
 * As a user,
 * When I go to my reading list,
 * Then I should see my tracked books.
 */
export class ReadUserForReadingListInteractor extends BaseInteractor {
  static async create() {
    const userRepo = new UserRepository();
    await userRepo.initializeModels();
    const interactor = new ReadUserForReadingListInteractor({ userRepo });
    return interactor;
  }
  /**
   * @method execute
   *
   * Retrieves the user's tracked books for their reading list.
   *
   * @param {string} userEmail - The email of the user whose tracked books are being retrieved.
   * @returns {Promise<object | null>} A promise that resolves to the user with their tracked books or null if not found.
   */
  async execute(userEmail: string): Promise<object | null> {
    const result = await this.userRepo.getUserWithTrackedBooksByEmail(
      userEmail
    );
    const dto = this.convertToPlainObject(result);
    return dto;
  }
}
