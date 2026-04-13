// consonant-acquisition.js

const consonantsByMonth = {
  24: {
    arpabet: ["P","M","HH","N","W"],
    ipa: ["p","m","h","n","w"],
    inherited: []
  },

  30: {
    arpabet: ["P","M","HH","N","W","B","K","G","D","T","NG"],
    ipa: ["p","m","h","n","w","b","k","ɡ","d","t","ŋ"],
    inherited: ["P","M","HH","N","W"]
  },

  36: {
    arpabet: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y"],
    ipa: ["p","m","h","n","w","b","k","ɡ","d","t","ŋ","f","j"],
    inherited: ["P","M","HH","N","W","B","K","G","D","T","NG"]
  },

  42: {
    arpabet: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y","R","L","S"],
    ipa: ["p","m","h","n","w","b","k","ɡ","d","t","ŋ","f","j","r","l","s"],
    inherited: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y"]
  },

  48: {
    arpabet: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y","R","L","S","CH","JH","Z"],
    ipa: ["p","m","h","n","w","b","k","ɡ","d","t","ŋ","f","j","r","l","s","tʃ","dʒ","z"],
    inherited: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y","R","L","S"]
  },

  60: {
    arpabet: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y","R","L","S","CH","JH","Z","V","TH"],
    ipa: ["p","m","h","n","w","b","k","ɡ","d","t","ŋ","f","j","r","l","s","tʃ","dʒ","z","v","θ"],
    inherited: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y","R","L","S","CH","JH","Z"]
  },

  72: {
    arpabet: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y","R","L","S","CH","JH","Z","V","TH","DH"],
    ipa: ["p","m","h","n","w","b","k","ɡ","d","t","ŋ","f","j","r","l","s","tʃ","dʒ","z","v","θ","ð"],
    inherited: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y","R","L","S","CH","JH","Z","V","TH"]
  },

  84: {
    arpabet: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y","R","L","S","CH","JH","Z","V","TH","DH","SH"],
    ipa: ["p","m","h","n","w","b","k","ɡ","d","t","ŋ","f","j","r","l","s","tʃ","dʒ","z","v","θ","ð","ʃ"],
    inherited: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y","R","L","S","CH","JH","Z","V","TH","DH"]
  },

  96: {
    arpabet: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y","R","L","S","CH","JH","Z","V","TH","DH","SH","ZH"],
    ipa: ["p","m","h","n","w","b","k","ɡ","d","t","ŋ","f","j","r","l","s","tʃ","dʒ","z","v","θ","ð","ʃ","ʒ"],
    inherited: ["P","M","HH","N","W","B","K","G","D","T","NG","F","Y","R","L","S","CH","JH","Z","V","TH","DH","SH"]
  }
};

// helper
function getAvailableConsonants(months) {
  const keys = Object.keys(consonantsByMonth)
    .map(Number)
    .sort((a, b) => a - b);

  let result = consonantsByMonth[keys[0]];

  for (const key of keys) {
    if (months >= key) {
      result = consonantsByMonth[key];
    }
  }

  return result;
}

module.exports = {
  consonantsByMonth,
  getAvailableConsonants
};