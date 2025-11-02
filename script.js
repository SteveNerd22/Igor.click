const img = document.querySelector('.avatar-wrap img');
let initialAngle = 0
let angle = initialAngle;
let spinning = true;
const speed = 0.3; // gradi per frame
const fartAudio = new Audio('fart.wav');

function rotate() {
  if (spinning) {
    angle = (angle + speed) % 360;
    // combina il translate già presente con la rotazione
    img.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  }
  requestAnimationFrame(rotate);
}

function tremoloAnimation(duration = 100) {
  const tremolo = [10, -10, 5, -5, 0];
  let i = 0;
  let lastTime = null;

  function step(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;

    if (delta >= duration) {
      img.style.transform = `translate(-50%, -50%) rotate(${angle + tremolo[i]}deg)`;
      i = (i + 1) % tremolo.length; // ciclico
      lastTime = timestamp;
    }

    if (spinning === false) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Animazione press/hold
function fartAnimationPress() {
  if (spinning) { // evita che parta più volte
    spinning = false;
    const originalSrc = img.src;
    img.src = "fart_-_orizzontale.png";
    fartAudio.currentTime = 0;
    fartAudio.play();

    tremoloAnimation();

    img._pressOriginalSrc = originalSrc; // salva per release
  }
}

function fartAnimationRelease() {
  setTimeout(() => {
    spinning = true; // ferma il tremolio continuo
    if (img._pressOriginalSrc) {
      img.src = img._pressOriginalSrc;
      delete img._pressOriginalSrc;
    }
  }, 500); // 500ms di ritardo
}

// Eventi per desktop
img.addEventListener('mousedown', fartAnimationPress);
img.addEventListener('mouseup', fartAnimationRelease);
img.addEventListener('mouseleave', fartAnimationRelease);

// Eventi per mobile
img.addEventListener('touchstart', fartAnimationPress);
img.addEventListener('touchend', fartAnimationRelease);
img.addEventListener('touchcancel', fartAnimationRelease);

rotate();
