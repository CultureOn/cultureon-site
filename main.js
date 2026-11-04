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

// Formulário: envia para o Formspree via fetch.
// Enquanto o ID não estiver configurado (SEU_ID), mostra só uma mensagem.
const form = document.querySelector('.form');
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
