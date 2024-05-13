import handler from "./models";

export async function getUserByEmail(email) {
  try {
    const { User } = await handler();
    const user = await User.findOne({ email }).populate("trackedBooks.bookId");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
}

export async function updateTrackedBooks(userId, updatedTrackedBooks) {
  try {
    const { User } = await handler();
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.trackedBooks = updatedTrackedBooks;
    await user.save();
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error updating tracked books:", error);
    throw error;
  }
}
