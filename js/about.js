document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const globalNav = document.querySelector('#global-nav');
  const pageTop = document.querySelector('.page-top');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setMenu = (isOpen) => {
    if (!hamburger || !globalNav) return;

    hamburger.classList.toggle('is-active', isOpen);
    globalNav.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  };

  hamburger?.addEventListener('click', () => {
    setMenu(!hamburger.classList.contains('is-active'));
  });

  globalNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1040) setMenu(false);
  });

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });

  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const updatePageTop = () => {
    pageTop?.classList.toggle('is-visible', window.scrollY > 500);
  };

  window.addEventListener('scroll', updatePageTop, { passive: true });
  updatePageTop();

  pageTop?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  });
});