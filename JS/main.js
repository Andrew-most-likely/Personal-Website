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
