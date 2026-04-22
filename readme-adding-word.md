# Adding A Word

This guide explains how to add a new Word Garden word to the repo, what data that word needs, which files are the source of truth, and which files are generated from scripts.

The short version is:

1. Add the word, definition, and category to `data/words.json`
2. Make sure the word is present in `data/approved-words.json`
3. Regenerate the derived files
4. Verify that the word works in the Sound Table, Word Cloud, and Level 3 word page
5. Decide whether worksheet generation should be allowed for that word

## 1. Source Of Truth vs Generated Files

## Edit directly

These are the files you edit on purpose:

- `data/words.json`
- `data/approved-words.json`
- sometimes `utils/wordGardenGenerationPolicy.js`
- sometimes `data/approved-letter-constant.json`
- rarely `data/approved-phonemes.json`

## Generated from scripts

These are derived and should normally be regenerated instead of hand-edited:

- `data/output.js`
- `data/phoneme-map.js`
- `data/first-letter-map.js`

Scripts involved:

- `data/add-phonemes.js`
- `data/build-phoneme-map.js`
- `data/build-first-letter-map.js`

## 2. What A New Word Needs

At minimum, a new word needs:

- `word`
- `definition`
- `category`

In practice, it should also pass these checks:

- the word is child-appropriate
- the definition is short and caregiver-friendly
- the word belongs to one of the app's existing categories, unless you intentionally want a new category
- the word can be pronounced by the CMU dictionary pipeline, or you are prepared to fix the phoneme pipeline problem
- the word fits the approved Word Garden lexicon
- the word is safe for worksheet generation, or explicitly blocked from it

## 3. Primary File To Edit: `data/words.json`

This is the main source file for Word Garden words.

Current shape:

```json
[
  {
    "word": "above",
    "definition": "in a higher place than something else",
    "category": "mathematics"
  },
  {
    "word": "energy",
    "definition": "the ability to do work or cause change",
    "category": "science"
  }
]
```

### Example: adding a new word

If you wanted to add `triangle`, the new entry would look like:

```json
{
  "word": "triangle",
  "definition": "a shape with 3 sides and 3 corners",
  "category": "mathematics"
}
```

Notes:

- Keep `word` in normal display form.
- Keep `definition` short and child-friendly.
- Use an existing category spelling exactly if possible.
- Multi-word entries are allowed in this dataset, but they are a little riskier because pronunciation depends on every part being recognized by the CMU dictionary.

## 4. Add The Word To `data/approved-words.json`

Word Garden also uses an approved lexicon list.

Current shape:

```json
{
  "approvedWords": [
    "above",
    "addition",
    "energy",
    "voice"
  ]
}
```

Add the same word there too:

```json
{
  "approvedWords": [
    "above",
    "addition",
    "energy",
    "triangle",
    "voice"
  ]
}
```

Why this matters:

- the app filters Word Garden content through the approved list
- if the word is only in `words.json` but not in `approved-words.json`, it may not behave as expected across the UI

## 5. Regenerate The Derived Files

After editing the source data, regenerate the supporting files.

Run:

```powershell
node data/add-phonemes.js
node data/build-phoneme-map.js
node data/build-first-letter-map.js
```

What each script does:

- `add-phonemes.js`
  - reads `data/words.json`
  - looks up CMU pronunciations
  - writes `data/output.js`
  - generates `drawPrompt`
  - generates `arpabet`
  - generates `ipa`

- `build-phoneme-map.js`
  - reads `data/output.js`
  - writes `data/phoneme-map.js`
  - builds both ARPAbet and IPA lookup maps

- `build-first-letter-map.js`
  - reads `data/words.json`
  - writes `data/first-letter-map.js`
  - builds the first-letter lookup list

## 6. What The Generated Word Should Look Like In `data/output.js`

You do not usually hand-edit this file, but it is the easiest way to verify that the word came through correctly.

Example generated shape:

```js
{
  word: 'energy',
  definition: 'the ability to do work or cause change',
  category: 'science',
  arpabet: ['EH1', 'N', 'ER0', 'JH', 'IY0'],
  ipa: ['ɛ', 'n', 'ɝ', 'dʒ', 'i'],
  drawPrompt: 'Draw something that reminds you of energy.'
}
```

What to check:

- `arpabet` is not full of `?`
- `ipa` is not full of `?`
- the category is correct
- the draw prompt still makes sense

If you see `?`, the pronunciation pipeline did not understand the word cleanly.

## 7. What The Lookup Files Should Contain

### `data/first-letter-map.js`

Expected shape:

```js
module.exports = {
  "T": [
    "temperature",
    "test",
    "tide",
    "title",
    "town",
    "traditions",
    "traffic"
  ]
};
```

Your new word should appear under its first letter.

### `data/phoneme-map.js`

Expected shape:

```js
module.exports = {
  arpabet: {
    "T": ["temperature", "test", "title"]
  },
  ipa: {
    "t": ["temperature", "test", "title"]
  }
};
```

