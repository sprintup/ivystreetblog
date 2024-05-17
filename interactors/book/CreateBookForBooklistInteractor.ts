import { BaseInteractor } from "../BaseInteractor";
import { IBooklist, IBook } from "@/domain/models";

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
    return this.bookRepo.addNewBookToBooklist(booklistId, bookData);
  }
}
