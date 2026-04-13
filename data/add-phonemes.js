const fs = require("fs");

// --- ARPAbet → IPA mapping ---
const ARPA_TO_IPA = {
  AA: "ɑ", AE: "æ", AH: "ʌ", AO: "ɔ", AW: "aʊ", AY: "aɪ",
  B: "b", CH: "tʃ", D: "d", DH: "ð", EH: "ɛ", ER: "ɝ",
  EY: "eɪ", F: "f", G: "ɡ", HH: "h", IH: "ɪ", IY: "i",
  JH: "dʒ", K: "k", L: "l", M: "m", N: "n", NG: "ŋ",
  OW: "oʊ", OY: "ɔɪ", P: "p", R: "r", S: "s", SH: "ʃ",
  T: "t", TH: "θ", UH: "ʊ", UW: "u", V: "v", W: "w",
  Y: "j", Z: "z", ZH: "ʒ"
};

function normalizeArpa(arpa) {
  return typeof arpa === "string" ? arpa.replace(/[0-9]/g, "") : "";
}

function arpaToIpa(arpaArray) {
  return arpaArray.map(p => {
    const clean = normalizeArpa(p);
    return ARPA_TO_IPA[clean] || "?";
  });
}

function normalizeWord(word) {
  return word
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim();
}

// 🔥 Universal lookup (handles object or map)
function lookup(dict, key) {
  if (!dict) return null;

  // case 1: plain object
  if (typeof dict === "object" && !dict.get) {
    return dict[key];
  }

  // case 2: Map
  if (typeof dict.get === "function") {
    return dict.get(key);
  }

  return null;
}

function getPhonemes(word, dict) {
  const parts = normalizeWord(word).split(/\s+/);

  let arpabet = [];
  let ipa = [];

  for (const part of parts) {
    const entry = lookup(dict, part);

    if (!entry) {
      arpabet.push("?");
      ipa.push("?");
      continue;
    }

    let arpaArray;

    if (Array.isArray(entry)) {
      arpaArray = entry;
    } else if (typeof entry === "string") {
      arpaArray = entry.split(" ");
    } else {
      arpabet.push("?");
      ipa.push("?");
      continue;
    }

    arpabet.push(...arpaArray);
    ipa.push(...arpaToIpa(arpaArray));
  }

  return { arpabet, ipa };
}

// --- MAIN ---
(async () => {
  const cmuModule = await import("cmu-pronouncing-dictionary");

  // 🔥 This handles ALL export shapes
  const dict = cmuModule.default || cmuModule;

  console.log("Dict type:", typeof dict); // debug once

  const data = JSON.parse(fs.readFileSync("./words.json", "utf-8"));

  const updated = data.map(item => {
    const { arpabet, ipa } = getPhonemes(item.word, dict);

    return {
      ...item,
      arpabet,
      ipa
    };
  });

  fs.writeFileSync("./output.json", JSON.stringify(updated, null, 2));

  console.log("✅ Phonemes added successfully.");
})();