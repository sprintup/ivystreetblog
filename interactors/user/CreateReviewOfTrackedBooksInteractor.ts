// interactors/user/CreateReviewOfTrackedBooksInteractor.ts

import { BaseInteractor } from '../BaseInteractor';
import { UserRepository } from '@/repositories/UserRepository';

/**
 * @class CreateReviewOfTrackedBooksInteractor
 *
 * As a user,
 * When I add a review to a tracked book,
 * The tracked book is updated with the review.
 */
export class CreateReviewOfTrackedBooksInteractor extends BaseInteractor {
  static async create() {
    const userRepo = new UserRepository();
    await userRepo.initializeModels();
    const interactor = new CreateReviewOfTrackedBooksInteractor({ userRepo });
    return interactor;
  }

  /**
   * @method execute
   *
   * Updates the review and perceived difficulty rating of a tracked book for a user.
   *
   * @param {string} userEmail - The email of the user.
   * @param {string} bookId - The ID of the book to update the review for.
   * @param {string} review - The review text.
   * @param {number} ratingPerceivedDifficulty - The perceived difficulty rating.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async execute(
    userEmail: string,
    bookId: string,
    review: string,
    ratingPerceivedDifficulty: number
  ): Promise<void> {
    await this.userRepo.updateTrackedBookReview(
      userEmail,
      bookId,
      review,
      ratingPerceivedDifficulty
    );
  }
}
