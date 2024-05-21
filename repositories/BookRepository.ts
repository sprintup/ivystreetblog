// BookRepository.ts
import { IBookData } from '@/domain/interfaces';
import { BookModel, IBook } from '@/domain/models';
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
      this.Book.find({ BookOwner: user._id, IsArchived: false })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.Book.countDocuments({ BookOwner: user._id, IsArchived: false }),
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

  async deleteBookFromCollectionAndBooklistsAndTrackedBooks(
    bookId: string
  ): Promise<IBook | null> {
    try {
      const book = await this.Book.findByIdAndDelete(bookId);
      if (!book) {
        console.error('No book found with the provided bookId:', bookId);
        return null;
      }

      // Remove the book reference from all booklists
      await this.Booklist.updateMany(
        { bookIds: bookId },
        { $pull: { bookIds: bookId } }
      );

      // Remove the book reference from all users' trackedBooks
      await this.User.updateMany(
        { 'trackedBooks.bookId': bookId },
        { $pull: { trackedBooks: { bookId: bookId } } }
      );

      // console.log('Book deleted:', book);
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

  async getBooksByUserEmail(userEmail: string): Promise<IBookDocument[]> {
    try {
      // Find the user by email
      const user = await this.User.findOne({ email: userEmail });

      if (!user) {
        throw new Error('User not found');
      }

      // Find the books associated with the user
      const books = await this.Book.find({ BookOwner: user._id });

      return books;
    } catch (error) {
      console.error('Error retrieving books by user email:', error);
      throw error;
    }
  }

  async updateBook(bookId: string, updatedData: any): Promise<IBook | null> {
    try {
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
      console.error('Error updating book:', error);
      throw error;
    }
  }

  async removeBookFromBooklist(
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

      // Remove the book from the booklist
      booklist.bookIds = booklist.bookIds.filter(
        id => id.toString() !== bookId
      );
      await booklist.save();

      return booklist;
    } catch (error) {
      console.error('Error removing book from booklist:', error);
      throw error;
    }
  }

  async toggleBookArchiveInUserCollection(bookId: string): Promise<IBook> {
    console.log('trying to find bookId: ', bookId);
    try {
      const book: BookModel = await this.Book.findById(bookId);

      if (!book) {
        throw new Error('Book not found');
      }

      book.IsArchived = !book.IsArchived;
      await book.save();

      return book;
    } catch (error) {
      console.error('Error toggling book archive:', error);
      throw new Error('Failed to toggle book archive');
    }
  }
}
