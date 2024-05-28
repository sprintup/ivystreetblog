// BooklistRepository.ts
import { IBooklist, IBookRecommendation, IUser } from '@/domain/models';
import { BaseRepository } from '@/repositories/BaseRepository';
import mongoose from 'mongoose';
import { RecommendBookData } from '@/domain/interfaces';

export class BooklistRepository extends BaseRepository {
  async getBooklistsByUserEmail(userEmail: string): Promise<IBooklist[]> {
    try {
      const user = await this.User.findOne({ email: userEmail }).populate<{
        bookListIds: IBooklist[];
      }>({
        path: 'bookListIds',
        model: this.Booklist.modelName,
      });
      if (!user) {
        console.error('No user found with the provided userEmail:', userEmail);
        return [];
      }

      const booklists: IBooklist[] = user.bookListIds;
      return booklists;
    } catch (error) {
      console.error('Error fetching booklists:', error);
      throw error;
    }
  }

  async createBooklist(
    userEmail: string,
    booklist: {
      title: string;
      description?: string;
      visibility: string;
      openToRecommendations: boolean;
    }
  ): Promise<IUser | null> {
    try {
      // Find the user by their email
      const user = await this.User.findOne({ email: userEmail });
      if (!user) {
        console.error('No user found with the provided email:', userEmail);
        return null;
      }
      console.log('open for recommendations: ', booklist.openToRecommendations);
      // Create a new booklist with the provided details and the user's id
      const newBooklist = new this.Booklist({
        title: booklist.title,
        description: booklist.description,
        visibility: booklist.visibility,
        booklistOwnerId: user._id,
        openToRecommendations: booklist.openToRecommendations,
      });
      await newBooklist.save();

      // If the user has a bookListIds field, add the new booklist's id to it
      if (user.bookListIds) {
        user.bookListIds.push(newBooklist._id);
      } else {
        // If the user doesn't have a bookListIds field, create it and add the new booklist's id
        user.bookListIds = [newBooklist._id];
      }
      await user.save();

      return user;
    } catch (error) {
      console.error('Error creating booklist:', error);
      throw error;
    }
  }

  async removeBooklist(booklistId: string): Promise<IBooklist | null> {
    try {
      // Find the booklist by ID and remove it
      const removedBooklist = await this.Booklist.findByIdAndDelete(booklistId);
      if (!removedBooklist) {
        console.error(
          'No booklist found with the provided booklistId:',
          booklistId
        );
        return null;
      }

      // Remove the booklist reference from the user's bookListIds array
      await this.User.updateMany(
        { bookListIds: booklistId },
        { $pull: { bookListIds: booklistId } }
      );

      console.log('Booklist removed:', removedBooklist);
      return removedBooklist;
    } catch (error) {
      console.error('Error removing booklist:', error);
      throw error;
    }
  }

  async getPublicBooklistByIdWithUserAndUserBooklistsAndBooks(
    booklistId: string
  ): Promise<IBooklist | null> {
    try {
      const booklist = await this.Booklist.findOne({
        _id: booklistId,
        visibility: 'public',
      })
        .populate({
          path: 'booklistOwnerId',
          model: 'User',
          populate: {
            path: 'bookListIds',
            model: 'Booklist',
          },
        })
        .populate('bookIds');

      if (!booklist) {
        console.error(
          'No public booklist found with the provided booklistId:',
          booklistId
        );
        return null;
      }
      return booklist;
    } catch (error) {
      console.error('Error getting booklist by ID:', error);
      throw error;
    }
  }

  async getBooklistByIdWithBooks(
    booklistId: string
  ): Promise<IBooklist | null> {
    try {
      const booklist = await this.Booklist.findById(booklistId).populate({
        path: 'bookIds',
        model: 'Book',
        select:
          'Name Author Description Age Series Publication_Date Publisher ISBN Link Source',
      });

      if (!booklist) {
        console.error(
          'No booklist found with the provided booklistId:',
          booklistId
        );
        return null;
      }

      return booklist;
    } catch (error) {
      console.error('Error getting booklist by ID:', error);
      throw error;
    }
  }

  async getPublicBooklists(): Promise<IBooklist[]> {
    try {
      const publicBooklists = await this.Booklist.find({
        visibility: 'public',
      }).populate('booklistOwnerId');
      return publicBooklists;
    } catch (error) {
      console.error('Error getting public booklists:', error);
      throw error;
    }
  }

