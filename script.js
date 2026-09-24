/* =========================================================
   1. ROLE NOTES – the text shown in the small note card.
      One entry per kind of role; edit the wording here.
   ========================================================= */
const NOTES = {
  gm: {
    abbr: 'GM',
    label: 'General Manager',
    short: "Manages the overall organization and ensures that all major departments, operations, projects, sales, and deliveries are working toward the company's targets.",
    receives: 'Performance, sales and delivery updates from the AGM',
    delivers: 'Company direction, targets and key decisions to the AGM',
    duties: [
      'Manages the overall organization',
      'Keeps all departments, teams, projects, operations, sales and deliveries moving in the right direction',
      'Sets company targets and makes key decisions',
    ],
  },
  agm: {
    abbr: 'AGM',
    label: 'Assistant General Manager',
    short: 'Monitors sales, operations, project delivery, and overall performance to ensure the organization is progressing toward its targets.',
    receives: 'Direction and targets from the GM; project status from the Project Coordinator',
    delivers: 'Performance updates to the GM; priorities and targets to the Project Coordinator',
    duties: [
      'Supports the General Manager',
      'Checks that sales targets are being achieved',
      'Checks that operations are running properly',
      'Checks that project deliveries are on track',
      'Checks that teams are meeting their targets',
      'Checks that overall business execution is progressing successfully',
    ],
  },
  pc: {
    abbr: 'PC',
    label: 'Project Coordinator',
    short: 'Assigns projects to Operation Managers, collects delivery plans and progress, monitors delivery targets, and checks overall project health.',
    receives: 'Projects, priorities and targets from management (AGM)',
    delivers: 'Assigned projects to the Operation Managers; delivery status and project health to management',
    duties: [
      'Assigns projects to the Operation Managers',
      'Collects delivery updates from Operation Managers',
      'Monitors project delivery targets',
      'Checks FPT / delivery targets and progress',
      'Collects delivery plans from Operation Managers',
      'Monitors the overall health / status of projects',
      'Makes sure projects move according to the planned delivery targets',
      'Coordinates information between management and operations',
    ],
  },
  om: {
    abbr: 'OM',
    label: 'Operation Manager',
    short: 'Assigns projects to Project Managers, manages delivery planning, monitors deadlines, and ensures projects stay on schedule.',
    receives: 'Projects from the Project Coordinator; delivery plans from Project Managers',
    delivers: 'Assigned projects to Project Managers; delivery plans and progress to the Project Coordinator',
    duties: [
      'Receives projects from the Project Coordinator',
      'Assigns projects to Project Managers',
      'Reviews the delivery plan provided by the Project Manager',
      'Updates and maintains planned delivery dates',
      'Monitors project deadlines',
      'Checks whether projects are progressing according to plan',
      'Follows up with Project Managers regarding delivery',
      'Keeps project execution aligned with the agreed timeline',
    ],
  },
  pm: {
    abbr: 'PM',
    label: 'Project Manager',
    short: 'Manages the client project, coordinates the team, assigns Developer tasks, tracks deadlines and documentation, and communicates project progress to the client.',
    receives: 'Client projects from the Operation Manager; completed work from Developers',
    delivers: 'Tasks to Developers; progress to the client; delivery plan and status to the Operation Manager',
    duties: [
      'Takes ownership of the assigned client project',
      'Ensures the project is progressing smoothly',
      'Creates and keeps project documentation up to date',
      'Tracks project deadlines',
      'Coordinates project communication',
      'Passes important updates and messages between the team and client',
      'Assigns tasks to Developers and monitors their progress',
      'Collects completed work from Developers',
      'Reviews project progress and delivery status',
      'Communicates daily / regular progress to the client',
      'Delivers the project according to the planned timeline',
    ],
  },
  spt: {
    abbr: 'SPT',
    label: 'Stack Leaders',
    short: 'Handles priority and special-case projects while providing technical leadership and reviewing source code, architecture, and development standards.',
    receives: 'Rapid, high-priority or special-case projects, sometimes assigned directly',
    delivers: 'Completed priority projects; technical direction and code-review feedback to Developers',
    duties: [
      'Handles rapid or high-priority projects',
      'Handles technically complex or special-case projects',
      'Provides technical direction to Developers',
      'Reviews project implementation',
      'Checks that Developers follow the required technical structure',
      'Reviews source code and architecture',
      'Performs technical quality checks',
      'Ensures coding standards and project structure are followed',
      'Supports the team when a project needs extra technical expertise',
    ],
  },
  dev: {
    abbr: 'DEV',
    label: 'Developer',
    short: 'Develops assigned features and fixes, follows the project structure, completes tasks within deadlines, and submits completed work to the Project Manager.',
    receives: 'Tasks and requirements from the Project Manager',
    delivers: 'Completed, tested features and fixes to the Project Manager',
    duties: [
      'Receives assigned tasks from the Project Manager',
      'Understands the requirements and expected outcome',
      'Develops the assigned features or fixes',
      "Follows the project's technical structure and standards",
      'Completes tasks within the given deadline',
      'Tests their implementation',
      'Submits completed work to the Project Manager',
      'Provides progress updates when required',
      'Fixes issues or changes found during review',
    ],
  },
};

// The chain of work, shown at the bottom of every note
const WORKFLOW = ['gm', 'agm', 'pc', 'om', 'pm', 'dev'];

/* =========================================================
   2. BOXES IN THE CHART – which kind of role each box is,
      plus team member lists.
   ========================================================= */
const ROLES = {
  gm: { type: 'gm' },
  agm: { type: 'agm' },
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
   ========================================================= */
const EDGES = [
  { from: 'gm', to: 'agm', type: 'down' },
  { from: 'agm', to: 'pc', type: 'down' },
  { from: 'pc', to: 'om-1', type: 'tree' },
  { from: 'pc', to: 'om-2', type: 'tree' },
];

SIDES.forEach((s) => {
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
    </defs>`;

  EDGES.forEach((e) => {
    const dashed = e.type === 'dashed';
    html += `<path class="edge ${dashed ? 'dashed' : ''} ${e.optional ? 'optional' : ''}" data-from="${e.from}" data-to="${e.to}"
      d="${pathFor(e)}" marker-end="url(#${dashed ? 'arrow-special' : 'arrow'})"></path>`;
  });

  svg.innerHTML = html;
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

function workflowHtml(type) {
  if (type === 'spt') {
    return `<p class="note-flow-alt">Special technical team working alongside the Operation Manager and Project Managers on priority, rapid and complex projects, and doing source-code quality checks.</p>`;
  }
  return WORKFLOW.map((t) => `<span class="${t === type ? 'current' : ''}">${NOTES[t].abbr}</span>`).join('<i>›</i>');
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

    <dl class="note-io">
      <dt>Receives</dt><dd>${n.receives}</dd>
      <dt>Delivers</dt><dd>${n.delivers}</dd>
    </dl>

    <details class="note-duties">
      <summary>Main responsibilities (${n.duties.length})</summary>
      <ul>${n.duties.map((d) => `<li>${d}</li>`).join('')}</ul>
    </details>

    <div class="note-flow">${workflowHtml(role.type)}</div>
  `;
  note.querySelector('.note-close').addEventListener('click', closeNote);
  // Opening the responsibilities list changes the card height
  note.querySelector('.note-duties').addEventListener('toggle', positionNote);
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNote();
});

draw();
