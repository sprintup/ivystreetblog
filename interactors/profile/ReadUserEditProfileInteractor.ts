// ReadUserEditProfileInteractor.ts

import { UserRepository } from '@/repositories/UserRepository';
import { BaseInteractor } from '../BaseInteractor';
import { IUser } from '@/domain/models';
import { ProfileRepository } from '@/repositories/ProfileRepository';

/**
 * ReadUserEditProfileInteractor
 *
 * As a user,
 * When I visit the edit profile page,
 * Then I am able to see the publicProfileName used to share booklists.
 *
 * @param {string} userEmail - The email of the user whose profile is being retrieved.
 * @returns {Promise<IUser | null>} A promise that resolves to the user profile or null if not found.
 */
export class ReadUserEditProfileInteractor extends BaseInteractor {
  static async create() {
    const profileRepo = new ProfileRepository();
    await profileRepo.initializeModels();
    const interactor = new ReadUserEditProfileInteractor({ profileRepo });
    return interactor;
  }

  async execute(userEmail: string): Promise<IUser | null> {
    return this.profileRepo.getUserByEmail(userEmail);
  }
}