Your new word should appear under its phoneme(s), but only supported phonemes will matter in the current Word Garden UI.

## 8. Supported Phonemes

The app only surfaces a selected approved set of phonemes for Word Garden targets.

Current file:

- `data/approved-phonemes.json`

Current shape:

```json
{
  "approvedPhonemes": [
    "P",
    "M",
    "H",
    "N",
    "W",
    "B",
    "K",
    "G",
    "D",
    "T",
    "NG",
    "F",
    "YR",
    "L",
    "S",
    "CH",
    "SH",
    "Z",
    "JH",
    "V",
    "TH",
    "DH",
    "ER"
  ]
}
```

Notes:

- You usually do not need to edit this file when adding a word.
- You only edit this if you want to teach a brand-new phoneme target across the app.
- If the word contains unsupported phonemes, those parts may still exist in the raw pronunciation, but they will not become supported teaching targets automatically.

## 9. Letter Constants

For unsupported first-letter phoneme cases, the app can use a letter constant, such as:

```json
{
  "E": "Egg",
  "O": "Owl",
  "U": "Up"
}
```

File:

- `data/approved-letter-constant.json`

You normally only change this file if:

- you are adding a better anchor word for a letter
- you are intentionally changing the teaching constant for that letter

Adding a regular new lexicon word does not usually require editing this file.

## 10. Worksheet Generation Policy

Some words are intentionally blocked from generated worksheet content.

File:

- `utils/wordGardenGenerationPolicy.js`

Current shape:

```js
const DISABLED_WORKSHEET_GENERATION_WORDS = new Set([
  'bath',
  'blood',
  'brain',
  'heart',
  'lungs',
  'organs',
  'reproduction',
]);
```

Add your new word there only if generation should be disabled for safety or content reasons.

Example:

```js
const DISABLED_WORKSHEET_GENERATION_WORDS = new Set([
  'bath',
  'blood',
  'brain',
  'triangle'
]);
```

Most new words should not need this.

## 11. Recommended Algorithm

Use this checklist when adding a new word:

1. Decide whether the word belongs in the approved Word Garden lexicon.
2. Write a short, child-friendly definition.
3. Choose the correct category.
4. Add the word to `data/words.json`.
5. Add the word to `data/approved-words.json`.
6. Run:
   `node data/add-phonemes.js`
7. Open `data/output.js` and verify:
   - pronunciation exists
   - no unexpected `?`
   - draw prompt makes sense
8. Run:
   `node data/build-phoneme-map.js`
9. Run:
   `node data/build-first-letter-map.js`
10. Verify the word appears:
    - under the right first letter
    - under the right phoneme(s)
    - in the right category
11. Decide whether worksheet generation should be disabled.
12. Test the word in the UI:
    - Sound Table
    - Word Cloud
    - Level 3 word page
    - printable worksheet if needed

## 12. UI Verification Checklist

After regenerating, verify all of these:

- the word appears in `All words`
- the word appears in its category filter
- the word appears in the correct first-letter list
- the word appears in the correct phoneme list
- the highlighted letter/phoneme is correct in the word cloud
- the synthetic approach does not show unsupported junk phonemes
- the Level 3 prompts read sensibly for the word
- the printable worksheet still looks correct
- worksheet generation is either:
  - enabled and reasonable
  - or intentionally disabled

## 13. Common Problems

### The word does not show up at all

Check:

- it was added to `data/words.json`
- it was also added to `data/approved-words.json`
- derived files were regenerated

### The word shows `?` phonemes

The CMU pronunciation source probably did not recognize the word cleanly.

Options:

- choose a simpler word
- adjust the source word
- investigate the pronunciation pipeline before keeping the word

### The wrong phoneme is highlighted

Check:

- the generated `arpabet` / `ipa`
- the supported phoneme list
- the derived maps after regeneration

### The word exists but generation should not be allowed

Add it to:

- `utils/wordGardenGenerationPolicy.js`

## 14. Minimal Example

If you want the smallest useful example, adding `triangle` would usually mean:

### Add to `data/words.json`

```json
{
  "word": "triangle",
  "definition": "a shape with 3 sides and 3 corners",
  "category": "mathematics"
}
```

### Add to `data/approved-words.json`

```json
{
  "approvedWords": [
    "triangle"
  ]
}
```

### Regenerate

```powershell
node data/add-phonemes.js
node data/build-phoneme-map.js
node data/build-first-letter-map.js
```

### Verify

- `triangle` appears under `T`
- `triangle` appears in the right phoneme map buckets
- `triangle` appears in the Word Cloud and on its word page

## 15. Rule Of Thumb

If you are unsure which files to touch:

- edit `data/words.json`
- edit `data/approved-words.json`
- regenerate the derived files
- only change the other files if the new word proves it needs them

That will cover most normal word additions safely.
