/* =========================================================
   DRAWING THE LINES – shared by every structure page.
   The page's data file (structure.js / alt-structure.js)
   defines ROLES and EDGES before this file loads.
   ========================================================= */
const chart = document.getElementById('chart');
const svg = document.getElementById('lines');
const GAP = 3; // space between arrow tip and box
let selectedId = null;
let hoveredId = null;

function total(members) {
  return Object.values(members).reduce((a, b) => a + b, 0);
}

// Team boxes: show the member count, and add the member list that
// appears when the box is clicked (expanded)
Object.entries(ROLES).forEach(([id, role]) => {
  if (!role.members) return;
  const node = chart.querySelector(`[data-id="${id}"]`);
  if (!node) return;

  node.querySelector('.node-meta').textContent = `${total(role.members)} members`;
  node.setAttribute('aria-expanded', 'false');

  const rows = Object.entries(role.members)
    .map(([skill, count]) => `<span class="roster-row"><span>${skill}</span><b>${count}</b></span>`)
    .join('');
  node.insertAdjacentHTML(
    'beforeend',
    `<span class="node-roster">
      ${rows}
      <span class="roster-row roster-total"><span>Total</span><b>${total(role.members)}</b></span>
      ${role.note ? `<span class="roster-note roster-note--strong">${role.note}</span>` : ''}
      <span class="roster-note">Reports to ${role.reportsTo}</span>
    </span>`
  );
});

function box(id) {
  const el = chart.querySelector(`[data-id="${id}"]`);
  const r = el.getBoundingClientRect();
  const c = chart.getBoundingClientRect();
  const l = r.left - c.left;
  const t = r.top - c.top;
  return { l, t, r: l + r.width, b: t + r.height, w: r.width, h: r.height, cx: l + r.width / 2, cy: t + r.height / 2 };
}

function pathFor(edge) {
  // Sales links are page-specific, so structure.js supplies salesPath()
  if (edge.type === 'sales') return salesPath(edge.to);

  const a = box(edge.from);
  const b = box(edge.to);

  if (edge.type === 'down') {
    return `M ${b.cx} ${a.b} V ${b.t - GAP}`;
  }
  if (edge.type === 'tree') {
    const mid = a.b + (b.t - a.b) * (edge.mid || 0.45);
    return `M ${a.cx} ${a.b} V ${mid} H ${b.cx} V ${b.t - GAP}`;
  }
  if (edge.type === 'elbow') {
    // across from the side of the box, then down into the target
    return `M ${a.r} ${a.cy} H ${b.cx} V ${b.t - GAP}`;
  }
  if (edge.type === 'side') {
    return b.cx > a.cx
      ? `M ${a.r} ${a.cy} H ${b.l - GAP}`
      : `M ${a.l} ${a.cy} H ${b.r + GAP}`;
  }
  // dashed: from Special Team to a PM, landing slightly off-centre
  const side = a.cx > b.cx ? 1 : -1;
  const endX = b.cx + side * b.w * 0.3;
  return `M ${a.cx} ${a.b} L ${endX} ${b.t - GAP}`;
}

function draw() {
  let html = `
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 z"></path>
      </marker>
      <marker id="arrow-special" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 z"></path>
      </marker>
      <marker id="arrow-sales" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z"></path>
      </marker>
    </defs>`;

  // Sales links first so the reporting lines are drawn on top of them
  const ordered = [...EDGES.filter((e) => e.type === 'sales'), ...EDGES.filter((e) => e.type !== 'sales')];
  ordered.forEach((e) => {
    const marker = { dashed: 'arrow-special', sales: 'arrow-sales' }[e.type] || 'arrow';
    const both = e.type === 'sales' ? `marker-start="url(#${marker})"` : '';
    html += `<path class="edge ${e.type} ${e.optional ? 'optional' : ''}" data-from="${e.from}" data-to="${e.to}"
      d="${pathFor(e)}" ${both} marker-end="url(#${marker})"></path>`;
  });

  svg.innerHTML = html;
  if (hoveredId) hoverLines(hoveredId);
  if (selectedId) {
    highlight(selectedId);
    positionNote();
  }
}

window.addEventListener('resize', draw);
if (window.ResizeObserver) new ResizeObserver(draw).observe(chart);
window.addEventListener('load', draw);
if (document.fonts) document.fonts.ready.then(draw);

/* =========================================================
   NOTE CARD – small card that appears next to the
      clicked box (right side if there is room, else left)
   ========================================================= */
