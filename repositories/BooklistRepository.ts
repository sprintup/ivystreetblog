// BooklistRepository.ts
import { IBooklist } from "@/domain/models";
import { BaseRepository } from "@/repositories/BaseRepository";

export class BooklistRepository extends BaseRepository {
  async getBooklistsByUserEmail(userEmail: string): Promise<IBooklist[]> {
    try {
      const user = await this.User.findOne({ email: userEmail }).populate<{ bookListIds: IBooklist[] }>({
        path: 'bookListIds',
        model: this.Booklist.modelName,
      });
      if (!user) {
        console.error("No user found with the provided userEmail:", userEmail);
        return [];
      }

      const booklists: IBooklist[] = user.bookListIds;
      return booklists;
    } catch (error) {
      console.error("Error fetching booklists:", error);
      throw error;
    }
  }
}
