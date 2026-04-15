const wordEntries = require('../data/output.js');
const firstLetterMap = require('../data/first-letter-map.js');
const phonemeMap = require('../data/phoneme-map.js');
const { approvedWords } = require('../data/approved-words.json');
const { approvedPhonemes } = require('../data/approved-phonemes.json');
const {
  getAvailableConsonants,
  getConsonantWindow,
} = require('../data/consonant-acquisition.js');

const IPA_BY_ARPABET = {
  P: 'p',
  M: 'm',
  HH: 'h',
  N: 'n',
  W: 'w',
  B: 'b',
  K: 'k',
  G: 'ɡ',
  D: 'd',
  T: 't',
  NG: 'ŋ',
  F: 'f',
  Y: 'j',
  R: 'ɹ',
  L: 'l',
  S: 's',
  CH: 'tʃ',
  JH: 'dʒ',
  Z: 'z',
  V: 'v',
  TH: 'θ',
  DH: 'ð',
  SH: 'ʃ',
  ZH: 'ʒ',
  ER: 'ɝ',
};

const COMMON_GLOSSARY = {
  a: 'A is a helper word we use when talking about one thing.',
  an: 'An is a helper word we use before some words that start with a vowel sound.',
  and: 'And is a word that joins ideas together.',
  at: 'At tells where something is.',
  by: 'By can mean near or how something is done.',
  for: 'For tells who or what something is meant to help.',
  from: 'From tells where something starts.',
  in: 'In tells that something is inside something else.',
  into: 'Into means going in.',
  is: 'Is is a helping word that tells about something right now.',
  like: 'Like can mean similar to, or that you enjoy something.',
  of: 'Of is a helper word that connects things together.',
  on: 'On tells that something is touching the top of something else.',
  or: 'Or gives another choice.',
  than: 'Than is a comparing word.',
  that: 'That points to a thing or idea.',
  the: 'The is a helper word we use when everyone knows which thing we mean.',
  their: 'Their tells that something belongs to them.',
  them: 'Them means more than one person or thing.',
  to: 'To can show where someone is going or what they are doing.',
  use: 'Use means to do something with a tool or idea.',
  used: 'Used means something was done with it before.',
  very: 'Very means a lot or extra much.',
  what: 'What is a question word.',
  when: 'When asks about time.',
  where: 'Where asks about place.',
  with: 'With means together or using something.',
};

const LETTER_SOUND_ROWS = [
  { letter: 'A', ipa: '', exampleWord: 'apple', phonemeSlug: null, requiredArpabet: [], isSelectable: false },
  { letter: 'B', ipa: 'b', exampleWord: 'bat', phonemeSlug: 'B', requiredArpabet: ['B'], isSelectable: true },
  { letter: 'C', ipa: 'k', exampleWord: 'cat', phonemeSlug: 'K', requiredArpabet: ['K'], isSelectable: true },
  { letter: '', ipa: 's', exampleWord: 'city', phonemeSlug: 'S', requiredArpabet: ['S'], isSelectable: true },
  { letter: 'D', ipa: 'd', exampleWord: 'dog', phonemeSlug: 'D', requiredArpabet: ['D'], isSelectable: true },
  { letter: 'E', ipa: '', exampleWord: 'elephant', phonemeSlug: null, requiredArpabet: [], isSelectable: false },
  { letter: 'F', ipa: 'f', exampleWord: 'fish', phonemeSlug: 'F', requiredArpabet: ['F'], isSelectable: true },
  { letter: 'G', ipa: 'ɡ', exampleWord: 'go', phonemeSlug: 'G', requiredArpabet: ['G'], isSelectable: true },
  { letter: '', ipa: 'dʒ', exampleWord: 'gem', phonemeSlug: 'JH', requiredArpabet: ['JH'], isSelectable: true },
  { letter: 'H', ipa: 'h', exampleWord: 'hat', phonemeSlug: 'HH', requiredArpabet: ['HH'], isSelectable: true },
  { letter: 'I', ipa: '', exampleWord: 'igloo', phonemeSlug: null, requiredArpabet: [], isSelectable: false },
  { letter: 'J', ipa: 'dʒ', exampleWord: 'jump', phonemeSlug: 'JH', requiredArpabet: ['JH'], isSelectable: true },
  { letter: 'K', ipa: 'k', exampleWord: 'kite', phonemeSlug: 'K', requiredArpabet: ['K'], isSelectable: true },
  { letter: 'L', ipa: 'l', exampleWord: 'lamp', phonemeSlug: 'L', requiredArpabet: ['L'], isSelectable: true },
  { letter: 'M', ipa: 'm', exampleWord: 'man', phonemeSlug: 'M', requiredArpabet: ['M'], isSelectable: true },
  { letter: 'N', ipa: 'n', exampleWord: 'net', phonemeSlug: 'N', requiredArpabet: ['N'], isSelectable: true },
  { letter: 'O', ipa: '', exampleWord: 'octopus', phonemeSlug: null, requiredArpabet: [], isSelectable: false },
  { letter: 'P', ipa: 'p', exampleWord: 'pan', phonemeSlug: 'P', requiredArpabet: ['P'], isSelectable: true },
  { letter: 'Q', ipa: 'k', exampleWord: 'quit', phonemeSlug: 'K', requiredArpabet: ['K'], isSelectable: true },
  { letter: 'R', ipa: 'ɹ', exampleWord: 'red', phonemeSlug: 'R', requiredArpabet: ['R'], isSelectable: true },
  { letter: 'S', ipa: 's', exampleWord: 'sun', phonemeSlug: 'S', requiredArpabet: ['S'], isSelectable: true },
  { letter: '', ipa: 'z', exampleWord: 'rose', phonemeSlug: 'Z', requiredArpabet: ['Z'], isSelectable: true },
  { letter: '', ipa: 'ʃ', exampleWord: 'sugar', phonemeSlug: 'SH', requiredArpabet: ['SH'], isSelectable: true },
  { letter: 'T', ipa: 't', exampleWord: 'top', phonemeSlug: 'T', requiredArpabet: ['T'], isSelectable: true },
  { letter: '', ipa: 'ʃ', exampleWord: 'nation', phonemeSlug: 'SH', requiredArpabet: ['SH'], isSelectable: true },
  { letter: '', ipa: 'tʃ', exampleWord: 'nature', phonemeSlug: 'CH', requiredArpabet: ['CH'], isSelectable: true },
  { letter: '', ipa: 'ɾ', exampleWord: 'butter', phonemeSlug: null, requiredArpabet: [], isSelectable: false, note: 'Reference row only' },
  { letter: 'U', ipa: '', exampleWord: 'umbrella', phonemeSlug: null, requiredArpabet: [], isSelectable: false },
  { letter: 'V', ipa: 'v', exampleWord: 'van', phonemeSlug: 'V', requiredArpabet: ['V'], isSelectable: true },
  { letter: 'W', ipa: 'w', exampleWord: 'wet', phonemeSlug: 'W', requiredArpabet: ['W'], isSelectable: true },
  { letter: 'X', ipa: 'ks', exampleWord: 'box', phonemeSlug: 'K__S', requiredArpabet: ['K', 'S'], isSelectable: true },
  { letter: '', ipa: 'ɡz', exampleWord: 'exam', phonemeSlug: 'G__Z', requiredArpabet: ['G', 'Z'], isSelectable: true },
  { letter: '', ipa: 'z', exampleWord: 'xylophone', phonemeSlug: 'Z', requiredArpabet: ['Z'], isSelectable: true },
  { letter: 'Y', ipa: 'j', exampleWord: 'yes', phonemeSlug: 'Y', requiredArpabet: ['Y'], isSelectable: true },
  { letter: 'Z', ipa: 'z', exampleWord: 'zoo', phonemeSlug: 'Z', requiredArpabet: ['Z'], isSelectable: true },
  { letter: '', ipa: 'ʒ', exampleWord: 'seizure', phonemeSlug: 'ZH', requiredArpabet: ['ZH'], isSelectable: true },
];

