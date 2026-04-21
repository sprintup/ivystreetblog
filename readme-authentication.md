# Authentication

This app uses NextAuth for sign-in and session handling. The active authentication setup lives in `app/api/auth/[...nextauth]/options.js`, and the route handler is exposed through `app/api/auth/[...nextauth]/route.js`.

## Stack

- Auth library: `next-auth`
- Active provider: GitHub
- Inactive/commented providers: Google and credentials
- Client session provider: `app/ClientProvider.jsx`
- Server session usage: `getServerSession(options)`

## Environment Variables

The expected auth- and data-related environment variables are shown in `example.env`:

- `MY_EMAIL`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `MONGODB_URI`

Only GitHub is actively wired in right now.

## Active Sign-In Provider

The only enabled provider is GitHub:

- `GitHubProvider(...)` is configured in `options.js`
- Google and credentials are commented out
- No custom adapter is configured

Inference from the current NextAuth config:
- because there is no database adapter configured in `options.js`, session persistence is effectively using NextAuth's default stateless JWT-based flow rather than a separate session collection in MongoDB

## Role Handling

The auth options add a simple role to the GitHub profile:

- default role: `Github User`
- admin role: `Admin` when `profile.email === process.env.MY_EMAIL`

That role is propagated like this:

1. `profile()` adds `role` to the provider profile
2. `jwt()` copies `user.role` into `token.role`
3. `session()` copies `token.role` into `session.user.role`

That means `session.user.role` is available on both the server and the client after sign-in.

## How Sessions Reach the App

### Server side

Server components and route handlers call:

```js
const session = await getServerSession(options);
```

Common examples:
- `app/layout.js`
- many `app/api/**/route.js` files
- `app/word-garden/wordGardenServer.js`

### Client side

The root layout wraps the app in:

```jsx
<SessionProvider>{children}</SessionProvider>
```

from `app/ClientProvider.jsx`.

Client components then use:

```js
const { data: session } = useSession();
```

Examples:
- `app/(components)/Nav.jsx`
- `app/page.jsx`
- several bookshelf/collection UI components

## User Bootstrap

Authentication and application user records are related, but not identical.

NextAuth gives the app an authenticated session. Separately, the app keeps its own `User` collection in MongoDB.

The bridge is `CreateUserInteractor.findOrCreateUser(...)`, which:

1. looks up a `User` by email
2. creates one if it does not exist yet

This bootstrap happens very explicitly in Word Garden:
- `requireWordGardenSession()` in `app/word-garden/wordGardenServer.js`
- `ensureUser(session)` in `app/api/word-garden/children/route.js`

As a result, Word Garden is careful to ensure the app-level `User` document exists before working with child profiles.

## Word Garden Authorization Model

Word Garden has the strongest authorization model in the app.

### Page-level protection

Server-side Word Garden pages use helpers from `app/word-garden/wordGardenServer.js`:

- `requireWordGardenSession(callbackPath)`
- `getAnonymousChildOrNotFound(acId, callbackPath)`

Behavior:

- no session: redirect to NextAuth sign-in with a callback URL
- signed in but no child access: redirect to `/`
- signed in and authorized: return the child/profile data

This protection is used across:
- sound table pages
- word cloud pages
- level 3 word pages
- started checklists page
- current-word route

### API-level protection

Word Garden API routes also require a session and then check actual access in `AnonymousChildRepository`.

Core repository gate:

- `getAnonymousChildAccessForUser(userEmail, acId)`

That method:

1. loads the signed-in user by email
2. loads the `AnonymousChild` by public `acId`
3. checks whether the child's Mongo `_id` appears in `user.acIds`

If that access check fails, the action returns `null`/`false`.

### Originator vs surrogate

Word Garden distinguishes:

- `originator`: the user who created the child profile
- `surrogate`: another signed-in user who has been granted access through a share token

Rules enforced in the repository:

- only the originator can delete an anonymous child
- only the originator can remove surrogate users
- surrogates can access and practice words, but they do not get originator-only controls
- the share token is only exposed to the originator in dashboard data

### Share flow

Share acceptance is page-driven rather than API-driven:

- route: `app/word-garden/share/[shareToken]/page.jsx`
- helper: `requireWordGardenSession(...)`
- action: `AcceptSharedAnonymousChildInteractor`

Flow:

1. user opens share URL
2. if not signed in, NextAuth redirects them through sign-in
3. after sign-in, the app looks up the child by `shareToken`
4. if found, the child's Mongo `_id` is added to the user's `acIds`
5. the user is redirected back to the dashboard with a status in the query string

## Current Auth/Authorization Shape by Area

### Stronger protection

These parts consistently derive identity from the current session:

- NextAuth sign-in/session handling
- Word Garden pages
- Word Garden API routes
- reading-list and review routes
- recommendation accept/reject/delete routes

### Older or weaker protection

Several older API routes still trust email or ownership information from the request body/query rather than fully deriving it from the session. Examples include:

- `app/api/collection/route.js`
- `app/api/user/profile/route.js`
- `app/api/booklist/route.js`
- `app/api/booklist/[id]/route.js`
- `app/api/booklist/[id]/book/route.js`
- `app/api/booklist/[id]/recommend/route.js`
- `app/api/book/toggleArchive/route.js`
- `app/api/book/route.js` `PUT` and `DELETE`

So the app currently has a mixed model:

- Word Garden is session-aware and access-checked
- several bookshelf/profile APIs are still "UI-internal" in style and would benefit from stricter ownership checks

## Recommended Mental Model

When working in this repo, it helps to think of auth in three layers:

1. NextAuth answers "who is signed in?"
2. The app's `User` collection answers "what app data belongs to this person?"
3. Feature-specific rules answer "what is this person allowed to do with this specific resource?"

Word Garden follows all three layers consistently.
Other legacy API areas often only do layers 1 and 2, or sometimes skip session enforcement entirely.

## Quick Reference

### Sign-in route

- `GET|POST /api/auth/[...nextauth]`

### Main server helpers

- `getServerSession(options)`
- `requireWordGardenSession(...)`
- `getAnonymousChildOrNotFound(...)`

### Session fields used by the app

Typical fields referenced by app code:

- `session.user.email`
- `session.user.name`
- `session.user.login`
- `session.user.role`

## Summary

Today, authentication is simple:

- users sign in with GitHub
- NextAuth provides the session
- the app maps that session to its own `User` record
- Word Garden adds strong resource-level authorization on top

If this app is hardened further, the clearest improvement would be to bring the older bookshelf/profile APIs up to the same ownership-check standard already used by Word Garden.
