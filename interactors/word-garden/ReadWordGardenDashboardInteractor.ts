import { BaseInteractor } from '@/interactors/BaseInteractor';
import { IAnonymousChild } from '@/domain/models';
import { AnonymousChildRepository } from '@/repositories/AnonymousChildRepository';

export class ReadWordGardenDashboardInteractor extends BaseInteractor {
  static async create() {
    const anonymousChildRepo = new AnonymousChildRepository();
    await anonymousChildRepo.initializeModels();

    return new ReadWordGardenDashboardInteractor({ anonymousChildRepo });
  }

  async execute(userEmail: string): Promise<IAnonymousChild[] | null> {
    return this.anonymousChildRepo.getAnonymousChildrenForUser(userEmail);
  }
}
