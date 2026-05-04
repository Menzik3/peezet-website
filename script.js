/* ================================================================
   PEE ZET PETROLEUM & TRADING (PTY) LTD
   script.js — Robust, Mobile-First JavaScript
   
   KEY FIX: Content is ALWAYS visible. JS only adds optional
   scroll animations AFTER confirming IntersectionObserver works.
   Nothing is hidden until JS is confirmed running.
   ================================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     REFERENCES
  ────────────────────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const navMenu    = document.getElementById('nav-menu');
  const hamburger  = document.getElementById('hamburger');
  const backTop    = document.getElementById('backTop');
  const tickerClose = document.getElementById('ticker-close');
  const announceBand = document.getElementById('announce-band');

  /* ──────────────────────────────────────────
     1. STICKY NAVBAR
  ────────────────────────────────────────── */
  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ──────────────────────────────────────────
     2. ACTIVE NAV LINK
  ────────────────────────────────────────── */
  const sections  = [...document.querySelectorAll('section[id]')];
  const navLinks  = navMenu ? [...navMenu.querySelectorAll('.nav-link')] : [];

  function updateActiveLink() {
    if (!navbar || navLinks.length === 0) return;
    const offset = navbar.offsetHeight + 20;
    const scrollY = window.scrollY + offset;
    let current = sections[0]?.id || '';

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${current}`);
    });
  }

  /* ──────────────────────────────────────────
     3. BACK-TO-TOP
  ────────────────────────────────────────── */
  function updateBackTop() {
    if (!backTop) return;
    backTop.classList.toggle('visible', window.scrollY > 500);
  }

  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────────────────
     4. SCROLL HANDLER (all scroll effects)
  ────────────────────────────────────────── */
  function onScroll() {
    updateNavbar();
    updateActiveLink();
    updateBackTop();
    if (window.innerWidth >= 860 && !prefersReducedMotion) {
      doParallax();
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run immediately on load

  /* ──────────────────────────────────────────
     5. SMOOTH SCROLL
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = (navbar ? navbar.offsetHeight : 0) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────────────────
     6. MOBILE MENU TOGGLE
  ────────────────────────────────────────── */
  function openMenu() {
    if (!navMenu || !hamburger) return;
    navMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!navMenu || !hamburger) return;
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close when a nav link is tapped
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close if tapped outside
    document.addEventListener('click', e => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  // Re-close if window widens to desktop size
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 860) closeMenu();
    }, 100);
  });

  /* ──────────────────────────────────────────
     7. TICKER CLOSE BUTTON
  ────────────────────────────────────────── */
  if (tickerClose && announceBand) {
    // Restore hidden state from this session
    if (sessionStorage.getItem('pz-ticker-closed') === '1') {
      announceBand.style.display = 'none';
    }

    tickerClose.addEventListener('click', () => {
      announceBand.style.display = 'none';
      sessionStorage.setItem('pz-ticker-closed', '1');
    });
  }

  /* ──────────────────────────────────────────
     8. SCROLL REVEAL ANIMATIONS
     
     IMPORTANT: Elements start VISIBLE in the HTML/CSS.
     JS marks them .hidden first, THEN observes them so
     they animate in on scroll. This means:
     - If JS fails → content still fully visible ✓
     - If IntersectionObserver not supported → content visible ✓
     - Normal case → smooth slide-up animation ✓
  ────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    // Elements to animate — selected by data attributes set here
    const animTargets = [
      { selector: '.pillar',       delay: true },
      { selector: '.prod-card',    delay: true },
      { selector: '.price-card',   delay: true },
      { selector: '.team-card',    delay: true },
      { selector: '.hours-block',  delay: true },
      { selector: '.info-card',    delay: true },
      { selector: '.about-badge',  delay: false },
      { selector: '.alert-banner', delay: false },
      { selector: '.contact-card', delay: false },
    ];

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('hidden');
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

    animTargets.forEach(({ selector, delay }) => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('anim');
        if (delay && i > 0 && i <= 4) {
          el.classList.add(`delay-${i}`);
        }
        // Mark as hidden ONLY after adding the anim class (so CSS transition applies)
        requestAnimationFrame(() => {
          el.classList.add('hidden');
          observer.observe(el);
        });
      });
    });
  }
  // If IntersectionObserver not supported: elements remain visible, no animation. That's fine.

  /* ──────────────────────────────────────────
     9. HERO PARALLAX (subtle, desktop only)
  ────────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg-img');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function doParallax() {
    if (!heroBg || prefersReducedMotion) return;
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }

  /* ──────────────────────────────────────────
     10. PRICE CHANGE — AUTO COLOUR LOGIC
     
     Future-proof: if a .pc-change element's text
     starts with ▼ or minus, switch it to green .down.
     This way you only need to update the HTML text.
  ────────────────────────────────────────── */
  document.querySelectorAll('.pc-change').forEach(el => {
    const text = el.textContent.trim();
    if (/^[▼\-]/.test(text) || /\-R/.test(text)) {
      el.classList.remove('up');
      el.classList.add('down');
    }
  });

  /* ──────────────────────────────────────────
     11. IMAGE ERROR FALLBACKS
     
     If an image fails to load (e.g. images/ folder
     not uploaded yet), show a styled placeholder.
  ────────────────────────────────────────── */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      const parent = this.parentElement;
      if (parent) {
        parent.classList.add('img-missing');
        this.style.display = 'none';
      }
    });
  });

}); // end DOMContentLoaded
