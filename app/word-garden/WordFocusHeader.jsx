import Link from 'next/link';
import {
  LETTER_GROUPS,
  buildWordGardenWordPath,
  getTargetLabel,
} from '@/utils/wordGardenData';

function normalizeLetter(value) {
  return String(value || '')
    .trim()
    .charAt(0)
    .toUpperCase();
}

function getRowPhonemeSlugs(row) {
  return Array.isArray(row?.phonemeSlugs)
    ? row.phonemeSlugs
    : row?.phonemeSlug
      ? [row.phonemeSlug]
      : [];
}

function getRowSupportedPhonemeSlugs(row) {
  return Array.isArray(row?.supportedPhonemeSlugs)
    ? row.supportedPhonemeSlugs
    : getRowPhonemeSlugs(row);
}

function getHighlightedPhonemeRowIndexes(soundMapRows = [], selectionSlug = '') {
  const exactMatches = soundMapRows.reduce((indexes, row, index) => {
    if (getRowPhonemeSlugs(row).includes(selectionSlug)) {
      indexes.push(index);
    }

    return indexes;
  }, []);

  if (exactMatches.length > 0) {
    return new Set(exactMatches);
  }

  return new Set(
    soundMapRows.reduce((indexes, row, index) => {
      if (getRowSupportedPhonemeSlugs(row).includes(selectionSlug)) {
        indexes.push(index);
      }

      return indexes;
    }, [])
  );
}

function renderHighlightedLetterWord(word, selectedLetter) {
  const displayWord = String(word || '');
  const normalizedSelectedLetter = normalizeLetter(selectedLetter);

  if (!normalizedSelectedLetter) {
    return displayWord;
  }

  return Array.from(displayWord).map((character, index) => (
    <span
      key={`${displayWord}-${character}-${index}`}
      className={
        /[A-Za-z]/.test(character) &&
        character.toUpperCase() === normalizedSelectedLetter
          ? 'text-yellow'
          : 'text-white'
      }
    >
      {character}
    </span>
  ));
}

function renderHighlightedPhonemeWord(wordDetail, phonemeSlug) {
  const highlightedIndexes = getHighlightedPhonemeRowIndexes(
    wordDetail.soundMapRows,
    phonemeSlug
  );

  if (highlightedIndexes.size === 0) {
    return <span className='text-white'>{wordDetail.word}</span>;
  }

  return wordDetail.soundMapRows.map((row, index) => (
    <span
      key={`${row.displayGrapheme || row.grapheme}-${index}-focus`}
      className={highlightedIndexes.has(index) ? 'text-yellow' : 'text-white'}
    >
      {row.displayGrapheme || row.grapheme}
    </span>
  ));
}

function getFocusPhonemeSlugs(wordDetail) {
  const seenPhonemeSlugs = new Set();
  const orderedPhonemeSlugs = [];

  (wordDetail.soundMapRows || []).forEach(row => {
    getRowPhonemeSlugs(row).forEach(phonemeSlug => {
      if (!phonemeSlug || seenPhonemeSlugs.has(phonemeSlug)) {
        return;
      }

      seenPhonemeSlugs.add(phonemeSlug);
      orderedPhonemeSlugs.push(phonemeSlug);
    });
  });

  if (
    wordDetail.selectionType === 'phoneme' &&
    wordDetail.selectionSlug &&
    !seenPhonemeSlugs.has(wordDetail.selectionSlug)
  ) {
    orderedPhonemeSlugs.unshift(wordDetail.selectionSlug);
  }

  return orderedPhonemeSlugs;
}

function isPhonemeUnlocked(phonemeSlug, unlockedPhonemeSet) {
  const symbols = String(phonemeSlug || '')
    .split('__')
    .filter(Boolean);

  return (
    symbols.length > 0 &&
    symbols.every(symbol => unlockedPhonemeSet.has(symbol))
  );
}

function getFocusPillClass(focusOption) {
  const baseClass =
    'rounded-full px-4 py-2 text-sm transition no-underline';

  if (focusOption.type === 'letter') {
    return focusOption.isActive
      ? `${baseClass} border-2 border-yellow/60 bg-yellow/5 text-yellow`
      : `${baseClass} border border-yellow/30 bg-yellow/10 text-yellow hover:border-yellow/45 hover:bg-yellow/15`;
  }

  if (focusOption.isUnlocked) {
    return focusOption.isActive
      ? `${baseClass} border-2 border-yellow/60 bg-yellow/5 text-yellow`
      : `${baseClass} border border-yellow/30 bg-yellow/10 text-yellow hover:border-yellow/45 hover:bg-yellow/15`;
  }

  return focusOption.isActive
    ? `${baseClass} border-2 border-white/25 bg-white/10 text-slate-200`
    : `${baseClass} border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200`;
}

