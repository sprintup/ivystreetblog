# API Endpoints

This file documents the API routes under `app/api/**` as they are implemented today.

Two important notes up front:

1. These routes are primarily app-internal endpoints used by the Next.js UI.
2. Authentication and authorization are not uniform across the whole API surface. Word Garden is the most tightly protected area; some older bookshelf/profile routes still trust request parameters from the client.

## Auth Legend

- `Open`: no `getServerSession()` check in the route
- `Session`: requires a signed-in NextAuth session
- `Session + access`: requires a session and feature-level access checks
- `Session + originator`: requires a session and originator-only Word Garden access

## Authentication

| Method | Path | Auth | Purpose | Notes |
| --- | --- | --- | --- | --- |
| `GET` / `POST` | `/api/auth/[...nextauth]` | Open | NextAuth entry point for sign-in/session flows | Backed by GitHub provider config in `options.js` |

## Books

| Method | Path | Auth | Purpose | Request shape |
| --- | --- | --- | --- | --- |
| `POST` | `/api/book` | Session | Create a book in the signed-in user's collection | `{ Name, Author }` |
| `PUT` | `/api/book` | Open | Update a book by id | `{ bookId, BookName, Series, Description, Author, Age, Publication_Date, Product_Details, Publisher, ISBN, Link, Source, BookOwner }` |
| `DELETE` | `/api/book` | Open | Delete a book and remove references from booklists/tracked books | `{ bookId }` |
| `GET` | `/api/book/[id]` | Open | Read one book for edit/details views | Path param `id` |
| `PUT` | `/api/book/toggleArchive` | Open | Toggle `IsArchived` on a book | `{ bookId }` |

Notes:
- `POST /api/book` is session-based.
- `PUT`, `DELETE`, and archive toggle are not currently protected by a route-level session/ownership check.

## Collection and Reading List

| Method | Path | Auth | Purpose | Request shape |
| --- | --- | --- | --- | --- |
| `POST` | `/api/collection` | Open | Paginated fetch of a user's collection | `{ page, limit, userEmail }` |
| `POST` | `/api/reading-list` | Session | Add a book to the signed-in user's tracked books | `{ bookId }` |
| `PUT` | `/api/reading-list/[bookId]` | Session | Update reading-list status | `{ status }` |
| `DELETE` | `/api/reading-list/[bookId]` | Session | Remove a book from the signed-in user's reading list | Path param `bookId` |
| `PUT` | `/api/review/[bookId]` | Session | Save review text and perceived difficulty | `{ review, ratingPerceivedDifficulty }` |

Notes:
- `POST /api/collection` is open and trusts `userEmail` from the request body.
- Reading-list and review routes correctly derive the acting user from the session.

## User Profile

| Method | Path | Auth | Purpose | Request shape |
| --- | --- | --- | --- | --- |
| `POST` | `/api/user/profile` | Open | Read a user profile by email | `{ email }` |
| `PUT` | `/api/user/profile` | Open | Update `publicProfileName` by email | `{ email, publicProfileName }` |
| `POST` | `/api/user/booklists-dropdown` | Session | Fetch booklists for dropdown UI | `{ email }` |

Notes:
- Profile read/update routes are not session-protected.
- The dropdown route requires a session, but still accepts `email` from the request body rather than forcing `session.user.email`.

## Booklists

| Method | Path | Auth | Purpose | Request shape |
| --- | --- | --- | --- | --- |
| `GET` | `/api/booklist` | Open | Fetch a user's booklists by email | Query `?userEmail=` |
| `POST` | `/api/booklist` | Open | Create a booklist | `{ userEmail, booklist }` |
| `GET` | `/api/booklist/[id]` | Open | Read one public booklist | Path param `id` |
| `PUT` | `/api/booklist/[id]` | Open | Update booklist metadata | `{ title, description, visibility, openToRecommendations }` |
| `DELETE` | `/api/booklist/[id]` | Open | Delete a booklist | Path param `id` |
| `GET` | `/api/booklist/[id]/edit` | Open | Read one booklist with books for edit page | Path param `id` |
| `POST` | `/api/booklist/[id]/book` | Open | Add a book from collection to booklist | `{ bookId }` |
| `DELETE` | `/api/booklist/[id]/book` | Open | Remove a book from a booklist | `{ bookId }` |
| `POST` | `/api/booklist/[id]/recommend` | Open | Add a recommendation to a booklist | `{ bookId, recommendedBy, recommendationReason }` |

Notes:
- The booklist area is functional, but it is one of the least protected API areas.
- Even where the UI usually sends valid user identity, most of these routes do not enforce it server-side.
- `GET /api/booklist/[id]` intentionally only returns public booklists through the repository query.

## Recommendations

