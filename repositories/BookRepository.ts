// BookRepository.ts
import { IBook } from "@/domain/models";
import { BaseRepository } from "@/repositories/BaseRepository";

export class BookRepository extends BaseRepository {
  async addNewBookToBooklist(booklistId: string, bookData: any): Promise<IBook | null> {
    try {
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        console.error("No booklist found with the provided booklistId:", booklistId);
        return null;
      }
  
      // Create a new book document
      const newBook = new this.Book(bookData);
      await newBook.save();
  
      // Add the ObjectId of the new book to the bookIds array of the booklist
      booklist.bookIds.push(newBook._id);
      await booklist.save();
  
      console.log("Book added to booklist:", newBook);
      return newBook;
    } catch (error) {
      console.error("Error adding book to booklist:", error);
      throw error;
    }
  }
  
  async deleteBookFromBooklist(booklistId: string, bookId: string): Promise<IBook | null> {
    try {
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        console.error("No booklist found with the provided booklistId:", booklistId);
        return null;
      }
  
      const book = await this.Book.findByIdAndDelete(bookId);
      if (!book) {
        console.error("No book found with the provided bookId:", bookId);
        return null;
      }
  
      // Remove the book reference from the booklist's bookIds array
      booklist.bookIds = booklist.bookIds.filter((id) => id.toString() !== bookId);
      await booklist.save();
  
      console.log("Book deleted:", book);
      return book;
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  }

  async getBooksByIds(bookIds: string[]): Promise<IBook[]> {
    try {
      const books = await this.Book.find({ _id: { $in: bookIds } });
      return books;
    } catch (error) {
      console.error("Error getting books by IDs:", error);
      throw error;
    }
  }
  
  async updateBookInBooklist(booklistId: string, bookId: string, updatedData: any): Promise<IBook | null> {
    try {
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        console.error("No booklist found with the provided booklistId:", booklistId);
        return null;
      }
  
      const book = await this.Book.findByIdAndUpdate(
        bookId,
        { $set: updatedData },
        { new: true }
      );
      if (!book) {
        console.error("No book found with the provided bookId:", bookId);
        return null;
      }
  
      return book;
    } catch (error) {
      console.error("Error updating book in booklist:", error);
      throw error;
    }
  }
  
}

