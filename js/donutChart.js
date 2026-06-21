const DONUT_SIZE = 180;

/**
 * Dessine le donut chart de répartition et la légende associée.
 */
function drawDonutChart() {
  d3.select('#donut-svg').selectAll('*').remove();

  const r  = DONUT_SIZE / 2;
  const ir = r * 0.58; // rayon intérieur (trou)

  const svg = d3.select('#donut-svg')
    .append('svg')
    .attr('width', DONUT_SIZE).attr('height', DONUT_SIZE)
    .attr('role', 'img')
    .attr('aria-label', 'Répartition du portefeuille par classe d\'actif');

  const g = svg.append('g').attr('transform', `translate(${r},${r})`);

  const pie     = d3.pie().value(d => d.pct).sort(null);
  const arc     = d3.arc().innerRadius(ir).outerRadius(r - 3);
  const arcHover= d3.arc().innerRadius(ir).outerRadius(r + 2);

  g.selectAll('path')
    .data(pie(ASSETS))
    .join('path')
    .attr('d', arc)
    .attr('fill', d => d.data.color)
    .attr('stroke', isDark ? '#1e1e1c' : '#fff')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('mouseover', function(event, d) {
      d3.select(this).transition().duration(120).attr('d', arcHover);
      showTooltip(event, d.data.name, d.data.pct + '% du portefeuille');
    })
    .on('mouseleave', function() {
      d3.select(this).transition().duration(120).attr('d', arc);
      hideTooltip();
    });

  renderLegend();
}

/**
 * Construit la légende textuelle à côté du donut.
 */
function renderLegend() {
  const legendEl = document.getElementById('legend');
  legendEl.innerHTML = '';

  ASSETS.forEach(a => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <span class="legend-dot" style="background:${a.color}"></span>
      <span class="legend-name">${a.name}</span>
      <span class="legend-pct">${a.pct}%</span>
    `;
    legendEl.appendChild(item);
  });
}
