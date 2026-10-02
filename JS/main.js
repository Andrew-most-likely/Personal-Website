// Icons
if (typeof lucide !== 'undefined') lucide.createIcons();

// Footer year
document.querySelectorAll('.js-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Scroll fade-in
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-section').forEach(el => fadeObserver.observe(el));
