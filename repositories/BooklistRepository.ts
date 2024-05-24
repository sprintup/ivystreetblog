// BooklistRepository.ts
import { IBooklist, IUser } from '@/domain/models';
import { BaseRepository } from '@/repositories/BaseRepository';
import mongoose from 'mongoose';

export class BooklistRepository extends BaseRepository {
  async getBooklistsByUserEmail(userEmail: string): Promise<IBooklist[]> {
    try {
      const user = await this.User.findOne({ email: userEmail }).populate<{
        bookListIds: IBooklist[];
      }>({
        path: 'bookListIds',
        model: this.Booklist.modelName,
      });
      if (!user) {
        console.error('No user found with the provided userEmail:', userEmail);
        return [];
      }

      const booklists: IBooklist[] = user.bookListIds;
      return booklists;
    } catch (error) {
      console.error('Error fetching booklists:', error);
      throw error;
    }
  }

  async createBooklist(
    userEmail: string,
    booklist: {
      title: string;
      description?: string;
      visibility: string;
      openForRecommendations: boolean;
    }
  ): Promise<IUser | null> {
    try {
      // Find the user by their email
      const user = await this.User.findOne({ email: userEmail });
      if (!user) {
        console.error('No user found with the provided email:', userEmail);
        return null;
      }

      // Create a new booklist with the provided details and the user's id
      const newBooklist = new this.Booklist({
        title: booklist.title,
        description: booklist.description,
        visibility: booklist.visibility,
        openForRecommendations: booklist.openForRecommendations,
        booklistOwnerId: user._id,
      });
      await newBooklist.save();

      // If the user has a bookListIds field, add the new booklist's id to it
      if (user.bookListIds) {
        user.bookListIds.push(newBooklist._id);
      } else {
        // If the user doesn't have a bookListIds field, create it and add the new booklist's id
        user.bookListIds = [newBooklist._id];
      }
      await user.save();

      return user;
    } catch (error) {
      console.error('Error creating booklist:', error);
      throw error;
    }
  }

  async removeBooklist(booklistId: string): Promise<IBooklist | null> {
    try {
      // Find the booklist by ID and remove it
      const removedBooklist = await this.Booklist.findByIdAndDelete(booklistId);
      if (!removedBooklist) {
        console.error(
          'No booklist found with the provided booklistId:',
          booklistId
        );
        return null;
      }

      // Remove the booklist reference from the user's bookListIds array
      await this.User.updateMany(
        { bookListIds: booklistId },
        { $pull: { bookListIds: booklistId } }
      );

      console.log('Booklist removed:', removedBooklist);
      return removedBooklist;
    } catch (error) {
      console.error('Error removing booklist:', error);
      throw error;
    }
  }

  async getBooklistByIdWithUserAndUserBooklistsAndBooks(
    booklistId: string
  ): Promise<IBooklist | null> {
    try {
      const booklist = await this.Booklist.findById(booklistId)
        .populate({
          path: 'booklistOwnerId',
          model: 'User',
          populate: {
            path: 'bookListIds',
            model: 'Booklist',
          },
        })
        .populate('bookIds');

      if (!booklist) {
        console.error(
          'No booklist found with the provided booklistId:',
          booklistId
        );
        return null;
      }
      return booklist;
    } catch (error) {
      console.error('Error getting booklist by ID:', error);
      throw error;
    }
  }

  async getBooklistByIdWithBooks(
    booklistId: string
  ): Promise<IBooklist | null> {
    try {
      const booklist = await this.Booklist.findById(booklistId).populate({
        path: 'bookIds',
        model: 'Book',
        select:
          'Name Author Description Age Series Publication_Date Publisher ISBN Link Source',
      });

      if (!booklist) {
        console.error(
          'No booklist found with the provided booklistId:',
          booklistId
        );
        return null;
      }

      return booklist;
    } catch (error) {
      console.error('Error getting booklist by ID:', error);
      throw error;
    }
  }

  async getPublicBooklists(): Promise<IBooklist[]> {
    try {
      const publicBooklists = await this.Booklist.find({
        visibility: 'public',
      }).populate('booklistOwnerId');
      return publicBooklists;
    } catch (error) {
      console.error('Error getting public booklists:', error);
      throw error;
    }
  }

  async updateBooklist(
    booklistId: string,
    updatedData: {
      title?: string;
      description?: string;
      visibility?: string;
      openForRecommendations?: boolean;
    }
  ): Promise<IBooklist | null> {
    try {
      const booklist = await this.Booklist.findByIdAndUpdate(
        booklistId,
        {
          $set: {
            title: updatedData.title,
            description: updatedData.description,
            visibility: updatedData.visibility,
            openForRecommendations: updatedData.openForRecommendations,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );
      if (!booklist) {
        console.error(
          'No booklist found with the provided booklistId:',
          booklistId
        );
        return null;
      }
      return booklist;
    } catch (error) {
      console.error('Error updating booklist:', error);
      throw error;
    }
  }

  async addBookToBooklist(booklistId: string, bookId: string): Promise<void> {
    try {
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        throw new Error('Booklist not found');
      }
      const bookObjectId = new mongoose.Types.ObjectId(bookId);
      if (!booklist.bookIds.includes(bookObjectId)) {
        booklist.bookIds.push(bookObjectId);
        await booklist.save();
      }
    } catch (error) {
      console.error('Error adding book to the booklist:', error);
      throw error;
    }
  }

  async getBooklistsByUserId(userId: string): Promise<IBooklist[]> {
    try {
      const booklists = await this.Booklist.find({ booklistOwnerId: userId });
      return booklists;
    } catch (error) {
      console.error('Error getting booklists by user ID:', error);
      throw error;
    }
  }
}
