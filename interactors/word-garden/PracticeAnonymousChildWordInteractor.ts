import { BaseInteractor } from '@/interactors/BaseInteractor';
import { IAnonymousChild } from '@/domain/models';
import { AnonymousChildRepository } from '@/repositories/AnonymousChildRepository';

export class PracticeAnonymousChildWordInteractor extends BaseInteractor {
  static async create() {
    const anonymousChildRepo = new AnonymousChildRepository();
    await anonymousChildRepo.initializeModels();

    return new PracticeAnonymousChildWordInteractor({ anonymousChildRepo });
  }

  async execute(
    userEmail: string,
    acId: string,
    word: string,
    practiceIncrement = 1,
    checklistIncrement = 0
  ): Promise<IAnonymousChild | null> {
    return this.anonymousChildRepo.recordWordPracticeForUser(userEmail, acId, {
      word,
      practiceIncrement,
      checklistIncrement,
    });
  }
}
