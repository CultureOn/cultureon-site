// CultureOn — Home v1
document.documentElement.classList.add('js');

// Nav: borda ao fazer scroll + menu mobile
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav__toggle');
addEventListener('scroll', () => nav.classList.toggle('is-scrolled', scrollY > 8), { passive: true });
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('is-open')));

// Reveal ao entrar no ecrã
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Vídeos: só tocam quando estão visíveis (poupa bateria e dados)
const vio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { const p = v.play(); if (p) p.catch(() => {}); } else { v.pause(); }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reel video, .mp-reel video').forEach(v => vio.observe(v));

// Filtros da página Projetos
const chips = document.querySelectorAll('.filters [data-filter]');
chips.forEach(chip => chip.addEventListener('click', () => {
  const f = chip.dataset.filter;
  chips.forEach(c => c.classList.toggle('is-active', c === chip));
  let shown = 0;
  document.querySelectorAll('.projects__grid .project').forEach(p => {
    const hide = f !== 'all' && p.dataset.cat !== f;
    p.classList.toggle('is-hidden', hide);
    if (!hide) { shown++; p.classList.add('is-in'); }
  });
  const empty = document.querySelector('.filters__empty');
  if (empty) empty.hidden = shown > 0;
}));

// Vídeos do YouTube: só carregam o player quando se clica (página mais rápida)
document.querySelectorAll('.vcard__player[data-yt]').forEach(btn => btn.addEventListener('click', () => {
  if (btn.querySelector('iframe')) return;
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0&playsinline=1`;
  f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  f.allowFullscreen = true;
  f.title = btn.getAttribute('aria-label') || 'Vídeo';
  btn.innerHTML = '';
  btn.appendChild(f);
}));

// Vídeos em janela (página Marca Pessoal)
const vmodal = document.querySelector('.vmodal');
if (vmodal) {
  const frame = vmodal.querySelector('.vmodal__frame');
  const close = () => { vmodal.close(); frame.innerHTML = ''; };
  document.querySelectorAll('[data-yt-modal]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.ytModal;
    if (!id) return;
    vmodal.classList.toggle('is-vertical', !!btn.closest('.mp-reel'));
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="Vídeo"></iframe>`;
    vmodal.showModal();
  }));
  vmodal.querySelector('.vmodal__close').addEventListener('click', close);
  vmodal.addEventListener('click', e => { if (e.target === vmodal) close(); });
  vmodal.addEventListener('close', () => { frame.innerHTML = ''; });
}

// Reels: pontos indicadores do swipe no telemóvel
document.querySelectorAll('.phones').forEach(row => {
  const phones = [...row.querySelectorAll('.phone')];
  if (phones.length < 2) return;
  const dots = document.createElement('div');
  dots.className = 'phones__dots'; dots.setAttribute('aria-hidden', 'true');
  dots.innerHTML = phones.map((_, i) => `<span${i ? '' : ' class="is-on"'}></span>`).join('');
  row.after(dots);
  const update = () => {
    const mid = row.scrollLeft + row.clientWidth / 2;
    let best = 0, dist = Infinity;
    phones.forEach((p, i) => { const c = p.offsetLeft + p.offsetWidth / 2; const d = Math.abs(c - mid); if (d < dist) { dist = d; best = i; } });
    [...dots.children].forEach((d, i) => d.classList.toggle('is-on', i === best));
  };
  row.addEventListener('scroll', update, { passive: true });
});

// Nuvem lima do topo da Home: segue o cursor de forma subtil
(() => {
  const hero = document.querySelector('.hero--home');
  const glow = hero && hero.querySelector('.hero__glow');
  if (!glow || matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover: hover)').matches) return;
  let tx = 0, ty = 0, ts = 1, x = 0, y = 0, sc = 1, raf = null;
  const MAX = 60;                       // deslocação máxima em px
  const tick = () => {
    x += (tx - x) * 0.06; y += (ty - y) * 0.06; sc += (ts - sc) * 0.06;
    glow.style.setProperty('--gx', x.toFixed(1) + 'px');
    glow.style.setProperty('--gy', y.toFixed(1) + 'px');
    glow.style.setProperty('--gs', sc.toFixed(3));
    raf = (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(ts - sc) * 100 > 0.2) ? requestAnimationFrame(tick) : null;
  };
  const go = () => { if (!raf) raf = requestAnimationFrame(tick); };
  hero.addEventListener('pointermove', e => {
    const r = glow.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2), dy = (e.clientY - cy) / (r.height / 2);
    const near = Math.max(0, 1 - Math.hypot(dx, dy) / 1.6);   // 1 = cursor em cima da nuvem
    tx = Math.max(-1, Math.min(1, dx)) * MAX * (0.35 + near * 0.65);
    ty = Math.max(-1, Math.min(1, dy)) * MAX * (0.35 + near * 0.65);
    ts = 1 + near * 0.08;
    go();
  });
  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; ts = 1; go(); });
})();

// Serviços em nuvem: clicar abre a descrição (um de cada vez)
(() => {
  const cloud = document.querySelector('.svc-cloud');
  if (!cloud) return;
  const tabs = [...cloud.querySelectorAll('.svc-item')];
  tabs.forEach(t => t.addEventListener('click', () => {
    const open = t.getAttribute('aria-expanded') === 'true';
    tabs.forEach(o => { o.setAttribute('aria-expanded', 'false'); document.getElementById(o.getAttribute('aria-controls')).hidden = true; });
    if (!open) { t.setAttribute('aria-expanded', 'true'); document.getElementById(t.getAttribute('aria-controls')).hidden = false; }
    cloud.classList.toggle('has-open', !open);
  }));
})();

// Biblioteca de vídeos: filtros e play no próprio cartão
(() => {
  const tabs = document.querySelectorAll('.lib-tab');
  const secs = document.querySelectorAll('.lib-sec');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(o => o.classList.toggle('is-active', o === t));
    const f = t.dataset.filter;
    secs.forEach(s => { s.hidden = f !== 'all' && s.dataset.cat !== f; });
    const top = document.querySelector('.lib-tabs');
    if (top && window.scrollY > top.offsetTop) window.scrollTo({ top: top.offsetTop - 64, behavior: 'smooth' });
  }));
  document.querySelectorAll('.lib-card__media').forEach(btn => btn.addEventListener('click', () => {
    if (btn.classList.contains('is-playing')) return;
    const src = btn.dataset.yt
      ? `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0&playsinline=1`
      : `https://player.vimeo.com/video/${btn.dataset.vimeo}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;
    const f = document.createElement('iframe');
    f.src = src; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true; f.title = btn.getAttribute('aria-label') || 'Vídeo';
    btn.classList.add('is-playing'); btn.appendChild(f);
  }));
})();

// Formulários: enviam para o Formspree via fetch.
// Enquanto o ID não estiver configurado (SEU_ID), mostram só uma mensagem.
document.querySelectorAll('form.form').forEach(form => {
  const status = form.querySelector('.form__status');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (form.action.includes('SEU_ID')) {
      status.textContent = 'Formulário ainda por ligar — escreve-nos para geral@cultureon.pt.';
      return;
    }
    status.textContent = 'A enviar…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error();
      form.reset();
      status.textContent = 'Obrigado! Entramos em contacto em breve.';
    } catch {
      status.textContent = 'Não foi possível enviar. Tenta por email: geral@cultureon.pt';
    }
  });
});
