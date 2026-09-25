/* =========================================================
   1. ROLE NOTES – the text shown in the small note card.
      One entry per kind of role; edit the wording here.
   ========================================================= */
const NOTES = {
  gm: {
    abbr: 'GM',
    label: 'General Manager',
    short: 'Oversees organizational direction, sales, FSD, CMS, and high-level performance metrics.',
    tasks: [
      '07 KAM overall status check',
      'Escalation Group Check',
      'Manage Sales + FSD + CMS',
      'Review Delivery Performance',
      'Review Overall Performance',
      'Receive Delivery & Cancel Data',
      'Communication With Sales',
      'Check Profile Health',
      'Profile Audit',
      'Client Message Pass & Receive',
    ],
  },
  agm: {
    abbr: 'AGM',
    label: 'Assistant General Manager',
    short: 'Assists the GM in monitoring sales, operations, profile health, delivery data, and deadlines.',
    tasks: [
      '07 KAM overall status check',
      'Escalation Group Check',
      'Manage Sales + FSD + CMS',
      'Review Delivery Performance',
      'Review Overall Performance',
      'Receive Delivery & Cancel Data',
      'Communication With Sales',
      'Check Profile Health',
      'Profile Audit',
      'Project Deadline Check',
      'Client Message Pass & Receive',
    ],
  },
  sales: {
    abbr: 'SALES',
    label: 'Sales Department',
    short: 'Brings in new client projects, communicates requirements with management, and hands over project scopes to the Project Coordinator.',
    tasks: [
      'Manage Sales + FSD + CMS',
      'Communication With Sales',
      'Client Message Pass & Receive',
      '07 KAM overall status check',
      'Escalation Group Check',
      'Handover Project To FSD / PC',
      'Review Delivery & Cancel Data',
    ],
  },
  pc: {
    abbr: 'PC',
    label: 'Project Coordinator',
    short: 'Assigns projects to FSD, monitors Operations Managers, tracks delivery progress, and audits projects.',
    tasks: [
      '07 KAM overall status check',
      'Escalation Group Check',
      'Assign Project To FSD',
      'Review Operation Manager',
      'Collect Delivery & Cancel Data',
      'Communication With Sales',
      'Profile Audit',
      'Project Audit',
      'Project Deadline Check',
      'Client Message Pass & Receive',
      'Project Tracker',
    ],
  },
  om: {
    abbr: 'OP',
    label: 'Operation Manager',
    short: 'Manages Project Managers and Special Team, reviews delivery data, and handles project tracking and urgent escalations.',
    tasks: [
      '07 KAM overall status check',
      'Escalation Group Check',
      'Manage Project Manager + Special',
      'Review Project Manager',
      'Collect Delivery & Cancel Data & Review',
      'Communication With Sales',
      'Project Audit',
      'Project Deadline Check',
      'Project Order Sheet Update',
      'Client Message Pass & Receive',
      'Client Meeting (In Case Of Emergency)',
      'Task Manager',
      'Project Tracker',
      'Support Message Check And Write',
    ],
  },
  pm: {
    abbr: 'PM',
    label: 'Project Manager',
    short: 'Manages development teams, assigns developer tasks, updates project sheets, and leads client communication.',
    tasks: [
      '07 KAM overall status check',
      'Escalation Group Check',
      'Manage Teams + Special',
      'Review Team Performance',
      'Generate Delivery & Cancel Data',
      'Communication With Sales',
      'Project Audit',
      'Project Deadline Check',
      'Project Order Sheet Update',
      'Client Message Pass & Receive',
      'Client Meeting',
      'Assign Task',
      'Project Tracker',
    ],
  },
  spt: {
    abbr: 'SPDev',
    label: 'Special Dev / Stack Leader',
    short: 'Delivers rapid & high-priority projects, trains developers, performs QA on stacks, and checks source code.',
    tasks: [
      'Project Deadline Check',
      'Generate Update Message',
      'Check Summary',
      'Complete Task',
      'QA Stacks Work',
      'Update Github & Source Code Check + Other',
      'Trainer',
      'Work On Rapid Project & Important',
    ],
  },
  dev: {
    abbr: 'DEV',
    label: 'Developer',
    short: 'Completes assigned features and tasks, updates GitHub/source code, checks summaries, and generates progress updates.',
    tasks: [
      'Project Deadline Check',
      'Generate Update Message',
      'Check Summary',
      'Complete Task',
      'Update Github & Source Code Check',
    ],
  },
};

/* =========================================================
   2. BOXES IN THE CHART – which kind of role each box is,
      plus team member lists.
   ========================================================= */
const ROLES = {
  gm: { type: 'gm' },
  agm: { type: 'agm' },
  sales: { type: 'sales', context: 'Deals & client acquisition' },
  pc: { type: 'pc', context: 'Final title not decided yet' },
};

// The 4 teams – every Operation Manager side has this same set
const TEAMS = {
  a: { stack: 'Laravel', members: { 'UI/UX': 3, Frontend: 4, Flutter: 4, Laravel: 5 } },
  b: { stack: 'Laravel', members: { 'UI/UX': 3, Frontend: 4, Flutter: 4, Laravel: 5 } },
  c: { stack: 'Python', members: { 'UI/UX': 3, Frontend: 4, Flutter: 4, Django: 5 } },
  d: {
    stack: 'MERN',
    members: { 'UI/UX': 3, 'MERN + Front': 3, 'MERN + Native': 3, 'MERN + Back': 3, n8n: 4 },
  },
};

