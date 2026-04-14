'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const DEFAULT_SORT_RULES = [
  { column: 'letter', direction: 'asc' },
];

function getRowHref(acId, row) {
  if (!row?.hasWords) {
    return null;
  }

  if (row.selectionType === 'letter') {
    return `/word-garden/${acId}/letter/${encodeURIComponent(row.selectionSlug)}`;
  }

  return `/word-garden/${acId}/phoneme/${row.selectionSlug}?letter=${encodeURIComponent(
    row.parentLetter || row.letter || ''
  )}`;
}

function getLetterDifficultyClass(row) {
  if (row.difficultyRank === 1) {
    return 'text-green-300';
  }

  if (row.difficultyRank === 2) {
    return 'text-yellow';
  }

  return 'text-orange';
}

function getStatusRank(row) {
  if (!row.hasWords) {
    return 4;
  }

  if (row.isLocked) {
    return 3;
  }

  if (row.suggestedWordCount === 0) {
    return 2;
  }

  return 1;
}

function getColumnValue(row, column) {
  switch (column) {
    case 'status':
      return getStatusRank(row);
    case 'letter':
      return row.letter || '';
    case 'difficultyRank':
      return row.difficultyRank || 999;
    case 'exampleWord':
      return row.exampleWord || '';
    case 'suggestedWordCount':
      return row.suggestedWordCount || 0;
    default:
      return '';
  }
}

function compareValues(leftValue, rightValue, direction) {
  if (typeof leftValue === 'number' && typeof rightValue === 'number') {
    return direction === 'desc'
      ? rightValue - leftValue
      : leftValue - rightValue;
  }

  const comparison = String(leftValue).localeCompare(String(rightValue));
  return direction === 'desc' ? comparison * -1 : comparison;
}

function compareRows(leftRow, rightRow, sortRules) {
  for (const sortRule of sortRules) {
    const comparison = compareValues(
      getColumnValue(leftRow, sortRule.column),
      getColumnValue(rightRow, sortRule.column),
      sortRule.direction
    );

    if (comparison !== 0) {
      return comparison;
    }
  }

  if (leftRow.rowType !== rightRow.rowType) {
    return leftRow.rowType === 'letter' ? -1 : 1;
  }

  return leftRow.originalIndex - rightRow.originalIndex;
}

function getInitialDirection(column) {
  if (column === 'suggestedWordCount') {
    return 'desc';
  }

  return 'asc';
}

function getNextDirection(currentDirection, column) {
  const initialDirection = getInitialDirection(column);
  const alternateDirection = initialDirection === 'asc' ? 'desc' : 'asc';

  if (!currentDirection) {
    return initialDirection;
  }

  if (currentDirection === initialDirection) {
    return alternateDirection;
  }

  return null;
}

function getSortMeta(sortRules, column) {
  const sortIndex = sortRules.findIndex(sortRule => sortRule.column === column);

  if (sortIndex === -1) {
    return null;
  }

  return {
    priority: sortIndex + 1,
    direction: sortRules[sortIndex].direction,
  };
}

function renderSortLabel(sortMeta) {
  if (!sortMeta) {
    return null;
  }

  return `${sortMeta.priority} ${sortMeta.direction === 'desc' ? 'v' : '^'}`;
}

function HeaderButton({ column, label, sortRules, onSort, align = 'left' }) {
  const sortMeta = getSortMeta(sortRules, column);

  return (
    <button
      type='button'
      onClick={event => onSort(column, event.shiftKey)}
      className={`flex w-full items-center gap-2 font-inherit ${
        align === 'right' ? 'justify-end' : 'justify-start'
      }`}
      title='Click to sort. Shift-click to add a secondary sort.'
    >
      <span>{label}</span>
      {sortMeta ? (
        <span className='rounded-full bg-white/10 px-2 py-0.5 text-xs text-white'>
          {renderSortLabel(sortMeta)}
        </span>
      ) : null}
    </button>
  );
}

