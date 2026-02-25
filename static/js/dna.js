const canvas = document.getElementById('intro-canvas');
const ctx = canvas.getContext('2d');
const introOverlay = document.getElementById('intro-sequence');
const joker1 = document.getElementById('joker-bg-1');
const joker2 = document.getElementById('joker-bg-2');
const gun = document.getElementById('floating-gun');
const cardEl = document.getElementById('single-card');

let width, height;
let particles = [];
let cards = [];
let sequenceStep = 0;
const userName = "NAGESH R";

function init() {
  resize();
  startSequence();
  animate();
}

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function startSequence() {
  // Step 1: Initial Artwork (Start)

  // Step 2: Fade to Joker 2 (3s)
  setTimeout(() => {
    joker2.style.opacity = 1;
    triggerGlitch();
  }, 3000);

  // Step 3: Card Drift (5s)
  setTimeout(() => {
    cardEl.style.opacity = 1;
    animateCard();
  }, 5000);

  // Step 4: Gun Reveal (8s)
  setTimeout(() => {
    gun.style.opacity = 1;
    animateGun();
  }, 8000);

  // Step 5: Final Background (White + Scattered Cards) (12s)
  setTimeout(() => {
    introOverlay.classList.add('finished');
    document.body.classList.add('white-theme');
    createScatteredCards();
    sequenceStep = 1; // Transition to final state
  }, 12000);

  // Step 6: Name Reveal (15s)
  setTimeout(() => {
    cardsToParticles();
  }, 15000);

  // Step 7: Fade Out Intro (18s)
  setTimeout(() => {
    introOverlay.style.transition = "opacity 2s";
    introOverlay.style.opacity = 0;
    setTimeout(() => introOverlay.style.display = "none", 2000);
  }, 18000);
}

function triggerGlitch() {
  let glitchInterval = setInterval(() => {
    ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.2})`;
    ctx.fillRect(0, 0, width, height);
    if (Math.random() > 0.8) {
      ctx.drawImage(joker2, Math.random() * 20 - 10, Math.random() * 20 - 10, width, height);
    }
  }, 50);
  setTimeout(() => clearInterval(glitchInterval), 1000);
}

function animateCard() {
  let startTime = Date.now();
  function move() {
    let elapsed = (Date.now() - startTime) / 1000;
    let x = width / 2 + Math.sin(elapsed) * 100;
    let y = height - (elapsed * 50); // Drift upward
    let rot = elapsed * 2;

    cardEl.style.left = `${x}px`;
    cardEl.style.top = `${y}px`;
    cardEl.style.transform = `rotate(${rot}rad)`;

    if (elapsed < 7) requestAnimationFrame(move);
  }
  move();
}

function animateGun() {
  let startTime = Date.now();
  function float() {
    let elapsed = (Date.now() - startTime) / 1000;
    let y = height / 2 + Math.sin(elapsed * 2) * 20;
    gun.style.top = `${y}px`;
    gun.style.left = `${width / 2 - 150}px`;
    if (elapsed < 4) requestAnimationFrame(float);
  }
  float();
}

function createScatteredCards() {
  cards = [];
  for (let i = 0; i < 40; i++) {
    cards.push({
      x: Math.random() * width,
      y: Math.random() * height,
      rot: Math.random() * Math.PI * 2,
      targetX: Math.random() * width,
      targetY: Math.random() * height,
      opacity: 1
    });
  }
}

function cardsToParticles() {
  sequenceStep = 2; // Morph to name
  particles = [];

  // Create particles for the name NAGESH R
  ctx.font = `bold 120px "Creepster"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.fillText(userName, width / 2, height / 2);

  let imgData = ctx.getImageData(0, 0, width, height);
  ctx.clearRect(0, 0, width, height);

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      let i = (y * width + x) * 4;
      if (imgData.data[i + 3] > 128) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          targetX: x,
          targetY: y,
          vx: 0,
          vy: 0
        });
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  if (sequenceStep === 1) {
    // Draw scattered cards
    ctx.fillStyle = "#000";
    cards.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.font = "40px Arial";
      ctx.fillText("🃏", 0, 0);
      ctx.restore();
    });
  } else if (sequenceStep === 2) {
    // Draw particles forming name
    ctx.fillStyle = "#ff0000";
    particles.forEach(p => {
      let dx = p.targetX - p.x;
      let dy = p.targetY - p.y;
      p.x += dx * 0.1;
      p.y += dy * 0.1;
      ctx.fillRect(p.x, p.y, 2, 2);
    });
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
init();