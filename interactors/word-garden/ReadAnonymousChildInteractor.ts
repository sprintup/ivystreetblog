import { BaseInteractor } from '@/interactors/BaseInteractor';
import { IAnonymousChild } from '@/domain/models';
import { AnonymousChildRepository } from '@/repositories/AnonymousChildRepository';

export class ReadAnonymousChildInteractor extends BaseInteractor {
  static async create() {
    const anonymousChildRepo = new AnonymousChildRepository();
    await anonymousChildRepo.initializeModels();

    return new ReadAnonymousChildInteractor({ anonymousChildRepo });
  }

  async execute(userEmail: string, acId: string): Promise<IAnonymousChild | null> {
    return this.anonymousChildRepo.getAnonymousChildForUser(userEmail, acId);
  }
}
