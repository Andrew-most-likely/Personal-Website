function loadProjects() {
  fetch('../JSON/projects.json')
    .then(response => response.json())
    .then(projects => {
      const projectSection = document.getElementById("ProjectSection");
      const container = projectSection.querySelector('.container');
      let projectHTML = '';

      projects.forEach(project => {
        projectHTML += `
          <div class="project-column">
            <video preload="none" loop muted poster="${project.poster}" onmouseover="this.play()" onmouseout="this.pause();this.currentTime=0;">
              <source src="${project.video}" type="video/mp4">Your browser does not support the video tag.
            </video>
            <div class="project-label">${project.name}</div>
          </div>
        `;
      });

      container.innerHTML = projectHTML; // Insert the generated HTML into the container
    })
    .catch(error => console.error('Error loading projects:', error));
}

window.onload = loadProjects;
