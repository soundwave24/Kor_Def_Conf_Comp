document.addEventListener('DOMContentLoaded', () => {
  fetch('data/conferences.json')
    .then(res => res.json())
    .then(data => {
      renderCountdowns(data.conferences);
      renderConferences(data.conferences);
      renderFooter(data.lastUpdated);
      setInterval(() => renderCountdowns(data.conferences), 60000);
    })
    .catch(err => {
      console.error('Failed to load conference data:', err);
      document.getElementById('countdowns').innerHTML =
        '<p style="color:#e53e3e;">Failed to load conference data.</p>';
    });
});

function getTimeRemaining(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;

  if (diff <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, passed: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { total: diff, days, hours, minutes, passed: false };
}

function getUrgencyClass(remaining) {
  if (remaining.passed) return 'passed';
  if (remaining.days < 7) return 'imminent';
  if (remaining.days < 30) return 'urgent';
  return '';
}

function getStatusColor(remaining) {
  if (remaining.passed) return 'gray';
  if (remaining.days < 7) return 'red';
  if (remaining.days < 30) return 'yellow';
  return 'green';
}

function renderCountdowns(conferences) {
  const container = document.getElementById('countdowns');
  const deadlines = [];

  conferences.forEach(conf => {
    conf.deadlines.forEach(dl => {
      deadlines.push({ confName: conf.name, type: dl.type, date: dl.date });
    });
  });

  deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Show only upcoming + recently passed (last 7 days)
  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const filtered = deadlines.filter(dl => new Date(dl.date) > weekAgo);

  container.innerHTML = filtered.map(dl => {
    const remaining = getTimeRemaining(dl.date);
    const urgency = getUrgencyClass(remaining);
    const dateStr = new Date(dl.date).toLocaleDateString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });

    return `
      <div class="countdown-card ${urgency}" data-deadline="${dl.date}">
        <div class="countdown-info">
          <div class="conf-name">${dl.confName}</div>
          <div class="deadline-type">${dl.type} &mdash; ${dateStr}</div>
        </div>
        ${remaining.passed
          ? '<span class="countdown-passed-text">Deadline Passed</span>'
          : `<div class="countdown-timer">
              <div class="time-unit"><span class="number">${remaining.days}</span><span class="label">Days</span></div>
              <span class="time-separator">:</span>
              <div class="time-unit"><span class="number">${String(remaining.hours).padStart(2, '0')}</span><span class="label">Hrs</span></div>
              <span class="time-separator">:</span>
              <div class="time-unit"><span class="number">${String(remaining.minutes).padStart(2, '0')}</span><span class="label">Min</span></div>
            </div>`
        }
      </div>
    `;
  }).join('');
}

function renderConferences(conferences) {
  const container = document.getElementById('conferences');

  container.innerHTML = conferences.map(conf => {
    const deadlineRows = conf.deadlines.map(dl => {
      const remaining = getTimeRemaining(dl.date);
      const color = getStatusColor(remaining);
      const dateStr = new Date(dl.date).toLocaleDateString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
      const status = remaining.passed ? 'Passed' : `D-${remaining.days}`;

      return `
        <tr>
          <td><span class="deadline-status ${color}"></span>${dl.type}</td>
          <td>${dateStr}</td>
          <td>${status}</td>
        </tr>
      `;
    }).join('');

    const papersHtml = conf.acceptedPapers.length > 0
      ? `<ul class="papers-list">
          ${conf.acceptedPapers.map(p =>
            `<li><a href="${p.url}" target="_blank">${p.title}</a> &mdash; ${p.authors}</li>`
          ).join('')}
        </ul>`
      : '<p class="papers-empty">To be announced</p>';

    return `
      <article class="conference-card">
        <div class="conference-card-header">
          <h3><a href="${conf.url}" target="_blank">${conf.name}</a></h3>
          <span class="conference-badge">${conf.dates}</span>
        </div>
        <div class="conference-card-body">
          <div class="conference-meta">
            <span>${conf.fullName}</span>
            <span>${conf.location}</span>
          </div>
          <p class="conference-description">${conf.description}</p>
          <div class="conference-links">
            <a href="${conf.url}" class="btn btn-primary" target="_blank">Conference Website</a>
            <a href="${conf.downloadUrl}" class="btn btn-outline" target="_blank">Download CFP</a>
          </div>
          <table class="deadlines-table">
            <thead>
              <tr><th>Deadline</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>${deadlineRows}</tbody>
          </table>
          <div class="papers-section">
            <h4>Accepted Papers</h4>
            ${papersHtml}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderFooter(lastUpdated) {
  document.getElementById('last-updated').textContent = lastUpdated;
}
