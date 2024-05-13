import dbConnect from "@services/dbConnect";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
      ref: "Booklist",
    },
  ],
  trackedBooks: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
      status: {
        type: String,
        enum: ["to-read", "read"],
        default: "to-read",
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
      ref: "Booklist",
    },
  ],
});

const BooklistSchema = new mongoose.Schema({
  title: String,
  description: String,
  visibility: String,
  booklistOwnerId: String,
  bookIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

const BookSchema = new mongoose.Schema({
  name: String,
  Author: String,
  Description: String,
  Age: String,
  Series: String,
  Publication_Date: String,
  Publisher: String,
  ISBN: String,
  Link: String,
  Source: String,
  BookOwner: String,
});

export default async function handler() {
  await dbConnect();

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);
  const Booklist =
    mongoose.models.Booklist || mongoose.model("Booklist", BooklistSchema);

  return { User, Book, Booklist };
}