function buildLetterListHref(acId, letter) {
  const normalizedLetter = normalizeLetter(letter);
  return normalizedLetter
    ? `/word-garden/${acId}/letter/${normalizedLetter}`
    : '';
}

function buildPhonemeListHref(acId, phonemeSlug, letter = '') {
  const normalizedLetter = normalizeLetter(letter);
  const query = normalizedLetter
    ? `?letter=${encodeURIComponent(normalizedLetter)}`
    : '';

  return phonemeSlug
    ? `/word-garden/${acId}/phoneme/${phonemeSlug}${query}`
    : '';
}

function buildAllWordsCategoryHref(acId, category = '') {
  const normalizedCategory = String(category || '').trim();

  return normalizedCategory
    ? `/word-garden/${acId}/all?category=${encodeURIComponent(normalizedCategory)}`
    : `/word-garden/${acId}/all`;
}

function getLetterPhonemeOptions(acId, letter, unlockedPhonemeSet) {
  const normalizedLetter = normalizeLetter(letter);
  const letterGroup = LETTER_GROUPS.find(
    group => group.letter === normalizedLetter
  );

  if (!letterGroup) {
    return [];
  }

  const seenPhonemeSlugs = new Set();

  return (letterGroup.phonemes || [])
    .map(phoneme => phoneme.phonemeSlug)
    .filter(Boolean)
    .filter(phonemeSlug => {
      if (seenPhonemeSlugs.has(phonemeSlug)) {
        return false;
      }

      seenPhonemeSlugs.add(phonemeSlug);
      return true;
    })
    .map(phonemeSlug => ({
      phonemeSlug,
      label: getTargetLabel(phonemeSlug),
      href: buildPhonemeListHref(acId, phonemeSlug, normalizedLetter),
      isUnlocked: isPhonemeUnlocked(phonemeSlug, unlockedPhonemeSet),
    }));
}

