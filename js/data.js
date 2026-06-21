const ASSETS = [
  { name: 'Actions EU',    color: '#1D9E75', pct: 38 },
  { name: 'Obligataires',  color: '#378ADD', pct: 25 },
  { name: 'Tech US',       color: '#7F77DD', pct: 20 },
  { name: 'Or & Matières', color: '#EF9F27', pct: 10 },
  { name: 'Cash',          color: '#888780', pct: 7  },
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
