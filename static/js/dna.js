const canvas = document.getElementById("dna-bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let t = 0;

// DNA Parameters
const BASE_PAIRS = 50;
const STRAND_RADIUS = 3;
const LINK_WIDTH = 1.5;

function drawDNA() {
  // Create a slight trailing effect for motion blur
  ctx.fillStyle = "rgba(10, 10, 15, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const h = canvas.height;
  const step = h / BASE_PAIRS;

  for (let i = 0; i < BASE_PAIRS; i++) {
    const y = i * step;

    // Calculate rotation base
    const angleBase = (i * 0.2) + t;

    // The two strands of DNA (Sine waves out of phase by PI)
    const amplitude = Math.min(canvas.width * 0.2, 150); // Responsive width

    // We create a "3D" effect by scaling the x distance and particle size based on a mock z-depth

    // Strand 1
    const z1 = Math.cos(angleBase);
    const x1 = centerX + Math.sin(angleBase) * amplitude;
    const size1 = STRAND_RADIUS * ((z1 + 2) / 2); // Larger when "closer"

    // Strand 2
    const z2 = Math.cos(angleBase + Math.PI);
    const x2 = centerX + Math.sin(angleBase + Math.PI) * amplitude;
    const size2 = STRAND_RADIUS * ((z2 + 2) / 2);

    // Multi-color hue shift over time and vertical position
    const hue = (t * 50 + i * 5) % 360;
    const color = `hsl(${hue}, 100%, 65%)`;
    const dimmedColor = `hsl(${hue}, 50%, 30%)`;

    // Draw the connecting link (Hydrogen bond)
    // We only draw links if one of the strands is "in front" (z > 0 somewhat)
    // Or we draw them faintly in the background.
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);

    // Fade the link based on depth 
    const depthAvg = (z1 + z2) / 2; // Actually always 0, but we use it for logic.
    // Instead we fade based on the absolute distance between x1 and x2
    const dist = Math.abs(x1 - x2);
    const maxDist = amplitude * 2;
    const alpha = (dist / maxDist) * 0.5 + 0.1;

    ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
    ctx.lineWidth = LINK_WIDTH;
    ctx.stroke();

    // Draw Strand 1 Particle
    ctx.beginPath();
    ctx.arc(x1, y, size1, 0, Math.PI * 2);
    ctx.fillStyle = z1 > 0 ? color : dimmedColor;
    ctx.shadowBlur = z1 > 0 ? 10 : 0;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset

    // Draw Strand 2 Particle
    ctx.beginPath();
    ctx.arc(x2, y, size2, 0, Math.PI * 2);
    ctx.fillStyle = z2 > 0 ? color : dimmedColor;
    ctx.shadowBlur = z2 > 0 ? 10 : 0;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset
  }

  t += 0.03;
  requestAnimationFrame(drawDNA);
}

drawDNA();