// Read BooklistInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IBooklist } from "@gateways/models";

/**
 * Read
 * BooklistInteractor
 *
 * As a user,
 * When I want to view a booklist by ID, such as after clicking the booklist from the public-bookshelf,
 * Then I can see that booklist.
 *
 * @param {string} booklistId - The ID of the booklist to retrieve.
 * @returns {Promise<IBooklist | null>} A promise that resolves to the booklist object or null if not found.
 */
export class ReadBooklistInteractor extends BaseInteractor {
  async execute(booklistId: string): Promise<IBooklist | null> {
    try {
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        console.error("No booklist found with the provided booklistId:", booklistId);
        return null;
      }
      return this.convertToPlainObject(booklist) as IBooklist;
    } catch (error) {
      console.error("Error getting booklist by ID:", error);
      throw error;
    }
  }
}