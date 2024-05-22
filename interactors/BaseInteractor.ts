import { BooklistRepository } from "@/repositories/BooklistRepository";
import { BookRepository } from "@/repositories/BookRepository";
import { ProfileRepository } from "@/repositories/ProfileRepository";
import { UserRepository } from "@/repositories/UserRepository";

export class BaseInteractor {
  protected userRepo?: UserRepository;
  protected booklistRepo?: BooklistRepository;
  protected bookRepo?: BookRepository;
  protected profileRepo?: ProfileRepository;

  constructor({ userRepo, booklistRepo, bookRepo, profileRepo }: { userRepo?: UserRepository, booklistRepo?: BooklistRepository, bookRepo?: BookRepository, profileRepo?: ProfileRepository }) {
    this.userRepo = userRepo;
    this.booklistRepo = booklistRepo;
    this.bookRepo = bookRepo;
    this.profileRepo = profileRepo;
  }

  protected convertToPlainObject(document: any): object {
    return JSON.parse(JSON.stringify(document));
  }
}