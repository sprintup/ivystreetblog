// import React from 'react';
// import { signIn, signOut, useSession } from 'next-auth/client';

// const Auth = () => {
//   const [session, loading] = useSession();

//   if (loading) return <p>Loading...</p>;

//   if (session) {
//     return (
//       <>
//         <p>Welcome, {session.user.name}!</p>
//         <button onClick={() => signOut()}>Sign out</button>
//       </>
//     );
//   }

//   return (
//     <button onClick={() => signIn()}>Sign in</button>
//   );
// };

// export default Auth;