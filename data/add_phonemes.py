import json
import re
import pronouncing

# ARPAbet → IPA mapping
ARPABET_TO_IPA = {
    "AA": "ɑ", "AE": "æ", "AH": "ʌ", "AO": "ɔ", "AW": "aʊ", "AY": "aɪ",
    "B": "b", "CH": "tʃ", "D": "d", "DH": "ð", "EH": "ɛ", "ER": "ɝ",
    "EY": "eɪ", "F": "f", "G": "ɡ", "HH": "h", "IH": "ɪ", "IY": "i",
    "JH": "dʒ", "K": "k", "L": "l", "M": "m", "N": "n", "NG": "ŋ",
    "OW": "oʊ", "OY": "ɔɪ", "P": "p", "R": "r", "S": "s", "SH": "ʃ",
    "T": "t", "TH": "θ", "UH": "ʊ", "UW": "u", "V": "v", "W": "w",
    "Y": "j", "Z": "z", "ZH": "ʒ"
}

def normalize_word(word):
    return re.sub(r'[^a-z\s]', '', word.lower()).strip()

def arpabet_to_ipa(arpa_list):
    ipa = []
    for phoneme in arpa_list:
        clean = re.sub(r'\d', '', phoneme)
        ipa.append(ARPABET_TO_IPA.get(clean, "?"))
    return ipa

def get_phonemes(word):
    parts = normalize_word(word).split()
    
    arpabet = []
    ipa = []
    
    for part in parts:
        phones = pronouncing.phones_for_word(part)
        
        if not phones:
            arpabet.append("?")
            ipa.append("?")
            continue
        
        # take first pronunciation
        arpa = phones[0].split()
        
        arpabet.extend(arpa)
        ipa.extend(arpabet_to_ipa(arpa))
    
    return arpabet, ipa


# --- MAIN ---
with open("words.json", "r", encoding="utf-8") as f:
    data = json.load(f)

updated = []

for item in data:
    arpabet, ipa = get_phonemes(item["word"])
    
    updated.append({
        **item,
        "arpabet": arpabet,
        "ipa": ipa
    })

with open("output.json", "w", encoding="utf-8") as f:
    json.dump(updated, f, indent=2, ensure_ascii=False)

print("✅ DONE — phonemes added")