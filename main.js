/* ===== PARTICLE CANVAS ===== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const COLORS = [
  'rgba(245,166,35,',
  'rgba(255,204,44,',
  'rgba(255,220,80,',
  'rgba(232,116,10,',
  'rgba(255,180,30,'
];

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', () => { resize(); initParticles(); });
resize();

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 3500);
  for (let i = 0; i < count; i++) {
    const size = Math.random();
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: size < 0.6 ? Math.random() * 1.5 + 0.6
        : size < 0.85 ? Math.random() * 2.5 + 1.5
        : Math.random() * 4 + 2.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.018 + 0.005,
      glow: Math.random() > 0.7
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
canvas.addEventListener('mouseleave', () => { mouseX = -1000; mouseY = -1000; });

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.pulse += p.pulseSpeed;
    const a = p.alpha + Math.sin(p.pulse) * 0.2;
    const dx = p.x - mouseX, dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repel = dist < 140 ? (140 - dist) / 140 : 0;
    p.x += p.vx + (repel * dx / (dist || 1)) * 0.8;
    p.y += p.vy + (repel * dy / (dist || 1)) * 0.8;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const ldx = p.x - q.x, ldy = p.y - q.y;
      const ld = Math.sqrt(ldx * ldx + ldy * ldy);
      if (ld < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(245,166,35,${0.1 * (1 - ld / 100)})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }

    if (p.glow && p.r > 2) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color + '0.8)';
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + Math.max(0, Math.min(1, a)) + ')';
    ctx.fill();
    ctx.shadowBlur = 0;
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
function animateCounter(el, targetVal) {
  const target   = targetVal !== undefined ? targetVal : parseInt(el.dataset.target);
  const current  = parseInt(el.textContent) || 0;
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(current + (target - current) * ease);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.number-val').forEach(el => animateCounter(el));
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const numSection = document.querySelector('.numbers-section');
if (numSection) counterObserver.observe(numSection);

/* =================================================================
   TELEGRAM SUBSCRIBER COUNT — Live from Cloudflare Worker
   ================================================================= */

const WORKER_URL = 'https://motafawiq-tg-proxy.motafawiq.workers.dev';

const subCounterEl  = document.querySelector('.number-val[data-target="415"]');
const heroStatEl    = document.querySelector('.hero-stats .text-gold');

async function fetchSubscriberCount() {
  try {
    const res  = await fetch(WORKER_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Worker HTTP ' + res.status);
    const data = await res.json();
    const count = data.count;

    if (!count || count === 0) return;

    if (subCounterEl) {
      subCounterEl.dataset.target = count;
      animateCounter(subCounterEl, count);
    }

    if (heroStatEl) {
      heroStatEl.textContent = `+${count.toLocaleString('ar-EG')} مشترك`;
    }

    const ctaText = document.querySelector('.telegram-card p');
    if (ctaText) {
      ctaText.textContent = `القناة هي الأساس – أكثر من ${count.toLocaleString('ar-EG')} طالب هندسة ميكانيك يستفيدون يومياً من شروحاتنا وملخصاتنا.`;
    }

    console.log(`[Motafawiq] Subscriber count updated: ${count} (cached: ${data.cached})`);

  } catch (err) {
    console.warn('[Motafawiq] Could not fetch subscriber count:', err.message);
  }
}

fetchSubscriberCount();
setInterval(fetchSubscriberCount, 10 * 60 * 1000);

/* =================================================================
   TELEGRAM DEEP LINK — يفتح تطبيق تلغرام مباشرة على الموبايل
   ================================================================= */
(function () {
  const TG_USERNAME = 'ENGENEERING7';
  const TG_HTTPS    = 'https://t.me/' + TG_USERNAME;
  const TG_DEEP     = 'tg://resolve?domain=' + TG_USERNAME;

  function openTelegram(e) {
    e.preventDefault();
    e.stopPropagation();

    // على الموبايل: جرّب الـ deep link أولاً، بعد 1.5 ثانية افتح https كـ fallback
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const start = Date.now();
      window.location = TG_DEEP;
      setTimeout(function () {
        // إذا لم يفتح التطبيق (المستخدم لا يزال في المتصفح)
        if (Date.now() - start < 2000) {
          window.open(TG_HTTPS, '_blank');
        }
      }, 1500);
    } else {
      window.open(TG_HTTPS, '_blank');
    }
  }

  // ربط الحدث بكل أزرار المواد .subject-btn
  document.querySelectorAll('.subject-btn').forEach(function (btn) {
    btn.addEventListener('click', openTelegram);
    btn.addEventListener('touchend', openTelegram, { passive: false });
  });
})();

/* ===== AOS scroll reveal ===== */
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
const dots  = document.querySelectorAll('.dot');
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

/* ================================================================
   LIVE SUBJECT SEARCH
   ================================================================ */
(function () {
  const searchInput = document.getElementById('subjectSearch');
  const clearBtn    = document.getElementById('searchClear');
  const grid        = document.querySelector('.subjects-grid');
  const noResults   = document.getElementById('noResults');
  if (!searchInput || !grid) return;

  // Store original text of each card for highlight restore
  const subjectCards = Array.from(grid.querySelectorAll('.subject-card'));
  const cardData = subjectCards.map(card => ({
    el: card,
    titleEl: card.querySelector('h3'),
    descEl:  card.querySelector('p'),
    origTitle: card.querySelector('h3')?.innerHTML || '',
    origDesc:  card.querySelector('p')?.innerHTML  || '',
    keywords:  [
      card.querySelector('h3')?.textContent || '',
      card.querySelector('p')?.textContent  || '',
      card.dataset.keywords || ''
    ].join(' ').toLowerCase()
  }));

  function highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'),
      '<mark class="search-highlight">$1</mark>');
  }

  function doSearch(raw) {
    const q = raw.trim().toLowerCase();
    let visible = 0;

    cardData.forEach(({ el, titleEl, descEl, origTitle, origDesc, keywords }) => {
      if (!q || keywords.includes(q)) {
        el.classList.remove('search-hidden');
        if (titleEl) titleEl.innerHTML = q ? highlight(origTitle, raw.trim()) : origTitle;
        if (descEl)  descEl.innerHTML  = q ? highlight(origDesc,  raw.trim()) : origDesc;
        visible++;
      } else {
        el.classList.add('search-hidden');
        if (titleEl) titleEl.innerHTML = origTitle;
        if (descEl)  descEl.innerHTML  = origDesc;
      }
    });

    clearBtn.classList.toggle('visible', q.length > 0);
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  searchInput.addEventListener('input', e => doSearch(e.target.value));

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    doSearch('');
    searchInput.focus();
  });

  // Keyboard shortcut: / opens search
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
    }
  });
})();