const STARTER_WORD_ENTRIES = [
  ['pan', 'A pan is something you can cook food in.', ['P', 'AE1', 'N'], ['p', 'æ', 'n']],
  ['pig', 'A pig is a farm animal with a round nose.', ['P', 'IH1', 'G'], ['p', 'ɪ', 'ɡ']],
  ['pop', 'Pop means a quick little burst or sound.', ['P', 'AA1', 'P'], ['p', 'ɑ', 'p']],
  ['man', 'A man is a grown-up boy or father.', ['M', 'AE1', 'N'], ['m', 'æ', 'n']],
  ['map', 'A map is a picture that shows where places are.', ['M', 'AE1', 'P'], ['m', 'æ', 'p']],
  ['moon', 'The moon is the bright round object in the night sky.', ['M', 'UW1', 'N'], ['m', 'u', 'n']],
  ['hat', 'A hat is something you wear on your head.', ['HH', 'AE1', 'T'], ['h', 'æ', 't']],
  ['hop', 'Hop means to jump on one or two feet.', ['HH', 'AA1', 'P'], ['h', 'ɑ', 'p']],
  ['home', 'Home is the place where you live.', ['HH', 'OW1', 'M'], ['h', 'oʊ', 'm']],
  ['net', 'A net is a woven thing that catches or holds something.', ['N', 'EH1', 'T'], ['n', 'ɛ', 't']],
  ['nose', 'Your nose helps you smell and breathe.', ['N', 'OW1', 'Z'], ['n', 'oʊ', 'z']],
  ['nap', 'A nap is a short sleep during the day.', ['N', 'AE1', 'P'], ['n', 'æ', 'p']],
  ['wet', 'Wet means covered with water.', ['W', 'EH1', 'T'], ['w', 'ɛ', 't']],
  ['web', 'A web is a sticky net made by a spider.', ['W', 'EH1', 'B'], ['w', 'ɛ', 'b']],
  ['wig', 'A wig is fake hair that you can wear on your head.', ['W', 'IH1', 'G'], ['w', 'ɪ', 'ɡ']],
  ['bat', 'A bat can be a flying animal or something used to hit a ball.', ['B', 'AE1', 'T'], ['b', 'æ', 't']],
  ['bed', 'A bed is where you sleep.', ['B', 'EH1', 'D'], ['b', 'ɛ', 'd']],
  ['bug', 'A bug is a tiny insect.', ['B', 'AH1', 'G'], ['b', 'ʌ', 'ɡ']],
  ['cat', 'A cat is a furry pet that meows.', ['K', 'AE1', 'T'], ['k', 'æ', 't']],
  ['kite', 'A kite is a toy that flies in the wind.', ['K', 'AY1', 'T'], ['k', 'aɪ', 't']],
  ['cup', 'A cup is something you drink from.', ['K', 'AH1', 'P'], ['k', 'ʌ', 'p']],
  ['go', 'Go means to move from one place to another.', ['G', 'OW1'], ['ɡ', 'oʊ']],
  ['gum', 'Gum can be a chewy candy or the pink part around your teeth.', ['G', 'AH1', 'M'], ['ɡ', 'ʌ', 'm']],
  ['gate', 'A gate is a door in a fence.', ['G', 'EY1', 'T'], ['ɡ', 'eɪ', 't']],
  ['dog', 'A dog is a pet that barks.', ['D', 'AO1', 'G'], ['d', 'ɔ', 'ɡ']],
  ['duck', 'A duck is a bird that likes water.', ['D', 'AH1', 'K'], ['d', 'ʌ', 'k']],
  ['dig', 'Dig means to scoop or move dirt.', ['D', 'IH1', 'G'], ['d', 'ɪ', 'ɡ']],
  ['top', 'The top is the highest part of something.', ['T', 'AA1', 'P'], ['t', 'ɑ', 'p']],
  ['tub', 'A tub is a large basin that can hold water.', ['T', 'AH1', 'B'], ['t', 'ʌ', 'b']],
  ['ten', 'Ten is the number after nine.', ['T', 'EH1', 'N'], ['t', 'ɛ', 'n']],
  ['ring', 'A ring is a round band you can wear or a bell sound.', ['R', 'IH1', 'NG'], ['r', 'ɪ', 'ŋ']],
  ['sing', 'Sing means to make music with your voice.', ['S', 'IH1', 'NG'], ['s', 'ɪ', 'ŋ']],
  ['wing', 'A wing helps a bird or bug fly.', ['W', 'IH1', 'NG'], ['w', 'ɪ', 'ŋ']],
  ['fish', 'A fish is an animal that lives in water.', ['F', 'IH1', 'SH'], ['f', 'ɪ', 'ʃ']],
  ['fan', 'A fan moves air to help keep you cool.', ['F', 'AE1', 'N'], ['f', 'æ', 'n']],
  ['fun', 'Fun means something is playful and enjoyable.', ['F', 'AH1', 'N'], ['f', 'ʌ', 'n']],
  ['yes', 'Yes means you agree or want to say okay.', ['Y', 'EH1', 'S'], ['j', 'ɛ', 's']],
  ['yam', 'A yam is a starchy vegetable.', ['Y', 'AE1', 'M'], ['j', 'æ', 'm']],
  ['yarn', 'Yarn is soft string used for knitting or crafts.', ['Y', 'AA1', 'R', 'N'], ['j', 'ɑ', 'r', 'n']],
  ['red', 'Red is a bright color.', ['R', 'EH1', 'D'], ['ɹ', 'ɛ', 'd']],
  ['rug', 'A rug is a soft covering on the floor.', ['R', 'AH1', 'G'], ['ɹ', 'ʌ', 'ɡ']],
  ['rain', 'Rain is water that falls from clouds.', ['R', 'EY1', 'N'], ['ɹ', 'eɪ', 'n']],
  ['lamp', 'A lamp is a light you can turn on.', ['L', 'AE1', 'M', 'P'], ['l', 'æ', 'm', 'p']],
  ['leaf', 'A leaf grows on a plant or tree.', ['L', 'IY1', 'F'], ['l', 'i', 'f']],
  ['log', 'A log is a big piece of a tree trunk.', ['L', 'AO1', 'G'], ['l', 'ɔ', 'ɡ']],
  ['sun', 'The sun is the bright star that warms Earth.', ['S', 'AH1', 'N'], ['s', 'ʌ', 'n']],
  ['sock', 'A sock is something you wear on your foot.', ['S', 'AA1', 'K'], ['s', 'ɑ', 'k']],
  ['soup', 'Soup is food you can eat with a spoon.', ['S', 'UW1', 'P'], ['s', 'u', 'p']],
  ['chair', 'A chair is something you sit on.', ['CH', 'EH1', 'R'], ['tʃ', 'ɛ', 'ɹ']],
  ['chip', 'A chip can be a crunchy snack or a tiny broken piece.', ['CH', 'IH1', 'P'], ['tʃ', 'ɪ', 'p']],
  ['chin', 'Your chin is the part under your mouth.', ['CH', 'IH1', 'N'], ['tʃ', 'ɪ', 'n']],
  ['jump', 'Jump means to push off the ground with your feet.', ['JH', 'AH1', 'M', 'P'], ['dʒ', 'ʌ', 'm', 'p']],
  ['jam', 'Jam is sweet fruit spread you can eat on bread.', ['JH', 'AE1', 'M'], ['dʒ', 'æ', 'm']],
  ['jeep', 'A jeep is a strong car for rough roads.', ['JH', 'IY1', 'P'], ['dʒ', 'i', 'p']],
  ['zoo', 'A zoo is a place where people can see animals.', ['Z', 'UW1'], ['z', 'u']],
  ['zip', 'Zip means to close a zipper or move quickly.', ['Z', 'IH1', 'P'], ['z', 'ɪ', 'p']],
  ['zebra', 'A zebra is an animal with black and white stripes.', ['Z', 'IY1', 'B', 'R', 'AH0'], ['z', 'i', 'b', 'r', 'ʌ']],
  ['van', 'A van is a larger car used to carry people or things.', ['V', 'AE1', 'N'], ['v', 'æ', 'n']],
  ['vet', 'A vet is a doctor who helps animals.', ['V', 'EH1', 'T'], ['v', 'ɛ', 't']],
  ['vase', 'A vase is something that holds flowers.', ['V', 'EY1', 'S'], ['v', 'eɪ', 's']],
  ['thumb', 'Your thumb is the short thick finger on your hand.', ['TH', 'AH1', 'M'], ['θ', 'ʌ', 'm']],
  ['thin', 'Thin means not thick or wide.', ['TH', 'IH1', 'N'], ['θ', 'ɪ', 'n']],
  ['bath', 'A bath is washing in water.', ['B', 'AE1', 'TH'], ['b', 'æ', 'θ']],
  ['this', 'This points to something close to you.', ['DH', 'IH1', 'S'], ['ð', 'ɪ', 's']],
  ['that', 'That points to something farther away.', ['DH', 'AE1', 'T'], ['ð', 'æ', 't']],
  ['then', 'Then means after that.', ['DH', 'EH1', 'N'], ['ð', 'ɛ', 'n']],
  ['ship', 'A ship is a very large boat.', ['SH', 'IH1', 'P'], ['ʃ', 'ɪ', 'p']],
  ['shop', 'A shop is a place where people buy things.', ['SH', 'AA1', 'P'], ['ʃ', 'ɑ', 'p']],
  ['shell', 'A shell is the hard outside of some sea animals.', ['SH', 'EH1', 'L'], ['ʃ', 'ɛ', 'l']],
  ['measure', 'To measure is to find how big, long, or heavy something is.', ['M', 'EH1', 'ZH', 'ER0'], ['m', 'ɛ', 'ʒ', 'ɝ']],
  ['treasure', 'Treasure is something special that feels valuable.', ['T', 'R', 'EH1', 'ZH', 'ER0'], ['t', 'r', 'ɛ', 'ʒ', 'ɝ']],
  ['box', 'A box is a container with sides and a lid or top.', ['B', 'AA1', 'K', 'S'], ['b', 'ɑ', 'k', 's']],
  ['xylophone', 'A xylophone is a musical instrument you tap with sticks.', ['Z', 'AY1', 'L', 'AH0', 'F', 'OW2', 'N'], ['z', 'aɪ', 'l', 'ʌ', 'f', 'oʊ', 'n']],
  ['exam', 'An exam is a test that checks what you know.', ['IH0', 'G', 'Z', 'AE1', 'M'], ['ɪ', 'ɡ', 'z', 'æ', 'm']],
];

