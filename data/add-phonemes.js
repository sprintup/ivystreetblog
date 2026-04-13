const fs = require('fs');
const path = require('path');

const ARPA_TO_IPA = {
  AA: 'ɑ',
  AE: 'æ',
  AH: 'ʌ',
  AO: 'ɔ',
  AW: 'aʊ',
  AY: 'aɪ',
  B: 'b',
  CH: 'tʃ',
  D: 'd',
  DH: 'ð',
  EH: 'ɛ',
  ER: 'ɝ',
  EY: 'eɪ',
  F: 'f',
  G: 'ɡ',
  HH: 'h',
  IH: 'ɪ',
  IY: 'i',
  JH: 'dʒ',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  NG: 'ŋ',
  OW: 'oʊ',
  OY: 'ɔɪ',
  P: 'p',
  R: 'r',
  S: 's',
  SH: 'ʃ',
  T: 't',
  TH: 'θ',
  UH: 'ʊ',
  UW: 'u',
  V: 'v',
  W: 'w',
  Y: 'j',
  Z: 'z',
  ZH: 'ʒ',
};

function normalizeArpa(arpa) {
  return typeof arpa === 'string' ? arpa.replace(/[0-9]/g, '') : '';
}

function arpaToIpa(arpaArray) {
  return arpaArray.map(symbol => {
    const cleanSymbol = normalizeArpa(symbol);
    return ARPA_TO_IPA[cleanSymbol] || '?';
  });
}

function normalizeWord(word) {
  return String(word || '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim();
}

const ABSTRACT_WORD_PATTERN =
  /(tion|sion|ness|ment|ity|ance|ence|ship|ism|tude|ure|dom|hood|graphy|ology|ics)$/;
const ABSTRACT_DEFINITION_PATTERN =
  /^(in|on|at|into|from|with|between|behind|below|above|over|under|before|after|during|what|when|where|why|how|more|less|being|putting|making|showing|using)\b/i;
const ABSTRACT_HEAD_NOUN_PATTERN =
  /^(a|an|the)\s+(group|way|kind|type|process|idea|act|amount|system|study|quality|state|condition|set|collection|plan|reason|rule|word|language)\b/i;
const CONCRETE_DEFINITION_PATTERN =
  /^(a|an|the|your|this|that|something|someone)\b/i;

function looksPluralWord(word) {
  return /s$/.test(word) && !/(ss|us|is)$/.test(word);
}

function buildDrawPrompt(word, definition = '') {
  const normalizedWord = normalizeWord(word);
  const normalizedDefinition = String(definition || '').trim().toLowerCase();

  if (!normalizedWord) {
    return 'Draw something that reminds you of this word.';
  }

  if (/^to\s/i.test(normalizedDefinition)) {
    return `Draw a picture of someone trying to ${normalizedWord}.`;
  }

  if (
    normalizedWord.includes(' ') ||
    ABSTRACT_WORD_PATTERN.test(normalizedWord) ||
    ABSTRACT_DEFINITION_PATTERN.test(normalizedDefinition) ||
    ABSTRACT_HEAD_NOUN_PATTERN.test(normalizedDefinition)
  ) {
    return `Draw something that reminds you of ${normalizedWord}.`;
  }

  if (looksPluralWord(normalizedWord) && CONCRETE_DEFINITION_PATTERN.test(normalizedDefinition)) {
    return `Draw some ${normalizedWord}.`;
  }

  if (!CONCRETE_DEFINITION_PATTERN.test(normalizedDefinition)) {
    return `Draw something that reminds you of ${normalizedWord}.`;
  }

  const article = /^[aeiou]/i.test(normalizedWord) ? 'an' : 'a';
  return `Draw ${article} ${normalizedWord}.`;
}

function lookup(dict, key) {
  if (!dict) {
    return null;
  }

  if (typeof dict === 'object' && !dict.get) {
    return dict[key];
  }

  if (typeof dict.get === 'function') {
    return dict.get(key);
  }

  return null;
}

function getPhonemes(word, dict) {
  const parts = normalizeWord(word).split(/\s+/).filter(Boolean);
  const arpabet = [];
  const ipa = [];

  for (const part of parts) {
    const entry = lookup(dict, part);

    if (!entry) {
      arpabet.push('?');
      ipa.push('?');
      continue;
    }

    const arpaArray =
      Array.isArray(entry) ? entry : typeof entry === 'string' ? entry.split(' ') : null;

    if (!arpaArray) {
      arpabet.push('?');
      ipa.push('?');
      continue;
    }

    arpabet.push(...arpaArray);
    ipa.push(...arpaToIpa(arpaArray));
  }

  return { arpabet, ipa };
}

(async () => {
  const cmuModule = await import('cmu-pronouncing-dictionary');
  const dict = cmuModule.default || cmuModule;
  const words = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'words.json'), 'utf-8')
  );

  const updatedWords = words.map(item => {
    const { arpabet, ipa } = getPhonemes(item.word, dict);

    return {
      ...item,
      drawPrompt: buildDrawPrompt(item.word, item.definition),
      arpabet,
      ipa,
    };
  });

  fs.writeFileSync(
    path.join(__dirname, 'output.js'),
    `module.exports = ${JSON.stringify(updatedWords, null, 2)};\n`
  );

  console.log('Phonemes added successfully.');
})();
