function loadProjects() {
  fetch('../JSON/projects.json')
    .then(response => response.json())
    .then(projects => {
      const projectSection = document.getElementById("ProjectSection");
      const container = projectSection.querySelector('.container');
      let projectHTML = '';

      projects.forEach(project => {
        // Conditionally include video or image
        const mediaContent = project.video
          ? `
            <video preload="none" loop muted poster="${project.poster}" 
              onmouseover="this.play()" 
              onmouseout="this.pause();this.currentTime=0;">
              <source src="${project.video}" type="video/mp4">
              Your browser does not support the video tag.
            </video>`
          : `<img src="${project.poster}" alt="${project.name}" class="project-image">`;

        projectHTML += `
          <div class="project-column">
            <a href="${project.link}" target="_blank">
              ${mediaContent}
            </a>
            <div class="project-label">${project.name}</div>
          </div>
        `;
      });

      container.innerHTML = projectHTML;
    })
    .catch(error => console.error('Error loading projects:', error));
}

window.onload = loadProjects;
