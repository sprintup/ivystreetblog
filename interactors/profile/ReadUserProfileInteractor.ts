// ReadUserProfileInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IUser } from "@/domain/models";

/**
 * ReadUserProfileInteractor
 *
 * As a user,
 * When I visit the profile page,
 * Then I am able to see the publicProfileName used to share booklists.
 *
 * @param {string} userEmail - The email of the user whose profile is being retrieved.
 * @returns {Promise<IUser | null>} A promise that resolves to the user profile or null if not found.
 */
export class ReadUserProfileInteractor extends BaseInteractor {
  async execute(userEmail: string): Promise<IUser | null> {
    return this.profileRepo.getUserByEmail(userEmail);
  }
}