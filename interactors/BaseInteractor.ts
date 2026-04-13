import { BooklistRepository } from "@/repositories/BooklistRepository";
import { BookRepository } from "@/repositories/BookRepository";
import { AnonymousChildRepository } from '@/repositories/AnonymousChildRepository';
import { ProfileRepository } from "@/repositories/ProfileRepository";
import { UserRepository } from "@/repositories/UserRepository";

export class BaseInteractor {
  protected userRepo?: UserRepository;
  protected booklistRepo?: BooklistRepository;
  protected bookRepo?: BookRepository;
  protected profileRepo?: ProfileRepository;
  protected anonymousChildRepo?: AnonymousChildRepository;

  constructor({
    userRepo,
    booklistRepo,
    bookRepo,
    profileRepo,
    anonymousChildRepo,
  }: {
    userRepo?: UserRepository;
    booklistRepo?: BooklistRepository;
    bookRepo?: BookRepository;
    profileRepo?: ProfileRepository;
    anonymousChildRepo?: AnonymousChildRepository;
  }) {
    this.userRepo = userRepo;
    this.booklistRepo = booklistRepo;
    this.bookRepo = bookRepo;
    this.profileRepo = profileRepo;
    this.anonymousChildRepo = anonymousChildRepo;
  }

  protected convertToPlainObject(document: any): object {
    return JSON.parse(JSON.stringify(document));
  }
}
