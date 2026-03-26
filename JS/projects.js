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

function loadProjects() {
  fetch('../JSON/projects.json')
    .then(response => response.json())
    .then(projects => {
      const projectSection = document.getElementById('ProjectSection');
      let projectHTML = '';

      projects.forEach(project => {
        projectHTML += `
          <div class="project-column">
            <a href="${project.link}" target="_blank">
              <video preload="none" loop muted poster="${project.poster}"
                onmouseover="this.play()" onmouseout="this.pause();this.currentTime=0;">
                <source src="${project.video}" type="video/mp4">Your browser does not support the video tag.
              </video>
            </a>
            <div class="project-label">${project.name}</div>
          </div>
        `;
      });

      const wrapper = document.createElement('div');
      wrapper.className = 'projects-flex';
      wrapper.innerHTML = projectHTML;
      projectSection.appendChild(wrapper);
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
    ? `<p class="repo-description">${repo.description}</p>`
    : `<p class="repo-description repo-no-desc">No description provided.</p>`;

  return `
    <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
      <div class="repo-card-header">
        <span class="repo-name"><i data-lucide="book-marked"></i>${repo.name}</span>
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
    grid.innerHTML = '<p class="repo-loading">Could not load repositories — check back later.</p>';
  }
}

window.onload = () => {
  loadProjects();
  loadRepos();

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-section').forEach(el => fadeObserver.observe(el));
};
