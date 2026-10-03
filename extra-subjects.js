(function () {
  var grid = document.querySelector('.subjects-grid');
  if (!grid || document.getElementById('extra-subjects-style')) return;

  var css = '' +
    '@keyframes mxPistonDown{0%,100%{transform:translateY(0)}50%{transform:translateY(10px)}}' +
    '@keyframes mxPistonUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}' +
    '@keyframes mxSpin{to{transform:rotate(360deg)}}' +
    '@keyframes mxPulse{0%,100%{transform:scale(.78);opacity:.45}50%{transform:scale(1.06);opacity:1}}' +
    '@keyframes mxDash{to{stroke-dashoffset:-16}}' +
    '@keyframes mxDashRev{to{stroke-dashoffset:16}}' +
    '.mx-p1{animation:mxPistonDown 3s ease-in-out infinite}' +
    '.mx-p2{animation:mxPistonUp 3s ease-in-out infinite}' +
    '.mx-fan{transform-origin:32px 30px;animation:mxSpin 2.4s linear infinite}' +
    '.subject-card:hover .mx-fan{animation-duration:.8s}' +
    '.mx-ring{transform-origin:32px 36px;animation:mxPulse 3s ease-in-out infinite}' +
    '.mx-ring.r2{animation-delay:.5s}.mx-ring.r3{animation-delay:1s}' +
    '.mx-cold{stroke-dasharray:4 4;animation:mxDash 1.2s linear infinite}' +
    '.mx-hot{stroke-dasharray:4 4;animation:mxDashRev 1.2s linear infinite}' +
    '@media (prefers-reduced-motion:reduce){.mx-anim *{animation:none!important}}';
  var style = document.createElement('style');
  style.id = 'extra-subjects-style';
  style.textContent = css;
  document.head.appendChild(style);

  var tg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>';
  var O = '#f5a623', Y = '#ffcc44';

  var hydraulic = '' +
    '<svg class="subj-svg mx-anim" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="9" y="18" width="16" height="32" rx="2" stroke="' + O + '" stroke-width="2" fill="rgba(245,166,35,0.08)"/>' +
    '<rect x="33" y="14" width="24" height="36" rx="2" stroke="' + O + '" stroke-width="2" fill="rgba(245,166,35,0.08)"/>' +
    '<rect x="10.5" y="34" width="13" height="14.5" fill="rgba(255,204,68,0.3)"/>' +
    '<rect x="34.5" y="34" width="21" height="14.5" fill="rgba(255,204,68,0.3)"/>' +
    '<g class="mx-p1"><rect x="10.5" y="20" width="13" height="5" rx="1" fill="' + O + '"/><line x1="17" y1="20" x2="17" y2="8" stroke="' + Y + '" stroke-width="2.5" stroke-linecap="round"/></g>' +
    '<g class="mx-p2"><rect x="34.5" y="26" width="21" height="5" rx="1" fill="' + O + '"/><line x1="45" y1="26" x2="45" y2="6" stroke="' + Y + '" stroke-width="2.5" stroke-linecap="round"/></g>' +
    '<path d="M17 50 V57 H45 V50" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<circle r="2.2" fill="' + Y + '"><animateMotion dur="2.4s" repeatCount="indefinite" path="M17 50 V57 H45 V50"/></circle>' +
    '</svg>';

  var math1 = '' +
    '<svg class="subj-svg mx-anim" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<line x1="6" y1="56" x2="60" y2="56" stroke="rgba(245,166,35,0.4)" stroke-width="1.5"/>' +
    '<line x1="8" y1="60" x2="8" y2="6" stroke="rgba(245,166,35,0.4)" stroke-width="1.5"/>' +
    '<path d="M12 14 Q32 70 52 14" stroke="' + O + '" stroke-width="2.5" stroke-linecap="round"/>' +
    '<circle cx="32" cy="42" r="3" fill="' + O + '"/>' +
    '<line x1="32" y1="42" x2="50" y2="19.3" stroke="' + Y + '" stroke-width="2" stroke-linecap="round">' +
    '<animate attributeName="x2" values="50;44;38;34;32;50" keyTimes="0;0.3;0.55;0.75;0.85;1" dur="4s" repeatCount="indefinite"/>' +
    '<animate attributeName="y2" values="19.3;31.9;39.5;41.7;42;19.3" keyTimes="0;0.3;0.55;0.75;0.85;1" dur="4s" repeatCount="indefinite"/></line>' +
    '<circle cx="50" cy="19.3" r="3" fill="' + Y + '">' +
    '<animate attributeName="cx" values="50;44;38;34;32;50" keyTimes="0;0.3;0.55;0.75;0.85;1" dur="4s" repeatCount="indefinite"/>' +
    '<animate attributeName="cy" values="19.3;31.9;39.5;41.7;42;19.3" keyTimes="0;0.3;0.55;0.75;0.85;1" dur="4s" repeatCount="indefinite"/></circle>' +
    '<text x="40" y="12" font-size="9" fill="' + O + '" font-family="serif" font-style="italic">dy/dx</text>' +
    '</svg>';

  var math2 = '' +
    '<svg class="subj-svg mx-anim" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<line x1="32" y1="56" x2="32" y2="6" stroke="rgba(245,166,35,0.5)" stroke-width="1.5"/>' +
    '<polygon points="32,4 29,10 35,10" fill="rgba(245,166,35,0.6)"/>' +
    '<line x1="32" y1="56" x2="60" y2="46" stroke="rgba(245,166,35,0.5)" stroke-width="1.5"/>' +
    '<line x1="32" y1="56" x2="4" y2="46" stroke="rgba(245,166,35,0.5)" stroke-width="1.5"/>' +
    '<ellipse class="mx-ring r1" cx="32" cy="36" rx="8" ry="3.5" stroke="' + Y + '" stroke-width="2" fill="rgba(255,204,68,0.12)"/>' +
    '<ellipse class="mx-ring r2" cx="32" cy="36" rx="15" ry="6.5" stroke="' + O + '" stroke-width="1.8"/>' +
    '<ellipse class="mx-ring r3" cx="32" cy="36" rx="22" ry="9.5" stroke="' + O + '" stroke-width="1.5" stroke-dasharray="3 3"/>' +
    '<text x="36" y="20" font-size="13" fill="' + Y + '" font-family="serif">&#8748;</text>' +
    '</svg>';

  var hvac = '' +
    '<svg class="subj-svg mx-anim" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="32" cy="28" r="20" stroke="' + O + '" stroke-width="2" fill="rgba(245,166,35,0.06)"/>' +
    '<g class="mx-fan">' +
    '<ellipse cx="32" cy="19" rx="4.5" ry="8" fill="rgba(245,166,35,0.35)" stroke="' + O + '" stroke-width="1.5"/>' +
    '<ellipse cx="32" cy="19" rx="4.5" ry="8" fill="rgba(255,204,68,0.3)" stroke="' + Y + '" stroke-width="1.5" transform="rotate(90 32 28)"/>' +
    '<ellipse cx="32" cy="19" rx="4.5" ry="8" fill="rgba(245,166,35,0.35)" stroke="' + O + '" stroke-width="1.5" transform="rotate(180 32 28)"/>' +
    '<ellipse cx="32" cy="19" rx="4.5" ry="8" fill="rgba(255,204,68,0.3)" stroke="' + Y + '" stroke-width="1.5" transform="rotate(270 32 28)"/>' +
    '</g>' +
    '<circle cx="32" cy="28" r="3" fill="' + O + '"/>' +
    '<path class="mx-cold" d="M8 54 q4 -5 8 0 t8 0" stroke="#6ec6ff" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path class="mx-hot" d="M36 54 q4 -5 8 0 t8 0" stroke="#ff6b4a" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path class="mx-cold" d="M8 60 q4 -5 8 0 t8 0" stroke="#6ec6ff" stroke-width="1.6" stroke-linecap="round" opacity="0.6"/>' +
    '<path class="mx-hot" d="M36 60 q4 -5 8 0 t8 0" stroke="#ff6b4a" stroke-width="1.6" stroke-linecap="round" opacity="0.6"/>' +
    '</svg>';

  var items = [
    { n: '16', delay: 1200, kw: 'hydraulic fluid pump piston هيدروليك', icon: hydraulic, title: 'هيدروليك', desc: 'الموائع المضغوطة وقانون باسكال، المكابس والمضخات، وتصميم الدوائر الهيدروليكية مع أمثلة محلولة خطوة بخطوة.' },
    { n: '17', delay: 1280, kw: 'math calculus derivative limit رياضيات 1', icon: math1, title: 'رياضيات 1', desc: 'النهايات والاشتقاق وتطبيقاته، مع شرح مبسط وحلول أسئلة من الامتحانات السابقة.' },
    { n: '18', delay: 1360, kw: 'math integral multiple series رياضيات 2', icon: math2, title: 'رياضيات 2', desc: 'التكامل المتعدد والمتسلسلات والمعادلات التفاضلية، مع أمثلة هندسية وتمارين محلولة.' },
    { n: '19', delay: 1440, kw: 'hvac heating air conditioning refrigeration تدفئة تكييف', icon: hvac, title: 'تدفئة وتكييف', desc: 'أساسيات التدفئة والتبريد والتكييف، حساب الأحمال الحرارية ومخطط الهواء الرطب بشرح مبسط.' }
  ];

  items.forEach(function (it) {
    var card = document.createElement('div');
    card.className = 'subject-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String(it.delay));
    card.setAttribute('data-keywords', it.kw);
    card.innerHTML =
      '<div class="subject-num">' + it.n + '</div>' +
      '<div class="subject-icon">' + it.icon + '</div>' +
      '<h3>' + it.title + '</h3>' +
      '<p>' + it.desc + '</p>' +
      '<a href="https://t.me/ENGENEERING7" target="_blank" rel="noopener" class="subject-btn">' + tg + ' اشترك الآن</a>';
    grid.appendChild(card);
  });
})();

