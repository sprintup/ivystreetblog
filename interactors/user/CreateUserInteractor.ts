// CreateUserInteractor.ts

import { BaseInteractor } from "@interactors/BaseInteractor";
import { IUser, handler } from "@gateways/models";

export class CreateUserInteractor extends BaseInteractor {
  async findOrCreateUser(login: string, name: string, email: string): Promise<IUser> {
    try {
      const { User } = await handler();
      
      // Check if the user already exists based on the email
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        // console.log("User already exists:", existingUser);
        return this.convertToPlainObject(existingUser) as IUser;
      }
      
      const newUser = new User({
        login,
        name,
        email,
        publicProfileName: email.split("@")[0],
        bookListIds: [],
        trackedBooks: [],
      });
      
      await newUser.save();
      console.log("Created new user:", newUser);
      return this.convertToPlainObject(newUser) as IUser;
    } catch (error) {
      console.error("Error finding or creating user:", error);
      throw error;
    }
  }
}