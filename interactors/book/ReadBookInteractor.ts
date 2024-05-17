// ReadBookInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IBook } from "@/domain/models";

/**
 * ReadBookInteractor
 *
 * As a user,
 * When I view a list of books,
 * Then I see the details of those books.
 *
 * @param {string[]} bookIds - The IDs of the books to retrieve.
 * @returns {Promise<IBook[]>} A promise that resolves to an array of book details.
 */
export class ReadBookInteractor extends BaseInteractor {
  async execute(bookIds: string[]): Promise<IBook[]> {
    return this.bookRepo.getBooksByIds(bookIds);
  }
}