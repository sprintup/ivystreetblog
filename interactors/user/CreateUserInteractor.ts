// CreateUserInteractor.ts

import { BaseInteractor } from "@interactors/BaseInteractor";
import { IUser } from "@/domain/models";
import { UserRepository } from "@/repositories/UserRepository";

export class CreateUserInteractor extends BaseInteractor {
  static async create() {
    const userRepo = new UserRepository();
    await userRepo.initializeModels();
    const interactor = new CreateUserInteractor({userRepo});
    return interactor;
  }
  
  async findOrCreateUser(login: string, name: string, email: string): Promise<IUser> {
    try {
      // Check if the user already exists based on the email
      const existingUser = await this.userRepo.findUser(email);
      if (existingUser) {
        return this.convertToPlainObject(existingUser) as IUser;
      }

      const newUser = await this.userRepo.createUser(login, name, email);

      return this.convertToPlainObject(newUser) as IUser;
    } catch (error) {
      console.error("Error finding or creating user:", error);
      throw error;
    }
  }
}