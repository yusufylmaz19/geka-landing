/* ========================================
   GEKA Yapı — script.js
   Vanilla JavaScript — No dependencies
   ======================================== */

(function () {
  'use strict';

  /* ──────────────────────────────────────
     Blueprint Canvas Background
     ────────────────────────────────────── */
  const canvas = document.getElementById('blueprint-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    let time = 0;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function drawGrid() {
      ctx.clearRect(0, 0, w, h);

      const spacing = 60;
      const offset = time * 0.15;

      // Horizontal lines
      ctx.strokeStyle = 'rgba(0, 180, 200, 0.06)';
      ctx.lineWidth = 0.5;
      for (let y = (offset % spacing); y < h; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Vertical lines
      for (let x = (offset % spacing); x < w; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Accent diagonal lines
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.03)';
      ctx.lineWidth = 0.8;
      for (let i = -h; i < w + h; i += spacing * 3) {
        ctx.beginPath();
        ctx.moveTo(i + offset * 0.5, 0);
        ctx.lineTo(i - h + offset * 0.5, h);
        ctx.stroke();
      }

      // Glowing nodes at intersections
      ctx.fillStyle = 'rgba(0, 245, 255, 0.08)';
      for (let x = (offset % (spacing * 3)); x < w; x += spacing * 3) {
        for (let y = (offset % (spacing * 3)); y < h; y += spacing * 3) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      time++;
      requestAnimationFrame(drawGrid);
    }

    resize();
    drawGrid();
    window.addEventListener('resize', resize);
  }

  /* ──────────────────────────────────────
     Navbar — Scroll Effect
     ────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ──────────────────────────────────────
     Hamburger Menu
     ────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function toggleMenu() {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', closeMenu);

  // Close on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ──────────────────────────────────────
     Scroll Spy – Active Nav Link
     ────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ──────────────────────────────────────
     Reveal on Scroll (Intersection Observer)
     ────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          // Staggered delay for sibling cards
          const parent = entry.target.parentElement;
          if (parent) {
            const siblings = Array.from(parent.querySelectorAll('.reveal'));
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = (idx * 0.08) + 's';
          }
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ──────────────────────────────────────
     Count-Up Animation
     ────────────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number');

  const countObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const countEl = el.querySelector('.count');
          animateCount(countEl, 0, target, 1800);
          countObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(function (el) {
    countObserver.observe(el);
  });

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(eased * (end - start) + start);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = end;
      }
    }

    requestAnimationFrame(step);
  }

  /* ──────────────────────────────────────
     Gallery Filters
     ────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-type') === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ──────────────────────────────────────
     Lightbox
     ────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lbContent = document.getElementById('lbContent');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbCounter = document.getElementById('lbCounter');

  let currentItems = [];
  let currentIndex = 0;

  function getVisibleItems() {
    return Array.from(galleryItems).filter(function (item) {
      return item.style.display !== 'none';
    });
  }

  function openLightbox(index) {
    currentItems = getVisibleItems();
    currentIndex = index;
    showLightboxItem();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Pause any playing video
    const vid = lbContent.querySelector('video');
    if (vid) vid.pause();
    lbContent.innerHTML = '';
  }

  function showLightboxItem() {
    // Clean up previous
    const prevVid = lbContent.querySelector('video');
    if (prevVid) prevVid.pause();
    lbContent.innerHTML = '';

    const item = currentItems[currentIndex];
    const type = item.getAttribute('data-type');

    if (type === 'video') {
      const vid = item.querySelector('video');
      const newVid = document.createElement('video');
      newVid.src = vid.src;
      newVid.controls = true;
      newVid.autoplay = true;
      newVid.style.maxWidth = '90vw';
      newVid.style.maxHeight = '85vh';
      newVid.style.borderRadius = '4px';
      lbContent.appendChild(newVid);
    } else {
      const img = item.querySelector('img');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt;
      lbContent.appendChild(newImg);
    }

    lbCounter.textContent = (currentIndex + 1) + ' / ' + currentItems.length;
  }

  function prevItem() {
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    showLightboxItem();
  }

  function nextItem() {
    currentIndex = (currentIndex + 1) % currentItems.length;
    showLightboxItem();
  }

  // Events
  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var visibleItems = getVisibleItems();
      var idx = visibleItems.indexOf(item);
      openLightbox(idx);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevItem);
  lbNext.addEventListener('click', nextItem);

  // Click outside content to close
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevItem();
    if (e.key === 'ArrowRight')  nextItem();
  });

  /* ──────────────────────────────────────
     Initial setup
     ────────────────────────────────────── */
  onScroll();
  updateActiveLink();
})();
