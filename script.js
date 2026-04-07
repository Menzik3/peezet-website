/* ═══════════════════════════════════════════════════════════
   PEE ZET PETROLEUM & TRADING — script.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     1. NAVBAR — sticky style + active link
  ────────────────────────────────────────── */
  const navbar  = document.getElementById('navbar');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu.querySelectorAll('.nav-link');

  // Sticky shadow
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
    toggleBackToTop();
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Active nav link on scroll
  const sections = [...document.querySelectorAll('section[id], header[id]')];

  function updateActiveLink() {
    const scrollY = window.scrollY + navbar.offsetHeight + 20;
    let current = sections[0]?.id ?? '';

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ──────────────────────────────────────────
     2. MOBILE NAV TOGGLE
  ────────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  /* ──────────────────────────────────────────
     3. SMOOTH SCROLL (respects nav height)
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────────────────
     4. BACK TO TOP
  ────────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ──────────────────────────────────────────
     5. SCROLL REVEAL
     Adds .visible to .reveal elements when they
     enter the viewport, with staggered delays
     for sibling groups.
  ────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Auto-apply reveal + stagger to key elements
  const revealGroups = [
    '.value-item',
    '.prod-card',
    '.price-card',
    '.leader-card',
    '.ops-season-block',
    '.ops-info-card',
    '.about-visual',
    '.about-copy',
    '.contact-copy',
    '.contact-info-card',
    '.outlook-banner',
  ];

  revealGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (i > 0 && i <= 6) {
        el.classList.add(`reveal-delay-${i}`);
      }
      revealObserver.observe(el);
    });
  });

  /* ──────────────────────────────────────────
     6. PRICE CARD — colour-code zero / negative
     (future-proof: if prices ever decrease,
     the JS will switch to green automatically)
  ────────────────────────────────────────── */
  document.querySelectorAll('.price-card-change').forEach(el => {
    const text = el.textContent.trim();
    // Already has class from HTML, but verify sign
    const isDecrease = text.startsWith('▼') || text.includes('-R');
    if (isDecrease) {
      el.classList.remove('change--up');
      el.classList.add('change--down');
      // Swap arrow svg fill direction
      const svg = el.querySelector('svg path');
      if (svg) svg.setAttribute('d', 'M8 13l5-6H3z'); // down arrow
    }
  });

  /* ──────────────────────────────────────────
     7. HERO PARALLAX (subtle, CSS-only friendly)
  ────────────────────────────────────────── */
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg && window.innerWidth > 860) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.3;
      heroBgImg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  /* ──────────────────────────────────────────
     8. INITIAL RUN
  ────────────────────────────────────────── */
  onScroll();

});
