// BookRepository.ts
import { IBookData } from '@/domain/interfaces';
import { IBook } from '@/domain/models';
import { BaseRepository } from '@/repositories/BaseRepository';

export class BookRepository extends BaseRepository {
  async createNewBook(userEmail: string, bookData: IBookData): Promise<IBook> {
    const user = await this.User.findOne({ email: userEmail });
    if (!user) {
      throw new Error(`User with email ${userEmail} not found`);
    }

    const newBook = new this.Book({
      Name: bookData.Name,
      Author: bookData.Author,
      BookOwner: user._id, // Use the user's _id from the database
      // Add other book properties from bookData
    });

    await newBook.save();

    return newBook;
  }

  async getBooksOwnedByUser(userId) {
    const books = await this.Book.find({ BookOwner: userId });
    return books;
  }

  async getUserBooksPaginated(
    userEmail: string,
    page: number,
    limit: number
  ): Promise<{ books: IBook[]; totalBooks: number }> {
    const user = await this.User.findOne({ email: userEmail });
    if (!user) {
      throw new Error(`User with email ${userEmail} not found`);
    }

    const skip = (page - 1) * limit;
    const [books, totalBooks] = await Promise.all([
      this.Book.find({ BookOwner: user._id })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.Book.countDocuments({ BookOwner: user._id }),
    ]);

    return { books, totalBooks };
  }

  async addBookToBooklist(
    booklistId: string,
    bookId: string
  ): Promise<IBooklist | null> {
    try {
      // Find the booklist
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        console.error(
          'No booklist found with the provided booklistId:',
          booklistId
        );
        return null;
      }

      // Find the book
      const book = await this.Book.findById(bookId);
      if (!book) {
        console.error('No book found with the provided bookId:', bookId);
        return null;
      }

      // Check if the book is already in the booklist
      if (booklist.bookIds.includes(bookId)) {
        console.warn(`Book with ID ${bookId} is already in the booklist`);
        return booklist;
      }

      // Add the book to the booklist
      booklist.bookIds.push(bookId);
      await booklist.save();

      return booklist;
    } catch (error) {
      console.error('Error adding book to booklist:', error);
      throw error;
    }
  }

  async deleteBookFromBooklist(
    booklistId: string,
    bookId: string
  ): Promise<IBook | null> {
    try {
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        console.error(
          'No booklist found with the provided booklistId:',
          booklistId
        );
        return null;
      }

      const book = await this.Book.findByIdAndDelete(bookId);
      if (!book) {
        console.error('No book found with the provided bookId:', bookId);
        return null;
      }

      // Remove the book reference from the booklist's bookIds array
      booklist.bookIds = booklist.bookIds.filter(
        id => id.toString() !== bookId
      );
      await booklist.save();

      console.log('Book deleted:', book);
      return book;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }

  async getBooksByIds(bookIds: string[]): Promise<IBook[]> {
    try {
      const books = await this.Book.find({ _id: { $in: bookIds } });
      return books;
    } catch (error) {
      console.error('Error getting books by IDs:', error);
      throw error;
    }
  }

  async updateBookInBooklist(
    booklistId: string,
    bookId: string,
    updatedData: any
  ): Promise<IBook | null> {
    try {
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        console.error(
          'No booklist found with the provided booklistId:',
          booklistId
        );
        return null;
      }

      const book = await this.Book.findByIdAndUpdate(
        bookId,
        { $set: updatedData },
        { new: true }
      );
      if (!book) {
        console.error('No book found with the provided bookId:', bookId);
        return null;
      }

      return book;
    } catch (error) {
      console.error('Error updating book in booklist:', error);
      throw error;
    }
  }
}
