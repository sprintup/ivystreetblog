const fs = require("fs");

// load your phoneme-enriched dataset
const data = JSON.parse(fs.readFileSync("output.json", "utf-8"));

const arpabetMap = {};
const ipaMap = {};

for (const item of data) {
  const word = item.word;

  // --- ARPAbet ---
  if (Array.isArray(item.arpabet)) {
    for (const phoneme of item.arpabet) {
      if (phoneme === "?") continue;

      if (!arpabetMap[phoneme]) {
        arpabetMap[phoneme] = [];
      }

      // avoid duplicates
      if (!arpabetMap[phoneme].includes(word)) {
        arpabetMap[phoneme].push(word);
      }
    }
  }

  // --- IPA ---
  if (Array.isArray(item.ipa)) {
    for (const phoneme of item.ipa) {
      if (phoneme === "?") continue;

      if (!ipaMap[phoneme]) {
        ipaMap[phoneme] = [];
      }

      if (!ipaMap[phoneme].includes(word)) {
        ipaMap[phoneme].push(word);
      }
    }
  }
}

// optional: sort for consistency
for (const key in arpabetMap) {
  arpabetMap[key].sort();
}

for (const key in ipaMap) {
  ipaMap[key].sort();
}

// write output
fs.writeFileSync(
  "phoneme-map.json",
  JSON.stringify(
    {
      arpabet: arpabetMap,
      ipa: ipaMap
    },
    null,
    2
  )
);

console.log("✅ Phoneme map created");