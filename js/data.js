const ASSETS = [
  { name: 'Actions EU',    color: '#00e5ff', pct: 38 },
  { name: 'Obligataires',  color: '#7b5cff', pct: 25 },
  { name: 'Tech US',       color: '#ff2e9a', pct: 20 },
  { name: 'Or & Matières', color: '#ffb800', pct: 10 },
  { name: 'Cash',          color: '#3a3f4d', pct: 7  },
];

const PORTFOLIO_FINAL_VALUE = 24830;

/**
 * Génère une série temporelle simulée sur `days` jours.
 * La dernière valeur est fixée à PORTFOLIO_FINAL_VALUE.
 * @param {number} days
 * @returns {{ date: Date, value: number }[]}
 */
function generateSeries(days) {
  const data = [];
  let v = 22100;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    v += v * (Math.random() - 0.46) * 0.015;
    data.push({ date: d, value: Math.round(v) });
  }

  data[data.length - 1].value = PORTFOLIO_FINAL_VALUE;
  return data;
}

// Cache pour éviter de recalculer à chaque changement de période
const seriesCache = {};

function getSeries(days) {
  if (!seriesCache[days]) seriesCache[days] = generateSeries(days);
  return seriesCache[days];
}
