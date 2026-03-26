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

const profilePhoto = document.getElementById("profilePhoto");

const photos = [
  "ASSETS/IMAGES/profile-photo1.webp",
  "ASSETS/IMAGES/profile-photo2.webp",
  "ASSETS/IMAGES/profile-photo3.webp",
  "ASSETS/IMAGES/profile-photo4.webp",
  "ASSETS/IMAGES/profile-photo5.webp",
  "ASSETS/IMAGES/profile-photo6.webp",
];

let currentIndex = 0;

setInterval(() => {
  profilePhoto.style.opacity = 0;
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % photos.length;
    profilePhoto.src = photos[currentIndex];
    profilePhoto.style.opacity = 1;
  }, 0); // match the CSS transition time
}, 4000);
