$(function () {
  const $hamburger = $('.hamburger');
  const $nav = $('#global-nav');
  const $body = $('body');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setMenu(open) {
    $hamburger.toggleClass('is-active', open);
    $nav.toggleClass('nav-open', open);
    $body.toggleClass('no-scroll', open);
    $hamburger.attr('aria-expanded', String(open));
    $hamburger.attr('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  }

  $hamburger.on('click', function () {
    setMenu(!$hamburger.hasClass('is-active'));
  });

  $(document).on('keydown', function (event) {
    if (event.key === 'Escape') {
      setMenu(false);
    }
  });

  $(window).on('resize', function () {
    if (window.innerWidth > 900) {
      setMenu(false);
    }
  });

  $('a[href^="#"]').on('click', function (event) {
    const href = $(this).attr('href');

    // 遷移先が未設定の仮リンクは移動させない
    if (!href || href === '#') {
      event.preventDefault();
      setMenu(false);
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    setMenu(false);

    target.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  });

  // セクションのフェードイン
  const sections = document.querySelectorAll('section');

  if ('IntersectionObserver' in window && !reduceMotion) {
    sections.forEach((section) => section.classList.add('js-animate'));

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    sections.forEach((section) => observer.observe(section));
  } else {
    sections.forEach((section) => section.classList.add('is-visible'));
  }

  // 在校生・卒業生タブ
  function changeVoiceTab(targetId) {
    $('.tab-button').each(function () {
      const isSelected = String($(this).data('target')) === targetId;

      $(this)
        .toggleClass('active', isSelected)
        .attr('aria-selected', String(isSelected));
    });

    $('.voice-category').each(function () {
      const isTarget = this.id === targetId;

      $(this).toggleClass('active', isTarget);
      this.hidden = !isTarget;
    });
  }

  $('.tab-button').on('click', function () {
    changeVoiceTab(String($(this).data('target')));
  });

  $('.tab-button').on('keydown', function (event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();

    const $tabs = $('.tab-button');
    const currentIndex = $tabs.index(this);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + direction + $tabs.length) % $tabs.length;
    const $nextTab = $tabs.eq(nextIndex);

    $nextTab.trigger('focus');
    changeVoiceTab(String($nextTab.data('target')));
  });

  changeVoiceTab('current-students');
});