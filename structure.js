/* =========================================================
   1. BOXES IN THE CHART – which kind of role each box is,
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
   2. CONNECTIONS – which box points to which.
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