const DIGRAPHS = [
  'tch',
  'igh',
  'air',
  'ear',
  'ch',
  'sh',
  'th',
  'ph',
  'ng',
  'qu',
  'ck',
  'wh',
  'ee',
  'oo',
  'oa',
  'ai',
  'ay',
  'ie',
  'oa',
];

const LETTER_GROUPS = [
  { letter: 'A', phonemes: [] },
  { letter: 'B', phonemes: [{ ipa: 'b', phonemeSlug: 'B', exampleWord: 'bat' }] },
  {
    letter: 'C',
    phonemes: [
      { ipa: 'k', phonemeSlug: 'K', exampleWord: 'cat' },
      { ipa: 's', phonemeSlug: 'S', exampleWord: 'city' },
    ],
  },
  { letter: 'D', phonemes: [{ ipa: 'd', phonemeSlug: 'D', exampleWord: 'dog' }] },
  { letter: 'E', phonemes: [] },
  { letter: 'F', phonemes: [{ ipa: 'f', phonemeSlug: 'F', exampleWord: 'fish' }] },
  {
    letter: 'G',
    phonemes: [
      { ipa: 'ɡ', phonemeSlug: 'G', exampleWord: 'go' },
      { ipa: 'dʒ', phonemeSlug: 'JH', exampleWord: 'gem' },
    ],
  },
  { letter: 'H', phonemes: [{ ipa: 'h', phonemeSlug: 'HH', exampleWord: 'hat' }] },
  { letter: 'I', phonemes: [] },
  { letter: 'J', phonemes: [{ ipa: 'dʒ', phonemeSlug: 'JH', exampleWord: 'jump' }] },
  { letter: 'K', phonemes: [{ ipa: 'k', phonemeSlug: 'K', exampleWord: 'kite' }] },
  { letter: 'L', phonemes: [{ ipa: 'l', phonemeSlug: 'L', exampleWord: 'lamp' }] },
  { letter: 'M', phonemes: [{ ipa: 'm', phonemeSlug: 'M', exampleWord: 'man' }] },
  { letter: 'N', phonemes: [{ ipa: 'n', phonemeSlug: 'N', exampleWord: 'net' }] },
  { letter: 'O', phonemes: [] },
  { letter: 'P', phonemes: [{ ipa: 'p', phonemeSlug: 'P', exampleWord: 'pan' }] },
  { letter: 'Q', phonemes: [{ ipa: 'k', phonemeSlug: 'K', exampleWord: 'question' }] },
  { letter: 'R', phonemes: [{ ipa: 'ɹ', phonemeSlug: 'R', exampleWord: 'red' }] },
  {
    letter: 'S',
    phonemes: [
      { ipa: 's', phonemeSlug: 'S', exampleWord: 'sun' },
      { ipa: 'z', phonemeSlug: 'Z', exampleWord: 'rose' },
      { ipa: 'ʃ', phonemeSlug: 'SH', exampleWord: 'sugar' },
    ],
  },
  {
    letter: 'T',
    phonemes: [
      { ipa: 't', phonemeSlug: 'T', exampleWord: 'top' },
      { ipa: 'ʃ', phonemeSlug: 'SH', exampleWord: 'nation' },
      { ipa: 'tʃ', phonemeSlug: 'CH', exampleWord: 'nature' },
    ],
  },
  { letter: 'U', phonemes: [] },
  { letter: 'V', phonemes: [{ ipa: 'v', phonemeSlug: 'V', exampleWord: 'van' }] },
  { letter: 'W', phonemes: [{ ipa: 'w', phonemeSlug: 'W', exampleWord: 'wet' }] },
  {
    letter: 'X',
    phonemes: [
      { ipa: 'ks', phonemeSlug: 'K__S', exampleWord: 'box' },
      { ipa: 'ɡz', phonemeSlug: 'G__Z', exampleWord: 'exam' },
      { ipa: 'z', phonemeSlug: 'Z', exampleWord: 'xylophone' },
    ],
  },
  { letter: 'Y', phonemes: [{ ipa: 'j', phonemeSlug: 'Y', exampleWord: 'yes' }] },
  {
    letter: 'Z',
    phonemes: [
      { ipa: 'z', phonemeSlug: 'Z', exampleWord: 'zoo' },
      { ipa: 'ʒ', phonemeSlug: 'ZH', exampleWord: 'seizure' },
    ],
  },
];

const LETTER_EXAMPLE_FALLBACKS = {
  A: 'above',
  B: 'ballot',
  C: 'calendar',
  D: 'data',
  E: 'earth',
  F: 'flag',
  G: 'graph',
  H: 'heart',
  I: 'index',
  J: 'justice',
  K: 'kite',
  L: 'light',
  M: 'map',
  N: 'number',
  O: 'ocean',
  P: 'plant',
  Q: 'question',
  R: 'reason',
  S: 'sound',
  T: 'title',
  U: 'United States of America',
  V: 'vegetable',
  W: 'weather',
  X: 'xylophone',
  Y: 'year',
  Z: 'zoo',
};

const LETTER_DIFFICULTY_BY_LETTER = {
  A: { level: 'Hard', pattern: 'Non' },
  B: { level: 'Easiest', pattern: 'CV' },
  C: { level: 'Hard', pattern: 'Non' },
  D: { level: 'Easiest', pattern: 'CV' },
  E: { level: 'Hard', pattern: 'Non' },
  F: { level: 'Medium', pattern: 'VC' },
  G: { level: 'Hard', pattern: 'Non' },
  H: { level: 'Hard', pattern: 'Non' },
  I: { level: 'Hard', pattern: 'Non' },
  J: { level: 'Easiest', pattern: 'CV' },
  K: { level: 'Easiest', pattern: 'CV' },
  L: { level: 'Medium', pattern: 'VC' },
  M: { level: 'Medium', pattern: 'VC' },
  N: { level: 'Medium', pattern: 'VC' },
  O: { level: 'Hard', pattern: 'Non' },
  P: { level: 'Easiest', pattern: 'CV' },
  Q: { level: 'Hard', pattern: 'Non' },
  R: { level: 'Medium', pattern: 'VC' },
  S: { level: 'Medium', pattern: 'VC' },
  T: { level: 'Easiest', pattern: 'CV' },
  U: { level: 'Hard', pattern: 'Non' },
  V: { level: 'Easiest', pattern: 'CV' },
  W: { level: 'Hard', pattern: 'Non' },
  X: { level: 'Hard', pattern: 'Non' },
  Y: { level: 'Hard', pattern: 'Non' },
  Z: { level: 'Easiest', pattern: 'CV' },
};

