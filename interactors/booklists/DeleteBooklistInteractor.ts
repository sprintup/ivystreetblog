// DeleteBooklistInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IBooklist } from "@/domain/models";

/**
 * DeleteBooklistInteractor
 *
 * As a user,
 * When I remove a booklist from the my-bookshelf page,
 * Then that booklist is removed.
 *
 * @param {string} booklistId - The ID of the booklist to remove.
 * @returns {Promise<IBooklist | null>} A promise that resolves to the removed booklist or null if not found.
 */
export class DeleteBooklistInteractor extends BaseInteractor {
  async execute(booklistId: string): Promise<IBooklist | null> {
    return this.booklistRepo.removeBooklist(booklistId);
  }
}