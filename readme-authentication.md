# Authentication

This app uses NextAuth for sign-in and session handling. The active authentication setup lives in [app/api/auth/[...nextauth]/options.js](app/api/auth/[...nextauth]/options.js), and the route handler is exposed through [app/api/auth/[...nextauth]/route.js](app/api/auth/[...nextauth]/route.js).

## Stack

- Auth library: `next-auth`
- Active provider: GitHub
- Inactive/commented providers: Google and credentials
- Client session provider: [app/ClientProvider.jsx](app/ClientProvider.jsx)
- Shared API session helper: [utils/authSession.js](utils/authSession.js)
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
- no custom adapter is configured

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

## How Sessions Reach The App

### Server side

Server components and route handlers call:

```js
const session = await getServerSession(options);
```

Common examples:

- [app/layout.js](app/layout.js)
- many `app/api/**/route.js` files
- [app/word-garden/wordGardenServer.js](app/word-garden/wordGardenServer.js)

For API routes that need a consistent unauthorized response, the repo now also has:

```js
const { userEmail, unauthorizedResponse } = await requireSessionUser();
```

from [utils/authSession.js](utils/authSession.js).

### Client side

The root layout wraps the app in:

```jsx
<SessionProvider>{children}</SessionProvider>
```

from [app/ClientProvider.jsx](app/ClientProvider.jsx).

Client components then use:

```js
const { data: session } = useSession();
```

Examples:

- [app/(components)/Nav.jsx](app/(components)/Nav.jsx)
- [app/page.jsx](app/page.jsx)
- several bookshelf/collection UI components

## User Bootstrap

Authentication and application user records are related, but not identical.

NextAuth gives the app an authenticated session. Separately, the app keeps its own `User` collection in MongoDB.

The bridge is `CreateUserInteractor.findOrCreateUser(...)`, which:

1. looks up a `User` by email
2. creates one if it does not exist yet

This bootstrap happens very explicitly in Word Garden:

- `requireWordGardenSession()` in [app/word-garden/wordGardenServer.js](app/word-garden/wordGardenServer.js)
- `ensureUser(session)` in [app/api/word-garden/children/route.js](app/api/word-garden/children/route.js)

As a result, Word Garden is careful to ensure the app-level `User` document exists before working with child profiles.

## Word Garden Authorization Model

Word Garden still has the strongest authorization model in the app.

### Page-level protection

Server-side Word Garden pages use helpers from [app/word-garden/wordGardenServer.js](app/word-garden/wordGardenServer.js):

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

- route: [app/word-garden/share/[shareToken]/page.jsx](app/word-garden/share/[shareToken]/page.jsx)
- helper: `requireWordGardenSession(...)`
- action: `AcceptSharedAnonymousChildInteractor`

Flow:

1. user opens share URL
2. if not signed in, NextAuth redirects them through sign-in
3. after sign-in, the app looks up the child by `shareToken`
4. if found, the child's Mongo `_id` is added to the user's `acIds`
5. the user is redirected back to the dashboard with a status in the query string

## Bookshelf And Profile Hardening

The biggest auth change in this pass was bringing the older bookshelf/profile APIs closer to the same pattern Word Garden already used:

- require a real NextAuth session
- derive the acting email from the session, not from the request body or query string
- enforce ownership in the repository layer, not just the UI

### Shared API helper

The common entry point is now [utils/authSession.js](utils/authSession.js):

- `requireSessionUser()`
- `jsonErrorResponse()`

That helper is now used by the session-protected bookshelf/profile routes so they do not have to trust caller-supplied identity.

### Routes that were hardened

These routes now derive identity from the current session instead of trusting request payloads:

- [app/api/collection/route.js](app/api/collection/route.js)
- [app/api/user/profile/route.js](app/api/user/profile/route.js)
- [app/api/user/booklists-dropdown/route.js](app/api/user/booklists-dropdown/route.js)
- [app/api/booklist/route.js](app/api/booklist/route.js)
- [app/api/booklist/[id]/edit/route.js](app/api/booklist/[id]/edit/route.js)
- [app/api/booklist/[id]/route.js](app/api/booklist/[id]/route.js) for `PUT` and `DELETE`
- [app/api/booklist/[id]/book/route.js](app/api/booklist/[id]/book/route.js)
- [app/api/booklist/[id]/recommend/route.js](app/api/booklist/[id]/recommend/route.js)
- [app/api/book/[id]/route.js](app/api/book/[id]/route.js)
- [app/api/book/route.js](app/api/book/route.js)
- [app/api/book/toggleArchive/route.js](app/api/book/toggleArchive/route.js)

### Repository-level ownership checks

The main ownership enforcement now lives in:

- [repositories/BookRepository.ts](repositories/BookRepository.ts)
- [repositories/BooklistRepository.ts](repositories/BooklistRepository.ts)

Notable additions:

- owned book fetch/update/delete methods
- owned booklist fetch/update/delete methods
- owned add/remove book-to-booklist methods
- recommendation flow now derives `recommendedBy` from the signed-in session and also verifies that the recommended book belongs to that signed-in user

That means the UI can no longer simply claim:

- "I am this email"
- "I own this book"
- "I own this booklist"

and have the API trust it.

## Current Auth/Authorization Shape By Area

### Stronger protection

These areas now consistently derive identity from the current session:

- NextAuth sign-in/session handling
- Word Garden pages
- Word Garden API routes
- reading-list routes
- review routes
- bookshelf/profile write routes
- private bookshelf/profile edit/read routes
- recommendation accept/reject/delete routes

### Remaining weaker or legacy areas

The app is in a better place than before, but it is not perfectly uniform yet.

Remaining improvement opportunities are mostly about consistency rather than the same old "trust the caller's email" problem. Examples:

- some older routes still call `getServerSession(options)` inline instead of using the shared helper
- some public route handlers are intentionally open because they serve public bookshelf pages
- the app still relies on feature-specific repository checks rather than a single centralized policy layer

So the current shape is:

- Word Garden remains the strongest, most explicit auth model
- bookshelf/profile APIs are now much closer to that model
- the remaining gaps are mostly cleanup and standardization, not the original body/query identity problem

## Recommended Mental Model

When working in this repo, it helps to think of auth in three layers:

1. NextAuth answers "who is signed in?"
2. The app's `User` collection answers "what app data belongs to this person?"
3. Feature-specific rules answer "what is this person allowed to do with this specific resource?"

Word Garden follows all three layers consistently.
After this hardening pass, the bookshelf/profile routes now follow the same pattern more closely.

## Quick Reference

### Sign-in route

- `GET|POST /api/auth/[...nextauth]`

### Main server helpers

- `getServerSession(options)`
- `requireSessionUser()`
- `requireWordGardenSession(...)`
- `getAnonymousChildOrNotFound(...)`

### Session fields used by the app

Typical fields referenced by app code:

- `session.user.email`
- `session.user.name`
- `session.user.login`
- `session.user.role`

## Summary

Today, authentication is still simple:

- users sign in with GitHub
- NextAuth provides the session
- the app maps that session to its own `User` record
- Word Garden adds strong resource-level authorization on top
- the older bookshelf/profile APIs now derive ownership from that same session instead of trusting caller-supplied identity

If this app is hardened further, the next gains are likely to come from consistency and cleanup, not from the earlier "email in the request body" pattern that used to exist in several private routes.
