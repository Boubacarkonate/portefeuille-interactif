const LINE_CONFIG = {
  height:    220,
  margin:    { top: 8, right: 12, bottom: 30, left: 56 },
  color:     '#00e5ff',
  areaFill:  'rgba(0,229,255,0.14)',
  gridColor: 'rgba(255,255,255,0.05)',
  textColor: '#565b66',
};

/**
 * Dessine (ou redessine) la courbe de performance.
 * @param {number} days - Période en jours
 */
function drawLineChart(days) {
  const data = getSeries(days);
  d3.select('#line-chart').selectAll('*').remove();

  const { height: H, margin: m, color, areaFill, gridColor, textColor } = LINE_CONFIG;
  const W = document.getElementById('line-chart').clientWidth || 680;
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;

  const svg = d3.select('#line-chart')
    .append('svg')
    .attr('width', W).attr('height', H)
    .attr('role', 'img')
    .attr('aria-label', 'Courbe d\'évolution de la valeur du portefeuille');

  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

  // Échelles
  const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, w]);
  const yMin = d3.min(data, d => d.value) * 0.995;
  const yMax = d3.max(data, d => d.value) * 1.005;
  const y = d3.scaleLinear().domain([yMin, yMax]).range([h, 0]);

  // Axe X
  const tickFmt = days <= 30 ? '%d %b' : days <= 90 ? '%d %b' : '%b %y';
  g.append('g')
    .attr('transform', `translate(0,${h})`)
    .call(d3.axisBottom(x).ticks(5).tickSize(0).tickPadding(8).tickFormat(d3.timeFormat(tickFmt)))
    .call(gg => gg.select('.domain').remove())
    .call(gg => gg.selectAll('text')
      .style('fill', textColor)
      .style('font-size', '11px')
      .style('font-family', 'Helvetica Neue, Arial, sans-serif'));

  // Axe Y + grille horizontale
  g.append('g')
    .call(d3.axisLeft(y).ticks(4).tickSize(-w)
      .tickFormat(d => d >= 1000 ? Math.round(d / 1000) + 'k€' : d + '€'))
    .call(gg => gg.select('.domain').remove())
    .call(gg => gg.selectAll('line').style('stroke', gridColor).style('stroke-dasharray', '3,4'))
    .call(gg => gg.selectAll('text')
      .style('fill', textColor)
      .style('font-size', '11px')
      .style('font-family', 'Helvetica Neue, Arial, sans-serif'));

  // Dégradé sous la courbe
  const defs = svg.append('defs');
  const grad = defs.append('linearGradient')
    .attr('id', 'area-grad').attr('x1', '0').attr('x2', '0').attr('y1', '0').attr('y2', '1');
  grad.append('stop').attr('offset', '0%').attr('stop-color', areaFill);
  grad.append('stop').attr('offset', '100%').attr('stop-color', 'transparent');

  // Zone et ligne
  const area = d3.area().x(d => x(d.date)).y0(h).y1(d => y(d.value)).curve(d3.curveCatmullRom);
  const line = d3.line().x(d => x(d.date)).y(d => y(d.value)).curve(d3.curveCatmullRom);

  g.append('path').datum(data).attr('fill', 'url(#area-grad)').attr('d', area).style('opacity', 0)
    .transition().delay(300).duration(500).style('opacity', 1);

  const linePath = g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 2)
    .attr('d', line);

  // Effet "dessin au pinceau" — la courbe se trace de gauche à droite
  drawPathIn(linePath, 900);

  // Point de survol (avec petite pulsation au repos une fois le tracé fini)
  const dot = g.append('circle').attr('r', 4)
    .attr('fill', color)
    .attr('stroke', '#0a0c10')
    .attr('stroke-width', 2)
    .style('opacity', 0)
    .style('pointer-events', 'none');

  // Overlay transparent pour la capture des événements souris
  g.append('rect')
    .attr('width', w).attr('height', h)
    .attr('fill', 'transparent')
    .style('cursor', 'crosshair')
    .on('mousemove', function(event) {
      const [mx] = d3.pointer(event);
      const bisect = d3.bisector(d => d.date).left;
      const i = Math.min(bisect(data, x.invert(mx), 1), data.length - 1);
      const d = data[i];

      dot.attr('cx', x(d.date)).attr('cy', y(d.value)).style('opacity', 1);
      showTooltip(event, d3.timeFormat('%d %B %Y')(d.date), d.value.toLocaleString('fr-FR') + ' €');
    })
    .on('mouseleave', () => { dot.style('opacity', 0); hideTooltip(); });
}
