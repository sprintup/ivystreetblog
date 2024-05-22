import { IUser } from '@/domain/models';
import { BaseInteractor } from '../BaseInteractor';
import { UserRepository } from '@/repositories/UserRepository';

/**
 * @class UpdateTrackedBookInteractor
 *
 * As a user,
 * When I change the status of a book in my reading list,
 * Then the status of my tracked book changes.
 */
export class UpdateTrackedBookInteractor extends BaseInteractor {
  static async create() {
    const userRepo = new UserRepository();
    await userRepo.initializeModels();
    const interactor = new UpdateTrackedBookInteractor({ userRepo });
    return interactor;
  }
  async execute(
    userEmail: string,
    bookId: string,
    status: string
  ): Promise<IUser | null> {
    return this.userRepo.updateBookStatus(userEmail, bookId, status);
  }
}
