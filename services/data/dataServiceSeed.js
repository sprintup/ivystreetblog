// services/dataService.js
const mongoose = require("mongoose");

const MONGODB_URI = "";
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    }).catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Error in database connection:", e);
    throw e;
  }

  return cached.conn;
}

const UserSchema = new mongoose.Schema({
  id: Number,
  username: String,
  name: String,
  email: String,
  password: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiration: Number,
  isMinor: Boolean,
  parentGuardianInfo: {
    name: String,
    email: String,
    phone: String,
  },
  trackedBooks: [
    {
      bookId: Number,
      status: String,
      inWishlist: Boolean,
    },
  ],
});

const BookSchema = new mongoose.Schema({
  ID: Number,
  Name: String,
  Series: String,
  Description: String,
  Author: String,
  Age: String,
  Publication_Date: String,
  Product_Details: String,
  Publisher: String,
  ISBN: String,
  Link: String,
  Source: String,
});

const BooklistSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  bookIds: [Number],
  visibility: String,
});

async function handler() {
  await dbConnect();

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);
  const Booklist = mongoose.models.Booklist || mongoose.model("Booklist", BooklistSchema);

  return { User, Book, Booklist };
}

async function getBooklists(userEmail) {
  try {
    const { Booklist } = await handler();
    const booklists = await Booklist.find({ userEmail });
    return JSON.parse(JSON.stringify(booklists));
  } catch (error) {
    console.error("Error fetching booklists:", error);
    throw error;
  }
}

module.exports = { dbConnect, handler, getBooklists };