const canvas = document.getElementById('dna-bg');
const ctx = canvas.getContext('2d');

let width, height;
let strands = [];

function init() {
  resize();
  createStrands();
  animate();
}

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createStrands() {
  strands = [];
  // Increase density: more strands
  const strandCount = 12;
  for (let i = 0; i < strandCount; i++) {
    strands.push({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 400 + Math.random() * 800,
      amplitude: 30 + Math.random() * 20,
      frequency: 0.005 + Math.random() * 0.01,
      speed: 0.2 + Math.random() * 0.5,
      rotation: (Math.PI / 4) + (Math.random() - 0.5) * 0.2, // ~45 degrees
      hueOffset: Math.random() * 360 // Start at different colors
    });
  }
}

function drawStrand(strand, time) {
  const points = 40;
  const step = strand.length / points;

  // Dynamic Color Shift based on time
  const hue = (time * 0.05 + strand.hueOffset) % 360;
  const colorA = `hsla(${hue}, 100%, 60%, 0.4)`;
  const colorB = `hsla(${(hue + 60) % 360}, 100%, 60%, 0.4)`;

  ctx.save();
  ctx.translate(strand.x, strand.y);
  ctx.rotate(strand.rotation);

  // Drifting motion
  const driftX = Math.sin(time * 0.001 + strand.hueOffset) * 50;
  const driftY = Math.cos(time * 0.0012 + strand.hueOffset) * 50;
  ctx.translate(driftX, driftY);

  for (let i = -points / 2; i < points / 2; i++) {
    const x = i * step;
    const phase = i * 0.2 + time * 0.005;
    const y1 = Math.sin(phase) * strand.amplitude;
    const y2 = Math.sin(phase + Math.PI) * strand.amplitude;

    // Connections (Base Pairs)
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.1)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Nodes (Atoms/Nucleotides)
    ctx.beginPath();
    ctx.arc(x, y1, 3, 0, Math.PI * 2);
    ctx.fillStyle = colorA;
    ctx.fill();
    // Glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = colorA;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y2, 3, 0, Math.PI * 2);
    ctx.fillStyle = colorB;
    ctx.fill();
    ctx.shadowColor = colorB;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

function animate() {
  const time = Date.now();
  ctx.clearRect(0, 0, width, height);

  // Subtle background particles
  for (let i = 0; i < 50; i++) {
    const px = (Math.sin(time * 0.0005 + i) * 0.5 + 0.5) * width;
    const py = (Math.cos(time * 0.0004 + i) * 0.5 + 0.5) * height;
    ctx.beginPath();
    ctx.arc(px, py, 1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();
  }

  strands.forEach(s => drawStrand(s, time));
  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
init();