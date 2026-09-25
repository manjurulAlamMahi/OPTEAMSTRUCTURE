/* =========================================================
   ALTERNATIVE STRUCTURE
   1. BOXES IN THE CHART – which kind of role each box is,
      plus team member lists.
   ========================================================= */
const ROLES = {
  pc: { type: 'pc', context: 'Top of the structure' },
  spt: {
    type: 'spt',
    context: 'Special / Rapid Team · reports to the Project Coordinator',
    members: { Frontend: 3, 'Mobile App': 1, Backend: 2, 'UI/UX': 1, Django: 1 },
    reportsTo: 'Project Coordinator',
    note: 'Each member is also the Stack Leader for their skill',
  },
};

// The 6 teams, left to right. Operations Manager 1 has Teams 1–3,
// Operations Manager 2 has Teams 4–6.
const TEAMS = [
  { stack: 'Web & Mobile', members: { Frontend: 3, 'Mobile App': 3, Backend: 5, 'UI/UX': 2 } },
  { stack: 'Web & Mobile', members: { Backend: 4, 'Mobile App': 4, Frontend: 3, 'UI/UX': 2 } },
  { stack: 'Web & Mobile', members: { 'Mobile App': 4, Frontend: 3, Backend: 5, 'UI/UX': 2 } },
  { stack: 'Web & Mobile', members: { 'Mobile App': 4, Frontend: 3, 'UI/UX': 2, Backend: 5 } },
  { stack: 'Django & MERN', members: { Django: 7, 'UI/UX': 2, 'Mobile App': 2, MERN: 6 } },
  { stack: 'n8n & AI', members: { n8n: 5, AI: 2, 'Frontend + n8n': 1 } },
];

const TEAMS_PER_OM = 3;

[1, 2].forEach((s) => {
  ROLES[`om-${s}`] = { type: 'om', context: `Operation Manager ${s} · one of two` };
});

TEAMS.forEach((team, i) => {
  const n = i + 1;
  const om = Math.floor(i / TEAMS_PER_OM) + 1;
  ROLES[`pm-${n}`] = { type: 'pm', context: `Project Manager ${n} · leads Team ${n}` };
  ROLES[`team-${n}`] = {
    type: 'dev',
    context: `Team ${n} (${team.stack}) · Operation Manager ${om} side`,
    members: team.members,
    reportsTo: `Project Manager ${n}`,
  };
});

/* =========================================================
   2. CONNECTIONS – which box points to which.
      type: 'tree'  = org-chart style (down, across, down)
            'down'  = straight down arrow
            'elbow' = across from the side, then down
   ========================================================= */
const EDGES = [
  { from: 'pc', to: 'om-1', type: 'tree' },
  { from: 'pc', to: 'om-2', type: 'tree' },
  { from: 'pc', to: 'spt', type: 'elbow' },
];

TEAMS.forEach((team, i) => {
  const n = i + 1;
  const om = Math.floor(i / TEAMS_PER_OM) + 1;
  EDGES.push({ from: `om-${om}`, to: `pm-${n}`, type: 'tree' });
  EDGES.push({ from: `pm-${n}`, to: `team-${n}`, type: 'down' });
});
