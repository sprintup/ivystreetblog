import { BaseInteractor } from '@/interactors/BaseInteractor';
import {
  AcceptSharedAnonymousChildResult,
  AnonymousChildRepository,
} from '@/repositories/AnonymousChildRepository';

export class AcceptSharedAnonymousChildInteractor extends BaseInteractor {
  static async create() {
    const anonymousChildRepo = new AnonymousChildRepository();
    await anonymousChildRepo.initializeModels();

    return new AcceptSharedAnonymousChildInteractor({ anonymousChildRepo });
  }

  async execute(
    userEmail: string,
    shareToken: string
  ): Promise<AcceptSharedAnonymousChildResult> {
    return this.anonymousChildRepo.addAnonymousChildToUserByShareToken(
      userEmail,
      shareToken
    );
  }
}
