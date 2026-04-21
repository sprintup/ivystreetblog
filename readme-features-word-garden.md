# Word Garden Features

This file describes the Word Garden feature set as it exists in the app today. It focuses on implemented behavior, current user flows, and the main rules behind the feature.

Word Garden is a three-level caregiver workflow:

1. `Sound Table`: choose a letter or phoneme target
2. `Word Cloud`: browse words connected to that target
3. `Word Page`: practice one word with a checklist, strategies, and a printable worksheet

## Main Goals

Word Garden is designed to help a caregiver:

- organize practice around anonymous child profiles
- choose age-appropriate sound targets
- move from letter/phoneme awareness to actual words
- practice a word from multiple angles: sound, meaning, orthography, and context
- save progress through started checklists and completed checklists
- print or generate a one-page worksheet for offline use

## 1. Dashboard And Child Profiles

Main entry points:

- `app/word-garden/page.jsx`
- `app/word-garden/AddAnonymousChildForm.jsx`
- `app/word-garden/DeleteAnonymousChildButton.jsx`
- `app/word-garden/ShareAnonymousChildButton.jsx`
- `app/word-garden/RemoveSurrogateButton.jsx`

Implemented features:

- Signed-in users get a `Your Garden` dashboard listing all anonymous child profiles they can access.
- Each profile stores:
  - parent-approved display name
  - birth year/month
  - waiver acceptance timestamp
  - practice history
  - checklist state
  - current word
  - share token
- New anonymous child profiles can be created from the dashboard.
- The add form includes:
  - a nickname/display-name field
  - birth month input
  - caregiver waiver / responsibility checkbox
  - age-range guidance for children 24-96 months
- Each child tile shows:
  - age in months
  - birth month
  - completion summary
  - last updated date
  - whether the current user is the originator or has shared access
- The main action on each tile is `Open sound table`.
- Dashboard tiles sort by most recently updated child.

## 2. Sharing, Originators, And Surrogates

Main entry points:

- `app/word-garden/ShareAnonymousChildButton.jsx`
- `app/word-garden/share/[shareToken]/page.jsx`
- `app/api/word-garden/children/[acId]/surrogates/[surrogateUserId]/route.js`
- `repositories/AnonymousChildRepository.ts`

Implemented features:

- Each child profile has a share token.
- Originators can open a `Share AC with QR code` panel on the dashboard tile.
- The share panel includes:
  - a QR code
  - the full share URL
  - a copy-link button
- A signed-in user who opens the share link can add that anonymous child to their own garden as a surrogate caregiver.
- The dashboard shows banner feedback for:
  - share accepted
  - already added
  - invalid share link
- Only the originator can:
  - delete the anonymous child profile
  - see the full surrogate list on the tile
  - remove surrogate users
  - access the share controls
- Surrogates can use the child profile, but they do not get originator-only controls.

## 3. Route Protection And Access Control

Main entry points:

- `app/word-garden/wordGardenServer.js`
- `app/api/word-garden/**`
- `repositories/AnonymousChildRepository.ts`

Implemented features:

- Word Garden pages require a valid NextAuth session.
- Word Garden routes redirect to sign-in when the user is not signed in.
- Word Garden child pages check that the current user actually has access to the anonymous child.
- Unauthorized access to a child profile redirects back out of the feature instead of exposing data.
- The repository layer distinguishes:
  - general access
  - originator-only actions
- The access model is based on:
  - `AnonymousChild.originatorUserId`
  - `User.acIds`

## 4. Level 1: Sound Table

Main entry points:

- `app/word-garden/[acId]/page.jsx`
- `app/word-garden/SoundTable.jsx`
- `utils/wordGardenData.js`
- `data/consonant-acquisition.js`
- `data/approved-phonemes.json`
- `data/approved-words.json`

Implemented features:

- The sound table is the Level 1 view for a selected child.
- It uses child age in months to determine which phonemes are currently developmentally available for expressive practice.
- Letters stay visible even when a related phoneme is not unlocked yet, because receptive alphabet learning is still allowed.
- The table presents:
  - target
  - difficulty
  - status
  - concrete word count
  - abstract word count
  - completed count
  - example word
- Phonemes are displayed in IPA.
- Only approved phonemes are shown.
- Example words come from the approved lexicon and row data rather than being made up ad hoc.
- Vowels are represented as vowels/open sounds rather than unsupported phoneme targets.

### Sound Table Statuses

Implemented statuses include:

- `Unlocked`
- `Augmented`
- `Embedded`
- `Done`
- `Locked`

Behavior:

- `Unlocked` means the target is available for direct exploration.
- `Augmented` is used when a letter has too few direct starting words, so the list is expanded.
- `Embedded` is used when there are no beginning-of-word matches and the app falls back to inside-the-word matches.
- `Done` indicates completed checklist coverage for the words tied to that target.
- `Locked` means the target is not yet available for expressive focus.

