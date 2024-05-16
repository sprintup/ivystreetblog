import { BaseInteractor } from "../BaseInteractor";
import { IBooklist, IBook } from "@gateways/models";

interface BookData {
  title: string;
  author: string;
  // Add other book properties as needed
}

/**
 * @class CreateBookForBooklistInteractor
 *
 * As a user,
 * When I have the editBooklist page open and I add a book,
 * Then that book should be added to the books collection and be tracked by the booklist.
 *
 * @method execute
 * @param {string} booklistId - The ID of the booklist to which the book is being added.
 * @param {BookData} bookData - The details of the book to add.
 * @returns {Promise<IBook | null>} A promise that resolves to the added book or null if not found.
 */
export class CreateBookForBooklistInteractor extends BaseInteractor {
  async execute(booklistId: string, bookData: BookData): Promise<IBook | null> {
    try {
      const booklist = await this.Booklist.findOne({ _id: booklistId });
      if (!booklist) {
        console.error("No booklist found with the provided booklistId:", booklistId);
        return null;
      }

      // Create a new book document
      const newBook = new this.Book(bookData);
      await newBook.save();

      // Add the ObjectId of the new book to the bookIds array of the booklist
      booklist.bookIds.push(newBook._id);
      await booklist.save();

      console.log("Book added to booklist:", newBook);
      return this.convertToPlainObject(newBook) as IBook;
    } catch (error) {
      console.error("Error adding book to booklist:", error);
      throw error;
    }
  }
}
