// UpdateUserProfileInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IUser } from "@gateways/models";

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
    try {
      // Check if the public profile name is already taken by another user
      const existingUser = await this.User.findOne({
        publicProfileName: updatedData.publicProfileName,
      });
      if (existingUser && existingUser.email !== userEmail) {
        throw new Error("Public profile name is already taken.");
      }

      const user = await this.User.findOneAndUpdate(
        { email: userEmail },
        { $set: updatedData },
        { new: true }
      );
      if (!user) {
        console.error("No user found with the provided email:", userEmail);
        return null;
      }
      console.log("User profile updated:", user);
      return this.convertToPlainObject(user) as IUser;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
}