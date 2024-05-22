async function migrateBooklists() {
    try {
      // Get all booklists
      const booklists = await this.Booklist.find();
  
      // For each booklist
      for (const booklist of booklists) {
        // Find the user with the email equal to the current booklistOwnerId
        const user = await this.User.findOne({ email: booklist.booklistOwnerId });
  
        // If the user exists, update the booklistOwnerId to the user's _id
        if (user) {
          booklist.booklistOwnerId = user._id;
          await booklist.save();
        } else {
          console.error("No user found with the provided email:", booklist.booklistOwnerId);
        }
      }
  
      console.log("Migration completed");
    } catch (error) {
      console.error("Error during migration:", error);
      throw error;
    }
  }
  