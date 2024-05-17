// CreateBooklistInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IUser, IBooklist } from "@/domain/models";

interface BooklistInput {
  title: string;
  description?: string;
  visibility: string;
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
  async execute(userEmail: string, booklist: BooklistInput): Promise<IUser | null> {
    return this.booklistRepo.createBooklist(userEmail, booklist);
  }
}
