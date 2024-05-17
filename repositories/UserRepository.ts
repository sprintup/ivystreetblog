// UserRepository.ts
import { IUser } from "@/domain/models";
import { BaseRepository } from "@/repositories/BaseRepository";

export class UserRepository extends BaseRepository {
  public async createUser(login: string, name: string, email: string): Promise<IUser> {
    const newUser = new this.User({
      login,
      name,
      email,
      publicProfileName: email.split("@")[0],
      bookListIds: [],
      trackedBooks: [],
    });

    await newUser.save();
    return newUser;
  }

  async addBookToTrackedBooks(userId, bookId) {
    try {
      // Find the user by their ID
      const user = await this.User.findOne({ _id: userId });
      if (!user) {
        console.error("No user found with the provided userId:", userId);
        return null;
      }
  
      // Check if the book is already in the user's trackedBooks
      const bookIsTracked = user.trackedBooks.some(
        (trackedBook) => trackedBook.bookId.toString() === bookId.toString()
      );
  
      if (!bookIsTracked) {
        // If the book is not tracked, add it to the user's trackedBooks
        user.trackedBooks.push({
          bookId,
          status: "to-read",
          isFavorite: false,
          review: "",
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
  
  async updateTrackedBooks(userId, updatedTrackedBooks) {
    try {
      // Find the user by their ID
      const user = await this.User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
  
      // Update the user's trackedBooks with the new list
      user.trackedBooks = updatedTrackedBooks;
  
      // Save the updated user document
      await user.save();
  
      return user;
    } catch (error) {
      console.error("Error updating tracked books:", error);
      throw error;
    }
  }
  
}