### Difficulty Labels

Implemented labels include:

- `Easy (CV)`
- `Medium (VC)`
- `Hard (Vowel/Non)`
- `Ready`
- `Advanced for age`

The sound table also uses matching colors to distinguish difficulty and developmental status.

### Sorting And Filtering

Implemented table controls:

- click a column header to sort
- shift-click a second header to add a secondary sort
- `Hide locked rows` checkbox
- row links to the next level

### Sound Table Button Pane

Implemented buttons:

- `Current word`
- `Recommend`
- `Checklists`
- `All unlocked words`
- `All words`

Behavior:

- `Current word` jumps into the active checklist, or falls back to a recommendation if no checklist is active.
- `Recommend` chooses an unfinished unlocked target and prefers concrete words before abstract ones.
- `Checklists` opens the saved started-checklist page.
- `All unlocked words` opens a Level 2 word cloud scoped to currently unlocked material.
- `All words` opens the full lexicon view.

### Sound Table Guidance

The Level 1 page includes an instructions area covering:

- how to read the table
- developmental timing
- what is hidden and what is not
- difficulty labels
- sorting behavior
- button meanings
- practice notes
- app flow across the three levels
- a reminder that yellow UI elements are usually clickable

## 5. Level 2: Word Cloud

Main entry points:

- `app/word-garden/WordCloud.jsx`
- `app/word-garden/LevelTwoIntro.jsx`
- `app/word-garden/[acId]/letter/[letter]/page.jsx`
- `app/word-garden/[acId]/phoneme/[phonemeSlug]/page.jsx`
- `app/word-garden/[acId]/all/page.jsx`

Implemented views:

- word cloud for a selected letter
- word cloud for a selected phoneme
- `All words`
- `All unlocked words`
- category-filtered word cloud

Implemented features:

- The title reflects the selected target, for example `Word Cloud for /k/`.
- Breadcrumbs preserve the Level 1 and Level 2 context.
- Top-level context pills can show:
  - developmental note
  - difficulty note
  - related letter/phoneme pills
- Letter word clouds can display linked phoneme pills for that letter.
- Phoneme word clouds can display linked letter pills for that phoneme.
- Top instruction copy explains:
  - concrete vs abstract learning
  - academic nature of the lexicon
  - that the top pills are only a selected teaching subset, not every phoneme in English
  - source attribution to Appendix B of Susan B. Neuman's book

### Word Cloud Filtering

Implemented filters include:

- category selector
- `Concrete`
- `Abstract`
- `Completed`

Behavior:

- abstract words default off until concrete words are learned, but can be manually enabled
- category filtering works on:
  - all words
  - letter word clouds
  - phoneme word clouds
- count labels next to the checkboxes reflect the currently selected category
- completed counts are based on completed checklist totals

### Word Cloud Presentation

Implemented word cloud behavior:

- words are rendered as clickable pills
- pills include repetition/visit information
- completed words show a checkmark
- spacing and size are tuned to keep the cloud dense and readable
- selected letters or phonemes are highlighted inside the word
- letter views highlight the selected letter in-place
- phoneme views highlight the corresponding grapheme segment(s) in-place
- phoneme matching supports multi-letter spellings like `/ʃ/` in `machine` or `ocean`

### Word Cloud Buttons

Implemented buttons:

- `Current word`
- `Recommend`
- `Checklists`
- `All unlocked words`
- `All words`

Behavior:

- the button pane mirrors the sound table so Level 2 can act like a control hub
- category context is preserved where appropriate

## 6. Recommendation Logic

Main entry points:

- `utils/wordGardenData.js`
- `app/word-garden/SoundTable.jsx`
- `app/word-garden/WordCloud.jsx`
- `app/word-garden/[acId]/current/page.jsx`

Implemented features:

- Recommendation logic is runtime-based rather than hard coded into the UI.
- The app can recommend from:
  - sound table rows
  - word cloud scopes
  - fallback current-word routing
- Concrete words are exhausted before abstract words.
- Completed words are excluded from recommendation pools where they should be.
- Current-word routing falls back to recommendation when no checklist is active.

## 7. Level 3: Single Word Page

Main entry points:

- `app/word-garden/[acId]/letter/[letter]/[word]/page.jsx`
- `app/word-garden/[acId]/phoneme/[phonemeSlug]/[word]/page.jsx`
- `app/word-garden/[acId]/all/[word]/page.jsx`
- `app/word-garden/WordFocusHeader.jsx`
- `app/word-garden/WorksheetChecklist.jsx`

The Level 3 page is the most feature-rich part of Word Garden.

Implemented features:

- one-word practice page for the selected child, target, and word
- breadcrumbs back to Word Garden, Sound Table, and Word Cloud
- target-aware rendering for:
  - letter-driven entry
  - phoneme-driven entry
  - all-words entry
