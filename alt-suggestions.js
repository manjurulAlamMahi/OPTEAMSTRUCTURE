// ---------- My Suggestion: structure + optimised teams ----------
// Uses `teams` (current members) from alt-data.js.

// Which slot types each current role can fill
const ROLE_FITS = {
  'UI/UX Designer': ['uiux'],
  'Front End Developer': ['front'],
  'Mobile App Developer': ['flutter'],
  'Backend Developer': ['laravel'],
  'Django': ['django'],
  'MERN': ['mern-front', 'mern-native', 'mern-backend'],
  'n8n': ['n8n-front'],
  'Front End Developer · n8n': ['n8n-front'],
  'AI': ['ai'],
};

const SLOT_LABELS = {
  uiux: 'UI/UX',
  front: 'Front End',
  flutter: 'Flutter',
  laravel: 'Backend · Laravel',
  django: 'Backend · Django',
  'mern-front': 'MERN + Front End',
  'mern-native': 'MERN + React Native',
  'mern-backend': 'MERN + Backend',
  'n8n-front': 'n8n + Front End',
  ai: 'AI Specialist',
};

// Every role in a team should have at least this many people
const MIN_PER_ROLE = 2;

// Target teams (one Project Manager each).
// slots = full team size per role (open slots can be hired later)
// from  = current team whose members are placed here first
// keep  = member IDs that must be in this team
// pin   = member ID → exact role slot in this team
const plan = [
  {
    label: 'Laravel Team 1', stack: 'Laravel', from: ['logic-lab'],
    keep: ['16066', '16000', '16048', '16606', '16075', '16309', '16012'],
    slots: { uiux: 3, front: 4, flutter: 4, laravel: 5 },
  },
  { label: 'Laravel Team 2', stack: 'Laravel', from: ['pixel-pioneers'], slots: { uiux: 3, front: 4, flutter: 4, laravel: 5 } },
  { label: 'Laravel Team 3', stack: 'Laravel', from: ['stack-masters'], slots: { uiux: 3, front: 4, flutter: 4, laravel: 5 } },
  { label: 'Python Team', stack: 'Python · Django', from: ['codehydra'], slots: { uiux: 3, front: 4, flutter: 4, django: 5 } },
  {
    label: 'MERN Team', stack: 'MERN · React Native', from: ['codehydra'],
    pin: {
      '15885': 'mern-front', '15866': 'mern-front', // Rabiul Haque, Sheikh Redwan Ahmed
      '15757': 'mern-native', '16076': 'mern-native', // Asaduzzaman Hisam, Md Tayeb
      '16816': 'mern-backend', '15864': 'mern-backend', // Abul Hasnat, Rashedul Islam
    },
    slots: { uiux: 2, 'mern-front': 3, 'mern-native': 3, 'mern-backend': 4 },
  },
  { label: 'AI Team', stack: 'n8n · AI', from: ['dev-ninja'], slots: { 'n8n-front': 6, ai: 4 } },
];

// Moved out of their team on purpose (to make room for someone kept above)
const FORCE_EXTRA = ['37071'];

// Reports to the AGM only, kept as it is
const SPECIAL_CASE_ID = 'dotify';

// Special / Rapid Teams: one per Operations Manager.
// Every stack + 2 SQA. Members are assigned later (for now extras stay in Extra).
const RAPID_TEAMS = [1, 2].map((om) => ({
  om,
  label: `Special / Rapid Team ${om}`,
  slots: ['Laravel', 'Django', 'MERN', 'Flutter', 'Front End', 'UI/UX', 'n8n', 'AI', 'SQA', 'SQA'],
}));

// ---------- Assign members to slots ----------
const pool = teams
  .filter((t) => t.id !== SPECIAL_CASE_ID)
  .flatMap((t) => t.members.map(([id, name, role]) => ({ id, name, role, team: t.id, placed: false })));

pool.filter((m) => FORCE_EXTRA.includes(m.id)).forEach((m) => (m.placed = true));

plan.forEach((t) => {
  t.filled = Object.fromEntries(Object.keys(t.slots).map((k) => [k, []]));
});

