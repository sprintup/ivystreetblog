// DeleteBooklistInteractor.ts

import { BooklistRepository } from "@/repositories/BooklistRepository";
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
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new DeleteBooklistInteractor({booklistRepo});
    return interactor;
  }
  
  async execute(booklistId: string): Promise<IBooklist | null> {
    return this.booklistRepo.removeBooklist(booklistId);
  }
}