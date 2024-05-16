// CreateBooklistInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IUser, IBooklist } from "@/domain/models";

interface BooklistInput {
  title: string;
  description?: string;
  visibility: string;
}

/**
 * CreateBooklistInteractor
 *
 * As a user,
 * When I create a booklist from the my-bookshelf page,
 * Then a booklist is created with me as the owner.
 *
 * @param {string} userId - The ID of the user creating the booklist.
 * @param {BooklistInput} booklist - The details of the booklist to create.
 * @returns {Promise<IUser | null>} A promise that resolves to the updated user or null if not found.
 */
export class CreateBooklistInteractor extends BaseInteractor {
  async execute(userId: string, booklist: BooklistInput): Promise<IUser | null> {
    try {
      const user = await this.User.findById(userId);
      if (!user) {
        console.error("No user found with the provided userId:", userId);
        return null;
      }

      const currentDate = new Date();

      const newBooklist = new this.Booklist({
        title: booklist.title,
        description: booklist.description,
        visibility: booklist.visibility,
        booklistOwnerId: userId,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
      await newBooklist.save();

      user.bookListIds?.push(newBooklist._id);
      await user.save();

      return this.convertToPlainObject(user) as IUser;
    } catch (error) {
      console.error("Error adding booklist to user's collection:", error);
      throw error;
    }
  }
}
