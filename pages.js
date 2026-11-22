(() => {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!nav || !toggle || !links) return;
  const setOpen = (open, restoreFocus = false) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && links.classList.contains('open')) setOpen(false, true);
  });
  document.addEventListener('pointerdown', event => {
    if (links.classList.contains('open') && !links.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  updateNav();
  window.addEventListener('scroll', updateNav, {passive: true});
  window.addEventListener('resize', () => { if (window.innerWidth > 900) setOpen(false); });
})();
