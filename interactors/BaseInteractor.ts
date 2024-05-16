import { BooklistRepository } from "@/repositories/BooklistRepository";
import { UserRepository } from "@/repositories/UserRepository";

export class BaseInteractor {
  protected userRepo?: UserRepository;
  protected booklistRepo?: BooklistRepository;

  constructor({ userRepo, booklistRepo }: { userRepo?: UserRepository, booklistRepo?: BooklistRepository }) {
    this.userRepo = userRepo;
    this.booklistRepo = booklistRepo;
  }

  protected convertToPlainObject(document: any): object {
    return JSON.parse(JSON.stringify(document));
  }
}