  async updateBooklist(
    booklistId: string,
    updatedData: {
      title?: string;
      description?: string;
      visibility?: string;
      openToRecommendations?: boolean;
    }
  ): Promise<IBooklist | null> {
    try {
      const booklist = await this.Booklist.findByIdAndUpdate(
        booklistId,
        {
          $set: {
            title: updatedData.title,
            description: updatedData.description,
            visibility: updatedData.visibility,
            openToRecommendations: updatedData.openToRecommendations,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );
      if (!booklist) {
        console.error(
          'No booklist found with the provided booklistId:',
          booklistId
        );
        return null;
      }
      return booklist;
    } catch (error) {
      console.error('Error updating booklist:', error);
      throw error;
    }
  }

  async addBookToBooklist(booklistId: string, bookId: string): Promise<void> {
    try {
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        throw new Error('Booklist not found');
      }
      const bookObjectId = new mongoose.Types.ObjectId(bookId);
      if (!booklist.bookIds.includes(bookObjectId)) {
        booklist.bookIds.push(bookObjectId);
        await booklist.save();
      }
    } catch (error) {
      console.error('Error adding book to the booklist:', error);
      throw error;
    }
  }

  async getBooklistsByUserId(userId: string): Promise<IBooklist[]> {
    try {
      const booklists = await this.Booklist.find({ booklistOwnerId: userId });
      return booklists;
    } catch (error) {
      console.error('Error getting booklists by user ID:', error);
      throw error;
    }
  }

  async recommendBookToBooklist(
    booklistId: string,
    recommendationData: RecommendBookData
  ): Promise<IBooklist | null> {
    const { bookId, recommendedBy, recommendationReason } = recommendationData;
    const recommendedByUser = await this.findUser(recommendedBy);
    if (!recommendedByUser) {
      throw new Error('User not found');
    }
    try {
      const booklist = await this.Booklist.findById(booklistId);
      if (!booklist) {
        console.error('No booklist found with the provided ID:', booklistId);
        return null;
      }

      const recommendedBook = await this.Book.findById(bookId);
      if (!recommendedBook) {
        console.error(
          'No recommended book found with the provided ID:',
          bookId
        );
        return null;
      }

      const recommendation: IBookRecommendation = {
        bookId: recommendedBook._id,
        recommendedBy: recommendedByUser._id,
        status: 'offered',
        recommendationReason,
      };

      booklist.bookRecommendations.push(recommendation);
      await booklist.save();

      return booklist;
    } catch (error) {
      console.error('Error recommending book to booklist:', error);
      throw error;
    }
  }

  async getBooklistRecommendations(
    booklistId: string
  ): Promise<{
    booklist: IBooklist | null;
    recommendations: IBookRecommendation[];
  }> {
    try {
      const booklist = await this.Booklist.findById(booklistId)
        .populate({
          path: 'bookRecommendations.bookId',
          model: 'Book',
        })
        .populate({
          path: 'bookRecommendations.recommendedBy',
          model: 'User',
          select: 'publicProfileName',
        });

      if (!booklist) {
        console.error('No booklist found with the provided ID:', booklistId);
        return { booklist: null, recommendations: [] };
      }

      return { booklist, recommendations: booklist.bookRecommendations };
    } catch (error) {
      console.error('Error getting booklist recommendations:', error);
      throw error;
    }
  }

  async updateRecommendationStatus(
    recommendationId: string,
    status: 'accepted' | 'rejected'
  ): Promise<IBooklist | null> {
    try {
      const updatedBooklist = await this.Booklist.findOneAndUpdate(
        { 'bookRecommendations._id': recommendationId },
        { $set: { 'bookRecommendations.$.status': status } },
        { new: true }
      )
        .populate('bookRecommendations.bookId')
        .populate('bookRecommendations.recommendedBy', 'publicProfileName');

      if (!updatedBooklist) {
        console.error(
          'No booklist found with the provided recommendation ID:',
          recommendationId
        );
        return null;
      }

      return updatedBooklist;
    } catch (error) {
      console.error('Error updating recommendation status:', error);
      throw error;
    }
  }

  async acceptRecommendation(
    recommendationId: string
  ): Promise<IBooklist | null> {
    try {
      const booklist = await this.Booklist.findOne({
        'bookRecommendations._id': recommendationId,
      })
        .populate('bookRecommendations.bookId')
        .populate('bookRecommendations.recommendedBy', 'publicProfileName');

      if (!booklist) {
        console.error(
          'No booklist found with the provided recommendation ID:',
          recommendationId
        );
        return null;
      }

      const recommendation = booklist.bookRecommendations.find(
        rec => rec._id.toString() === recommendationId
      );

      if (!recommendation) {
        console.error(
          'Recommendation not found in the booklist:',
          recommendationId
        );
        return null;
      }

      const { bookId, recommendedBy } = recommendation;

      // Clone the recommended book and create a new book object
      const clonedBook: IBook = {
        ...bookId.toObject(),
        _id: undefined,
        BookOwner: booklist.booklistOwnerId,
        Source: `Recommended by ${recommendedBy.publicProfileName}`,
      };

      // Save the cloned book to the database
      const newBook = new this.Book(clonedBook);
      const savedBook = await newBook.save();

      // Add the cloned book to the booklist
      booklist.bookIds.push(savedBook._id);

      // Update the recommendation status to 'accepted'
      recommendation.status = 'accepted';

      await booklist.save();

      return booklist;
    } catch (error) {
      console.error('Error accepting recommendation:', error);
      throw error;
    }
  }
}