(function () {
  var slider = document.getElementById('testimonialsSlider');
  if (!slider || slider.getAttribute('data-extra') === '1') return;
  var dots = document.getElementById('sliderDots');
  var cards = slider.querySelectorAll('.testimonial-card');
  var last = cards.length ? cards[cards.length - 1] : null;

  var data = [
    { name: 'أحمد عبد الكريم', role: 'طالب في المنصة', text: 'منصة رائعة وريحتني كتير والله' },
    { name: 'تسنيم خواتمي', role: 'طالبة في المنصة', text: 'شكرا كتير الله يجزيكم كل خير' },
    { name: 'ميس شعال', role: 'طالبة في المنصة', text: 'كنت خايفة سجل بس والله روعة وحبيت كتير' },
    { name: 'مصطفى حداد', role: 'طالب في المنصة', text: 'والله رفعت منها ٣ مواد معدل وانا كتا احلم بالمعدل' },
    { name: 'جميل خطاط', role: 'طالب في المنصة', text: 'الله يجزيكم الخير ع تعبكم معنا' }
  ];

  data.forEach(function (t) {
    var card = document.createElement('div');
    card.className = 'testimonial-card';
    var p = document.createElement('p');
    p.className = 'testimonial-text';
    p.textContent = t.text;
    var author = document.createElement('div');
    author.className = 'testimonial-author';
    var av = document.createElement('div');
    av.className = 'author-avatar';
    av.textContent = t.name.charAt(0);
    var info = document.createElement('div');
    var s = document.createElement('strong');
    s.textContent = t.name;
    var sp = document.createElement('span');
    sp.textContent = t.role;
    info.appendChild(s);
    info.appendChild(sp);
    author.appendChild(av);
    author.appendChild(info);
    card.appendChild(p);
    card.appendChild(author);
    if (last && last.parentNode) {
      last.parentNode.insertBefore(card, last.nextSibling);
    } else {
      slider.appendChild(card);
    }
    last = card;
    if (dots) {
      var d = document.createElement('span');
      d.className = 'dot';
      dots.appendChild(d);
    }
  });
  slider.setAttribute('data-extra', '1');
})();
