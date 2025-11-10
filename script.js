const img = document.querySelector('.avatar-wrap img');
let initialAngle = 0;
let angle = initialAngle;
let spinning = true;
const speed = 0.3; // gradi per frame

// 🔹 Precarica le immagini e il suono
const fartImg = new Image();
fartImg.src = "fart_-_orizzontale.png";
const barkImg = new Image();
barkImg.src = "bark_-_orizzontale.png";

const originalImgSrc = img.src;

// 🔹 Precarica e mantiene l’audio in memoria
const fartAudio = new Audio("fart.wav");
fartAudio.preload = "auto"; // forza il caricamento immediato
fartAudio.load();
const barkAudio = new Audio("bark.wav");
barkAudio.preload = "auto"; // forza il caricamento immediato
barkAudio.load();
const fartElement = document.getElementById('fartElement');
const fartAnimation = lottie.loadAnimation({
  container: fartElement, // the dom element that will contain the animation
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'orizzontale.json' // the path to the animation json
});


// 🔹 Animazione rotazione
function rotate() {
  if (spinning) {
    angle = (angle + speed) % 360;
    img.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    fartElement.style.transform = `rotate(${angle}deg)`;
  }
  requestAnimationFrame(rotate);
}

// 🔹 Effetto tremolio
function tremoloAnimation(duration = 100) {
  const tremolo = [10, -10, 5, -5, 0];
  let i = 0;
  let lastTime = null;

  function step(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;

    if (delta >= duration) {
      img.style.transform = `translate(-50%, -50%) rotate(${angle + tremolo[i]}deg)`;
      i = (i + 1) % tremolo.length;
      lastTime = timestamp;
    }

    if (!spinning) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// 🔹 Animazione press
function fartAnimationPress() {
    fartElement.style.display = 'block';
    if (spinning) {
        spinning = false;
        img.src = fartImg.src; // già in memoria
        fartAudio.currentTime = 0;
        fartAudio.play();
        fartAnimation.goToAndPlay(0)
        tremoloAnimation();
    }
}

// 🔹 Animazione press
function barkAnimationPress() {
  if (spinning) {
    spinning = false;
    img.src = barkImg.src; // già in memoria
    barkAudio.currentTime = 0;
    barkAudio.play();
    tremoloAnimation();
  }
}

function AnimationPress() {
  let n = Math.floor(Math.random() * 2);
  if(n === 0) {
    fartAnimationPress()
  } else {
    barkAnimationPress()
  }
}

// 🔹 Animazione release
function AnimationRelease() {
  setTimeout(() => {
    spinning = true;
    img.src = originalImgSrc;
  }, 500);
}

function unlockAudio() {
  fartAudio.play().then(() => {
    fartAudio.pause();
    fartAudio.currentTime = 0;
  }).catch(() => {});

  barkAudio.play().then(() => {
    barkAudio.pause();
    barkAudio.currentTime = 0;
  }).catch(() => {});

  // Rimuovi l’evento dopo la prima interazione
  document.removeEventListener('mousedown', unlockAudio);
  document.removeEventListener('touchstart', unlockAudio);
}

document.addEventListener('mousedown', unlockAudio);
document.addEventListener('touchstart', unlockAudio);

// 🔹 Disabilita interazioni sull’immagine
img.addEventListener('contextmenu', e => e.preventDefault());

// 🔹 Eventi desktop
img.addEventListener('mousedown', AnimationPress);
img.addEventListener('mouseup', AnimationRelease);
img.addEventListener('mouseleave', AnimationRelease);

// 🔹 Eventi mobile
img.addEventListener('touchstart', AnimationPress);
img.addEventListener('touchend', AnimationRelease);
img.addEventListener('touchcancel', AnimationRelease);

rotate();
