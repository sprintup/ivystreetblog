// ReadUserPublicProfileInteractor.ts

import { ProfileRepository } from '@/repositories/ProfileRepository';
import { BaseInteractor } from '../BaseInteractor';

/**
 * ReadUserPublicProfileInteractor
 *
 * As a user,
 * When I visit the public profile of any user,
 * Then I am able to see that user's booklists.
 *
 * @param {string} userEmail - The email of the user whose profile is being retrieved.
 * @returns {Promise<IBooklist | null>} A promise that resolves to the user profile or null if not found.
 */
export class ReadUserPublicProfileInteractor extends BaseInteractor {
  static async create() {
    const profileRepo = new ProfileRepository();
    await profileRepo.initializeModels();
    const interactor = new ReadUserPublicProfileInteractor({ profileRepo });
    return interactor;
  }

  async execute(userEmail: string): Promise<string | null> {
    return this.profileRepo.getPublicProfileName(userEmail);
  }
}
