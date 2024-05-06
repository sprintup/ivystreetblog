import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        console.log("Profile Github: ", profile);
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
    //   profile(profile) {
    //     console.log("Profile Google: ", profile);
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