export default function WordFocusHeader({
  acId,
  wordDetail,
  unlockedArpabet = [],
  focusLetter = '',
}) {
  const normalizedContextLetter = normalizeLetter(focusLetter);
  const initialLetter = normalizeLetter(
    wordDetail.initialLetter || wordDetail.uppercaseLetter || wordDetail.word
  );
  const currentFocusLetter =
    normalizedContextLetter ||
    (wordDetail.selectionType === 'letter'
      ? normalizeLetter(wordDetail.selectionSlug)
      : '') ||
    initialLetter;
  const phonemeContextLetter = currentFocusLetter || initialLetter;
  const unlockedPhonemeSet = new Set(
    Array.isArray(unlockedArpabet)
      ? unlockedArpabet.map(phonemeSlug => String(phonemeSlug || '').trim())
      : []
  );
  const focusPhonemeSlugs = getFocusPhonemeSlugs(wordDetail);
  const focusOptions = [
    currentFocusLetter
      ? {
          key: `letter-${currentFocusLetter}`,
          type: 'letter',
          label: currentFocusLetter,
          href: buildWordGardenWordPath(
            acId,
            'letter',
            currentFocusLetter,
            wordDetail.word
          ),
          isActive:
            wordDetail.selectionType === 'letter' &&
            normalizeLetter(wordDetail.selectionSlug) === currentFocusLetter,
        }
      : null,
    ...focusPhonemeSlugs.map(phonemeSlug => ({
      key: `phoneme-${phonemeSlug}`,
      type: 'phoneme',
      label: getTargetLabel(phonemeSlug),
      href: buildWordGardenWordPath(
        acId,
        'phoneme',
        phonemeSlug,
        wordDetail.word,
        phonemeContextLetter
      ),
      isActive:
        wordDetail.selectionType === 'phoneme' &&
        String(wordDetail.selectionSlug || '') === String(phonemeSlug || ''),
      isUnlocked: isPhonemeUnlocked(phonemeSlug, unlockedPhonemeSet),
    })),
  ].filter(Boolean);
  const isPhonemeFocus = wordDetail.selectionType === 'phoneme';
  const letterListHref = buildLetterListHref(acId, currentFocusLetter);
  const phonemeListHref = isPhonemeFocus
    ? buildPhonemeListHref(acId, wordDetail.selectionSlug, phonemeContextLetter)
    : '';
  const letterPhonemeOptions = isPhonemeFocus
    ? []
    : getLetterPhonemeOptions(acId, currentFocusLetter, unlockedPhonemeSet);
  const categoryHref = buildAllWordsCategoryHref(acId, wordDetail.category);

  return (
    <div className='no-print rounded-[2rem] border border-accent/20 bg-secondary/80 p-8 shadow-xl'>
      <div className='flex flex-wrap items-start justify-between gap-6'>
        <div className='max-w-3xl'>
          <h1 className='text-5xl text-white'>{wordDetail.word}</h1>
          <p className='mt-4 text-lg leading-8 text-accent'>
            {wordDetail.definitionTokens.map((token, index) =>
              token.isLinkable ? (
                <a
                  key={`${token.text}-${index}`}
                  href={token.dictionaryUrl}
                  className='font-normal text-accent underline decoration-dotted underline-offset-4 decoration-accent/70 hover:text-yellow hover:decoration-yellow'
                >
                  {token.text}
                </a>
              ) : (
                <span key={`${token.text}-${index}`}>{token.text}</span>
              )
            )}
          </p>
          <div className='mt-6 flex flex-wrap gap-3 text-sm text-accent'>
            <span className='rounded-full border border-accent/30 px-4 py-2'>
              {wordDetail.syllableCount} syllable
              {wordDetail.syllableCount === 1 ? '' : 's'}
            </span>
            <span className='rounded-full border border-accent/30 px-4 py-2'>
              {wordDetail.concreteness === 'abstract'
                ? 'Abstract word'
                : 'Concrete word'}
            </span>
          </div>
          {focusOptions.length > 0 ? (
            <div className='mt-4 flex flex-wrap items-center gap-2'>
              {focusOptions.map(focusOption => (
                <Link
                  key={focusOption.key}
                  href={focusOption.href}
                  className={getFocusPillClass(focusOption)}
                  aria-current={focusOption.isActive ? 'page' : undefined}
                >
                  {focusOption.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <div className='min-w-[260px] rounded-3xl bg-primary/70 px-5 py-4 text-sm text-accent'>
          <p className='text-[11px] uppercase tracking-[0.25em] text-accent'>
            Focus Pane
          </p>
          {isPhonemeFocus ? (
            <>
              {phonemeListHref ? (
                <Link
                  href={phonemeListHref}
                  className='mt-2 inline-block text-3xl font-semibold text-yellow no-underline transition hover:text-orange'
                >
                  {getTargetLabel(wordDetail.selectionSlug)}
                </Link>
              ) : (
                <p className='mt-2 text-3xl font-semibold text-yellow'>
                  {getTargetLabel(wordDetail.selectionSlug)}
                </p>
              )}
              <p className='mt-4 text-[11px] uppercase tracking-[0.25em] text-accent'>
                Sound In Word
              </p>
              <p className='mt-2 text-4xl font-semibold tracking-[0.08em]'>
                {renderHighlightedPhonemeWord(
                  wordDetail,
                  wordDetail.selectionSlug
                )}
              </p>
            </>
          ) : (
            <>
              <div className='mt-4 grid grid-cols-2 gap-3'>
                {[
                  {
                    label: 'Lowercase',
                    value: currentFocusLetter.toLowerCase(),
                    valueClass:
                      'mt-2 text-4xl font-semibold lowercase text-yellow',
                  },
                  {
                    label: 'Uppercase',
                    value: currentFocusLetter,
                    valueClass: 'mt-2 text-4xl font-semibold text-yellow',
                  },
                ].map(card =>
                  letterListHref ? (
                    <Link
                      key={card.label}
                      href={letterListHref}
                      className='rounded-2xl border border-yellow/30 bg-secondary/60 p-3 text-center no-underline transition hover:border-yellow/50 hover:bg-secondary'
                    >
                      <p className='text-[11px] uppercase tracking-[0.25em] text-accent'>
                        {card.label}
                      </p>
                      <p className={card.valueClass}>{card.value || '-'}</p>
                    </Link>
                  ) : (
                    <div
                      key={card.label}
                      className='rounded-2xl border border-accent/20 bg-secondary/60 p-3 text-center'
                    >
                      <p className='text-[11px] uppercase tracking-[0.25em] text-accent'>
                        {card.label}
                      </p>
                      <p className={card.valueClass}>{card.value || '-'}</p>
                    </div>
                  )
                )}
              </div>
              {letterPhonemeOptions.length > 0 ? (
                <>
                  <p className='mt-4 text-[11px] uppercase tracking-[0.25em] text-accent'>
                    Focus Letter Phonemes
                  </p>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {letterPhonemeOptions.map(option => (
                      <Link
                        key={`${currentFocusLetter}-${option.phonemeSlug}`}
                        href={option.href}
                        className={getFocusPillClass({
                          type: 'phoneme',
                          isActive: false,
                          isUnlocked: option.isUnlocked,
                        })}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : null}
              <p className='mt-4 text-4xl font-semibold tracking-[0.08em]'>
                {renderHighlightedLetterWord(wordDetail.word, currentFocusLetter)}
              </p>
            </>
          )}
          {wordDetail.category ? (
            <p className='mt-4'>
              Category:{' '}
              <Link
                href={categoryHref}
                className='text-yellow no-underline transition hover:text-orange'
              >
                {wordDetail.category}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
