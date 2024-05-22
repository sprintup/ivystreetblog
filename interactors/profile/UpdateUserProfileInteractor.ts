// interactors/profile/UpdateUserProfileInteractor.ts

import { BaseInteractor } from '../BaseInteractor';
import { UserRepository } from '@/repositories/UserRepository';
import { IUser } from '@/domain/models';
import { ProfileRepository } from '@/repositories/ProfileRepository';

/**
 * @class UpdateUserProfileInteractor
 *
 * As a user,
 * When I update my publicProfileName,
 * Then I'm able to access my bookshelf from the new name.
 */
export class UpdateUserProfileInteractor extends BaseInteractor {
  static async create() {
    const profileRepo = new ProfileRepository();
    await profileRepo.initializeModels();
    const interactor = new UpdateUserProfileInteractor({ profileRepo });
    return interactor;
  }

  /**
   * @method execute
   *
   * Updates the user's public profile name.
   *
   * @param {string} userEmail - The email of the user.
   * @param {string} newPublicProfileName - The new public profile name.
   * @returns {Promise<IUser | null>} A promise that resolves to the updated user or null if not found.
   */
  async execute(
    userEmail: string,
    publicProfileName: string
  ): Promise<IUser | null> {
    return this.profileRepo.updateUserPublicProfileName(
      userEmail,
      publicProfileName
    );
  }
}
