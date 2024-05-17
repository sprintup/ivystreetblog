// UpdateBookInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IBook } from "@/domain/models";

interface UpdateBookData {
  [key: string]: any;
}

/**
 * UpdateBookInteractor
 *
 * As a user,
 * When I update a book in a booklist,
 * Then the new book information is saved.
 *
 * @param {string} booklistId - The ID of the booklist containing the book to update.
 * @param {string} bookId - The ID of the book to update.
 * @param {UpdateBookData} updatedData - The updated data for the book.
 * @returns {Promise<IBook | null>} A promise that resolves to the updated book or null if not found.
 */
export class UpdateBookInteractor extends BaseInteractor {
  async execute(booklistId: string, bookId: string, updatedData: UpdateBookData): Promise<IBook | null> {
    return this.bookRepo.updateBookInBooklist(booklistId, bookId, updatedData);
  }
}