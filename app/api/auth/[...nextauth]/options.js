import GitHubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        // console.log("Profile Github: ", profile);
        // assign special stuff to session
        let userRole = "Github User";
        if (profile?.email == process.env.MY_EMAIL) {
          userRole = "Admin";
        }
        return {
          ...profile, // everything that was in the profile before is still there
          role: userRole, // add a role with our userRole
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // GoogleProvider({
    // this works, but could lead to duplicate accounts if someone (like me) has different emails for github and google.
    //   profile(profile) {
    //     console.log("Profile Google: ", profile);
    //     let userRole = "Google User";
    //     // no special roles for google provider, but we do need an id field and they don't provide one so we make one
    //     return {
    //       ...profile,
    //       id: this.id.sub, // supposed to be the id that they've passed back
    //       role: userRole,
    //     };
    //   },
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // CredentialsProvider({ // this will let you log in with email and password, but not register. to
    // register you need a custom form like https://github.com/ClarityCoders/NextAuthTutorial-Video/blob/master/app/(components)/UserForm.jsx
    // but the problem is you need to verify the email, otherwise you'll get a lot of bots.
    // by just using github, we're circumventing this issue.
    //   name: "Credentials",
    //   credentials: {
    //     email: {
    //       label: "email:",
    //       type: "text",
    //       placeholder: "your-email",
    //     },
    //     password: {
    //       label: "password:",
    //       type: "password",
    //       placeholder: "your-password",
    //     },
    //   },
    //   async authorize(credentials) {
    //     try {
    //       const foundUser = await User.findOne({ email: credentials.email })
    //         .lean()
    //         .exec();

    //       if (foundUser) {
    //         console.log("User Exists");
    //         const match = await bcrypt.compare(
    //           credentials.password,
    //           foundUser.password
    //         );

    //         if (match) {
    //           console.log("Good Pass");
    //           delete foundUser.password;

    //           foundUser["role"] = "Unverified Email";
    //           return foundUser;
    //         }
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //     return null;
    //   },
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // callbacks are for making the role available to us in the application
      // we add our role to the token so we can utilize it in our program
      if (user) token.role = user.role; // allows us to utilize the role on the server side
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role; // allows us to utilize the role on client
      return session;
    },
  },
};
