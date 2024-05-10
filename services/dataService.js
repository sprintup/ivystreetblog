// services/dataService.js
import mongoose from "mongoose";
import dbConnect from "@services/dbConnect";

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
      bookId: Number,
      status: String,
      inWishlist: Boolean,
    },
  ],
});

const BooklistSchema = new mongoose.Schema({
  title: String,
  description: String,
  visibility: String,
  bookIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

const BookSchema = new mongoose.Schema({
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

export async function createUser(login, name, email) {
  try {
    const { User } = await handler();
    // Get the current date and time
    const currentDate = new Date();

    const newUser = new User({
      login,
      name,
      email,
      publicProfileName: email.split("@")[0],
      bookListIds: [],
      trackedBooks: [],
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    await newUser.save();
    console.log("Created new user:", newUser);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUserIdByEmail(email) {
  try {
    const { User } = await handler();
    const user = await User.findOne({ email });
    // console.log("User found:", user);
    if (!user) {
      console.error("No user found with the provided email:", email);
      return null;
    }
    // console.log("User found:", user);
    return user._id;
  } catch (error) {
    console.error("Error getting user ID by email:", error);
    throw error;
  }
}

export async function getUserByPublicProfileName(publicProfileName) {
  try {
    const { User } = await handler();
    const user = await User.findOne({ publicProfileName });
    if (!user) {
      console.error(
        "No user found with the provided public profile name:",
        publicProfileName
      );
      return null;
    }
    // console.log("User found:", user);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error getting user by public profile name:", error);
    throw error;
  }
}

export async function addUserBooklist(userId, booklist) {
  try {
    const { User, Booklist } = await handler();
    const user = await User.findById(userId);
    if (!user) {
      console.error("No user found with the provided userId:", userId);
      return null;
    }
    // Get the current date and time
    const currentDate = new Date();

    // Create a new booklist
    const newBooklist = new Booklist({
      title: booklist.title,
      description: booklist?.description,
      visibility: booklist.visibility,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    await newBooklist.save();

    // Add the new booklist to the user's collection
    user.bookListIds?.push(newBooklist._id);
    await user.save();

    console.log("Added booklist to user's collection:", user);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error adding booklist to user's collection:", error);
    throw error;
  }
}

export async function getBooklists(userEmail) {
  // console.log("Fetching booklists for user:", userEmail);
  try {
    const { User } = await handler();
    const user = await User.findOne({ email: userEmail }).populate(
      "bookListIds"
    );
    // console.log("Fetched booklists:", user.bookListIds);
    const booklistsWithOwner = user.bookListIds.map((booklist) => ({
      booklist,
      booklistOwner: userEmail,
    }));
    return JSON.parse(JSON.stringify(booklistsWithOwner));
  } catch (error) {
    console.error("Error fetching booklists:", error);
    throw error;
  }
}

export async function getBooklistById(booklistId) {
  try {
    const { Booklist } = await handler();
    const booklist = await Booklist.findById(booklistId);
    if (!booklist) {
      console.error(
        "No booklist found with the provided booklistId:",
        booklistId
      );
      return null;
    }
    // console.log("Booklist found:", booklist);
    return JSON.parse(JSON.stringify(booklist));
  } catch (error) {
    console.error("Error getting booklist by ID:", error);
    throw error;
  }
}

export async function updateBooklist(booklistId, updatedData) {
  try {
    const { Booklist } = await handler();
    const booklist = await Booklist.findByIdAndUpdate(
      booklistId,
      {
        $set: {
          title: updatedData.title,
          description: updatedData.description,
          visibility: updatedData.visibility,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    if (!booklist) {
      console.error(
        "No booklist found with the provided booklistId:",
        booklistId
      );
      return null;
    }
    console.log("Booklist updated:", booklist);
    return JSON.parse(JSON.stringify(booklist));
  } catch (error) {
    console.error("Error updating booklist:", error);
    throw error;
  }
}

export async function removeBooklist(booklistId) {
  try {
    const { Booklist, User } = await handler();

    // Find the booklist by ID and remove it
    const removedBooklist = await Booklist.findByIdAndDelete(booklistId);
    if (!removedBooklist) {
      console.error(
        "No booklist found with the provided booklistId:",
        booklistId
      );
      return null;
    }

    // Remove the booklist reference from the user's bookListIds array
    await User.updateMany(
      { bookListIds: booklistId },
      { $pull: { bookListIds: booklistId } }
    );

    console.log("Booklist removed:", removedBooklist);
    return JSON.parse(JSON.stringify(removedBooklist));
  } catch (error) {
    console.error("Error removing booklist:", error);
    throw error;
  }
}

export async function addBookToBooklist(booklistId, bookData) {
  try {
    const { Booklist, Book } = await handler();
    const booklist = await Booklist.findOne({ _id: booklistId });
    if (!booklist) {
      console.error(
        "No booklist found with the provided booklistId:",
        booklistId
      );
      return null;
    }

    // Create a new book document
    const newBook = new Book(bookData);
    await newBook.save();

    // Add the ObjectId of the new book to the bookIds array of the booklist
    booklist.bookIds.push(newBook._id);
    await booklist.save();

    console.log("Book added to booklist:", newBook);
    return JSON.parse(JSON.stringify(newBook));
  } catch (error) {
    console.error("Error adding book to booklist:", error);
    throw error;
  }
}

export async function getPublicBooklists() {
  try {
    const { Booklist } = await handler();
    const publicBooklists = await Booklist.find({ visibility: "public" });
    // console.log("Public booklists found:", publicBooklists);
    return JSON.parse(JSON.stringify(publicBooklists));
  } catch (error) {
    console.error("Error getting public booklists:", error);
    throw error;
  }
}

export async function getPublicBooklistsByUserId(userId) {
  try {
    const { User } = await handler();
    const user = await User.findById(userId).populate({
      path: "bookListIds",
      match: { visibility: "public" },
    });
    // console.log("Public booklists found:", user.bookListIds);
    return JSON.parse(JSON.stringify(user.bookListIds));
  } catch (error) {
    console.error("Error getting public booklists:", error);
    throw error;
  }
}

export async function getBookById(bookId) {
  try {
    // console.log("Fetching book by ID:", bookId);
    const { Book } = await handler();
    const book = await Book.findById(bookId);
    if (!book) {
      console.error("No book found with the provided bookId:", bookId);
      return null;
    }
    // console.log("Book found:", book);
    return JSON.parse(JSON.stringify(book));
  } catch (error) {
    console.error("Error getting book by ID:", error);
    throw error;
  }
}

export async function deleteBook(bookId, BooklistId) {
  // TODO: THIS ALSO NEEDS TO DELETE THE BOOK
  try {
    const { Booklist, Book } = await handler();
    const booklist = await Booklist.findById(BooklistId);
    if (!booklist) {
      console.error(
        "No booklist found with the provided BooklistId:",
        BooklistId
      );
      return null;
    }
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      console.error("No book found with the provided bookId:", bookId);
      return null;
    }

    // Remove the book reference from the booklist's bookIds array
    booklist.bookIds = booklist.bookIds.filter(
      (id) => id.toString() !== bookId
    );
    await booklist.save();

    console.log("Book deleted:", book);
    return JSON.parse(JSON.stringify(book));
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
}

export async function updateBookInBooklist(booklistId, bookId, updatedData) {
  try {
    const { Booklist, Book } = await handler();
    const booklist = await Booklist.findById(booklistId);
    if (!booklist) {
      console.error(
        "No booklist found with the provided booklistId:",
        booklistId
      );
      return null;
    }
    const book = await Book.findByIdAndUpdate(
      bookId,
      { $set: updatedData },
      { new: true }
    );
    if (!book) {
      console.error("No book found with the provided bookId:", bookId);
      return null;
    }
    // console.log("Book updated in booklist:", book);
    return JSON.parse(JSON.stringify(book));
  } catch (error) {
    console.error("Error updating book in booklist:", error);
    throw error;
  }
}

export async function getUserProfile(userEmail) {
  try {
    const { User } = await handler();
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.error("No user found with the provided email:", userEmail);
      return null;
    }
    // console.log("User profile found:", user);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(userEmail, updatedData) {
  try {
    const { User } = await handler();

    // Check if the public profile name is already taken by another user
    const existingUser = await User.findOne({
      publicProfileName: updatedData.publicProfileName,
    });
    if (existingUser && existingUser.email !== userEmail) {
      throw new Error("Public profile name is already taken.");
    }

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: updatedData },
      { new: true }
    );
    if (!user) {
      console.error("No user found with the provided email:", userEmail);
      return null;
    }
    console.log("User profile updated:", user);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
