// consonant-acquisition.js

const consonantMilestones = [
  {
    month: 24,
    adds: ['P', 'M', 'HH', 'N', 'W', 'B', 'K', 'G', 'D', 'T', 'NG'],
    ends: [],
  },
  {
    month: 30,
    adds: ['F', 'Y'],
    ends: [],
  },
  {
    month: 36,
    adds: ['R', 'L', 'S'],
    ends: ['P', 'M', 'HH', 'N', 'W', 'B'],
  },
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
  {
    month: 54,
    adds: ['TH'],
    ends: [],
  },
  {
    month: 60,
    adds: ['DH'],
    ends: [],
  },
  {
    month: 72,
    adds: ['ER'],
    ends: ['T', 'NG', 'R', 'L'],
  },
  {
    month: 84,
    adds: [],
    ends: ['CH', 'SH', 'JH', 'TH'],
  },
  {
    month: 96,
    adds: [],
    ends: ['S', 'Z', 'V', 'DH'],
  },
  {
    month: 102,
    adds: [],
    ends: ['ER'],
  },
];

const consonantWindows = consonantMilestones.reduce((windows, milestone) => {
  milestone.adds.forEach(symbol => {
    windows[symbol] = {
      startMonth: milestone.month,
      endMonth: windows[symbol]?.endMonth || null,
    };
  });

  milestone.ends.forEach(symbol => {
    windows[symbol] = {
      startMonth: windows[symbol]?.startMonth || null,
      endMonth: milestone.month,
    };
  });

  return windows;
}, {});

function getConsonantWindow(symbol) {
  return consonantWindows[symbol] || { startMonth: null, endMonth: null };
}

function getAvailableConsonants(months) {
  const normalizedMonths = Number(months);
  const active = [];
  const inherited = [];

  Object.entries(consonantWindows).forEach(([symbol, window]) => {
    if (!window.startMonth || normalizedMonths < window.startMonth) {
      return;
    }

    if (window.endMonth && normalizedMonths >= window.endMonth) {
      inherited.push(symbol);
      return;
    }

    active.push(symbol);
  });

  return {
    active,
    inherited,
    arpabet: [...active, ...inherited],
    windows: consonantWindows,
  };
}

module.exports = {
  consonantMilestones,
  consonantWindows,
  getAvailableConsonants,
  getConsonantWindow,
};
