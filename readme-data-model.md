# Data Model

This app stores its dynamic data in MongoDB through Mongoose models defined in `domain/models.ts`. Repositories initialize those models through `handler()` and `BaseRepository.initializeModels()`, then interactors wrap repository operations for route handlers and server components.

There are two broad kinds of data in this codebase:

1. Persisted application data in MongoDB
2. Static Word Garden curriculum data in `data/` and `utils/wordGardenData.js`

## Persistence Stack

- Database connection: `repositories/dbConnect.ts`
- Mongoose models: `domain/models.ts`
- Base repository bootstrap: `repositories/BaseRepository.ts`
- Main business logic layer: `interactors/**`

`dbConnect()` caches the active Mongoose connection on `global.mongoose`, so repeated model access in serverless/runtime contexts can reuse the connection instead of reconnecting on every request.

## Collections

### `User`

Defined by `UserSchema` in `domain/models.ts`.

Purpose:
- Represents a signed-in app user
- Owns books and booklists
- Tracks reading-list state
- Tracks access to Word Garden anonymous child profiles

Important fields:

| Field | Type | Notes |
| --- | --- | --- |
| `login` | `string` | Provider login/username |
| `name` | `string` | Display name from auth provider |
| `email` | `string` | Main application identity key in repository logic |
| `publicProfileName` | `string` | Unique, lowercase public profile slug |
| `bookListIds` | `ObjectId[]` | References `Booklist` documents owned by the user |
| `trackedBooks` | embedded array | Reading-list entries referencing `Book` |
| `favoriteBooklistIds` | `ObjectId[]` | Reserved for favorite/public booklists |
| `acIds` | `ObjectId[]` | References `AnonymousChild` documents the user can access |

### `trackedBooks` embedded objects

Each tracked book stores:

| Field | Type | Notes |
| --- | --- | --- |
| `bookId` | `ObjectId` | Refers to `Book` |
| `status` | `'to-read' \| 'finished'` | Reading-list state |
| `isFavorite` | `boolean` | Favorite toggle |
| `review` | `string` | Free-text review |
| `ratingPerceivedDifficulty` | `number \| null` | 1-10 difficulty rating |
| `isWishlistItem` | `boolean` | Wishlist support |
| `bookPriority` | `number` | Manual ordering/priority |

Notes:
- The app treats `email` as the canonical user identity in repository code.
- The schema does not currently mark `email` as unique, so uniqueness is enforced by application behavior rather than by the Mongo schema itself.

### `Book`

Defined by `BookSchema` in `domain/models.ts`.

Purpose:
- Represents a book in a user's collection
- Can also be referenced from booklists and tracked reading entries

Important fields:

| Field | Type | Notes |
| --- | --- | --- |
| `Name` | `string` | Title |
| `Author` | `string` | Author |
| `Description` | `string` | Optional long description |
| `Age` | `string` | Age range text |
| `Series` | `string` | Series metadata |
| `Publication_Date` | `string` | Publication metadata |
| `Publisher` | `string` | Publisher metadata |
| `ISBN` | `string` | ISBN metadata |
| `Link` | `string` | External URL |
| `Source` | `string` | Import/source note |
| `BookOwner` | `ObjectId` | Refers to the owning `User` |
| `IsArchived` | `boolean` | Soft archive flag |

Notes:
- Field names on `Book` are capitalized because the model mirrors imported/source data conventions already used by the app.
- Deleting a book also removes references from booklists and users' `trackedBooks`.

### `Booklist`

Defined by `BooklistSchema` in `domain/models.ts`.

Purpose:
- Represents a shelf/list owned by a user
- Supports public/private visibility
- Supports book recommendations

Important fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `string` | Booklist title |
| `description` | `string` | Optional description |
| `visibility` | `string` | Used for public/private access checks |
| `booklistOwnerId` | `ObjectId` | Refers to owner `User` |
| `bookIds` | `ObjectId[]` | References books in the list |
| `openToRecommendations` | `boolean` | Whether others can recommend books |
| `bookRecommendations` | embedded array | Pending/accepted/rejected recommendations |

### `bookRecommendations` embedded objects

| Field | Type | Notes |
| --- | --- | --- |
| `bookId` | `ObjectId` | Refers to `Book` |
| `recommendedBy` | `ObjectId` | Refers to `User` |
| `status` | `'accepted' \| 'rejected' \| 'offered'` | Recommendation lifecycle |
| `recommendationReason` | `string` | Explanation text |

Notes:
- A user's owned booklists are reachable both from `User.bookListIds` and from `Booklist.booklistOwnerId`.
- Public bookshelf/profile pages rely on `visibility === 'public'`.

### `AnonymousChild`

Defined by `AnonymousChildSchema` in `domain/models.ts`.