| Method | Path | Auth | Purpose | Request shape |
| --- | --- | --- | --- | --- |
| `PUT` | `/api/recommendations/accept` | Session | Mark a recommendation as accepted | `{ recommendationId }` |
| `PUT` | `/api/recommendations/reject` | Session | Mark a recommendation as rejected | `{ recommendationId }` |
| `DELETE` | `/api/recommendations/delete` | Session | Remove a recommendation entry | `{ recommendationId }` |

Notes:
- These routes require a session.
- The route layer does not additionally verify that the current user owns the target booklist before changing the recommendation.

## Word Garden

Word Garden is the most fully protected API surface in the app. These routes require a session and then validate child access in `AnonymousChildRepository`.

### Child dashboard and creation

| Method | Path | Auth | Purpose | Request shape |
| --- | --- | --- | --- | --- |
| `GET` | `/api/word-garden/children` | Session | Load all Word Garden child profiles for current user | none |
| `POST` | `/api/word-garden/children` | Session | Create a new anonymous child profile | `{ displayName, birthYearMonth, waiverAccepted }` |

Behavior:
- ensures a `User` record exists for the signed-in session
- validates `birthYearMonth`
- requires waiver acceptance

### Single child access

| Method | Path | Auth | Purpose | Request shape |
| --- | --- | --- | --- | --- |
| `GET` | `/api/word-garden/children/[acId]` | Session + access | Read one child profile if current user has access | Path param `acId` |
| `DELETE` | `/api/word-garden/children/[acId]` | Session + originator | Delete a child profile if current user is the originator | Path param `acId` |

Important detail:
- access is determined by whether the child's Mongo `_id` is present in `session user -> User.acIds`
- deletion additionally checks that `originatorUserId` matches the current user

### Practice and checklists

| Method | Path | Auth | Purpose | Request shape |
| --- | --- | --- | --- | --- |
| `POST` | `/api/word-garden/children/[acId]/practice` | Session + access | Update practice counts, checklist state, or current word | See below |
| `POST` | `/api/word-garden/children/[acId]/checklists/order` | Session + access | Reorder started checklist words | `{ orderedWords }` |

### `POST /api/word-garden/children/[acId]/practice`

Supported request fields:

```json
{
  "word": "light",
  "practiceIncrement": 1,
  "checklistIncrement": 0,
  "resetChecklist": false,
  "checklistCheckedItemIds": ["phonological-1"],
  "openChecklist": true,
  "selectionType": "letter",
  "selectionSlug": "L",
  "selectionLetter": "L",
  "setCurrentWord": true
}
```

What it can do:
- increment practice count
- mark a checklist completed
- save/open checklist checkbox state
- clear checklist state
- set the current word
- preserve the Level 2 selection context that opened the word

### Surrogate management

| Method | Path | Auth | Purpose | Request shape |
| --- | --- | --- | --- | --- |
| `DELETE` | `/api/word-garden/children/[acId]/surrogates/[surrogateUserId]` | Session + originator | Remove a surrogate user's access to a child profile | Path params `acId`, `surrogateUserId` |

Behavior:
- only the originator may remove surrogates
- the originator cannot remove themselves through this route

### Worksheet generation

| Method | Path | Auth | Purpose | Request shape |
| --- | --- | --- | --- | --- |
| `POST` | `/api/word-garden/generate` | Session | Generate worksheet text + image through OpenAI | See below |

### `POST /api/word-garden/generate`

Request body:

```json
{
  "apiKey": "sk-...",
  "word": "light",
  "category": "science",
  "focusLabel": "/l/",
  "definition": "energy that lets us see",
  "morphologyExamples": ["lights", "lighting"],
  "relatedWords": ["animal", "left", "cylinder"]
}
```

Behavior:
- requires a signed-in app session
- requires a caller-supplied OpenAI API key
- does not store that API key in MongoDB
- blocks generation for words disabled by `utils/wordGardenGenerationPolicy.js`
- calls both:
  - `POST /v1/chat/completions`
  - `POST /v1/images/generations`

Response shape:

```json
{
  "childFriendlyDefinition": "...",
  "categoryTypeAnswer": "...",
  "morphemeSentences": [],
  "relatedWordConnections": [],
  "antonymConnections": [],
  "homographMeanings": [],
  "bookRecommendations": [],
  "imagePrompt": "...",
  "imageDataUrl": "data:image/png;base64,..."
}
```

## Summary by Protection Quality

### Most hardened routes

Best examples to follow when adding new endpoints:

- `/api/word-garden/**`
- `/api/reading-list/**`
- `/api/review/[bookId]`
- `/api/recommendations/*`

### Legacy routes that should be treated carefully

These are working endpoints, but they are not yet hardened like Word Garden:

- `/api/collection`
- `/api/user/profile`
- `/api/booklist/**`
- `/api/book` `PUT` and `DELETE`
- `/api/book/toggleArchive`

If you add new API routes, the safest pattern in this repo is:

1. require `getServerSession(options)`
2. derive the acting user from `session.user.email`
3. enforce resource ownership/access in the repository or interactor
4. avoid trusting `userEmail` or owner ids from the client when the server can derive them
