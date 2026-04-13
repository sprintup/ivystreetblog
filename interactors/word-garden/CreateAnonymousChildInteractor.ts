import { BaseInteractor } from '@/interactors/BaseInteractor';
import { IAnonymousChild } from '@/domain/models';
import { AnonymousChildRepository } from '@/repositories/AnonymousChildRepository';

export class CreateAnonymousChildInteractor extends BaseInteractor {
  static async create() {
    const anonymousChildRepo = new AnonymousChildRepository();
    await anonymousChildRepo.initializeModels();

    return new CreateAnonymousChildInteractor({ anonymousChildRepo });
  }

  async execute(
    userEmail: string,
    displayName: string,
    birthYearMonth: string,
    waiverAcceptedAt: Date
  ): Promise<IAnonymousChild | null> {
    return this.anonymousChildRepo.createAnonymousChildForUser(userEmail, {
      displayName,
      birthYearMonth,
      waiverAcceptedAt,
    });
  }
}
