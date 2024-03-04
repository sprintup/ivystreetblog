// import NextAuth from 'next-auth';
// import Providers from 'next-auth/providers';

// export default NextAuth({
//   providers: [
//     Providers.Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     // Add other providers as needed
//   ],
//   database: process.env.DATABASE_URL,
//   session: {
//     jwt: true,
//   },
//   pages: {
//     signIn: '/auth/signin',
//     signOut: '/auth/signout',
//     error: '/auth/error', // Error code passed in query string as ?error=
//   },
//   callbacks: {
//     async session(session, user) {
//       session.user.id = user.id;
//       return session;
//     },
//   },
// });