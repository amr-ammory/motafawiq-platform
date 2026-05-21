/* ===== PARTICLE CANVAS ===== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const COLORS = ['rgba(245,166,35,', 'rgba(232,116,10,', 'rgba(255,204,68,'];

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', () => { resize(); initParticles(); });
resize();

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 9000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.015 + 0.005
    });
  }
}
initParticles();

let mouseX = -1000, mouseY = -1000;
canvas.addEventListener('mousemove', e => {
  const r = canvas.getBoundingClientRect();
  mouseX = e.clientX - r.left;
  mouseY = e.clientY - r.top;
});

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.pulse += p.pulseSpeed;
    const a = p.alpha + Math.sin(p.pulse) * 0.15;
    const dx = p.x - mouseX, dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repel = dist < 120 ? (120 - dist) / 120 : 0;
    p.x += p.vx + (repel * dx / dist) * 0.6;
    p.y += p.vy + (repel * dy / dist) * 0.6;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    // draw lines to nearby
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const ldx = p.x - q.x, ldy = p.y - q.y;
      const ld = Math.sqrt(ldx * ldx + ldy * ldy);
      if (ld < 90) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(245,166,35,${0.06 * (1 - ld / 90)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + Math.max(0, Math.min(1, a)) + ')';
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.number-val').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const numSection = document.querySelector('.numbers-section');
if (numSection) counterObserver.observe(numSection);

/* ===== AOS – scroll reveal ===== */
const aosEls = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.aosDelay || 0);
      setTimeout(() => e.target.classList.add('aos-animate'), delay);
      aosObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
aosEls.forEach(el => aosObserver.observe(el));

/* ===== TESTIMONIAL SLIDER ===== */
const cards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
let current = 0;
function goTo(n) {
  cards[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + cards.length) % cards.length;
  cards[current].classList.add('active');
  dots[current].classList.add('active');
}
document.getElementById('nextBtn').addEventListener('click', () => goTo(current - 1));
document.getElementById('prevBtn').addEventListener('click', () => goTo(current + 1));
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
setInterval(() => goTo(current + 1), 5000);