const fits = (m, slot) => (ROLE_FITS[m.role] || []).includes(slot);

// 0) Pinned members go into their exact slot, then kept members go in
plan.forEach((t) => {
  Object.entries(t.pin || {}).forEach(([id, slot]) => {
    const m = pool.find((x) => x.id === id && !x.placed);
    if (m && t.filled[slot] && t.filled[slot].length < t.slots[slot]) {
      t.filled[slot].push(m);
      m.placed = true;
    }
  });

  pool.filter((m) => (t.keep || []).includes(m.id)).forEach((m) => {
    const slot = Object.keys(t.slots).find((s) => fits(m, s) && t.filled[s].length < t.slots[s]);
    if (slot) {
      t.filled[slot].push(m);
      m.placed = true;
    }
  });
});

// 1) Fill level by level (everyone gets 1, then 2, ...) so no team is left empty
//    while another is full. Prefer the team's own current members, then people
//    from teams that are being split up, then anyone.
const sourceTeams = new Set(plan.flatMap((t) => t.from));

function pick(t, slot) {
  const free = (m) => !m.placed && fits(m, slot);
  return pool.find((m) => free(m) && t.from.includes(m.team))
    || pool.find((m) => free(m) && !sourceTeams.has(m.team))
    || pool.find(free);
}

const maxSlot = Math.max(...plan.flatMap((t) => Object.values(t.slots)));
for (let level = 1; level <= maxSlot; level++) {
  plan.forEach((t) => {
    Object.keys(t.slots).forEach((s) => {
      if (t.filled[s].length >= Math.min(level, t.slots[s])) return;
      const m = pick(t, s);
      if (m) {
        t.filled[s].push(m);
        m.placed = true;
      }
    });
  });
}

// 2) Whoever is left over (plus FORCE_EXTRA) is extra
const extras = pool.filter((m) => !m.placed || FORCE_EXTRA.includes(m.id));

// ---------- Render helpers ----------
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const person = (m) => `<li><span class="t-id">${esc(m.id)}</span>${esc(m.name)}</li>`;

function teamCard(t, i) {
  const need = sum(Object.values(t.slots));
  const have = sum(Object.values(t.filled).map((a) => a.length));
  const open = Object.entries(t.slots)
    .map(([s, n]) => [s, n - t.filled[s].length])
    .filter(([, n]) => n > 0);

  const groups = Object.entries(t.slots).map(([s, n]) => {
    const got = t.filled[s].length;
    const belowMin = got < Math.min(MIN_PER_ROLE, n);
    const empty = '<li class="slot-empty">Open slot</li>'.repeat(n - got);
    return `<div class="slot-group">
      <div class="slot-head"><span>${SLOT_LABELS[s]}</span><span class="slot-count${belowMin ? ' is-short' : ''}">${got}/${n}</span></div>
      <ul>${t.filled[s].map(person).join('')}${empty}</ul>
    </div>`;
  }).join('');

  const hire = open.length
    ? `<details class="hire">
        <summary>Open slots, can hire later <span class="hire-badge">${need - have}</span></summary>
        <ul>${open.map(([s, n]) => `<li><span>${SLOT_LABELS[s]}</span><b>${n}</b></li>`).join('')}</ul>
      </details>`
    : '<p class="hire hire--done">Team complete</p>';

  return `<article class="sg-team">
    <header class="sg-team-head">
      <span class="node-abbr">PM ${i + 1}</span>
      <h3>${esc(t.label)}</h3>
      <p>${esc(t.stack)}</p>
      <span class="sg-fill">${have}/${need} members</span>
    </header>
    ${groups}
    ${hire}
  </article>`;
}

