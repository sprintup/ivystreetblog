// UserRepository.ts
import { IUser } from '@/domain/models';
import { BaseRepository } from '@/repositories/BaseRepository';
import { Types } from 'mongoose';

export class UserRepository extends BaseRepository {
  public async createUser(
    login: string,
    name: string,
    email: string
  ): Promise<IUser> {
    const newUser = new this.User({
      login,
      name,
      email,
      publicProfileName: email.split('@')[0],
      bookListIds: [],
      trackedBooks: [],
    });

    await newUser.save();
    return newUser;
  }

  async addBookToTrackedBooks(
    userEmail: string,
    bookId: string
  ): Promise<IUser | null> {
    try {
      // Find the user by their email
      const user = await this.User.findOne({ email: userEmail });
      if (!user) {
        console.error('No user found with the provided email:', userEmail);
        return null;
      }

      // Convert the bookId string to ObjectId
      const bookObjectId = new Types.ObjectId(bookId);

      // Check if the book is already in the user's trackedBooks
      const bookIsTracked = user.trackedBooks.some(
        trackedBook => trackedBook.bookId.toString() === bookObjectId.toString()
      );

      if (!bookIsTracked) {
        // If the book is not tracked, add it to the user's trackedBooks
        user.trackedBooks.push({
          bookId: bookObjectId,
          status: 'to-read',
          isFavorite: false,
          review: '',
          ratingPerceivedDifficulty: null,
          isWishlistItem: false,
          bookPriority: 0,
        });
        await user.save();
        console.log("Book added to user's tracked books:", bookId);
      } else {
        console.log("Book is already in the user's tracked books:", bookId);
      }

      return user;
    } catch (error) {
      console.error("Error adding book to user's tracked books:", error);
      throw error;
    }
  }

  async updateBookStatus(userEmail: string, bookId: string, status: string) {
    if (status !== 'to-read' && status !== 'finished') {
      throw new Error(`Invalid status: ${status}`);
    }
    try {
      // Find the user by their email
      const user = await this.User.findOne({ email: userEmail });
      if (!user) {
        throw new Error('User not found');
      }

      // Find the book in the user's trackedBooks
      const trackedBook = user.trackedBooks.find(
        book => book.bookId._id.toString() === bookId
      );
      if (!trackedBook) {
        throw new Error("Book not found in user's tracked books");
      }

      // Update the status of the tracked book
      trackedBook.status = status;

      // Save the updated user document
      await user.save();

      return user;
    } catch (error) {
      console.error('Error updating book status:', error);
      throw error;
    }
  }

  async getUserWithTrackedBooksByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await this.User.findOne({ email })
        .populate({
          path: 'trackedBooks.bookId',
          model: 'Book',
        })
        .lean()
        .exec();
      return user;
    } catch (error) {
      console.error('Error retrieving user with tracked books:', error);
      throw error;
    }
  }

  async updateTrackedBookReview(
    userEmail: string,
    bookId: string,
    review: string,
    ratingPerceivedDifficulty: number
  ): Promise<void> {
    try {
      const user = await this.User.findOne({ email: userEmail });
      if (!user) {
        throw new Error('User not found');
      }

      const trackedBookIndex = user.trackedBooks.findIndex(
        book => book.bookId.toString() === bookId
      );

      if (trackedBookIndex !== -1) {
        user.trackedBooks[trackedBookIndex].review = review;
        user.trackedBooks[trackedBookIndex].ratingPerceivedDifficulty =
          ratingPerceivedDifficulty;
        await user.save();
      } else {
        throw new Error('Tracked book not found');
      }
    } catch (error) {
      console.error('Error updating tracked book review:', error);
      throw error;
    }
  }

  async deleteTrackedBook(
    userEmail: string,
    bookId: string
  ): Promise<IUser | null> {
    try {
      const user = await this.User.findOne({ email: userEmail });
      if (!user) {
        return null;
      }

      const updatedTrackedBooks = user.trackedBooks.filter(
        book => book.bookId.toString() !== bookId
      );

      user.trackedBooks = updatedTrackedBooks;
      await user.save();

      return user;
    } catch (error) {
      console.error('Error deleting tracked book:', error);
      throw error;
    }
  }
}
