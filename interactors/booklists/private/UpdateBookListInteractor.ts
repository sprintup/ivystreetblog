// interactors\booklists\private\UpdateBookListInteractor.ts

import { BooklistRepository } from '@/repositories/BooklistRepository';
import { BaseInteractor } from '../../BaseInteractor';
import { IBooklist } from '@/domain/models';

interface UpdateBooklistData {
  title?: string;
  description?: string;
  visibility?: string;
  openForRecommendations?: boolean;
}

/**
 * UpdateBooklistInteractor
 *
 * As a user,
 * When I edit a booklist,
 * Then that booklist's data is updated.
 *
 * @param {string} booklistId - The ID of the booklist to update.
 * @param {UpdateBooklistData} updatedData - The updated data for the booklist.
 * @returns {Promise<IBooklist | null>} A promise that resolves to the updated booklist or null if not found.
 */
export class UpdateBookListInteractor extends BaseInteractor {
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new UpdateBookListInteractor({ booklistRepo });
    return interactor;
  }

  async execute(
    booklistId: string,
    updatedData: UpdateBooklistData
  ): Promise<IBooklist | null> {
    return this.booklistRepo.updateBooklist(booklistId, updatedData);
  }
}
