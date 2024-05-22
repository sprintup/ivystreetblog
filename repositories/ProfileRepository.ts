// BookRepository.ts
import { IBook, IBooklist, IUser } from '@/domain/models';
import { BaseRepository } from '@/repositories/BaseRepository';

export class ProfileRepository extends BaseRepository {
  async getUserByEmail(userEmail: string): Promise<IUser | null> {
    try {
      const user = await this.User.findOne({ email: userEmail });
      if (!user) {
        console.error('No user found with the provided email:', userEmail);
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async updateUserPublicProfileName(
    userEmail: string,
    publicProfileName: string
  ): Promise<IUser | null> {
    try {
      const user = await this.User.findOneAndUpdate(
        { email: userEmail },
        { publicProfileName },
        { new: true }
      )
        .lean()
        .exec();

      return user;
    } catch (error) {
      console.error("Error updating user's public profile name:", error);
      throw error;
    }
  }

  async getPublicBooklistsByPublicProfileName(
    publicProfileName: string
  ): Promise<IBooklist[] | null> {
    try {
      const user = await this.User.findOne({ publicProfileName })
        .populate({
          path: 'bookListIds',
          match: { visibility: 'public' },
        })
        .lean()
        .exec();

      if (!user) {
        return null;
      }

      const publicBooklists = user.bookListIds;
      return publicBooklists;
    } catch (error) {
      console.error(
        'Error retrieving public booklists by public profile name:',
        error
      );
      throw error;
    }
  }
}
