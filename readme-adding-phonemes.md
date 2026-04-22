# Adding A Phoneme

This guide explains how to add a phoneme to Word Garden, which files are the source of truth, which files are generated, and what has to line up before a phoneme becomes a real teaching target in the app.

The short version is:

1. Decide whether you want the phoneme to be raw pronunciation data only, or a real selectable Word Garden target
2. Add the phoneme to `data/approved-phonemes.json`
3. Add its developmental timing to `data/consonant-acquisition.js`
4. Add its IPA label and letter/grapheme mapping in `utils/wordGardenData.js`
5. Add or verify approved words that actually contain the phoneme
6. Regenerate derived files only if the word data changed
7. Verify Sound Table, Word Cloud, and Level 3 focus/highlighting

## 1. What Counts As A “Phoneme” In This App

Word Garden has two different phoneme layers:

- raw pronunciation data
- approved teaching targets

The raw pronunciation data comes from the CMU pronunciation pipeline and ends up in files like:

- `data/output.js`
- `data/phoneme-map.js`

That raw layer can contain many more sounds than the UI actually teaches.

The teaching layer is narrower. A phoneme only becomes a real Word Garden target when all of these line up:

- it is approved in `data/approved-phonemes.json`
- it has a developmental window in `data/consonant-acquisition.js`
- it has an IPA display mapping in `utils/wordGardenData.js`
- it is connected to at least one letter or grapheme in `utils/wordGardenData.js`
- there are approved words that contain it

Important: the internal phoneme IDs are ARPAbet-style slugs such as `SH`, `JH`, `ER`, not IPA. IPA is what the user sees.

Examples:

- `SH` displays as `/ʃ/`
- `JH` displays as `/dʒ/`
- `ER` displays as `/ɝ/`

Composite targets also exist for letter behaviors that combine multiple sounds:

- `K__S` displays as `/k/ + /s/`
- `G__Z` displays as `/ɡ/ + /z/`

## 2. Source Of Truth vs Generated Files

## Edit directly

These are the files you intentionally edit when adding a supported phoneme:

- `data/approved-phonemes.json`
- `data/consonant-acquisition.js`
- `utils/wordGardenData.js`
- sometimes `data/words.json`
- sometimes `data/approved-words.json`

## Generated from scripts

These are derived and should usually be regenerated instead of hand-edited:

- `data/output.js`
- `data/phoneme-map.js`
- `data/first-letter-map.js`

Scripts involved:

- `data/add-phonemes.js`
- `data/build-phoneme-map.js`
- `data/build-first-letter-map.js`

Rule of thumb:

- if you are only turning on a phoneme that already exists in the raw word data, you may not need to regenerate anything
- if you add new words so the phoneme has usable examples, regenerate the derived files

## 3. Primary Approval File: `data/approved-phonemes.json`

This file defines which phoneme slugs are allowed to become approved teaching sounds.

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

- the app normalizes some legacy aliases when reading this file
- `H` is normalized to `HH`
- `YR` is normalized to `R`
- for new entries, prefer the normalized ARPAbet symbol used elsewhere in the code when possible

### Example

