// CultureOn · Marca Pessoal v2.0
(() => {
  const form = document.getElementById('mp2-form');
  const nav = document.querySelector('.nav');
  const setNavH = () => document.documentElement.style.setProperty('--nav-h', (nav ? nav.offsetHeight : 64) + 'px');
  setNavH(); addEventListener('resize', setNavH, { passive: true });

  // CTAs: deslocam para o formulário e pré-selecionam o serviço
  document.querySelectorAll('[data-mp2-go]').forEach(a => a.addEventListener('click', ev => {
    if (!form) return;
    ev.preventDefault();
    const service = a.dataset.service;
    if (service) {
      const radio = form.querySelector(`input[name="servico"][value="${CSS.escape(service)}"]`);
      if (radio) radio.checked = true;
    }
    form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    form.classList.remove('is-flash'); void form.offsetWidth; form.classList.add('is-flash');
    const first = form.querySelector('#mp2-nome');
    setTimeout(() => first && first.focus({ preventScroll: true }), 650);
    history.replaceState(null, '', '#contacto');
  }));

  // Chegar à página com #contacto?servico=... (ex.: links de campanhas)
  const q = new URLSearchParams(location.search).get('servico');
  if (q && form) {
    const map = { 'brand-kit': 'Brand Kit', 'videos': 'Produção de Vídeos', 'completo': 'Brand Kit + Vídeos' };
    const r = form.querySelector(`input[name="servico"][value="${CSS.escape(map[q] || q)}"]`);
    if (r) r.checked = true;
  }

  // Âncoras: marca a secção visível
  const links = [...document.querySelectorAll('.mp2-anchors a')];
  const secs = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => io.observe(s));
})();
