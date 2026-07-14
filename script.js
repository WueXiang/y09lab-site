// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Scrollspy: highlight the active dot-nav entry
const sections = document.querySelectorAll("main .section");
const dots = document.querySelectorAll(".dotnav a.dot");

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      dots.forEach((dot) => {
        dot.classList.toggle("active", dot.getAttribute("href") === `#${id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);

sections.forEach((section) => spy.observe(section));

// Background network animation (nodes + connecting edges)
const canvas = document.getElementById("net-bg");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let nodes = [];
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  const count = Math.round((width * height) / 28000);
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
  }));
}

function accentColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--node").trim() || "#0e7c66";
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  const color = accentColor();
  const linkDist = Math.min(width, height) * 0.12;

  nodes.forEach((n) => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < linkDist) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 1 - dist / linkDist;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 0.8;
  ctx.fillStyle = color;
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  if (!reduceMotion) requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
draw();