export default function SoundTable({ acId, rows }) {
  const router = useRouter();
  const [hideLockedRows, setHideLockedRows] = useState(true);
  const [sortRules, setSortRules] = useState(DEFAULT_SORT_RULES);
  const [pendingUnlockRow, setPendingUnlockRow] = useState(null);

  const visibleRows = useMemo(() => {
    const preparedRows = rows.map((row, originalIndex) => ({
      ...row,
      originalIndex,
    }));
    const filteredRows = hideLockedRows
      ? preparedRows.filter(row => !row.isLocked)
      : preparedRows;
    const activeSortRules =
      sortRules.length > 0 ? sortRules : DEFAULT_SORT_RULES;

    return [...filteredRows].sort((leftRow, rightRow) =>
      compareRows(leftRow, rightRow, activeSortRules)
    );
  }, [hideLockedRows, rows, sortRules]);

  function updateSort(column, isSecondarySort) {
    setSortRules(currentRules => {
      const existingRule = currentRules.find(sortRule => sortRule.column === column);
      const nextDirection = getNextDirection(existingRule?.direction, column);

      if (isSecondarySort) {
        const nextRules = currentRules.filter(
          sortRule => sortRule.column !== column
        );

        if (!nextDirection) {
          return nextRules;
        }

        return [...nextRules, { column, direction: nextDirection }];
      }

      if (!nextDirection) {
        return [];
      }

      return [{ column, direction: nextDirection }];
    });
  }

  function openRow(row) {
    const href = getRowHref(acId, row);

    if (!href) {
      return;
    }

    if (row.isLocked) {
      setPendingUnlockRow({ ...row, href });
      return;
    }

    router.push(href);
  }

  function handleKeyDown(event, row) {
    const href = getRowHref(acId, row);

    if (!href) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openRow(row);
    }
  }

  function closeUnlockModal() {
    setPendingUnlockRow(null);
  }

  function continueUnlock() {
    if (pendingUnlockRow?.href) {
      router.push(pendingUnlockRow.href);
    }
  }

  return (
    <div className='space-y-4 pb-24 md:pb-28'>
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-accent/20 bg-primary/40 p-4'>
        <div className='flex flex-wrap items-center gap-4'>
          <label className='flex items-center gap-2 text-sm text-accent'>
            <input
              type='checkbox'
              checked={hideLockedRows}
              onChange={event => setHideLockedRows(event.target.checked)}
              className='h-4 w-4'
            />
            Hide locked rows
          </label>

          <Link
            href={`/word-garden/${acId}/all`}
            className='rounded-full border border-yellow/30 bg-yellow/10 px-4 py-2 text-sm font-semibold text-yellow transition hover:border-yellow/50 hover:text-orange'
          >
            All words
          </Link>
        </div>

        <p className='text-sm text-accent'>
          Click a header to sort. Shift-click another header to add a secondary
          sort, like a spreadsheet.
        </p>
      </div>

      <div className='rounded-3xl border border-accent/20 bg-primary/50 shadow-lg'>
        <div className='max-h-[70vh] overflow-auto'>
          <table className='w-full border-collapse'>
            <thead className='text-left text-accent'>
              <tr>
                <th className='sticky top-0 z-20 bg-secondary px-4 py-3 text-sm uppercase tracking-wide'>
                  <HeaderButton
                    column='status'
                    label='Status'
                    sortRules={sortRules}
                    onSort={updateSort}
                  />
                </th>
                <th className='sticky top-0 z-20 bg-secondary px-4 py-3 text-sm uppercase tracking-wide'>
                  <HeaderButton
                    column='letter'
                    label='Letter'
                    sortRules={sortRules}
                    onSort={updateSort}
                  />
                </th>
                <th className='sticky top-0 z-20 bg-secondary px-4 py-3 text-sm uppercase tracking-wide'>
                  <HeaderButton
                    column='difficultyRank'
                    label='Expressive Difficulty'
                    sortRules={sortRules}
                    onSort={updateSort}
                  />
                </th>
                <th className='sticky top-0 z-20 bg-secondary px-4 py-3 text-sm uppercase tracking-wide'>
                  <HeaderButton
                    column='exampleWord'
                    label='Example Word'
                    sortRules={sortRules}
                    onSort={updateSort}
                  />
                </th>
                <th className='sticky top-0 z-20 bg-secondary px-4 py-3 text-sm uppercase tracking-wide text-right'>
                  <HeaderButton
                    column='suggestedWordCount'
                    label='Suggested Words'
                    sortRules={sortRules}
                    onSort={updateSort}
                    align='right'
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map(row => {
                const href = getRowHref(acId, row);
                const isClickable = Boolean(href);

                return (
                  <tr
                    key={row.rowKey}
                    role={isClickable ? 'link' : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    onClick={isClickable ? () => openRow(row) : undefined}
                    onKeyDown={event => handleKeyDown(event, row)}
                    className={`border-t border-accent/10 transition ${
                      row.rowType === 'letter' ? 'bg-secondary/20' : ''
                    } ${
                      row.isLocked ? 'bg-yellow/5' : ''
                    } ${
                      isClickable
                        ? 'cursor-pointer hover:bg-white/5 focus:outline-none focus:bg-white/5'
                        : ''
                    }`}
                  >
                    <td className='px-4 py-3 align-top text-sm text-accent'>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          row.isLocked
                            ? 'bg-yellow/20 text-yellow'
                            : row.isSelectable
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-white/10 text-accent'
                        }`}
                      >
                        {row.statusText}
                      </span>
                    </td>
                    <td className='px-4 py-3 font-bold text-white align-top'>
                      {row.rowType === 'letter' ? (
                        row.letter
                      ) : (
                        <span className='text-accent/40'>&mdash;</span>
                      )}
                    </td>
                    <td
                      className={`px-4 py-3 align-top ${
                        row.rowType === 'phoneme' ? 'pl-8' : ''
                      } ${
                        row.rowType === 'letter'
                          ? `${getLetterDifficultyClass(row)} font-bold`
                          : row.isEnabled
                            ? row.isInherited
                              ? 'text-green-300 italic'
                              : 'text-green-300'
                            : 'text-yellow'
                      }`}
                    >
                      {row.rowType === 'letter'
                        ? row.difficultyLabel
                        : row.displayPhoneme}
                    </td>
                    <td className='px-4 py-3 align-top text-yellow'>
                      {row.exampleWord}
                    </td>
                    <td className='px-4 py-3 align-top text-right text-sm text-accent'>
                      <span className='text-white'>{row.suggestedWordCount}</span>
                      {row.wordCount !== row.suggestedWordCount ? (
                        <span className='block text-xs text-accent/70'>
                          of {row.wordCount}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {pendingUnlockRow ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-primary/80 px-4'>
          <div className='w-full max-w-lg rounded-3xl border border-accent/20 bg-secondary p-6 shadow-2xl'>
            <p className='text-sm uppercase tracking-[0.3em] text-yellow'>
              Advanced Sound
            </p>
            <h2 className='mt-3 text-2xl font-bold text-white'>
              Open {pendingUnlockRow.displayPhoneme} anyway?
            </h2>
            <p className='mt-4 text-accent'>
              This target is more advanced than what is typical for this child&apos;s
              current age. You can still continue if you want to explore it now.
            </p>
            <div className='mt-6 flex flex-wrap gap-3'>
              <button
                type='button'
                onClick={continueUnlock}
                className='rounded-full bg-yellow px-4 py-2 font-bold text-primary'
              >
                Continue Anyway
              </button>
              <button
                type='button'
                onClick={closeUnlockModal}
                className='rounded-full border border-accent/30 px-4 py-2 font-bold text-accent'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
