import { handler, UserModel, BookModel, BooklistModel, IUser } from "@gateways/models";

export class BaseInteractor {
  protected User: UserModel;
  protected Book: BookModel;
  protected Booklist: BooklistModel;

  protected constructor() {
    // javascript does not allow async constructors, so make sure to call a static async constructor called .create() that initializes the models when constructing from a subclass. See commented out example below.
    // static async create() {
    //   const interactor = new SubclassInteractor();
    //   await interactor.initializeModels();
    //   return interactor;
    // }
    // The reason behind this is to separate use cases into different interactors that have share functionality, like db calls. Further, it makes the code closer to testable, although there currently isn't a seem between the domain logic and the database. If we wanted to make it fully testable, we'd create a repository that is injected into the constructor of the subclasses instead of having it in the BaseInteractor. That way we could inject a test class when needed. Further, it would be easier to switch repositories in the long run if needed. 
  }

  protected async initializeModels() {
    const { User, Book, Booklist } = await handler();
    this.User = User;
    this.Book = Book;
    this.Booklist = Booklist;
  }

  protected async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await this.User.findById(userId);

      if (!user) {
        console.error("No user found with the provided userId:", userId);
        return null;
      }

      return this.convertToPlainObject(user) as IUser;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  protected async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await this.User.findOne({ email });

      if (!user) {
        console.error("No user found with the provided email:", email);
        return null;
      }

      return this.convertToPlainObject(user) as IUser;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  }

  protected async getUserByPublicProfileName(publicProfileName: string): Promise<IUser | null> {
    try {
      const user = await this.User.findOne({ publicProfileName });

      if (!user) {
        console.error("No user found with the provided public profile name:", publicProfileName);
        return null;
      }

      return this.convertToPlainObject(user) as IUser;
    } catch (error) {
      console.error("Error getting user by public profile name:", error);
      throw error;
    }
  }

  protected convertToPlainObject(document: any): object {
    return JSON.parse(JSON.stringify(document));
  }
}