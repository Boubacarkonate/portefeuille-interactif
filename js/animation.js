/** Easing "easeOutExpo" — démarre vite, ralentit en douceur à l'arrivée */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Anime un nombre de `from` à `to` sur `duration` ms, avec formatage € FR.
 * @param {HTMLElement} el
 * @param {number} from
 * @param {number} to
 * @param {number} duration
 */
function animateCounter(el, from, to, duration = 1100) {
  const start = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = easeOutExpo(t);
    const value = Math.round(from + (to - from) * eased);
    el.textContent = value.toLocaleString('fr-FR') + ' €';

    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/**
 * Fait apparaître les `.card` une par une avec un léger décalage,
 * pour un effet d'arrivée élégant plutôt qu'un "pop" brutal.
 */
function revealCards() {
  const cards = document.querySelectorAll('.card');

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 120 * i + 80);
  });
}

/**
 * Applique une pulsation discrète (halo qui respire) sur un élément
 * SVG <circle> tant que `active` reste vrai. Utilisé sur le point
 * de survol du line chart pour le rendre plus vivant au repos.
 * @param {d3.Selection} circleSelection
 */
function pulseDot(circleSelection) {
  if (!circleSelection || circleSelection.empty()) return;

  circleSelection
    .attr('r', 4)
    .transition()
    .duration(900)
    .ease(d3.easeSinInOut)
    .attr('r', 6)
    .transition()
    .duration(900)
    .ease(d3.easeSinInOut)
    .attr('r', 4)
    .on('end', function() {
      // Relance la pulsation si l'élément est toujours visible
      if (+d3.select(this).style('opacity') > 0) {
        pulseDot(d3.select(this));
      }
    });
}

/**
 * Anime l'apparition d'un <path> en le "dessinant" de gauche à droite,
 * comme un trait de pinceau, via stroke-dasharray / stroke-dashoffset.
 * @param {d3.Selection} pathSelection - sélection D3 d'un seul <path>
 * @param {number} duration
 */
function drawPathIn(pathSelection, duration = 1000) {
  const node = pathSelection.node();
  if (!node) return;

  const length = node.getTotalLength();

  pathSelection
    .attr('stroke-dasharray', `${length} ${length}`)
    .attr('stroke-dashoffset', length)
    .transition()
    .duration(duration)
    .ease(d3.easeCubicInOut)
    .attr('stroke-dashoffset', 0)
    .on('end', function() {
      // Nettoyage : on retire le dasharray pour ne pas perturber un futur resize
      d3.select(this).attr('stroke-dasharray', null).attr('stroke-dashoffset', null);
    });
}

/**
 * Fait jaillir quelques confettis discrets autour d'un élément cliqué.
 * Purement cosmétique — un clin d'œil sympa pour qui explore le portfolio.
 * @param {MouseEvent} event
 */
function burstConfetti(event) {
  const colors = ['#00e5ff', '#7b5cff', '#ff2e9a', '#ffb800'];
  const originX = event.clientX;
  const originY = event.clientY;

  for (let i = 0; i < 14; i++) {
    const piece = document.createElement('div');
    const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
    const distance = 40 + Math.random() * 50;
    const size = 4 + Math.random() * 4;

    piece.style.position = 'fixed';
    piece.style.left = originX + 'px';
    piece.style.top = originY + 'px';
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.background = colors[i % colors.length];
    piece.style.borderRadius = '2px';
    piece.style.pointerEvents = 'none';
    piece.style.zIndex = '999';
    piece.style.opacity = '1';
    piece.style.transition = 'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.7s ease';
    document.body.appendChild(piece);

    requestAnimationFrame(() => {
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 20; // léger envol vers le haut
      piece.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`;
      piece.style.opacity = '0';
    });

    setTimeout(() => piece.remove(), 750);
  }
}

// Branchement de l'easter egg sur la valeur totale
document.addEventListener('DOMContentLoaded', () => {
  const totalEl = document.getElementById('total-val');
  if (totalEl) {
    totalEl.style.cursor = 'pointer';
    totalEl.title = 'Clique-moi ✨';
    totalEl.addEventListener('click', burstConfetti);
  }
});
