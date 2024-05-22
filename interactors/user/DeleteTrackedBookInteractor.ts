import { IUser } from '@/domain/models';
import { BaseInteractor } from '../BaseInteractor';
import { UserRepository } from '@/repositories/UserRepository';

/**
 * @class DeleteTrackedBookInteractor
 *
 * As a user,
 * When I remove a book from my reading list,
 * Then the book is no longer in my tracked books array.
 */
export class DeleteTrackedBookInteractor extends BaseInteractor {
  static async create() {
    const userRepo = new UserRepository();
    await userRepo.initializeModels();
    const interactor = new DeleteTrackedBookInteractor({ userRepo });
    return interactor;
  }

  /**
   * @method execute
   *
   * Removes a book from the user's tracked books.
   *
   * @param {string} userEmail - The email of the user who is removing the book.
   * @param {string} bookId - The ID of the book to be removed.
   * @returns {Promise<IUser | null>} A promise that resolves to the updated user or null if not found.
   */
  async execute(userEmail: string, bookId: string): Promise<IUser | null> {
    return this.userRepo.deleteTrackedBook(userEmail, bookId);
  }
}
