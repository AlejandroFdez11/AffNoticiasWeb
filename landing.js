(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const screens = Array.from(document.querySelectorAll('.app-screen'));
  const tabs = Array.from(document.querySelectorAll('.phone-tabbar .tab'));
  const stage = document.querySelector('.phone-stage');
  let current = 0;
  let timer;

  function show(index) {
    current = (index + screens.length) % screens.length;
    screens.forEach((screen, i) => {
      const active = i === current;
      screen.classList.toggle('is-active', active);
      screen.setAttribute('aria-hidden', String(!active));
    });
    tabs.forEach((tab, i) => {
      const active = i === current;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
  }

  function start() {
    if (reduceMotion) return;
    window.clearInterval(timer);
    timer = window.setInterval(() => show(current + 1), 4200);
  }

  function stop() {
    window.clearInterval(timer);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      show(index);
      start();
    });
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const next = (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      show(next);
      tabs[next].focus();
      start();
    });
  });

  if (stage) {
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', start);
    stage.addEventListener('focusin', stop);
    stage.addEventListener('focusout', start);
  }

  document.querySelectorAll('[data-jump]').forEach((button) => {
    button.addEventListener('click', () => {
      show(Number(button.dataset.jump));
      if (stage) stage.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });

  show(0);
  start();

  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const counters = Array.from(document.querySelectorAll('[data-count]'));

  function animateCounter(el) {
    const target = Number(el.dataset.count);
    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }
    const startAt = performance.now();
    const duration = 900;
    const tick = (now) => {
      const progress = Math.min((now - startAt) / duration, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => revealObserver.observe(el));

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
    counters.forEach(animateCounter);
  }
})();
