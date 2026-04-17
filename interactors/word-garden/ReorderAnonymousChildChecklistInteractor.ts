import { BaseInteractor } from '@/interactors/BaseInteractor';
import { IAnonymousChild } from '@/domain/models';
import { AnonymousChildRepository } from '@/repositories/AnonymousChildRepository';

export class ReorderAnonymousChildChecklistInteractor extends BaseInteractor {
  static async create() {
    const anonymousChildRepo = new AnonymousChildRepository();
    await anonymousChildRepo.initializeModels();

    return new ReorderAnonymousChildChecklistInteractor({ anonymousChildRepo });
  }

  async execute(
    userEmail: string,
    acId: string,
    orderedWords: string[]
  ): Promise<IAnonymousChild | null> {
    return this.anonymousChildRepo.reorderStartedChecklistsForUser(
      userEmail,
      acId,
      orderedWords
    );
  }
}