Purpose:
- Represents a Word Garden child profile without storing direct identifying information
- Holds practice history, checklist state, and sharing metadata

Important fields:

| Field | Type | Notes |
| --- | --- | --- |
| `acId` | `string` | Public UUID-like identifier used in routes and URLs |
| `displayName` | `string` | App-visible label for the profile |
| `birthYearMonth` | `string` | `YYYY-MM` used for age calculations |
| `waiverAcceptedAt` | `Date` | Caregiver waiver acceptance timestamp |
| `originatorUserId` | `ObjectId \| null` | User who created the profile |
| `shareToken` | `string` | Unique token used to add surrogates via share links/QR |
| `currentChecklistWord` | `string \| null` | Current active Word Garden word |
| `checklistWordOrder` | `string[]` | Stored ordering for started checklists |
| `practicedWords` | embedded array | Practice and checklist history |
| `createdAt` / `updatedAt` | `Date` | Automatic timestamps |

Important design detail:
- `acId` is the public/stable route key.
- `_id` is the Mongo internal key.
- `User.acIds` stores the Mongo `_id`, not the public `acId`.

### `practicedWords` embedded objects

Each `AnonymousChild` stores Word Garden progress in an embedded array rather than a separate collection.

| Field | Type | Notes |
| --- | --- | --- |
| `word` | `string` | Normalized lowercase word |
| `practiceCount` | `number` | Times the word page/checklist has been practiced |
| `completedChecklistCount` | `number` | Number of completed checklists for this word |
| `lastPracticedAt` | `Date \| null` | Last activity timestamp |
| `checklistCheckedItemIds` | `string[]` | Saved UI checkbox state for an open checklist |
| `checklistSelectionType` | `'all' \| 'letter' \| 'phoneme' \| null` | Which Level 2 view opened the checklist |
| `checklistSelectionSlug` | `string \| null` | Slug for the selected letter/phoneme/all view |
| `checklistSelectionLetter` | `string \| null` | Optional focus letter |
| `checklistUpdatedAt` | `Date \| null` | Last saved checklist-state timestamp |

In practice, this embedded structure powers:
- practice counts
- checklist "started" vs "complete"
- saved checkbox state
- current word behavior
- manual checklist ordering

## Relationships

At a high level:

- One `User` owns many `Book` records through `Book.BookOwner`
- One `User` owns many `Booklist` records through `Booklist.booklistOwnerId`
- One `User` references owned booklists through `User.bookListIds`
- One `User` tracks many books through embedded `User.trackedBooks`
- Many `Users` can reference the same `AnonymousChild` through `User.acIds`
- One `AnonymousChild` has one `originatorUserId` and may also be shared with surrogate users

### Word Garden sharing model

The Word Garden access model is slightly unusual:

- The originator is stored directly on the child as `originatorUserId`
- Any user with access stores that child's Mongo `_id` in `User.acIds`
- Surrogates are therefore inferred as:
  - users whose `acIds` contains the child `_id`
  - minus the originator user

This lets the app answer:
- who created the child
- who currently has access
- who is allowed to remove surrogates or delete the child

## Static Word Garden Data

Not all Word Garden behavior comes from MongoDB. The teaching content is mostly static and lives in `data/` plus `utils/wordGardenData.js`.

Important files:

| File | Purpose |
| --- | --- |
| `data/approved-words.json` | Approved lexicon used by the Word Garden |
| `data/approved-phonemes.json` | Supported phoneme inventory |
| `data/approved-letter-constant.json` | Letter anchor words like "A like Apple" |
| `data/phoneme-map.js` | Word-to-phoneme mapping data |
| `data/first-letter-map.js` | Letter-to-word mapping data |
| `data/consonant-acquisition.js` | Developmental phoneme release windows |
| `utils/wordGardenData.js` | Derived sound table, word cloud, highlighting, checklist, and recommendation logic |

So:
- Mongo stores learner progress and access
- `data/` stores the teaching corpus/rules
- `utils/wordGardenData.js` combines the two into view models used by the UI

## Architectural Flow

The codebase generally follows this path:

1. Route handler or server component receives a request
2. Interactor is created through a static `create()` method
3. Interactor initializes one or more repositories
4. Repository initializes Mongoose models through `handler()`
5. Repository reads/writes Mongo documents

This is not a strict clean architecture boundary yet, but it does give the app a useful split between:
- routes/pages
- use-case logic
- repository/database logic

## Known Modeling Notes

- `email` is treated as unique in practice, but that is not enforced in the schema.
- Several older APIs still pass `userEmail` from the client instead of always deriving ownership from the session.
- Book and booklist ownership is represented both by direct owner fields and by arrays on the `User` document.
- Word Garden is the most fully modeled feature in the app: it has the clearest ownership/access rules and the richest embedded state model.