const SELECTABLE_PHONEME_SLUGS = new Set(
  LETTER_GROUPS.flatMap(group =>
    group.phonemes
      .map(phoneme => phoneme.phonemeSlug)
      .filter(Boolean)
  )
);
const LETTER_GROUP_BY_LETTER = new Map(
  LETTER_GROUPS.map(group => [group.letter, group])
);
const MANUAL_PHONEME_SLUGS_BY_GRAPHEME = new Map(
  Object.entries({
    ch: ['CH'],
    sh: ['SH'],
    th: ['TH', 'DH'],
    ph: ['F'],
    ng: ['NG'],
    ck: ['K'],
    qu: ['K'],
    wh: ['W'],
    tch: ['CH'],
  }).map(([grapheme, phonemeSlugs]) => [grapheme, new Set(phonemeSlugs)])
);
const VOWEL_GRAPHEME_PATTERN = /^[aeiouy]+$/;

const VOWEL_ARPABET = new Set([
  'AA',
  'AE',
  'AH',
  'AO',
  'AW',
  'AY',
  'EH',
  'ER',
  'EY',
  'IH',
  'IY',
  'OW',
  'OY',
  'UH',
  'UW',
]);

function normalizeArpabetSymbol(symbol) {
  return String(symbol || '')
    .toUpperCase()
    .replace(/\d/g, '')
    .trim();
}

function normalizeWord(word) {
  return String(word || '').trim().toLowerCase();
}

function normalizeApprovedPhonemeSymbol(symbol) {
  const normalized = normalizeArpabetSymbol(symbol);

  if (normalized === 'H') {
    return 'HH';
  }

  if (normalized === 'YR') {
    return 'R';
  }

  return normalized;
}

function graphemeSupportsPhoneme(grapheme, arpabetSymbol) {
  const normalizedGrapheme = normalizeWord(grapheme).replace(/[^a-z]/g, '');
  const normalizedSymbol = normalizeArpabetSymbol(arpabetSymbol);

  if (!normalizedGrapheme || !normalizedSymbol) {
    return false;
  }

  const manualPhonemes = MANUAL_PHONEME_SLUGS_BY_GRAPHEME.get(normalizedGrapheme);
  if (manualPhonemes?.has(normalizedSymbol)) {
    return true;
  }

  if (VOWEL_ARPABET.has(normalizedSymbol)) {
    return VOWEL_GRAPHEME_PATTERN.test(normalizedGrapheme);
  }

  if (normalizedGrapheme.length !== 1) {
    return false;
  }

  const letterGroup = LETTER_GROUP_BY_LETTER.get(normalizedGrapheme.toUpperCase());
  return letterGroup
    ? letterGroup.phonemes.some(phoneme => phoneme.phonemeSlug === normalizedSymbol)
    : false;
}

const APPROVED_WORD_SET = new Set(
  (approvedWords || []).map(word => normalizeWord(word)).filter(Boolean)
);
const APPROVED_SYNTHETIC_PHONEME_SET = new Set(
  (approvedPhonemes || [])
    .map(symbol => normalizeApprovedPhonemeSymbol(symbol))
    .filter(Boolean)
);

function alignPhonemesToGraphemes(graphemes = [], arpabet = []) {
  const memo = new Map();

  function solve(graphemeIndex, phonemeIndex) {
    const key = `${graphemeIndex}:${phonemeIndex}`;

    if (memo.has(key)) {
      return memo.get(key);
    }

    if (graphemeIndex >= graphemes.length) {
      const result = {
        score: -(arpabet.length - phonemeIndex),
        mapping: [],
      };
      memo.set(key, result);
      return result;
    }

    const skipGraphemeResult = solve(graphemeIndex + 1, phonemeIndex);
    let bestResult = {
      score: skipGraphemeResult.score,
      mapping: [null, ...skipGraphemeResult.mapping],
    };

    if (phonemeIndex < arpabet.length) {
      const normalizedPhoneme = normalizeArpabetSymbol(arpabet[phonemeIndex]);

      if (graphemeSupportsPhoneme(graphemes[graphemeIndex], normalizedPhoneme)) {
        const matchResult = solve(graphemeIndex + 1, phonemeIndex + 1);
        const matchCandidate = {
          score: matchResult.score + 3,
          mapping: [phonemeIndex, ...matchResult.mapping],
        };

        if (matchCandidate.score > bestResult.score) {
          bestResult = matchCandidate;
        }
      }

      const skipPhonemeResult = solve(graphemeIndex, phonemeIndex + 1);
      const skipPhonemeCandidate = {
        score: skipPhonemeResult.score - 1,
        mapping: skipPhonemeResult.mapping,
      };

      if (skipPhonemeCandidate.score > bestResult.score) {
        bestResult = skipPhonemeCandidate;
      }
    }

    memo.set(key, bestResult);
    return bestResult;
  }

  return solve(0, 0).mapping;
}

function countSyllables(arpabet = []) {
  const stressedSyllableCount = arpabet.filter(symbol =>
    /\d/.test(String(symbol))
  ).length;

  if (stressedSyllableCount > 0) {
    return stressedSyllableCount;
  }

  const vowelCount = arpabet
    .map(normalizeArpabetSymbol)
    .filter(symbol => VOWEL_ARPABET.has(symbol)).length;

  return Math.max(1, vowelCount);
}

function toIpaSequence(arpabet = [], ipa = []) {
  return arpabet.map((symbol, index) => {
    const normalizedSymbol = normalizeArpabetSymbol(symbol);
    return (
      IPA_BY_ARPABET[normalizedSymbol] ||
      ipa[index] ||
      normalizedSymbol.toLowerCase()
    );
  });
}

const ABSTRACT_WORD_PATTERN =
  /(tion|sion|ness|ment|ity|ance|ence|ship|ism|tude|ure|dom|hood|graphy|ology|ics)$/;
const ABSTRACT_DEFINITION_PATTERN =
  /^(in|on|at|into|from|with|between|behind|below|above|over|under|before|after|during|what|when|where|why|how|more|less|being|putting|making|showing|using)\b/i;
const ABSTRACT_HEAD_NOUN_PATTERN =
  /^(a|an|the)\s+(group|way|kind|type|process|idea|act|amount|system|study|quality|state|condition|set|collection|plan|reason|rule|word|language|direction|duty|job|difference|meaning|time|number|information|data)\b/i;
const CONCRETE_DEFINITION_PATTERN =
  /^(a|an|the|your|this|that|something|someone)\b/i;

function looksPluralWord(word) {
  return /s$/.test(word) && !/(ss|us|is)$/.test(word);
}

