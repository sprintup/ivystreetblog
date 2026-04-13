import { BaseInteractor } from '@/interactors/BaseInteractor';
import { AnonymousChildRepository } from '@/repositories/AnonymousChildRepository';

export class DeleteAnonymousChildInteractor extends BaseInteractor {
  static async create() {
    const anonymousChildRepo = new AnonymousChildRepository();
    await anonymousChildRepo.initializeModels();

    return new DeleteAnonymousChildInteractor({ anonymousChildRepo });
  }

  async execute(userEmail: string, acId: string): Promise<boolean> {
    return this.anonymousChildRepo.deleteAnonymousChildForUser(userEmail, acId);
  }
}
