import { BaseInteractor } from '@/interactors/BaseInteractor';
import { AnonymousChildRepository } from '@/repositories/AnonymousChildRepository';

export class RemoveAnonymousChildSurrogateInteractor extends BaseInteractor {
  static async create() {
    const anonymousChildRepo = new AnonymousChildRepository();
    await anonymousChildRepo.initializeModels();

    return new RemoveAnonymousChildSurrogateInteractor({ anonymousChildRepo });
  }

  async execute(
    userEmail: string,
    acId: string,
    surrogateUserId: string
  ): Promise<boolean> {
    return this.anonymousChildRepo.removeSurrogateFromAnonymousChild(
      userEmail,
      acId,
      surrogateUserId
    );
  }
}