function extraCard() {
  const byRole = {};
  extras.forEach((m) => (byRole[m.role] = byRole[m.role] || []).push(m));
  const groups = Object.entries(byRole).map(([role, list]) => `<div class="slot-group">
      <div class="slot-head"><span>${esc(role)}</span><span class="slot-count">${list.length}</span></div>
      <ul>${list.map(person).join('')}</ul>
    </div>`).join('');

  return `<article class="sg-team sg-team--extra">
    <header class="sg-team-head">
      <span class="node-abbr">EXTRA</span>
      <h3>Extra members</h3>
      <p>More people than the slots for their role</p>
      <span class="sg-fill">${extras.length} members</span>
    </header>
    ${groups || '<p class="hire hire--done">No extra members</p>'}
  </article>`;
}

// ---------- Team Suggestion tab ----------
const totalSlots = sum(plan.map((t) => sum(Object.values(t.slots))));
const totalFilled = sum(plan.map((t) => sum(Object.values(t.filled).map((a) => a.length))));
const hireByRole = {};
plan.forEach((t) => Object.entries(t.slots).forEach(([s, n]) => {
  const gap = n - t.filled[s].length;
  if (gap > 0) hireByRole[s] = (hireByRole[s] || 0) + gap;
}));

document.getElementById('sg-summary').innerHTML = `
  <div class="sg-stat"><b>${plan.length}</b><span>Teams, 1 PM each</span></div>
  <div class="sg-stat"><b>${totalFilled}/${totalSlots}</b><span>Slots filled by current members</span></div>
  <div class="sg-stat sg-stat--hire"><b>${totalSlots - totalFilled}</b><span>Open slots to hire later</span></div>
  <div class="sg-stat"><b>${extras.length}</b><span>Extra members</span></div>`;

document.getElementById('sg-hire-total').innerHTML = Object.entries(hireByRole)
  .map(([s, n]) => `<li><span>${SLOT_LABELS[s]}</span><b>${n}</b></li>`).join('');

document.getElementById('sg-teams').innerHTML = plan.map(teamCard).join('') + extraCard();

const special = teams.find((t) => t.id === SPECIAL_CASE_ID);
document.getElementById('sg-special').innerHTML = `
  <section class="team-card team-card--purple">
    <h3 class="team-card-head">Special Case Team<span class="team-count">${special.members.length}</span></h3>
    <table class="team-table"><tbody>${special.members.map(([id, name, role, flag]) =>
      `<tr${flag === 'teal' || flag === 'pink' ? ` class="row--${flag}"` : ''}><td class="t-id">${esc(id)}</td><td>${esc(name)}</td><td>${esc(role)}</td></tr>`
    ).join('')}</tbody></table>
  </section>`;

document.getElementById('sg-rapid').innerHTML = RAPID_TEAMS.map((r) => `
  <section class="team-card team-card--orange">
    <h3 class="team-card-head">${esc(r.label)}<span class="team-count">OM ${r.om}</span></h3>
    <table class="team-table"><tbody>${r.slots.map((stack) =>
      `<tr><td class="rapid-stack">${esc(stack)}</td><td class="rapid-open">To be assigned</td></tr>`
    ).join('')}</tbody></table>
  </section>`).join('');

// ---------- Structure Suggestion tab ----------
const chart = document.getElementById('sg-chart');
const svg = document.getElementById('sg-lines');

// What the note card says for each box (texts come from notes.js)
const BOXES = {
  gm: { type: 'gm' },
  agm: { type: 'agm' },
  pc: { type: 'pc' },
  'om-1': { type: 'om', context: 'Operations Manager 1 · PM 1–3 and Rapid Team 1' },
  'om-2': { type: 'om', context: 'Operations Manager 2 · PM 4–6 and Rapid Team 2' },
  'rapid-1': { type: 'spt', context: 'Reports to Operations Manager 1 · every stack + 2 SQA' },
  'rapid-2': { type: 'spt', context: 'Reports to Operations Manager 2 · every stack + 2 SQA' },
  special: {
    note: {
      abbr: 'SC',
      label: 'Special Case Team',
      short: 'Special members handled directly by the GM and AGM, outside the Operations Manager / Project Manager chain.',
      tasks: NOTES.dev.tasks,
    },
    context: `${special.members.length} members · GM & AGM`,
  },
};