function getWordConcreteness(word, definition = '') {
  const normalizedWord = normalizeWord(word);
  const normalizedDefinition = String(definition || '').trim().toLowerCase();

  if (!normalizedWord) {
    return 'abstract';
  }

  if (/^to\s/i.test(normalizedDefinition)) {
    return 'concrete';
  }

  if (
    normalizedWord.includes(' ') ||
    normalizedWord.includes('-') ||
    ABSTRACT_WORD_PATTERN.test(normalizedWord) ||
    ABSTRACT_DEFINITION_PATTERN.test(normalizedDefinition) ||
    ABSTRACT_HEAD_NOUN_PATTERN.test(normalizedDefinition)
  ) {
    return 'abstract';
  }

  if (
    CONCRETE_DEFINITION_PATTERN.test(normalizedDefinition) ||
    /means\s+(to|someone|something)\b/i.test(normalizedDefinition)
  ) {
    return 'concrete';
  }

  return 'concrete';
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
    normalizedWord.includes('-') ||
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

function getInitialLetter(word) {
  const match = String(word || '').match(/[A-Za-z]/);
  return match ? match[0] : '';
}

function buildWordEntry({
  word,
  definition,
  category = 'Appendix B lexicon',
  arpabet = [],
  ipa = [],
  drawPrompt,
  concreteness,
  source = 'dataset',
}) {
  const normalizedWord = normalizeWord(word);
  const normalizedArpabet = arpabet.map(normalizeArpabetSymbol).filter(Boolean);
  const normalizedIpa = toIpaSequence(arpabet, ipa);
  const initialLetter = getInitialLetter(word);
  const soundMapRows = buildEntrySoundMapRows({
    word,
    normalizedArpabet,
    normalizedIpa,
  });

  return {
    word,
    normalizedWord,
    definition,
    category,
    concreteness: concreteness || getWordConcreteness(word, definition),
    drawPrompt: drawPrompt || buildDrawPrompt(word, definition),
    source,
    arpabet,
    ipa: normalizedIpa,
    normalizedArpabet,
    normalizedIpa,
    initialLetter,
    soundMapRows,
    syllableCount: countSyllables(arpabet),
    letterCount: normalizedWord.replace(/[^a-z]/g, '').length,
    wordCount: normalizedWord ? normalizedWord.split(/\s+/).length : 0,
  };
}

function buildStarterEntry([word, definition, arpabet, ipa]) {
  return buildWordEntry({
    word,
    definition,
    arpabet,
    ipa,
    source: 'starter',
  });
}

const starterEntries = STARTER_WORD_ENTRIES.map(buildStarterEntry);
const datasetEntries = wordEntries.map(entry =>
  buildWordEntry({
    ...entry,
    source: 'dataset',
  })
);
const approvedStarterEntries = starterEntries.filter(entry =>
  APPROVED_WORD_SET.has(entry.normalizedWord)
);
const approvedDatasetEntries = datasetEntries.filter(entry =>
  APPROVED_WORD_SET.has(entry.normalizedWord)
);

const WORD_ENTRY_BY_WORD = new Map();

approvedStarterEntries.forEach(entry => {
  WORD_ENTRY_BY_WORD.set(entry.normalizedWord, entry);
});

approvedDatasetEntries.forEach(entry => {
  WORD_ENTRY_BY_WORD.set(entry.normalizedWord, entry);
});

const COMBINED_WORD_ENTRIES = Array.from(WORD_ENTRY_BY_WORD.values());

function calculateAgeInMonths(birthYearMonth) {
  if (!/^\d{4}-\d{2}$/.test(birthYearMonth || '')) {
    return null;
  }

  const [yearString, monthString] = birthYearMonth.split('-');
  const birthYear = Number(yearString);
  const birthMonth = Number(monthString);

  if (!birthYear || !birthMonth || birthMonth < 1 || birthMonth > 12) {
    return null;
  }

  const now = new Date();
  const nowYear = now.getUTCFullYear();
  const nowMonth = now.getUTCMonth() + 1;

  return (nowYear - birthYear) * 12 + (nowMonth - birthMonth);
}

function validateBirthYearMonth(birthYearMonth) {
  const ageInMonths = calculateAgeInMonths(birthYearMonth);

  if (ageInMonths === null) {
    return 'Birth month must be in YYYY-MM format.';
  }

  if (ageInMonths < 24 || ageInMonths > 96) {
    return 'Children must be between 24 and 96 months old.';
  }

  return null;
}

function containsPhonemeSequence(arpabetSequence, requiredSequence) {
  if (!requiredSequence.length) {
    return false;
  }

  for (let index = 0; index <= arpabetSequence.length - requiredSequence.length; index += 1) {
    const matches = requiredSequence.every(
      (requiredSymbol, offset) => arpabetSequence[index + offset] === requiredSymbol
    );

    if (matches) {
      return true;
    }
  }

  return false;
}

function getPracticeMap(practicedWords = []) {
  return new Map(
    practicedWords.map(practicedWord => [normalizeWord(practicedWord.word), practicedWord])
  );
}

function withPracticeData(entry, practicedWordMap) {
  const practicedWord = practicedWordMap.get(entry.normalizedWord);

  return {
    ...entry,
    practiceCount: practicedWord?.practiceCount || 0,
    completedChecklistCount: practicedWord?.completedChecklistCount || 0,
  };
}

function getSuggestedWordCount(entries = []) {
  return entries.filter(
    entry => (entry.completedChecklistCount || 0) === 0
  ).length;
}

function getWordAvailabilitySummary(entries = []) {
  const concreteAvailableWords = entries
    .filter(
      entry =>
        entry.concreteness === 'concrete' &&
        (entry.completedChecklistCount || 0) === 0
    )
    .map(entry => entry.word);
  const abstractAvailableWords = entries
    .filter(
      entry =>
        entry.concreteness === 'abstract' &&
        (entry.completedChecklistCount || 0) === 0
    )
    .map(entry => entry.word);
  const completedWords = entries
    .filter(entry => (entry.completedChecklistCount || 0) > 0)
    .map(entry => entry.word);

  return {
    concreteAvailableCount: concreteAvailableWords.length,
    abstractAvailableCount: abstractAvailableWords.length,
    completedWordCount: completedWords.length,
    concreteRecommendableWords: concreteAvailableWords,
    abstractRecommendableWords: abstractAvailableWords,
    recommendableWords: [...concreteAvailableWords, ...abstractAvailableWords],
  };
}

function getLetterDifficultyLabel(letter) {
  const difficulty = LETTER_DIFFICULTY_BY_LETTER[letter];

  if (!difficulty) {
    return 'Hard (Non)';
  }

  const patternLabel =
    /^[AEIOU]$/.test(letter) && difficulty.pattern === 'Non'
      ? 'Vowel'
      : difficulty.pattern;

  const difficultyLabel =
    difficulty.level === 'Easiest' ? 'Easy' : difficulty.level;

  return `${difficultyLabel} (${patternLabel})`;
}

function getPhonemeTimingLabel(phonemeSlug) {
  const { startMonth, endMonth } = getPhonemeTimingForSlug(phonemeSlug);

  if (startMonth && endMonth) {
    return `${startMonth}-${endMonth} months`;
  }

  if (startMonth) {
    return `${startMonth} months and later`;
  }

  return 'Timing unavailable';
}

function getLetterDifficultyRank(letter) {
  const difficulty = LETTER_DIFFICULTY_BY_LETTER[letter];

  if (!difficulty) {
    return 3;
  }

  if (difficulty.level === 'Easiest') {
    return 1;
  }

  if (difficulty.level === 'Medium') {
    return 2;
  }

  return 3;
}

function isVowelLetter(letter) {
  return /^[AEIOU]$/.test(String(letter || '').toUpperCase());
}

function getDifficultyPowerBonus(difficultyRank) {
  if (difficultyRank === 2) {
    return 1;
  }

  if (difficultyRank >= 3) {
    return 2;
  }

  return 0;
}

function getPhonemeTimingForSlug(phonemeSlug) {
  const requiredSymbols = String(phonemeSlug || '')
    .split('__')
    .filter(Boolean);
  const windows = requiredSymbols.map(symbol => getConsonantWindow(symbol));
  const startMonth = windows
    .map(window => window.startMonth)
    .filter(Boolean)
    .reduce(
      (latestStart, value) => (latestStart === null ? value : Math.max(latestStart, value)),
      null
    );
  const endingMonths = windows.map(window => window.endMonth).filter(Boolean);
  const endMonth =
    endingMonths.length > 0
      ? endingMonths.reduce(
          (earliestEnd, value) => (earliestEnd === null ? value : Math.min(earliestEnd, value)),
          null
        )
      : null;

  return {
    startMonth,
    endMonth,
  };
}

function getBasePowerScore(row) {
  let score = 0;
  const availableWordCount =
    (row.concreteAvailableCount || 0) + (row.abstractAvailableCount || 0);

  score += getDifficultyPowerBonus(row.difficultyRank);
  score += row.rowType === 'phoneme' ? 2 : 1;

  if (availableWordCount <= 5) {
    score -= 1;
  }

  if (isVowelLetter(row.parentLetter || row.letter)) {
    score += 1;
  }

  if ((row.releaseEndMonth || 0) % 10 === 6) {
    score += 2;
  }

  return score;
}

function compareWordEntries(leftEntry, rightEntry) {
  const leftPracticeCount = leftEntry.practiceCount || 0;
  const rightPracticeCount = rightEntry.practiceCount || 0;

  if (leftPracticeCount !== rightPracticeCount) {
    return leftPracticeCount - rightPracticeCount;
  }

  if (leftEntry.source !== rightEntry.source) {
    return leftEntry.source === 'starter' ? -1 : 1;
  }

  if (leftEntry.wordCount !== rightEntry.wordCount) {
    return leftEntry.wordCount - rightEntry.wordCount;
  }

  if (leftEntry.letterCount !== rightEntry.letterCount) {
    return leftEntry.letterCount - rightEntry.letterCount;
  }

  return leftEntry.word.localeCompare(rightEntry.word);
}

function getWordEntriesFromWordList(words, practicedWords = []) {
  const practicedWordMap = getPracticeMap(practicedWords);
  const dedupedWords = Array.from(
    new Set(words.map(word => normalizeWord(word)).filter(Boolean))
  );

  return dedupedWords
    .map(word => WORD_ENTRY_BY_WORD.get(word))
    .filter(Boolean)
    .map(entry => withPracticeData(entry, practicedWordMap))
    .sort(compareWordEntries);
}

function getStarterWordsForLetter(letter) {
  return starterEntries
    .filter(entry => entry.word.charAt(0).toUpperCase() === letter)
    .map(entry => entry.word);
}

function getStarterWordsForPhoneme(requiredArpabet) {
  return starterEntries
    .filter(entry =>
      containsPhonemeSequence(entry.normalizedArpabet, requiredArpabet)
    )
    .map(entry => entry.word);
}

function getWordsForLetter(letter, practicedWords = []) {
  return getWordEntriesFromWordList(
    [...getStarterWordsForLetter(letter), ...(firstLetterMap[letter] || [])],
    practicedWords
  );
}

function getAllWords(practicedWords = []) {
  return getWordEntriesFromWordList(
    COMBINED_WORD_ENTRIES.map(entry => entry.word),
    practicedWords
  );
}

function getWordsForPhonemeSlug(phonemeSlug, _monthsOrPracticedWords, practicedWords) {
  const actualPracticedWords = Array.isArray(_monthsOrPracticedWords)
    ? _monthsOrPracticedWords
    : practicedWords || [];
  const requiredArpabet = phonemeSlug ? phonemeSlug.split('__') : [];
  const phonemeWords =
    requiredArpabet.length === 1
      ? phonemeMap.arpabet[requiredArpabet[0]] || []
      : COMBINED_WORD_ENTRIES.filter(entry =>
          containsPhonemeSequence(entry.normalizedArpabet, requiredArpabet)
        ).map(entry => entry.word);

  return getWordEntriesFromWordList(
    [...getStarterWordsForPhoneme(requiredArpabet), ...phonemeWords],
    actualPracticedWords
  );
}

function shuffleWords(words) {
  return [...words]
    .map(word => ({ word, sort: Math.random() }))
    .sort((leftItem, rightItem) => leftItem.sort - rightItem.sort)
    .map(item => item.word);
}

function formatPhoneme(ipa) {
  return ipa ? `/${ipa}/` : '';
}

function getLetterExampleWord(letter, practicedWords = []) {
  return (
    getWordsForLetter(letter, practicedWords)[0]?.word ||
    LETTER_EXAMPLE_FALLBACKS[letter] ||
    letter
  );
}

function buildLevelOneRows(months, practicedWords = []) {
  const { arpabet, inherited } = getAvailableConsonants(months);
  const availableArpabet = new Set(arpabet);
  const inheritedArpabet = new Set(inherited);

  const rows = LETTER_GROUPS.flatMap(group => {
    const letterWords = getWordsForLetter(group.letter, practicedWords);
    const letterSuggestedWordCount = getSuggestedWordCount(letterWords);
    const letterAvailability = getWordAvailabilitySummary(letterWords);
    const letterDifficultyRank = getLetterDifficultyRank(group.letter);
    const letterRow = {
      rowKey: `letter-${group.letter}`,
      rowType: 'letter',
      selectionType: 'letter',
      selectionSlug: group.letter,
      parentLetter: group.letter,
      letter: group.letter,
      displayTarget: group.letter,
      targetSortValue: group.letter,
      displayPhoneme: getLetterDifficultyLabel(group.letter),
      expressiveText: getLetterDifficultyLabel(group.letter),
      difficultyLabel: getLetterDifficultyLabel(group.letter),
      difficultyRank: letterDifficultyRank,
      exampleWord: getLetterExampleWord(group.letter, practicedWords),
      isEnabled: letterWords.length > 0,
      isInherited: false,
      isLocked: false,
      hasWords: letterWords.length > 0,
      isSelectable: letterWords.length > 0,
      wordCount: letterWords.length,
      suggestedWordCount: letterSuggestedWordCount,
      concreteAvailableCount: letterAvailability.concreteAvailableCount,
      abstractAvailableCount: letterAvailability.abstractAvailableCount,
      completedWordCount: letterAvailability.completedWordCount,
      concreteRecommendableWords: letterAvailability.concreteRecommendableWords,
      abstractRecommendableWords: letterAvailability.abstractRecommendableWords,
      recommendableWords: letterAvailability.recommendableWords,
      releaseEndMonth: null,
      statusText: letterWords.length
        ? letterSuggestedWordCount > 0
          ? 'Unlocked'
          : 'Done'
        : 'No words',
    };

    const phonemeRows = group.phonemes.map(phonemeRow => {
      const matchingWords = getWordsForPhonemeSlug(
        phonemeRow.phonemeSlug,
        practicedWords
      );
      const suggestedWordCount = getSuggestedWordCount(matchingWords);
      const wordAvailability = getWordAvailabilitySummary(matchingWords);
      const isEnabled = phonemeRow.phonemeSlug
        .split('__')
        .every(requiredSymbol => availableArpabet.has(requiredSymbol));
      const isInherited = phonemeRow.phonemeSlug
        .split('__')
        .every(requiredSymbol => inheritedArpabet.has(requiredSymbol));
      const phonemeTiming = getPhonemeTimingForSlug(phonemeRow.phonemeSlug);
      const expressiveText = isEnabled
        ? matchingWords.length > 0
          ? suggestedWordCount > 0
            ? 'Ready'
            : 'Practiced'
          : 'No words'
        : matchingWords.length > 0
          ? 'Advanced for age'
          : 'No words';
      const statusText = isEnabled
        ? matchingWords.length > 0
          ? suggestedWordCount > 0
            ? 'Unlocked'
            : 'Done'
          : 'No words'
        : 'Locked';

      return {
        rowKey: `phoneme-${group.letter}-${phonemeRow.phonemeSlug}`,
        rowType: 'phoneme',
        selectionType: 'phoneme',
        selectionSlug: phonemeRow.phonemeSlug,
        parentLetter: group.letter,
        letter: group.letter,
        displayTarget: formatPhoneme(phonemeRow.ipa),
        targetSortValue: `${group.letter}-${formatPhoneme(phonemeRow.ipa)}`,
        displayPhoneme: formatPhoneme(phonemeRow.ipa),
        expressiveText,
        difficultyLabel: getLetterDifficultyLabel(group.letter),
        difficultyRank: getLetterDifficultyRank(group.letter),
        exampleWord: phonemeRow.exampleWord,
        isEnabled,
        isInherited,
        isLocked: !isEnabled,
        hasWords: matchingWords.length > 0,
        isSelectable: matchingWords.length > 0,
        wordCount: matchingWords.length,
        suggestedWordCount,
        concreteAvailableCount: wordAvailability.concreteAvailableCount,
        abstractAvailableCount: wordAvailability.abstractAvailableCount,
        completedWordCount: wordAvailability.completedWordCount,
        concreteRecommendableWords: wordAvailability.concreteRecommendableWords,
        abstractRecommendableWords: wordAvailability.abstractRecommendableWords,
        recommendableWords: wordAvailability.recommendableWords,
        releaseEndMonth: phonemeTiming.endMonth,
        statusText,
      };
    });

    return [letterRow, ...phonemeRows];
  });

  const candidateRows = rows.filter(row => {
    const availableWordCount =
      (row.concreteAvailableCount || 0) + (row.abstractAvailableCount || 0);

    return row.isSelectable && !row.isLocked && availableWordCount > 0;
  });
  const lowestCompletedCount =
    candidateRows.length > 0
      ? Math.min(...candidateRows.map(row => row.completedWordCount || 0))
      : null;

  return rows.map(row => {
    const availableWordCount =
      (row.concreteAvailableCount || 0) + (row.abstractAvailableCount || 0);
    const inFewestCompletedPool =
      lowestCompletedCount !== null &&
      row.isSelectable &&
      !row.isLocked &&
      availableWordCount > 0 &&
      (row.completedWordCount || 0) === lowestCompletedCount;
    const powerScore =
      getBasePowerScore(row) + (inFewestCompletedPool ? 1 : 0);

    return {
      ...row,
      availableWordCount,
      powerScore,
      recommendationWeight: Math.max(1, powerScore),
    };
  });
}

function normalizeSelectionLetter(value) {
  return String(value || '')
    .trim()
    .charAt(0)
    .toUpperCase();
}

function getLetterScopedPhonemeSlugs(months, practicedWords = [], letter = '') {
  const normalizedLetter = normalizeSelectionLetter(letter);

  if (!normalizedLetter) {
    return [];
  }

  return buildLevelOneRows(months, practicedWords)
    .filter(
      row =>
        row.rowType === 'phoneme' &&
        row.parentLetter === normalizedLetter &&
        row.selectionSlug
    )
    .map(row => row.selectionSlug);
}

function getValidSoundTableLetterForPhoneme(
  phonemeSlug,
  requestedLetter,
  months,
  practicedWords = []
) {
  const normalizedLetter = normalizeSelectionLetter(requestedLetter);

  if (!phonemeSlug || !normalizedLetter) {
    return '';
  }

  return getLetterScopedPhonemeSlugs(
    months,
    practicedWords,
    normalizedLetter
  ).includes(phonemeSlug)
    ? normalizedLetter
    : '';
}

function getTargetLabel(phonemeSlug) {
  if (!phonemeSlug) {
    return 'Sound';
  }

  return phonemeSlug
    .split('__')
    .map(symbol => formatPhoneme(IPA_BY_ARPABET[symbol] || symbol.toLowerCase()))
    .join(' + ');
}

function getLetterLabel(letter) {
  return `${letter} words`;
}

function getSelectionLabel(selectionType, selectionSlug) {
  if (selectionType === 'all') {
    return 'All words';
  }

  return selectionType === 'letter'
    ? getLetterLabel(selectionSlug)
    : getTargetLabel(selectionSlug);
}

function slugifyTerm(term) {
  return encodeURIComponent(normalizeWord(term));
}

function unslugifyTerm(term) {
  return decodeURIComponent(term || '').trim();
}

function decodeWordParam(wordParam) {
  return decodeURIComponent(wordParam || '').trim();
}

function getWordEntry(word) {
  return WORD_ENTRY_BY_WORD.get(normalizeWord(word)) || null;
}

function getDictionaryLookupUrl(term) {
  return `https://www.merriam-webster.com/dictionary/${encodeURIComponent(term)}`;
}

function getDefinitionTokens(definition, currentWord = '') {
  const tokenPattern = /([A-Za-z'-]+|\s+|[^A-Za-z'\s-]+)/g;
  const tokens = definition.match(tokenPattern) || [];

  return tokens.map(token => {
    const normalizedToken = normalizeWord(token.replace(/[^a-z'-]/g, ''));

    return {
      text: token,
      glossaryTerm: normalizedToken || null,
      dictionaryUrl: normalizedToken
        ? getDictionaryLookupUrl(normalizedToken)
        : null,
      isLinkable: Boolean(normalizedToken),
    };
  });
}

function pluralizeWord(word) {
  if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
    return `${word.slice(0, -1)}ies`;
  }

  if (/(s|x|z|ch|sh)$/.test(word)) {
    return `${word}es`;
  }

  return `${word}s`;
}

function endsWithShortVowelConsonant(word) {
  return (
    word.length >= 3 &&
    /[aeiou][bcdfghjklmnpqrstvz]$/.test(word) &&
    !/[wxy]$/.test(word) &&
    !/[aeiou][aeiou][bcdfghjklmnpqrstvz]$/.test(word)
  );
}

function toIngWord(word) {
  if (word.endsWith('ie')) {
    return `${word.slice(0, -2)}ying`;
  }

  if (word.endsWith('e') && !word.endsWith('ee')) {
    return `${word.slice(0, -1)}ing`;
  }

  if (endsWithShortVowelConsonant(word)) {
    return `${word}${word.slice(-1)}ing`;
  }

  return `${word}ing`;
}

function toPastTenseWord(word) {
  if (word.endsWith('e')) {
    return `${word}d`;
  }

  if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
    return `${word.slice(0, -1)}ied`;
  }

  if (endsWithShortVowelConsonant(word)) {
    return `${word}${word.slice(-1)}ed`;
  }

  return `${word}ed`;
}

function buildMorphologyExamples(entry) {
  const normalized = normalizeWord(entry?.word);

  if (!normalized || normalized.includes(' ')) {
    return [];
  }

  const variants = [
    {
      form: pluralizeWord(normalized),
      sentence: `Look for more than one: "${pluralizeWord(normalized)}".`,
    },
    {
      form: toIngWord(normalized),
      sentence: `Try the action form if it makes sense: "${toIngWord(normalized)}".`,
    },
    {
      form: toPastTenseWord(normalized),
      sentence: `Talk about something that already happened: "${toPastTenseWord(normalized)}".`,
    },
  ];

  const seenForms = new Set([normalized]);
  return variants.filter(variant => {
    if (seenForms.has(variant.form)) {
      return false;
    }

    seenForms.add(variant.form);
    return true;
  });
}

function splitIntoGraphemes(word) {
  const normalized = normalizeWord(word).replace(/[^a-z]/g, '');
  const graphemes = [];
  let index = 0;

  while (index < normalized.length) {
    const remainingWord = normalized.slice(index);
    const matchedDigraph = DIGRAPHS.find(digraph => remainingWord.startsWith(digraph));

    if (matchedDigraph) {
      graphemes.push(matchedDigraph);
      index += matchedDigraph.length;
      continue;
    }

    graphemes.push(normalized[index]);
    index += 1;
  }

  return graphemes;
}

function splitWordIntoDisplayGraphemes(word, graphemes = []) {
  const rawWord = String(word || '');
  const displayGraphemes = [];
  let rawIndex = 0;

  graphemes.forEach(grapheme => {
    const segmentStart = rawIndex;
    let lettersRemaining = grapheme.length;

    while (rawIndex < rawWord.length && lettersRemaining > 0) {
      if (/[A-Za-z]/.test(rawWord[rawIndex])) {
        lettersRemaining -= 1;
      }
      rawIndex += 1;
    }

    while (rawIndex < rawWord.length && /[^A-Za-z]/.test(rawWord[rawIndex])) {
      rawIndex += 1;
    }

    displayGraphemes.push(rawWord.slice(segmentStart, rawIndex) || grapheme);
  });

  if (displayGraphemes.length > 0 && rawIndex < rawWord.length) {
    displayGraphemes[displayGraphemes.length - 1] += rawWord.slice(rawIndex);
  }

  return displayGraphemes;
}

function buildEntrySoundMapRows({
  word,
  normalizedArpabet = [],
  normalizedIpa = [],
}) {
  const graphemes = splitIntoGraphemes(word);
  const displayGraphemes = splitWordIntoDisplayGraphemes(word, graphemes);
  const graphemeAlignment = alignPhonemesToGraphemes(graphemes, normalizedArpabet);

  return graphemes.map((grapheme, index) => {
    const alignedPhonemeIndex = graphemeAlignment[index];
    const rawPhonemeSlug =
      alignedPhonemeIndex === null || alignedPhonemeIndex === undefined
        ? null
        : normalizedArpabet[alignedPhonemeIndex];
    const isApprovedPhoneme =
      rawPhonemeSlug && APPROVED_SYNTHETIC_PHONEME_SET.has(rawPhonemeSlug);

    return {
      grapheme,
      displayGrapheme: displayGraphemes[index] || grapheme,
      phonemeLabel:
        isApprovedPhoneme &&
        alignedPhonemeIndex !== null &&
        normalizedIpa[alignedPhonemeIndex]
          ? formatPhoneme(normalizedIpa[alignedPhonemeIndex])
          : null,
      phonemeSlug:
        isApprovedPhoneme &&
        rawPhonemeSlug
          ? rawPhonemeSlug
          : null,
    };
  });
}

function getOnsetAndRime(word) {
  const normalized = normalizeWord(word).replace(/[^a-z]/g, '');
  const vowelMatch = normalized.match(/[aeiouy]+/);

  if (!vowelMatch || vowelMatch.index === undefined) {
    return {
      onset: normalized,
      rime: '',
    };
  }

  return {
    onset: normalized.slice(0, vowelMatch.index),
    rime: normalized.slice(vowelMatch.index),
  };
}

function getArpabetRime(arpabet = []) {
  const normalizedSequence = arpabet.map(normalizeArpabetSymbol).filter(Boolean);
  const firstVowelIndex = normalizedSequence.findIndex(symbol =>
    VOWEL_ARPABET.has(symbol)
  );

  if (firstVowelIndex === -1) {
    return '';
  }

  return normalizedSequence.slice(firstVowelIndex).join('__');
}

function getSimilarRimeWords(entry, practicedWords = []) {
  const practicedWordMap = getPracticeMap(practicedWords);
  const targetOrthographicRime = getOnsetAndRime(entry.word).rime;
  const targetPhonemeRime = getArpabetRime(entry.normalizedArpabet);

  return COMBINED_WORD_ENTRIES
    .filter(candidate => candidate.normalizedWord !== entry.normalizedWord)
    .map(candidate => {
      const orthographicRime = getOnsetAndRime(candidate.word).rime;
      const phonemeRime = getArpabetRime(candidate.normalizedArpabet);
      const orthographicMatch =
        Boolean(targetOrthographicRime) &&
        orthographicRime === targetOrthographicRime;
      const phonemeMatch =
        Boolean(targetPhonemeRime) && phonemeRime === targetPhonemeRime;

      return {
        ...withPracticeData(candidate, practicedWordMap),
        orthographicMatch,
        phonemeMatch,
      };
    })
    .filter(candidate => candidate.orthographicMatch || candidate.phonemeMatch)
    .sort((leftCandidate, rightCandidate) => {
      if (leftCandidate.orthographicMatch !== rightCandidate.orthographicMatch) {
        return leftCandidate.orthographicMatch ? -1 : 1;
      }

      if (leftCandidate.phonemeMatch !== rightCandidate.phonemeMatch) {
        return leftCandidate.phonemeMatch ? -1 : 1;
      }

      return compareWordEntries(leftCandidate, rightCandidate);
    })
    .slice(0, 8)
    .map(
      ({
        orthographicMatch,
        phonemeMatch,
        ...candidate
      }) => candidate
    );
}

function getPhonemePrompt(word, targetPhonemeLabel, phonemePosition) {
  if (phonemePosition === 0) {
    return `What is the first sound in "${word}"?`;
  }

  if (phonemePosition > 0) {
    return `Can you find ${targetPhonemeLabel} in "${word}"?`;
  }

  return `Can you hear ${targetPhonemeLabel} anywhere in "${word}"?`;
}

function buildChecklist(entry, selectionType, selectionSlug) {
  const targetLabel = getSelectionLabel(selectionType, selectionSlug);
  const phonemePosition = entry.normalizedIpa.findIndex(
    symbol => formatPhoneme(symbol) === targetLabel
  );
  const focusPrompt =
    selectionType === 'all'
      ? `What is the first sound in "${entry.word}"? What other sounds do you hear?`
      : selectionType === 'letter'
        ? `What letter does "${entry.word}" start with? Can you point to the ${selectionSlug} at the beginning?`
        : getPhonemePrompt(entry.word, targetLabel, phonemePosition);

  return [
    `Ask the child what "${entry.word}" means.`,
    `Read the child-friendly definition together.`,
    `Clap or tap the ${entry.syllableCount} syllable${entry.syllableCount === 1 ? '' : 's'}.`,
    `Say each sound in ${entry.word}, then blend the word back together.`,
    focusPrompt,
    `Show "${entry.word}" in lowercase and uppercase, then spell it together.`,
    `Use "${entry.word}" in a short sentence.`,
  ];
}

function getGlossaryTerm(term) {
  const normalizedTerm = normalizeWord(term);
  if (!normalizedTerm) {
    return null;
  }

  const wordEntry = getWordEntry(normalizedTerm);
  if (wordEntry) {
    return {
      term: normalizedTerm,
      definition: wordEntry.definition,
      category: wordEntry.category,
    };
  }

  if (COMMON_GLOSSARY[normalizedTerm]) {
    return {
      term: normalizedTerm,
      definition: COMMON_GLOSSARY[normalizedTerm],
      category: 'helper word',
    };
  }

  return {
    term: normalizedTerm,
    definition: `${normalizedTerm} is a helper word in this definition. Read it again in the full sentence to understand how it is being used.`,
    category: 'helper word',
  };
}

function getWordsForSelection(selectionType, selectionSlug, practicedWords = []) {
  if (selectionType === 'all') {
    return getAllWords(practicedWords);
  }

  return selectionType === 'letter'
    ? getWordsForLetter(selectionSlug, practicedWords)
    : getWordsForPhonemeSlug(selectionSlug, practicedWords);
}

function getWordDetailForSelection(
  selectionType,
  selectionSlug,
  word,
  practicedWords = []
) {
  const availableWords = getWordsForSelection(
    selectionType,
    selectionSlug,
    practicedWords
  );
  const entry = availableWords.find(
    availableWord => availableWord.normalizedWord === normalizeWord(word)
  );

  if (!entry) {
    return null;
  }

  const relatedWords = availableWords
    .filter(relatedEntry => relatedEntry.normalizedWord !== entry.normalizedWord)
    .slice(0, 8);
  const onsetAndRime = getOnsetAndRime(entry.word);
  const focusLabel = getSelectionLabel(selectionType, selectionSlug);
  const soundMapRows = entry.soundMapRows || buildEntrySoundMapRows(entry);
  const graphemes = soundMapRows.map(row => row.grapheme);

  return {
    ...entry,
    displayPhonemes: entry.normalizedIpa.map(formatPhoneme),
    relatedWords,
    similarRimeWords: getSimilarRimeWords(entry, practicedWords),
    morphologyExamples: buildMorphologyExamples(entry),
    graphemes,
    soundMapRows,
    onsetAndRime,
    checklist: buildChecklist(entry, selectionType, selectionSlug),
    definitionTokens: getDefinitionTokens(entry.definition, entry.word),
    targetPhonemeLabel: focusLabel,
    focusLabel,
    lowercaseLetter: entry.initialLetter.toLowerCase(),
    uppercaseLetter: entry.initialLetter.toUpperCase(),
    selectionType,
    selectionSlug,
  };
}

function getWordDetail(phonemeSlug, word, _months, practicedWords = []) {
  return getWordDetailForSelection('phoneme', phonemeSlug, word, practicedWords);
}

function getWordCloudWordsFromEntries(words) {
  return shuffleWords(words).map((wordEntry, index) => ({
    ...wordEntry,
    sizeClass:
      wordEntry.practiceCount > 0
        ? 'text-lg md:text-xl'
        : index % 3 === 0
          ? 'text-3xl md:text-4xl'
          : 'text-2xl md:text-3xl',
  }));
}

function getWordGardenCompletionSummary(practicedWords = []) {
  const completedCount = (practicedWords || []).filter(
    practicedWord =>
      APPROVED_WORD_SET.has(normalizeWord(practicedWord.word)) &&
      (practicedWord.completedChecklistCount || 0) > 0
  ).length;
  const totalCount = APPROVED_WORD_SET.size;

  return {
    completedCount,
    totalCount,
    remainingCount: Math.max(totalCount - completedCount, 0),
  };
}

function getWordCloudWords(phonemeSlug, _months, practicedWords = []) {
  return getWordCloudWordsFromEntries(
    getWordsForPhonemeSlug(phonemeSlug, practicedWords)
  );
}

function getLetterWordCloudWords(letter, practicedWords = []) {
  return getWordCloudWordsFromEntries(getWordsForLetter(letter, practicedWords));
}

function getSelectionWordCloudWords(
  selectionType,
  selectionSlug,
  practicedWords = []
) {
  return getWordCloudWordsFromEntries(
    getWordsForSelection(selectionType, selectionSlug, practicedWords)
  );
}

function getUnlockedWordCloudWords(months, practicedWords = []) {
  const unlockedWords = buildLevelOneRows(months, practicedWords)
    .filter(
      row =>
        row.isSelectable &&
        !row.isLocked &&
        Array.isArray(row.recommendableWords) &&
        row.recommendableWords.length > 0
    )
    .flatMap(row => row.recommendableWords);

  return getWordCloudWordsFromEntries(
    getWordEntriesFromWordList(unlockedWords, practicedWords)
  );
}

function getUnlockedArpabetForMonths(months) {
  return getAvailableConsonants(months).arpabet;
}

module.exports = {
  calculateAgeInMonths,
  validateBirthYearMonth,
  buildLevelOneRows,
  getLetterDifficultyLabel,
  getLetterScopedPhonemeSlugs,
  getPhonemeTimingLabel,
  getValidSoundTableLetterForPhoneme,
  getWordCloudWords,
  getLetterWordCloudWords,
  getSelectionWordCloudWords,
  getUnlockedWordCloudWords,
  getUnlockedArpabetForMonths,
  getWordGardenCompletionSummary,
  getWordsForPhonemeSlug,
  getWordsForLetter,
  getWordDetail,
  getWordDetailForSelection,
  getWordEntry,
  getGlossaryTerm,
  getTargetLabel,
  getLetterLabel,
  getSelectionLabel,
  slugifyTerm,
  unslugifyTerm,
  decodeWordParam,
  LETTER_GROUPS,
  normalizeWord,
};