const note = document.createElement('aside');
note.className = 'note';
note.setAttribute('role', 'dialog');
note.hidden = true;
chart.appendChild(note);

const NOTE_GAP = 16;

function highlight(id) {
  chart.classList.add('has-selection');
  svg.querySelectorAll('.edge').forEach((p) => {
    p.classList.toggle('active', p.dataset.from === id || p.dataset.to === id);
  });
}

function renderNote(id) {
  const role = ROLES[id];
  const n = NOTES[role.type];
  note.innerHTML = `
    <button class="note-close" aria-label="Close note">&times;</button>
    <div class="note-head">
      <span class="note-badge">${n.abbr}</span>
      <div>
        <h2>${n.label}${role.optional ? ' <span class="note-optional">Optional</span>' : ''}</h2>
        ${role.context ? `<p class="note-context">${role.context}</p>` : ''}
      </div>
    </div>

    <p class="note-short">${n.short}</p>

    <div class="note-tasks-header">
      <span class="note-tasks-title">Assigned Tasks</span>
      <span class="note-tasks-count">${n.tasks.length}</span>
    </div>
    <ul class="note-tasks-list">
      ${n.tasks.map((task) => `
        <li>
          <span class="note-task-check" aria-hidden="true">✓</span>
          <span>${task}</span>
        </li>
      `).join('')}
    </ul>
  `;
  note.querySelector('.note-close').addEventListener('click', closeNote);
}

function positionNote() {
  if (!selectedId || note.hidden) return;
  const b = box(selectedId);
  const nodeRect = chart.querySelector(`[data-id="${selectedId}"]`).getBoundingClientRect();
  const w = note.offsetWidth;
  const h = note.offsetHeight;

  // Right side if it fits in the window, otherwise left side
  const fitsRight = nodeRect.right + NOTE_GAP + w <= window.innerWidth - 8;
  const fitsLeft = nodeRect.left - NOTE_GAP - w >= 8;
  const onRight = fitsRight || !fitsLeft;
  const left = onRight ? b.r + NOTE_GAP : b.l - NOTE_GAP - w;

  // Line the card up with the box, but keep it inside the chart
  let top = b.t - 8;
  top = Math.min(top, chart.offsetHeight - h);
  top = Math.max(top, 0);

  note.style.left = `${left}px`;
  note.style.top = `${top}px`;
  note.classList.toggle('note--left', !onRight);
  // Small pointer on the card, level with the middle of the box
  const caret = Math.min(Math.max(b.t + Math.min(b.h, 80) / 2 - top, 18), h - 18);
  note.style.setProperty('--caret-y', `${caret}px`);
}

function openNote(id) {
  chart.querySelectorAll('.node.selected').forEach((n) => n.classList.remove('selected'));
  chart.querySelector(`[data-id="${id}"]`).classList.add('selected');
  selectedId = id;
  highlight(id);

  renderNote(id);
  note.hidden = false;
  note.classList.remove('show');
  positionNote();
  requestAnimationFrame(() => note.classList.add('show'));
}

function closeNote() {
  note.hidden = true;
  note.classList.remove('show');
  chart.classList.remove('has-selection');
  chart.querySelectorAll('.node.selected').forEach((n) => n.classList.remove('selected'));
  selectedId = null;
}

function setExpanded(node, open) {
  node.classList.toggle('expanded', open);
  node.setAttribute('aria-expanded', String(open));
  draw();
}

chart.addEventListener('click', (e) => {
  if (e.target.closest('.note')) return;
  const node = e.target.closest('.node');
  if (!node) {
    closeNote();
    return;
  }
  const id = node.dataset.id;

  // Clicking the open box again closes its note (and folds a team list)
  if (id === selectedId) {
    if (ROLES[id].members) setExpanded(node, false);
    closeNote();
    return;
  }

  // Teams also unfold their member list
  if (ROLES[id].members) setExpanded(node, true);
  openNote(id);
});

// Hover (or keyboard focus) on a box: light up the lines connected to it
function hoverLines(id) {
  svg.querySelectorAll('.edge').forEach((p) => {
    p.classList.toggle('hover', !!id && (p.dataset.from === id || p.dataset.to === id));
  });
}

function setHover(e) {
  const node = e.target.closest('.node');
  const id = node ? node.dataset.id : null;
  if (id === hoveredId) return;
  hoveredId = id;
  hoverLines(id);
}

chart.addEventListener('mouseover', setHover);
chart.addEventListener('focusin', setHover);
chart.addEventListener('mouseleave', () => {
  hoveredId = null;
  hoverLines(null);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNote();
});

draw();
