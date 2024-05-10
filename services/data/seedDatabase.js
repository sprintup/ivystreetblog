// seedDatabase.js
const mongoose = require("mongoose");
const { handler } = require("./dataServiceSeed");
const booklistData = require("./data/booklistData.json");

async function seedDatabase() {
  try {
    const { Book, Booklist } = await handler();

    // Clear existing data
    await Book.deleteMany({});
    await Booklist.deleteMany({});

    // Extract books from booklistData
    const books = booklistData.flatMap((booklist) => booklist.books);

    // Insert books into the database
    const insertedBooks = await Book.insertMany(books);

    // Map the inserted books to their respective booklists
    const booklists = booklistData.map((booklist) => ({
      ...booklist,
      books: booklist.books.map((book) => {
        const insertedBook = insertedBooks.find(
          (insertedBook) => insertedBook.ID === book.id
        );
        return insertedBook._id;
      }),
    }));

    // Insert booklists into the database
    await Booklist.insertMany(booklists);

    console.log("Database seeded successfully");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.disconnect();
  }
}

seedDatabase();