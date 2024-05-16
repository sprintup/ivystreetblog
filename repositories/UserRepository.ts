// UserRepository.ts
import { IUser } from "@/domain/models";
import { BaseRepository } from "@/repositories/BaseRepository";

export class UserRepository extends BaseRepository {
  public async createUser(login: string, name: string, email: string): Promise<IUser> {
    const newUser = new this.User({
      login,
      name,
      email,
      publicProfileName: email.split("@")[0],
      bookListIds: [],
      trackedBooks: [],
    });

    await newUser.save();
    return newUser;
  }
}
