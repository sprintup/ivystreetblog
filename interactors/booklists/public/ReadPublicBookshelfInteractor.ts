import { BooklistRepository } from '@/repositories/BooklistRepository';
import { BaseInteractor } from '../../BaseInteractor';
import { IBooklist } from '@/domain/models';

/**
 * @class ReadPublicBookshelfInteractor
 *
 * As a user,
 * When I go to public-bookshelf,
 * Then I can see all the public booklists.
 */
export class ReadPublicBookshelfInteractor extends BaseInteractor {
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new ReadPublicBookshelfInteractor({ booklistRepo });
    return interactor;
  }
  /**
   * @method execute
   *
   * Retrieves all public booklists.
   *
   * @returns {Promise<IBooklist[]>} A promise that resolves to an array of public booklists.
   */
  async execute(): Promise<IBooklist[]> {
    return this.booklistRepo.getPublicBooklists();
  }
}
