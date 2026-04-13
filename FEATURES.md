# Background
## Description
The word garden feature is a way for parents to generate age appropriate next letters or words to teach their children. This will involve a little set up then operation. The child must first be capable of producing the phoneme, then the application will provide words with those phonemes using different strategies for the child to practice that phoneme using word. So the order is: 
```
Level 1 - age based phoneme recommendation
Level 2 - phoneme based word recommendation
Level 3 - word learning strategies
```
The hierarchy of pages should be:
```
- word garden dashboard - top level view that shows all the anonymous children listed by favorite food. 
- Level 1 detail view - view that lists letters to phonemes the child has access to based on their age (data\consonant-acquisition.js). 
- Level 2 detail view - word cloud full of unlearned words that use the phoneme selected on level 1. 
- Level 3 detail view - The actual strategies to learn that word, letter and phoneme. 
```
I have a list of words to choose from in data\phoneme-map.js that have each phoneme with a list of words associated with that phoneme. This can be used with the data\consonant-acquisition.js and age of the child to 'enable' different phonemes on level 1. 

AC objects should look something like 
```
{
  "acId": "c6d3a7f4-0f4a-4a5a-9b2d-9a2f0f8d2c11",
  "displayName": "Blueberries",
  "birthYearMonth": "2022-04",
  "waiverAcceptedAt": "2026-04-13T12:28:10.000Z",
  "practicedWords": [
    "pan",
    "chair"
  ],
  "createdAt": "2026-04-13T12:28:10.000Z",
  "updatedAt": "2026-04-13T12:28:10.000Z"
}
```
with a user (repositories\UserRepository.ts) having multiple acIds. 

## Important Points
- All recommendations have to be age appropriate for the child. 
- All phonemes should be unicode
- For now, we're just going to use hard coded values for the words and phonemes and not store them in the database. The only things we will store in the database should be ac objects. 
- There are going to be api calls to open AI or the web to generate some of these thing, possibly using MCP.

## Acronyms 
- coat - caretaker of a child
- ac - anonymous child(ren)

# Use cases 
## Set up 
As a parent
When I click a link called 'Word Garden' in the footer
Then I am taken to the dashboard where I can add to a list of ac. When adding a ac, I am presented with a screen where I can enter a parent approved name for the child, perhaps their favorite food to protect their anonymity, which is used as their display name. I am also presented with a liability waiver stating basically the parent accepts all risk and recommendations come from AI. I also enter the child's age in months (birthmonth). The child must be between 24 and 96 months. 

## Operation
As a coat
When I enter the word garden dashboard, I can see a list of ac that I've added to my garden in a list. I can select an ac to see Level 1 page.
Then the level 1 page will show list of phonemes,

As a coat
When I reach level 1
Then I will see a list of letter/phonemes as described above. The table should have all the letters and these phonemes ("p","m","h","n","w","b","k","ɡ","d","t","ŋ","f","j","r","l","s","tʃ","dʒ","z","v","θ","ð","ʃ","ʒ"). If the letter doesn't have phonemes that fit one of those phonemes, the phoneme container should just be blank for that letter (vowels), however, all lines should have an example. The phonemes are displayed to the user in IPA, but processed behind the scenes in arpabet. Only consonant letters will have phonemes listed to avoid bloat. However, each letter is represented. It should be a table with the first column being the letter, the second column being one of many possible phonemes and the third column being an example of that phoneme. The phonemes the user has access to (based on data\consonant-acquisition.js) should be green. The phonemes that are inherited from previous months should be italics.

As a coat
When I reach level 2
Then I should see a wordcloud of all the words associated with the phoneme/letter selected in level 1. That list can be based on the data\phoneme-map.js When I select a word, I will see the level 3 view. Then on subsequent visits to level 2, the word I clicked will be slightly smaller and the remaining words will be slightly larger, which means there should be a repetition value in the data structure of the words that child has learned. The word cloud should be in a random order. 

As a coat
When I reach level 3 page
Then the app should:
- Remind coats to elicit responses from the child:
  - what the word means 
    - child friendly definition is displayed 
      - Each word in the definition is a link to a child friendly definition to that sub word.
      - possibly a colorable image of the word. 
  - how the word sounds, 
    - along with syllable count, 
    - onset/rimes and phonemes of that word. 
    - "what is the first (or any number where phoneme is) sound in <word>"? 
    - Can you say each sound? and what is the word without x sound? 
    - a synthetic approach, which lists the grapheme-phoneme then blend and decode to spell the word. 
  - show the ac how the word looks (both uppercase and lowercase), 
    - spell the word
    - a analytic approach, which starts with the whole word and breaks down the word parts
- Generate 
  - generate some examples of the use of the word in using different morphemes. 
  - There should also be a list of related words that share common features. 
  - a list of children book recommendations most likely to have those words. 
- This page 2 should be a printable worksheet as well. 
  - There should be checkboxes next to each item on the worksheet.
  - There should be a QR code on the worksheet to 'complete' the checklist for that word online. 

## Future features
As a coat
When enter my chatgpt api key
Then it is encrypted and stored in the database

As a coat
When I am on level 1
Then I am able to add words to learn

As a coat
When I am on the garden dashboard
Then I can review the words the ac has learned and has yet to learn