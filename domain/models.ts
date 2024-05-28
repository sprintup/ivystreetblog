import dbConnect from '@/repositories/dbConnect';
import mongoose, { Document, Model, Types } from 'mongoose';

export interface IUser extends Document {
  login: string;
  name: string;
  email: string;
  publicProfileName: string;
  bookListIds: mongoose.Types.ObjectId[];
  trackedBooks: ITrackedBook[];
  favoriteBooklistIds: mongoose.Types.ObjectId[];
}

export interface ITrackedBook {
  bookId: mongoose.Types.ObjectId;
  status: 'to-read' | 'finished';
  isFavorite: boolean;
  review: string;
  ratingPerceivedDifficulty: number | null;
  isWishlistItem: boolean;
  bookPriority: number;
}

export interface IBooklist extends Document {
  title: string;
  description: string;
  visibility: string;
  booklistOwnerId: mongoose.Types.ObjectId;
  bookIds: mongoose.Types.ObjectId[];
  openToRecommendations: boolean;
  bookRecommendations: IBookRecommendation[];
}

export interface IBookRecommendation {
  bookId: mongoose.Types.ObjectId;
  recommendedBy: mongoose.Types.ObjectId;
  status: 'accepted' | 'rejected' | 'offered';
  recommendationReason: string;
}

export interface IBook extends Document {
  Name: string;
  Author: string;
  Description: string;
  Age: string;
  Series: string;
  Publication_Date: string;
  Publisher: string;
  ISBN: string;
  Link: string;
  Source: string;
  BookOwner: Types.ObjectId;
  IsArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserModel = Model<IUser>;
export type BooklistModel = Model<IBooklist>;
export type BookModel = Model<IBook>;

const UserSchema = new mongoose.Schema(
  {
    login: String,
    name: String,
    email: String,
    publicProfileName: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    bookListIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booklist',
      },
    ],
    trackedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
        status: {
          type: String,
          enum: ['to-read', 'finished'],
          default: 'to-read',
        },
        isFavorite: {
          type: Boolean,
          default: false,
        },
        review: String,
        ratingPerceivedDifficulty: {
          type: Number,
          min: 1,
          max: 10,
          default: null,
        },
        isWishlistItem: {
          type: Boolean,
          default: false,
        },
        bookPriority: Number,
      },
    ],
    favoriteBooklistIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booklist',
      },
    ],
  },
  { timestamps: true }
);

const BooklistSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    visibility: String,
    booklistOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    bookIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    openToRecommendations: {
      type: Boolean,
      default: false,
    },
    bookRecommendations: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
        recommendedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['accepted', 'rejected', 'offered'],
          default: 'offered',
        },
        recommendationReason: String,
      },
    ],
  },
  { timestamps: true }
);

const BookSchema = new mongoose.Schema(
  {
    Name: String,
    Author: String,
    Description: String,
    Age: String,
    Series: String,
    Publication_Date: String,
    Publisher: String,
    ISBN: String,
    Link: String,
    Source: String,
    BookOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    IsArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export async function handler(): Promise<{
  User: UserModel;
  Book: BookModel;
  Booklist: BooklistModel;
}> {
  await dbConnect();

  const User =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
  const Book =
    mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
  const Booklist =
    mongoose.models.Booklist ||
    mongoose.model<IBooklist>('Booklist', BooklistSchema);

  return { User, Book, Booklist };
}
