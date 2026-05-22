/* ===== SEARCH FEATURE ===== */
(function() {
  const searchInput = document.getElementById('subjectSearch');
  const clearBtn    = document.getElementById('searchClear');
  const cards       = document.querySelectorAll('.subject-card');
  const noResult    = document.getElementById('noSearchResult');
  const counter     = document.getElementById('searchCounter');

  if (!searchInput) return;

  const keywords = {
    'تصميم 1':       ['تصميم','design','1','واحد','اول','أول'],
    'تصميم 2':       ['تصميم','design','2','اثنين','ثاني','ثانية'],
    'وصفية':         ['وصفي','وصفية','descriptive'],
    'رياضيات 3':     ['رياضيات','رياضيات3','رياضيات 3','math','3','ثلاثة','ثالث'],
    'رياضيات 4':     ['رياضيات','رياضيات4','رياضيات 4','math','4','اربعة','رابع','مصفوفة','matrix'],
    'رياضيات 5':     ['رياضيات','رياضيات5','رياضيات 5','math','5','خمسة','خامس','انتيغرال','integral'],
    'ماتلاب':        ['ماتلاب','matlab','برمجة','code'],
    'رسم صناعي':     ['رسم صناعي','رسم','صناعي','drawing','industrial'],
    'رسم هندسي':     ['رسم هندسي','رسم','هندسي','drawing','engineering','geometric','بوصلة'],
    'solidworks':    ['solidworks','solid works','سوليدووركس','سوليد','3d','ثلاثي'],
    'powermill':     ['powermill','power mill','باورميل','cnc','تصنيع'],
    'تشكيل المعادن': ['تشكيل','معادن','metal','forming','تشغيل'],
    'ستاتيك':        ['ستاتيك','statics','قوى','statics'],
    'الموائع':       ['موائع','مائع','fluid','fluids','ميكانيكا الموائع'],
    'بوربوينت':      ['بوربوينت','powerpoint','عروض','presentation']
  };

  function normalize(str) {
    return str.trim().toLowerCase()
      .replace(/[أإآا]/g,'ا')
      .replace(/[ىي]/g,'ي')
      .replace(/ة/g,'ه');
  }

  function search(query) {
    const q = normalize(query);
    let visible = 0;

    cards.forEach(card => {
      const title = normalize(card.querySelector('h3').textContent);
      const desc  = normalize(card.querySelector('p') ? card.querySelector('p').textContent : '');
      const num   = normalize(card.querySelector('.subject-num').textContent);
      const cardKey = Object.keys(keywords).find(k => title.includes(normalize(k)));
      const tags = cardKey ? keywords[cardKey].map(normalize) : [];

      const match = !q ||
        title.includes(q) ||
        desc.includes(q)  ||
        num.includes(q)   ||
        tags.some(t => t.includes(q) || q.includes(t));

      card.style.display    = match ? '' : 'none';
      card.style.animation  = match && q ? 'searchPop 0.3s ease' : '';
      if (match) visible++;
    });

    noResult.style.display   = visible === 0 ? 'flex' : 'none';
    clearBtn.style.opacity   = q ? '1' : '0';
    clearBtn.style.pointerEvents = q ? 'auto' : 'none';
    counter.textContent      = q ? `${visible} نتيجة` : `${cards.length} مادة`;
    counter.style.color      = visible === 0 ? '#e74c3c' : 'var(--gold)';
  }

  searchInput.addEventListener('input',  () => search(searchInput.value));
  searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') { searchInput.value = ''; search(''); } });
  clearBtn.addEventListener('click', () => { searchInput.value = ''; search(''); searchInput.focus(); });

  // initial counter
  counter.textContent = `${cards.length} مادة`;
})();
