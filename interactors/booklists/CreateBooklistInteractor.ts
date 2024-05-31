// CreateBooklistInteractor.ts

import { BooklistRepository } from '@/repositories/BooklistRepository';
import { BaseInteractor } from '../BaseInteractor';
import { IUser, IBooklist } from '@/domain/models';

interface BooklistInput {
  title: string;
  description?: string;
  visibility: string;
  openToRecommendations: boolean;
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
  static async create() {
    const booklistRepo = new BooklistRepository();
    await booklistRepo.initializeModels();
    const interactor = new CreateBooklistInteractor({ booklistRepo });
    return interactor;
  }

  async execute(
    userEmail: string,
    booklist: BooklistInput
  ): Promise<IUser | null> {
    const result = await this.booklistRepo.createBooklist(userEmail, booklist);
    return this.convertToPlainObject(result) as IUser | null;
  }
}
