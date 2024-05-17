// UpdateUserProfileInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IUser } from "@/domain/models";

interface UpdateUserProfileData {
  publicProfileName?: string;
  // Add other fields as needed
}

/**
 * UpdateUserProfileInteractor
 *
 * As a user,
 * When I update my publicProfileName,
 * Then I'm able to access my bookshelf from the new name.
 *
 * @param {string} userEmail - The email of the user whose profile is being updated.
 * @param {UpdateUserProfileData} updatedData - The updated data for the user profile.
 * @returns {Promise<IUser | null>} A promise that resolves to the updated user profile or null if not found.
 */
export class UpdateUserProfileInteractor extends BaseInteractor {
  async execute(userEmail: string, updatedData: UpdateUserProfileData): Promise<IUser | null> {
    return this.profileRepo.updateUserProfile(userEmail, updatedData);
  }
}