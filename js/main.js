/**
 * Affiche le tooltip à la position de l'événement souris.
 * @param {MouseEvent} event
 * @param {string} label  - Ligne supérieure (date ou nom)
 * @param {string} value  - Ligne inférieure (valeur ou pourcentage)
 */
function showTooltip(event, label, value) {
  const tooltip = document.getElementById('tooltip');
  document.getElementById('tt-date').textContent = label;
  document.getElementById('tt-val').textContent  = value;
  tooltip.style.opacity = '1';
  tooltip.style.left    = (event.clientX + 14) + 'px';
  tooltip.style.top     = (event.clientY - 44) + 'px';
}

function hideTooltip() {
  document.getElementById('tooltip').style.opacity = '0';
}

/**
 * Met à jour la période sélectionnée :
 * - active le bon bouton
 * - recalcule la performance affichée
 * - redessine la courbe
 * @param {number} days
 */
function setPeriod(days) {
  [30, 90, 180, 365].forEach(d => {
    document.getElementById('btn-' + d).classList.toggle('active', d === days);
  });

  const data  = getSeries(days);
  const first = data[0].value;
  const last  = data[data.length - 1].value;
  const perf  = ((last - first) / first * 100).toFixed(1);

  const perfEl = document.getElementById('perf-label');
  perfEl.textContent = `${perf > 0 ? '+' : ''}${perf}% sur la période`;
  perfEl.style.color = perf >= 0
    ? 'var(--green)'
    : 'var(--red)';

  drawLineChart(days);
}

//Initialisation 
document.addEventListener('DOMContentLoaded', () => {
  revealCards();
  animateCounter(document.getElementById('total-val'), 0, PORTFOLIO_FINAL_VALUE);
  setPeriod(180);
  drawDonutChart();
});

window.addEventListener('resize', () => {
  drawLineChart(180);
  drawDonutChart();
});