plan.forEach((t, i) => {
  const n = i + 1;
  const col = n;
  const have = sum(Object.values(t.filled).map((a) => a.length));
  const need = sum(Object.values(t.slots));
  BOXES[`pm-${n}`] = { type: 'pm', context: `Project Manager ${n} · leads ${t.label} · Operations Manager ${i < 3 ? 1 : 2}` };
  BOXES[`team-${n}`] = { type: 'dev', context: `${t.label} · ${t.stack} · ${have}/${need} members · PM ${n}` };

  const pm = document.createElement('button');
  pm.className = 'anode anode--lead';
  pm.dataset.id = `pm-${n}`;
  pm.style.gridRow = '5';
  pm.style.gridColumn = col;
  pm.innerHTML = `<span class="node-abbr">PM ${n}</span><span class="node-title">Project Manager ${n}</span>`;
  chart.appendChild(pm);

  const team = document.createElement('button');
  team.className = 'anode anode--team';
  team.dataset.id = `team-${n}`;
  team.style.gridRow = '6';
  team.style.gridColumn = col;
  team.innerHTML = `<span class="node-title">${esc(t.label)}</span><span class="node-sub">${esc(t.stack)}</span>`;
  chart.appendChild(team);
});

// Connections: [from, to, kind]  kind: 'down' | 'side' | 'dashed' | 'special'
const EDGES = [
  ['gm', 'agm', 'down'],
  ['agm', 'pc', 'down'],
  ['pc', 'om-1', 'down'],
  ['pc', 'om-2', 'down'],
  ['om-1', 'rapid-1', 'dashed'],
  ['om-2', 'rapid-2', 'dashed'],
  ['gm', 'special', 'special'],
  ['agm', 'special', 'special'],
];
plan.forEach((_, i) => {
  EDGES.push([i < 3 ? 'om-1' : 'om-2', `pm-${i + 1}`, 'down']);
  EDGES.push([`pm-${i + 1}`, `team-${i + 1}`, 'down']);
});

function box(id) {
  const r = chart.querySelector(`[data-id="${id}"]`).getBoundingClientRect();
  const c = chart.getBoundingClientRect();
  return { left: r.left - c.left, right: r.right - c.left, top: r.top - c.top, bottom: r.bottom - c.top, cx: r.left - c.left + r.width / 2, cy: r.top - c.top + r.height / 2 };
}

function pathFor([from, to, kind]) {
  const a = box(from), b = box(to);
  if (kind === 'dashed') {
    // Side arrow from the OM to its Rapid Team
    return a.cx < b.cx ? `M${a.right},${a.cy} H${b.left - 4}` : `M${a.left},${a.cy} H${b.right + 4}`;
  }
  if (kind === 'special') {
    // Out of the right side, across, down; GM and AGM land side by side
    const x = b.cx + (from === 'gm' ? 18 : -18);
    return `M${a.right},${a.cy} H${x} V${b.top - 4}`;
  }
  const midY = (a.bottom + b.top) / 2;
  return `M${a.cx},${a.bottom} V${midY} H${b.cx} V${b.top - 4}`;
}

function draw() {
  if (!chart.offsetParent) return; // tab hidden
  svg.innerHTML =
    '<defs><marker id="sg-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0,0 L10,5 L0,10 z"></path></marker>' +
    '<marker id="sg-arrow-special" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0,0 L10,5 L0,10 z"></path></marker></defs>' +
    EDGES.map((e) => {
      const cls = `edge${e[2] === 'dashed' ? ' line--dashed' : ''}${e[2] === 'special' ? ' line--special' : ''}`;
      const marker = e[2] === 'dashed' ? 'sg-arrow-special' : 'sg-arrow';
      return `<path class="${cls}" data-from="${e[0]}" data-to="${e[1]}" d="${pathFor(e)}" marker-end="url(#${marker})"></path>`;
    }).join('');
  if (selectedId) highlight(selectedId);
  positionNote();
}

window.addEventListener('resize', draw);
window.addEventListener('load', draw);

