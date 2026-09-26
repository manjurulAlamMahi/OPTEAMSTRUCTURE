// ---------- Build the lead boxes and team tables ----------
const chart = document.getElementById('alt-chart');
const svg = document.getElementById('alt-lines');

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

teams.forEach((team, i) => {
  const col = i + 1;

  // Teams under an OM get a lead box; Dotify reports straight to the top
  if (team.parent !== 'top') {
    const lead = document.createElement('div');
    lead.className = 'anode anode--lead';
    lead.dataset.id = `lead-${team.id}`;
    lead.style.gridRow = '3';
    lead.style.gridColumn = col;
    lead.innerHTML = `<span class="node-abbr">LEAD</span><span class="node-title">${esc(team.name)} Lead</span>`;
    chart.appendChild(lead);
  }

  const rows = team.members.map(([id, name, role, flag]) =>
    `<tr${flag ? ` class="row--${flag}"` : ''}>` +
    `<td class="t-id">${esc(id)}</td><td>${esc(name)}</td><td>${esc(role)}</td></tr>`
  ).join('');

  const card = document.createElement('section');
  card.className = `team-card team-card--${team.color}`;
  card.dataset.id = `team-${team.id}`;
  card.style.gridRow = '4';
  card.style.gridColumn = col;
  card.innerHTML =
    `<h2 class="team-card-head">${esc(team.name)}<span class="team-count">${team.members.length}</span></h2>` +
    `<table class="team-table"><tbody>${rows}</tbody></table>`;
  chart.appendChild(card);
});

document.getElementById('alt-legend').innerHTML =
  '<li><span class="swatch swatch--check"></span>Needs checking (read from a low-res screenshot)</li>' +
  '<li><span class="swatch swatch--teal"></span>Highlighted in the original chart</li>' +
  '<li><span class="swatch swatch--pink"></span>Highlighted in the original chart</li>';

// ---------- Connector lines ----------
function box(id) {
  const r = chart.querySelector(`[data-id="${id}"]`).getBoundingClientRect();
  const c = chart.getBoundingClientRect();
  return { left: r.left - c.left, right: r.right - c.left, top: r.top - c.top, bottom: r.bottom - c.top, cx: r.left - c.left + r.width / 2 };
}

// Elbow line from the bottom of one box to the top of another
function down(fromId, toId) {
  const a = box(fromId), b = box(toId);
  const midY = (a.bottom + b.top) / 2;
  return `M${a.cx},${a.bottom} V${midY} H${b.cx} V${b.top - 4}`;
}

function draw() {
  const paths = [
    down('top', 'om-1'),
    down('top', 'om-2'),
  ];

  teams.forEach((team) => {
    if (team.parent === 'top') {
      // Out of the right side of the top box, across, then down to the team
      const a = box('top'), b = box(`team-${team.id}`);
      const y = a.top + (a.bottom - a.top) / 2;
      paths.push(`M${a.right},${y} H${b.cx} V${b.top - 4}`);
    } else {
      paths.push(down(team.parent, `lead-${team.id}`));
      paths.push(down(`lead-${team.id}`, `team-${team.id}`));
    }
  });

  svg.innerHTML =
    '<defs><marker id="alt-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0,0 L10,5 L0,10 z" fill="var(--line)"></path></marker></defs>' +
    paths.map((d) => `<path d="${d}" marker-end="url(#alt-arrow)"></path>`).join('');
}

window.addEventListener('resize', draw);
window.addEventListener('load', draw);
draw();