// The Special / Rapid Team – each side has its own, with this same set of people
const SPECIAL_MEMBERS = { 'UI/UX': 1, Frontend: 1, Flutter: 1, Laravel: 1, MERN: 1, Django: 1, SQA: 1, n8n: 1 };

// The 3 Project Managers on each side (left to right) and the teams they lead
const PM_GROUPS = [
  { key: 'ac', teams: ['a', 'c'], label: 'Team A & Team C' },
  { key: 'all', teams: ['a', 'c', 'b', 'd'], label: 'all four teams', optional: true },
  { key: 'bd', teams: ['b', 'd'], label: 'Team B & Team D' },
];

const SIDES = [1, 2];

SIDES.forEach((s) => {
  const pmNumbers = PM_GROUPS.map((g, i) => (s - 1) * PM_GROUPS.length + i + 1);

  ROLES[`om-${s}`] = { type: 'om', context: `Operation Manager ${s} · one of two` };

  ROLES[`spt-${s}`] = {
    type: 'spt',
    context: `Special / Rapid Team · Operation Manager ${s} side`,
    members: SPECIAL_MEMBERS,
    reportsTo: `Operations Manager ${s}`,
    note: 'Each member is also the Stack Leader for their skill',
  };

  PM_GROUPS.forEach((g, i) => {
    ROLES[`pm-${s}${g.key}`] = {
      type: 'pm',
      context: `Project Manager ${pmNumbers[i]} · leads ${g.label}`,
      optional: g.optional,
    };
  });

  Object.keys(TEAMS).forEach((t) => {
    const leads = PM_GROUPS.map((g, i) => (g.teams.includes(t) ? pmNumbers[i] : null)).filter(Boolean);
    ROLES[`team-${s}${t}`] = {
      type: 'dev',
      context: `Team ${t.toUpperCase()} (${TEAMS[t].stack}) · Operation Manager ${s} side`,
      members: TEAMS[t].members,
      reportsTo: `PM ${leads.join(' & PM ')}`,
    };
  });
});

/* =========================================================
   3. CONNECTIONS – which box points to which.
      type: 'down'  = straight down arrow
            'tree'  = org-chart style (down, across, down)
                      `mid` = where the horizontal part sits (0–1)
            'side'  = horizontal arrow
            'dashed'= Special Team support line
            'sales' = two-way link with Sales (green)
   ========================================================= */
const EDGES = [
  { from: 'gm', to: 'agm', type: 'down' },
  { from: 'agm', to: 'pc', type: 'down' },
  { from: 'pc', to: 'om-1', type: 'tree' },
  { from: 'pc', to: 'om-2', type: 'tree' },
  // Roles that work directly with Sales
  { from: 'sales', to: 'gm', type: 'sales' },
  { from: 'sales', to: 'agm', type: 'sales' },
  { from: 'sales', to: 'pc', type: 'sales' },
];

SIDES.forEach((s) => {
  EDGES.push({ from: 'sales', to: `om-${s}`, type: 'sales' });
  PM_GROUPS.forEach((g) => EDGES.push({ from: 'sales', to: `pm-${s}${g.key}`, type: 'sales', optional: !!g.optional }));
  EDGES.push({ from: `om-${s}`, to: `spt-${s}`, type: 'side' });
  PM_GROUPS.forEach((g) => {
    const pm = `pm-${s}${g.key}`;
    const optional = !!g.optional;
    EDGES.push({ from: `om-${s}`, to: pm, type: 'tree', optional });
    EDGES.push({ from: `spt-${s}`, to: pm, type: 'dashed', optional });
    // The "all teams" PM's lines run higher so they don't overlap the others
    const mid = g.key === 'all' ? 0.3 : 0.6;
    g.teams.forEach((t) => EDGES.push({ from: pm, to: `team-${s}${t}`, type: 'tree', mid, optional }));
  });
});

/* =========================================================
   4. DRAWING THE LINES
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

// Sales links: GM, AGM and PC get a short direct line. OMs and PMs are
// reached through one shared green line that drops down from Sales
// (between Special Team 2 and OM 2) and splits along a bar above each row.
function salesPath(to) {
  const s = box('sales');
  const b = box(to);
  const role = ROLES[to].type;

  if (role === 'gm') return `M ${b.r + GAP} ${b.cy} H ${s.cx} V ${s.t - GAP}`;
  if (role === 'agm') return `M ${s.l - GAP} ${s.cy} H ${b.r + GAP}`;

  const spt = box('spt-2');
  const om = box('om-2');
  const railX = Math.min(Math.max((spt.r + om.l) / 2, s.l + 12), s.r - 12);
  const start = `M ${railX} ${s.b + GAP}`;

  if (role === 'pc') return `${start} V ${b.cy} H ${b.r + GAP}`;

  // Left side lands on the inner (right) part of the box, right side on the
  // inner (left) part, away from the other lines that arrive at the top.
  const leftSide = b.cx < railX;
  if (role === 'om') {
    const x = leftSide ? b.r - 28 : b.l + 28;
    return `${start} V ${b.t - 14} H ${x} V ${b.t - GAP}`;
  }
  // PM: Special Team lines land on one side of the box, so use the other
  const x = b.cx + (leftSide ? -1 : 1) * b.w * 0.3;
  return `${start} V ${b.t - 22} H ${x} V ${b.t - GAP}`;
}

function pathFor(edge) {
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
   5. NOTE CARD – small card that appears next to the
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