- focus-sensitive content that changes when the target changes

## 8. Focus System

Implemented focus features:

- Focus pills appear in the title area for:
  - the active letter
  - all supported phonemes found for that word
- Unlocked phoneme pills are yellow.
- Locked phoneme pills stay neutral/gray.
- The active focus pill is distinguished by a stronger border rather than by changing the fill color.
- Letter focus pills are also highlighted as unlocked/clickable.
- Clicking a focus pill changes the Level 3 focus of the current word.
- Focus changes update:
  - highlighted graphemes
  - the target focus pane
  - the first checklist prompts
  - related links
  - strategy content

### Focus Pane Content

The top pane can show:

- target label
- category
- linked letter and phoneme targets
- letter-family phonemes when the focus is on a letter
- related context pills

## 9. Checklist System

Main entry points:

- `app/word-garden/WorksheetChecklist.jsx`
- `app/api/word-garden/children/[acId]/practice/route.js`
- `app/word-garden/[acId]/checklists/page.jsx`
- `app/word-garden/StartedChecklistGrid.jsx`
- `app/word-garden/StartedChecklistTile.jsx`
- `app/api/word-garden/children/[acId]/checklists/order/route.js`

Implemented checklist features:

- A checklist can be `not started`, `started`, or `complete`.
- A checklist opens when:
  - the user presses `Start Checklist`
  - the user checks a box
- Open checklist state is saved to the child profile.
- Saved state includes:
  - checked item ids
  - selection type
  - selection slug
  - selection letter
  - last checklist update time
- Revisiting a word restores the previously checked boxes.
- Completing a checklist increments the completed count and clears the open checklist state for that word.
- A completed word can be reopened for more work.

### Required And Optional Structure

Implemented structure:

- four required processors:
  - phonological
  - meaning
  - orthographic
  - context
- one optional section, collapsed by default
- completion rules require at least 2 checked items in each required processor

### Checklist UX

Implemented checklist UX features:

- `Completion Rules` pane above the checklist
- completion-rule rows are clickable and scroll to the matching checklist section
- completion-rule rows change color when sections are complete
- required sections collapse once their minimum is complete
- optional remains available but is not required
- success messaging appears when the checklist is completed
- after completion, the flow returns to the sound table

## 10. Current Word System

Main entry points:

- `app/word-garden/[acId]/current/page.jsx`
- `app/word-garden/[acId]/checklists/page.jsx`
- `app/word-garden/StartedChecklistTile.jsx`
- `repositories/AnonymousChildRepository.ts`

Implemented features:

- Each child can have one `current word`.
- The current word is a singleton across open checklists.
- Current-word state is saved on the anonymous child profile.
- If there is no current word, current-word buttons use a recommendation fallback.
- The current-word route is bookmarkable:
  - `/word-garden/[acId]/current`
- The current word is pinned to the top of the checklist list.
- A word can be made current from:
  - the Level 3 page
  - the checklist page tiles
- Buttons and pills adapt based on whether the current word exists.

## 11. Started Checklists Page

Main entry point:

- `app/word-garden/[acId]/checklists/page.jsx`

Implemented features:

- dedicated checklist-management page
- instructions explaining:
  - what opens a checklist
  - what current word means
  - what the bookmarkable current-word URL does
  - what counts as not-started, started, and complete
  - a suggestion to begin with words sharing letters from the child's name
- child details panel matching the Level 1 layout style
- button pane with:
  - `Current word`
  - `Recommend`
- tile-based checklist list instead of rows
- tiles show:
  - word
  - definition
  - checked count
  - repetition count
  - current-word state
- tile is clickable to open the word page
- tile actions include:
  - `Make Current`
  - `Move Up`
  - `Move Down`
  - soft delete with confirmation modal
- checklist order can be reorganized and saved

## 12. Four-Processor Practice Content

Main entry point:

- `app/word-garden/WorksheetChecklist.jsx`

Implemented processor sections:

- Phonological
- Meaning
- Orthographic
- Context

Implemented content areas include:

- first-letter/first-sound prompts
- syllable segmentation prompt
- child-friendly definition work
- acting/showing/finding the word
- uppercase/lowercase letter work
- writing/showing the word
- child writing and drawing prompts
- category-based context questions
- metaphor prompt
- discussion of synonyms, antonyms, homonyms, and morphemes

The wording inside these sections adapts based on:

- whether the focus is a letter or a phoneme
- whether the first letter has a supported phoneme
- whether the target is a vowel/open sound
- which letter/phoneme is currently in focus

## 13. Strategy Panes And Teaching Supports

Implemented strategy and support panes include:

- clickable definition / glossary support
- synthetic approach
- analytic approach
- sound map
- onset/rime
- focus letter phonemes
- related words
- synonyms/antonyms/homonyms/morphemes support

