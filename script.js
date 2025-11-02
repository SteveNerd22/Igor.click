const img = document.querySelector('.avatar-wrap img');
let angle = 0;
let running = true;
const speed = 0.3; // gradi per frame

function rotate() {
  if (running) {
    angle = (angle + speed) % 360;
    // combina il translate già presente con la rotazione
    img.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  }
  requestAnimationFrame(rotate);
}

img.addEventListener('click', () => running = !running);

rotate();
