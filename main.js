/* ===== PARTICLE CANVAS ===== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let particleFrameId = null;
let lastParticleFrame = 0;
let heroInView = true;
const COLORS = [
  'rgba(255,205,70,',
  'rgba(255,224,112,',
  'rgba(255,236,165,',
  'rgba(218,151,29,',
  'rgba(255,181,39,'
];

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', () => { resize(); initParticles(); });
resize();

function initParticles() {
  particles = [];
  const count = Math.min(180, Math.floor((canvas.width * canvas.height) / 9000));
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

function drawParticles(now = 0) {
  particleFrameId = null;
  if (prefersReducedMotion || document.hidden || !heroInView) return;
  if (now - lastParticleFrame < 1000 / 30) {
    particleFrameId = requestAnimationFrame(drawParticles);
    return;
  }
  lastParticleFrame = now;
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
        ctx.strokeStyle = `rgba(237,197,71,${0.11 * (1 - ld / 100)})`;
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
  particleFrameId = requestAnimationFrame(drawParticles);
}

function startParticleAnimation() {
  if (!prefersReducedMotion && !document.hidden && heroInView && particleFrameId === null) {
    particleFrameId = requestAnimationFrame(drawParticles);
  }
}
function stopParticleAnimation() {
  if (particleFrameId !== null) cancelAnimationFrame(particleFrameId);
  particleFrameId = null;
}

const heroMotionTarget = document.querySelector('.hero');
if ('IntersectionObserver' in window && heroMotionTarget) {
  const heroMotionObserver = new IntersectionObserver(entries => {
    heroInView = entries.some(entry => entry.isIntersecting);
    if (heroInView) startParticleAnimation();
    else stopParticleAnimation();
  }, { threshold: 0.01 });
  heroMotionObserver.observe(heroMotionTarget);
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopParticleAnimation();
  else startParticleAnimation();
});
startParticleAnimation();

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
const scrollProgress = document.querySelector('#scrollProgress span');
let scrollUpdatePending = false;
function updateScrollUi() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
  scrollUpdatePending = false;
}
window.addEventListener('scroll', () => {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  requestAnimationFrame(updateScrollUi);
}, { passive: true });
window.addEventListener('resize', updateScrollUi, { passive: true });
updateScrollUi();

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
function setMenuOpen(open, returnFocus = false) {
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  if (returnFocus) hamburger.focus();
}
hamburger.addEventListener('click', () => {
  setMenuOpen(!navLinks.classList.contains('open'));
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => setMenuOpen(false));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) setMenuOpen(false, true);
});
document.addEventListener('pointerdown', e => {
  if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    setMenuOpen(false);
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) setMenuOpen(false);
});

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, targetVal) {
  const target   = targetVal !== undefined ? targetVal : parseInt(el.dataset.target);
  if (prefersReducedMotion) {
    el.textContent = target;
    return;
  }
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

const numSection = document.querySelector('.numbers-section');
if ('IntersectionObserver' in window && numSection) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.number-val').forEach(el => animateCounter(el));
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  counterObserver.observe(numSection);
} else {
  document.querySelectorAll('.number-val').forEach(el => animateCounter(el));
}

/* =================================================================
   TELEGRAM SUBSCRIBER COUNT — Live from Cloudflare Worker
   ================================================================= */

const WORKER_URL = 'https://motafawiq-tg-proxy.motafawiq.workers.dev';

const subCounterEl  = document.querySelector('.numbers-grid .number-card:first-child .number-val');
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
   SUBJECT CARD — كل المربع ياخد عالتلغرام
   ================================================================= */
(function () {
  const TG_USERNAME = 'ENGENEERING7';
  const TG_HTTPS    = 'https://t.me/' + TG_USERNAME;
  const TG_DEEP     = 'tg://resolve?domain=' + TG_USERNAME;
  const isMobile    = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  function openTelegram(e) {
    // تجاهل إذا كانت حركة scroll وليس tap حقيقي
    if (e.type === 'touchend') {
      const touch = e.changedTouches[0];
      if (!touch) return;
    }
    e.preventDefault();

    if (isMobile) {
      window.location.href = TG_DEEP;
      setTimeout(function () {
        window.open(TG_HTTPS, '_blank');
      }, 1500);
    } else {
      window.open(TG_HTTPS, '_blank');
    }
  }

  document.querySelectorAll('.subject-card').forEach(function (card) {
    // كامل المربع يشتغل كرابط
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', (card.querySelector('h3')?.textContent || 'المادة') + ' — فتح قناة التلغرام');

    card.addEventListener('click', openTelegram);

    // دعم لوحة المفاتيح
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openTelegram(e);
      }
    });
  });
})();

/* ===== AOS scroll reveal ===== */
const aosEls = document.querySelectorAll('[data-aos]');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  aosEls.forEach(el => el.classList.add('aos-animate'));
} else {
  document.documentElement.classList.add('motion-ready');
  const aosObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const authoredDelay = Number.parseInt(e.target.dataset.aosDelay || '0', 10) || 0;
      e.target.style.setProperty('--aos-delay', `${Math.min(authoredDelay, 280)}ms`);
      e.target.classList.add('aos-animate');
      aosObserver.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px 160px 0px', threshold: 0.04 });
  aosEls.forEach(el => aosObserver.observe(el));
}

/* ===== TESTIMONIAL SLIDER ===== */
const cards = document.querySelectorAll('.testimonial-card');
const dots  = document.querySelectorAll('.dot');
let current = Math.max(0, Array.from(cards).findIndex(card => card.classList.contains('active')));
function goTo(n) {
  if (!cards.length) return;
  cards[current]?.classList.remove('active');
  dots[current]?.classList.remove('active');
  dots[current]?.setAttribute('aria-pressed', 'false');
  current = (n + cards.length) % cards.length;
  cards[current].classList.add('active');
  dots[current]?.classList.add('active');
  dots[current]?.setAttribute('aria-pressed', 'true');
}
document.getElementById('nextBtn')?.addEventListener('click', () => goTo(current - 1));
document.getElementById('prevBtn')?.addEventListener('click', () => goTo(current + 1));
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
const testimonialSlider = document.querySelector('.testimonials-slider');
let carouselTimer = null;
function stopCarousel() {
  if (carouselTimer !== null) window.clearInterval(carouselTimer);
  carouselTimer = null;
}
function startCarousel() {
  stopCarousel();
  const interactionActive = testimonialSlider && (testimonialSlider.matches(':hover') || testimonialSlider.contains(document.activeElement));
  if (!prefersReducedMotion && !document.hidden && !interactionActive && cards.length > 1) {
    carouselTimer = window.setInterval(() => goTo(current + 1), 6500);
  }
}
testimonialSlider?.addEventListener('mouseenter', stopCarousel);
testimonialSlider?.addEventListener('mouseleave', startCarousel);
testimonialSlider?.addEventListener('focusin', stopCarousel);
testimonialSlider?.addEventListener('focusout', e => {
  if (!testimonialSlider.contains(e.relatedTarget)) startCarousel();
});
document.addEventListener('visibilitychange', () => document.hidden ? stopCarousel() : startCarousel());
startCarousel();

/* ================================================================
   LIVE SUBJECT SEARCH
   ================================================================ */
(function () {
  const searchInput = document.getElementById('subjectSearch');
  const clearBtn    = document.getElementById('searchClear');
  const grid        = document.querySelector('.subjects-grid');
  const noResults   = document.getElementById('noResults');
  if (!searchInput || !grid) return;

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

  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      searchInput.focus();
    }
  });
})();