If you were approving `ZH`, the file would become:

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
    "ER",
    "ZH"
  ]
}
```

Adding it here alone is not enough to make it appear in the UI.

## 4. Add Developmental Timing In `data/consonant-acquisition.js`

This file controls when a phoneme becomes:

- active
- inherited
- labeled with a timing range in the UI

Current structure:

```js
const consonantMilestones = [
  {
    month: 42,
    adds: ['CH', 'SH', 'Z'],
    ends: [],
  },
  {
    month: 48,
    adds: ['JH', 'V'],
    ends: ['F', 'Y'],
  },
];
```

What the fields mean:

- `adds`: the phoneme becomes unlocked starting at that month
- `ends`: the phoneme stops being “active” at that month and becomes “inherited”

Important: `ends` does not lock the phoneme again. It becomes inherited, not unavailable.

### Example

If a new phoneme should start at 48 months and end at 84 months, you would add it to both places:

```js
{
  month: 48,
  adds: ['JH', 'V', 'ZH'],
  ends: ['F', 'Y'],
},
{
  month: 84,
  adds: [],
  ends: ['CH', 'SH', 'JH', 'TH', 'ZH'],
},
```

## 5. Add The IPA Display Mapping In `utils/wordGardenData.js`

The UI uses `IPA_BY_ARPABET` to display phoneme labels.

Current shape:

```js
const IPA_BY_ARPABET = {
  SH: 'ʃ',
  JH: 'dʒ',
  ER: 'ɝ',
};
```

If your phoneme is not already in that map, add it.

Example:

```js
const IPA_BY_ARPABET = {
  SH: 'ʃ',
  JH: 'dʒ',
  ER: 'ɝ',
  ZH: 'ʒ',
};
```

If you skip this, the target label may fall back to the raw slug instead of good IPA.

## 6. Connect The Phoneme To Letters Or Graphemes

A phoneme can exist in the approved set and still never appear in the UI if it is not connected to a letter or grapheme.

The main place to wire this up is:

- `LETTER_GROUPS` in `utils/wordGardenData.js`

Example:

```js
const LETTER_GROUPS = [
  {
    letter: 'S',
    phonemes: [
      { ipa: 's', phonemeSlug: 'S', exampleWord: 'sun' },
      { ipa: 'z', phonemeSlug: 'Z', exampleWord: 'rose' },
      { ipa: 'ʃ', phonemeSlug: 'SH', exampleWord: 'sugar' },
    ],
  },
];
```

This powers:

- Sound Table phoneme rows
- letter word cloud related phoneme pills
- phoneme word cloud related letter pills
- Level 3 focus pills
- focus-pane phoneme links
- several letter/phoneme prompt variations

### Example

If you wanted `ZH` to be associated with `Z`, you would add a row like:

```js
{
  letter: 'Z',
  phonemes: [
    { ipa: 'z', phonemeSlug: 'Z', exampleWord: 'zoo' },
    { ipa: 'ʒ', phonemeSlug: 'ZH', exampleWord: 'measure' },
  ],
},
```

Use a real child-appropriate example word that exists in the approved lexicon. Do not use a made-up example.

## 7. Optional: Add Grapheme Support For Highlighting

Some phoneme-to-letter matches are not simple one-letter matches. For those, you may also need:

- `MANUAL_PHONEME_SLUGS_BY_GRAPHEME` in `utils/wordGardenData.js`

Current examples:

```js
const MANUAL_PHONEME_SLUGS_BY_GRAPHEME = new Map(
  Object.entries({
    c: ['SH'],
    ch: ['CH', 'SH'],
    sh: ['SH'],
    th: ['TH', 'DH'],
    ear: ['ER'],
    ph: ['F'],
    ng: ['NG'],
    ck: ['K'],
    qu: ['K'],
    wh: ['W'],
    tch: ['CH'],
  }).map(([grapheme, phonemeSlugs]) => [grapheme, new Set(phonemeSlugs)])
);
```

Update this when the sound should highlight through:

- digraphs
- trigraphs
- multi-letter spellings
- irregular spellings not discoverable from the single-letter map

If you skip this step, the phoneme may exist and be clickable, but the highlighted part of the word can still be wrong or missing.

## 8. Make Sure The App Has Real Words For The Phoneme

Even after approval and mapping, the phoneme still needs actual words.

Check these source files:

- `data/words.json`
- `data/approved-words.json`

If there are not enough approved words containing the phoneme:

- the phoneme row may show no words
- the word cloud may be sparse or empty
- example words may be weak

If you add or edit words to support the phoneme, regenerate the derived files:

```powershell
node data/add-phonemes.js
node data/build-phoneme-map.js
node data/build-first-letter-map.js
```

## 9. What You Do Not Usually Need To Edit

You may notice `LETTER_SOUND_ROWS` near the top of `utils/wordGardenData.js`.

At the moment, the live Level 1 rows are built from `LETTER_GROUPS`, not `LETTER_SOUND_ROWS`. So if you are updating the real UI behavior, `LETTER_GROUPS` is the important structure.

You also do not usually hand-edit:

- `data/phoneme-map.js`
- `data/output.js`
- `data/first-letter-map.js`

Those should be regenerated if the underlying word data changed.

## 10. Recommended Algorithm

Use this checklist when adding a new supported phoneme:

1. Decide whether the phoneme should be a real Word Garden target, not just raw pronunciation data.
2. Choose the normalized ARPAbet slug for the phoneme.
3. Add the slug to `data/approved-phonemes.json`.
4. Add a developmental `adds` month in `data/consonant-acquisition.js`.
5. Optionally add an `ends` month if the phoneme should later become inherited.
6. Add or verify the IPA label in `IPA_BY_ARPABET` in `utils/wordGardenData.js`.
7. Add the phoneme to one or more `LETTER_GROUPS` entries with a real example word.
8. If the spelling is not a simple one-letter match, update `MANUAL_PHONEME_SLUGS_BY_GRAPHEME`.
9. Make sure the approved word list has real words for this phoneme.
10. If word data changed, regenerate:
    `node data/add-phonemes.js`
11. Then regenerate:
    `node data/build-phoneme-map.js`
12. Then regenerate:
    `node data/build-first-letter-map.js`
13. Verify Sound Table, Word Cloud, Level 3 focus, highlighting, and timing labels.

## 11. Verification Checklist

After the change, verify all of these:

- the phoneme appears in the Sound Table only if it is supposed to be a real teaching target
- the phoneme label shows the correct IPA
- the phoneme unlocks at the expected month
- after its `endMonth`, it becomes inherited rather than locked
- the letter word cloud shows the phoneme pill in the top section
- the phoneme word cloud shows the related letter pills in the top section
- the Level 3 focus pills include the phoneme when appropriate
- the synthetic approach shows the phoneme correctly
- the highlighted letter/grapheme is correct in the word cloud
- the example words are real approved words, not invented placeholders

## 12. Common Problems

### The phoneme exists in `phoneme-map.js` but never appears in the UI

Check:

- `data/approved-phonemes.json`
- `LETTER_GROUPS` in `utils/wordGardenData.js`

Raw data alone is not enough.

### The phoneme is always gray / advanced

Check:

- `data/consonant-acquisition.js`
- symbol normalization mismatch such as `H` vs `HH`

### The phoneme label looks wrong

Check:

- `IPA_BY_ARPABET`

### The phoneme opens a list, but the word highlight is wrong or empty

Check:

- `MANUAL_PHONEME_SLUGS_BY_GRAPHEME`
- whether the actual `arpabet` sequence in `data/output.js` matches what you expect

### A composite phoneme never unlocks

Composite slugs such as `K__S` only unlock when every required component is available.

## 13. Minimal Example

If the repo already had enough approved words for `ZH`, the smallest useful change would be:

### `data/approved-phonemes.json`

```json
{
  "approvedPhonemes": ["P", "M", "H", "N", "W", "B", "K", "G", "D", "T", "NG", "F", "YR", "L", "S", "CH", "SH", "Z", "JH", "V", "TH", "DH", "ER", "ZH"]
}
```

### `data/consonant-acquisition.js`

```js
{
  month: 48,
  adds: ['JH', 'V', 'ZH'],
  ends: ['F', 'Y'],
}
```

### `utils/wordGardenData.js`

```js
const IPA_BY_ARPABET = {
  ZH: 'ʒ',
};

{
  letter: 'Z',
  phonemes: [
    { ipa: 'z', phonemeSlug: 'Z', exampleWord: 'zoo' },
    { ipa: 'ʒ', phonemeSlug: 'ZH', exampleWord: 'measure' },
  ],
}
```

Then verify there are real approved words containing `ZH`, and test the UI.

## 14. Rule Of Thumb

If you are unsure which files to touch:

- add the phoneme to `data/approved-phonemes.json`
- add its timing to `data/consonant-acquisition.js`
- add its IPA and letter/grapheme mapping in `utils/wordGardenData.js`
- only regenerate the derived files if the word inventory changed

That covers most normal phoneme additions safely.
