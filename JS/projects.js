const GITHUB_USER = 'Andrew-most-likely';

const LANG_COLORS = {
  'JavaScript':  '#f1e05a',
  'TypeScript':  '#2b7489',
  'Python':      '#3572A5',
  'C++':         '#f34b7d',
  'C':           '#555555',
  'C#':          '#178600',
  'Java':        '#b07219',
  'Rust':        '#dea584',
  'Go':          '#00ADD8',
  'Assembly':    '#6E4C13',
  'HTML':        '#e34c26',
  'CSS':         '#563d7c',
  'Shell':       '#89e051',
  'PowerShell':  '#012456',
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
}

function loadProjects() {
  fetch('../JSON/projects.json')
    .then(response => response.json())
    .then(projects => {
      const projectSection = document.getElementById('ProjectSection');

      const projectHTML = projects.map(project => {
        const external = /^https?:/.test(project.link);
        const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `
          <a class="project-column" href="${project.link}"${target}>
            <div class="project-media">
              <video preload="none" loop muted playsinline poster="${project.poster}">
                <source src="${project.video}" type="video/mp4">
              </video>
            </div>
            <div class="project-body">
              <h3 class="project-label">${project.name}<i data-lucide="arrow-up-right"></i></h3>
              ${project.description ? `<p class="project-desc">${project.description}</p>` : ''}
            </div>
          </a>
        `;
      }).join('');

      const wrapper = document.createElement('div');
      wrapper.className = 'projects-flex';
      wrapper.innerHTML = projectHTML;
      projectSection.appendChild(wrapper);

      wrapper.querySelectorAll('.project-column').forEach(card => {
        const video = card.querySelector('video');
        card.addEventListener('mouseenter', () => video.play().catch(() => {}));
        card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
      });

      if (typeof lucide !== 'undefined') lucide.createIcons();
    })
    .catch(error => console.error('Error loading projects:', error));
}

function formatRelativeDate(dateString) {
  const diff = Math.floor((Date.now() - new Date(dateString)) / 86400000);
  if (diff === 0)  return 'today';
  if (diff < 7)    return `${diff}d ago`;
  if (diff < 30)   return `${Math.floor(diff / 7)}w ago`;
  if (diff < 365)  return `${Math.floor(diff / 30)}mo ago`;
  return `${Math.floor(diff / 365)}y ago`;
}

function createRepoCard(repo) {
  const color  = LANG_COLORS[repo.language] || '#7A7570';
  const lang   = repo.language ? `
    <span class="repo-lang">
      <span class="lang-dot" style="background:${color}"></span>${repo.language}
    </span>` : '';

  const stars  = repo.stargazers_count > 0
    ? `<span class="repo-stat"><i data-lucide="star"></i>${repo.stargazers_count}</span>` : '';
  const forks  = repo.forks_count > 0
    ? `<span class="repo-stat"><i data-lucide="git-fork"></i>${repo.forks_count}</span>` : '';
  const desc   = repo.description
    ? `<p class="repo-description">${escapeHTML(repo.description)}</p>`
    : `<p class="repo-description repo-no-desc">No description provided.</p>`;

  return `
    <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
      <div class="repo-card-header">
        <span class="repo-name"><i data-lucide="book-marked"></i>${escapeHTML(repo.name)}</span>
        ${lang}
      </div>
      ${desc}
      <div class="repo-meta">
        ${stars}${forks}
        <span class="repo-updated">Updated ${formatRelativeDate(repo.updated_at)}</span>
      </div>
    </a>
  `;
}

async function loadRepos() {
  const section = document.getElementById('RepoSection');
  if (!section) return;

  const grid = section.querySelector('.repos-grid');
  grid.innerHTML = '<p class="repo-loading">Loading repositories…</p>';

  try {
    const res  = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    if (!res.ok) throw new Error(res.status);

    const repos = await res.json();
    const filtered = repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count
                   || new Date(b.updated_at) - new Date(a.updated_at));

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="repo-loading">No public repositories found.</p>';
      return;
    }

    grid.innerHTML = filtered.map(createRepoCard).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();

  } catch (err) {
    console.error('Error loading repos:', err);
    grid.innerHTML = '<p class="repo-loading">Repositories could not be loaded right now. They are all on GitHub.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  loadRepos();
});
