// ReadUserPublicProfileInteractor.ts

import { ProfileRepository } from '@/repositories/ProfileRepository';
import { BaseInteractor } from '../BaseInteractor';
import { IBooklist } from '@/domain/models';

/**
 * ReadUserPublicProfileInteractor
 *
 * As a user,
 * When I visit the public profile of any user,
 * Then I am able to see that user's booklists.
 *
 * @param {string} publicProfileName - The public profile name of the user whose booklists are being retrieved.
 * @returns {Promise<IBooklist[] | null>} A promise that resolves to the user's public booklists or null if not found.
 */
export class ReadUserPublicProfileInteractor extends BaseInteractor {
  static async create() {
    const profileRepo = new ProfileRepository();
    await profileRepo.initializeModels();
    const interactor = new ReadUserPublicProfileInteractor({ profileRepo });
    return interactor;
  }

  async execute(publicProfileName: string): Promise<IBooklist[] | null> {
    return this.profileRepo.getPublicBooklistsByPublicProfileName(
      publicProfileName
    );
  }
}
