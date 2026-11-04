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
document.querySelectorAll('.reel video').forEach(v => vio.observe(v));

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

// Formulários: enviam para o Formspree via fetch.
// Enquanto o ID não estiver configurado (SEU_ID), mostram só uma mensagem.
document.querySelectorAll('form.form').forEach(form => {
  const status = form.querySelector('.form__status');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (form.action.includes('SEU_ID')) {
      status.textContent = 'Formulário ainda por ligar — escreve-nos para cultureonlisboa@gmail.com.';
      return;
    }
    status.textContent = 'A enviar…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error();
      form.reset();
      status.textContent = 'Obrigado! Entramos em contacto em breve.';
    } catch {
      status.textContent = 'Não foi possível enviar. Tenta por email: cultureonlisboa@gmail.com';
    }
  });
});