Implemented behavior:

- synthetic and analytic panes are horizontally scrollable when needed
- supported phonemes are linked and shown in IPA
- unsupported phonemes are filtered out
- synthetic highlighting uses approved phoneme mappings only
- sound-in-word highlighting follows the active target
- related-word strategy copy explains how another word is related by:
  - category
  - first letter
  - sound
- related words are linked where appropriate
- category links route back to the filtered all-words page

## 14. Printable Worksheet

Main entry point:

- `app/word-garden/WorksheetChecklist.jsx`
- print styles in `app/globals.css`

Implemented worksheet features:

- printable one-page worksheet layout
- tuned for both desktop and mobile printing
- separate print-only render path
- QR code in the top-right corner
- top area with:
  - target word
  - definition
  - pronunciation helper tiles
- required panes on the left/main area
- optional section on the right
- related words section
- draw-your-own-picture section

Implemented print-specific features:

- printable pronunciation helper
- highlighted graphemes and phonemes
- emphasis for uppercase and lowercase letters
- related word sentences carried over from the UI rather than blanks
- optional hiding of empty generated sections
- worksheet download flow
- automatic worksheet readiness/download behavior after generation

## 15. Generated Worksheet Content

Main entry points:

- `app/api/word-garden/generate/route.js`
- `utils/wordGardenGenerationPolicy.js`

Implemented generation features:

- Generation is optional. The worksheet can still be printed without it.
- Generation uses a user-supplied OpenAI API key.
- The token is not stored in the database.
- The generation panel includes setup instructions and cost/time guidance.
- The generate route produces:
  - child-friendly definition
  - category-type answer
  - black-and-white coloring-page prompt and image
  - age-appropriate related-word connections
  - age-appropriate antonyms
  - homonym/homograph support when appropriate
  - morpheme sentences when appropriate
  - picture-book recommendations
- Generated images are styled toward:
  - thick outlines
  - white background
  - no gray fill
  - no text
- Some words are intentionally blocked from generation by policy.
- When generation is disabled for a word, the UI tells the user the generator is unavailable for that word.

## 16. QR-Based Completion Flow

Implemented features:

- Printed worksheets include a QR code that links back to the matching Level 3 word page.
- QR entry can prefill the checklist state online.
- The online page can then be completed with `Complete Checklist`.
- This ties paper use back into saved digital progress.

## 17. Glossary And Definition Linking

Main entry point:

- `app/word-garden/glossary/[term]/page.jsx`

Implemented features:

- definition support pages for glossary terms
- clickable sub-terms from definitions
- child-friendly fallback glossary behavior in `utils/wordGardenData.js`

## 18. Data Rules And Curriculum Rules

Main entry points:

- `data/approved-words.json`
- `data/approved-phonemes.json`
- `data/approved-letter-constant.json`
- `data/consonant-acquisition.js`
- `utils/wordGardenData.js`

Implemented curriculum/data rules:

- only approved words are used in the Word Garden lexicon
- only approved phonemes are surfaced as supported phoneme targets
- consonant release windows are based on the developmental acquisition data file
- letter constants provide prompts like `A like Apple`
- example words, sound maps, and highlighting are derived from the approved dataset
- generation can be selectively disabled for words that are not good worksheet-generation candidates

## 19. Info Page And Onboarding

Main entry point:

- `app/word-garden-info/page.jsx`

Implemented onboarding features:

- a public Word Garden info page
- explanation of why the feature helps
- explanation of real-life caregiver use cases
- summary of what can be done in Word Garden
- link into the dashboard or sign-in flow

## 20. Supporting APIs

Implemented Word Garden API routes:

- `GET /api/word-garden/children`
- `POST /api/word-garden/children`
- `GET /api/word-garden/children/[acId]`
- `DELETE /api/word-garden/children/[acId]`
- `POST /api/word-garden/children/[acId]/practice`
- `POST /api/word-garden/children/[acId]/checklists/order`
- `DELETE /api/word-garden/children/[acId]/surrogates/[surrogateUserId]`
- `POST /api/word-garden/generate`

These cover:

- child creation and lookup
- access-protected child deletion
- practice state persistence
- checklist ordering
- surrogate removal
- worksheet generation

## 21. Summary

Word Garden currently includes:

- a protected multi-child dashboard
- originator/surrogate sharing with QR-based linking
- a three-level learning flow
- age-aware sound availability
- filtered and highlight-aware word clouds
- a focus-sensitive single-word teaching page
- persistent started/completed checklist state
- current-word management
- printable and generatable worksheets
- glossary/definition support
- static approved curriculum data combined with saved learner progress

It is one of the most complete and deeply modeled features in the app, with both a strong UI workflow and a matching persistence/access model behind it.