// ---------- Click a box: note card (same as My Idea) ----------
const note = document.createElement('aside');
note.className = 'note';
note.setAttribute('role', 'dialog');
note.hidden = true;
chart.appendChild(note);

let selectedId = null;
let hoveredId = null;

function highlight(id) {
  chart.classList.add('has-selection');
  svg.querySelectorAll('.edge').forEach((p) => {
    p.classList.toggle('active', p.dataset.from === id || p.dataset.to === id);
  });
}

function renderNote(id) {
  const b = BOXES[id];
  const n = b.note || NOTES[b.type];
  note.innerHTML = `
    <button class="note-close" aria-label="Close note">&times;</button>
    <div class="note-head">
      <span class="note-badge">${n.abbr}</span>
      <div>
        <h2>${n.label}</h2>
        ${b.context ? `<p class="note-context">${esc(b.context)}</p>` : ''}
      </div>
    </div>
    <p class="note-short">${n.short}</p>
    <div class="note-tasks-header">
      <span class="note-tasks-title">Assigned Tasks</span>
      <span class="note-tasks-count">${n.tasks.length}</span>
    </div>
    <ul class="note-tasks-list">
      ${n.tasks.map((task) => `<li><span class="note-task-check" aria-hidden="true">✓</span><span>${task}</span></li>`).join('')}
    </ul>`;
  note.querySelector('.note-close').addEventListener('click', closeNote);
}

function positionNote() {
  if (!selectedId || note.hidden) return;
  const b = box(selectedId);
  const nodeRect = chart.querySelector(`[data-id="${selectedId}"]`).getBoundingClientRect();
  const w = note.offsetWidth;
  const h = note.offsetHeight;
  const GAP = 16;

  const fitsRight = nodeRect.right + GAP + w <= window.innerWidth - 8;
  const fitsLeft = nodeRect.left - GAP - w >= 8;
  const onRight = fitsRight || !fitsLeft;
  const left = onRight ? b.right + GAP : b.left - GAP - w;

  let top = b.top - 8;
  top = Math.min(top, chart.offsetHeight - h);
  top = Math.max(top, 0);

  note.style.left = `${left}px`;
  note.style.top = `${top}px`;
  note.classList.toggle('note--left', !onRight);
  const caret = Math.min(Math.max(b.top + Math.min(b.bottom - b.top, 80) / 2 - top, 18), h - 18);
  note.style.setProperty('--caret-y', `${caret}px`);
}

function openNote(id) {
  chart.querySelectorAll('.anode.selected').forEach((n) => n.classList.remove('selected'));
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
  chart.querySelectorAll('.anode.selected').forEach((n) => n.classList.remove('selected'));
  selectedId = null;
}

chart.addEventListener('click', (e) => {
  if (e.target.closest('.note')) return;
  const node = e.target.closest('.anode');
  if (!node) return closeNote();
  if (node.dataset.id === selectedId) return closeNote();
  openNote(node.dataset.id);
});

// Hover (or keyboard focus): light up the lines connected to the box
function setHover(e) {
  const node = e.target.closest('.anode');
  const id = node ? node.dataset.id : null;
  if (id === hoveredId) return;
  hoveredId = id;
  svg.querySelectorAll('.edge').forEach((p) => {
    p.classList.toggle('hover', !!id && (p.dataset.from === id || p.dataset.to === id));
  });
}

chart.addEventListener('mouseover', setHover);
chart.addEventListener('focusin', setHover);
chart.addEventListener('mouseleave', () => setHover({ target: chart }));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNote();
});

// ---------- Tabs ----------
const tabs = document.querySelectorAll('.sg-tab');

function showTab(name) {
  tabs.forEach((b) => {
    const on = b.dataset.tab === name;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on);
    document.getElementById(`tab-${b.dataset.tab}`).hidden = !on;
  });
  if (name !== 'structure') closeNote();
  draw();
}

tabs.forEach((b) => b.addEventListener('click', () => {
  history.replaceState(null, '', `#${b.dataset.tab}`);
  showTab(b.dataset.tab);
}));

showTab(location.hash === '#teams' ? 'teams' : 'structure');
