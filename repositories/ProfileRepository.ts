// BookRepository.ts
import { IBook, IUser } from "@/domain/models";
import { BaseRepository } from "@/repositories/BaseRepository";

export class ProfileRepository extends BaseRepository {
  async getUserByEmail(userEmail: string): Promise<IUser | null> {
    try {
      const user = await this.User.findOne({ email: userEmail });
      if (!user) {
        console.error("No user found with the provided email:", userEmail);
        return null;
      }
      return user;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }
 
  async updateUserProfile(userEmail, updatedData) {
    try {
      // Validate if the new public profile name is not used by another user
      const userWithSameProfileName = await this.User.findOne({
        publicProfileName: updatedData.publicProfileName,
      });
  
      // If the profile name is already used and not by the current user, throw an error
      if (userWithSameProfileName && userWithSameProfileName.email !== userEmail) {
        throw new Error("Public profile name is already in use.");
      }
  
      // Find the user by email and update their data with the new values
      const updatedUser = await this.User.findOneAndUpdate(
        { email: userEmail },
        { $set: updatedData },
        { new: true }
      );
  
      if (!updatedUser) {
        console.error("No user found with the provided email:", userEmail);
        return null;
      }
  
      console.log("User profile updated:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
  
}

