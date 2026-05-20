/* ========================================
   GEKA Yapı — script.js
   Vanilla JavaScript — No dependencies
   v2: Cursor trail, enhanced scroll anims, muted videos
   ======================================== */

(function () {
  'use strict';

  // Global flag to prevent infinite scroll firing during smooth scroll
  window.isAutoScrolling = false;
  var autoScrollTimeout = null;
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function() {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        window.isAutoScrolling = true;
        clearTimeout(autoScrollTimeout);
        autoScrollTimeout = setTimeout(function() {
          window.isAutoScrolling = false;
        }, 1500); // Wait 1.5s for smooth scroll to finish
      }
    });
  });

  /* ──────────────────────────────────────
     Cursor Trail Animation
     ────────────────────────────────────── */
  const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX - 3 + 'px';
      dot.style.top = mouseY - 3 + 'px';
    });

    function animateTrail() {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      trail.style.left = trailX - 14 + 'px';
      trail.style.top = trailY - 14 + 'px';
      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Expand cursor on interactive elements
    const interactiveSelectors = 'a, button, .gallery-item, .service-card, .filter-btn, .btn, .wa-big-btn, .social-links a';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  /* ──────────────────────────────────────
     Blueprint Canvas Background (enhanced)
     ────────────────────────────────────── */
  const canvas = document.getElementById('blueprint-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    let time = 0;
    let sketches = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      
      if (sketches.length === 0) {
        for(let i=0; i<8; i++) {
          sketches.push({
            x: Math.random() * 4000,
            y: Math.random() * 4000,
            scale: 0.6 + Math.random() * 1.4,
            type: Math.floor(Math.random() * 4),
            rotation: Math.random() * 0.2 - 0.1
          });
        }
      }
    }

    function drawGrid() {
      ctx.clearRect(0, 0, w, h);

      const spacing = 55;
      const offset = time * 0.12;
      const pulse = Math.sin(time * 0.008) * 0.5 + 0.5;

      // Major grid lines
      ctx.strokeStyle = 'rgba(0, 220, 255, ' + (0.04 + pulse * 0.02) + ')';
      ctx.lineWidth = 0.5;
      for (let y = (offset % spacing); y < h; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = (offset % spacing); x < w; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Minor subdivisions
      ctx.strokeStyle = 'rgba(220, 235, 255, 0.015)';
      ctx.lineWidth = 0.3;
      var minor = spacing / 4;
      for (let y = (offset % minor); y < h; y += minor) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = (offset % minor); x < w; x += minor) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Diagonal accent lines
      ctx.strokeStyle = 'rgba(220, 235, 255, ' + (0.02 + pulse * 0.015) + ')';
      ctx.lineWidth = 0.6;
      for (let i = -h; i < w + h; i += spacing * 3) {
        ctx.beginPath();
        ctx.moveTo(i + offset * 0.4, 0);
        ctx.lineTo(i - h + offset * 0.4, h);
        ctx.stroke();
      }

      // Glowing intersection nodes
      var nodeAlpha = 0.06 + pulse * 0.06;
      ctx.fillStyle = 'rgba(220, 235, 255, ' + nodeAlpha + ')';
      for (let x = (offset % (spacing * 2)); x < w; x += spacing * 2) {
        for (let y = (offset % (spacing * 2)); y < h; y += spacing * 2) {
          ctx.beginPath();
          ctx.arc(x, y, 2 + pulse, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Scanline effect
      var scanY = (time * 0.4) % h;
      var grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      grad.addColorStop(0, 'rgba(220, 235, 255,0)');
      grad.addColorStop(0.5, 'rgba(220, 235, 255,0.03)');
      grad.addColorStop(1, 'rgba(220, 235, 255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 30, w, 60);

      // --- Architectural Sketches ---
      ctx.strokeStyle = 'rgba(220, 235, 255, ' + (0.04 + pulse * 0.02) + ')';
      ctx.lineWidth = 1;
      
      sketches.forEach(s => {
        ctx.save();
        let currentY = (s.y + time * 0.08) % (h + 600) - 300;
        let currentX = s.x % (w + 600) - 300;
        
        ctx.translate(currentX, currentY);
        ctx.rotate(s.rotation);
        ctx.scale(s.scale, s.scale);
        ctx.beginPath();
        
        if (s.type === 0) {
          // House frame
          ctx.moveTo(-50, 0); ctx.lineTo(50, 0); 
          ctx.moveTo(-50, 0); ctx.lineTo(-50, -60); 
          ctx.moveTo(50, 0); ctx.lineTo(50, -60); 
          ctx.moveTo(-50, -60); ctx.lineTo(0, -100); ctx.lineTo(50, -60); 
          ctx.moveTo(-60, -60); ctx.lineTo(60, -60); 
          ctx.rect(-20, -40, 15, 20); 
          ctx.moveTo(-20, -30); ctx.lineTo(-5, -30);
          ctx.moveTo(-12.5, -40); ctx.lineTo(-12.5, -20);
        } else if (s.type === 1) {
          // Roof Truss
          ctx.moveTo(-80, 0); ctx.lineTo(80, 0);
          ctx.moveTo(-80, 0); ctx.lineTo(0, -60); ctx.lineTo(80, 0);
          ctx.moveTo(-40, 0); ctx.lineTo(0, -60);
          ctx.moveTo(40, 0); ctx.lineTo(0, -60);
          ctx.moveTo(-40, 0); ctx.lineTo(-40, -30);
          ctx.moveTo(40, 0); ctx.lineTo(40, -30);
        } else if (s.type === 2) {
          // I-Beam Isometric
          ctx.moveTo(-20, -30); ctx.lineTo(20, -30); 
          ctx.moveTo(-20, -26); ctx.lineTo(-2, -26);
          ctx.lineTo(-2, 26); ctx.lineTo(-20, 26);
          ctx.moveTo(20, -26); ctx.lineTo(2, -26);
          ctx.lineTo(2, 26); ctx.lineTo(20, 26);
          ctx.moveTo(-20, 30); ctx.lineTo(20, 30); 
          ctx.moveTo(-20, -30); ctx.lineTo(-20, -26);
          ctx.moveTo(20, -30); ctx.lineTo(20, -26);
          ctx.moveTo(-20, 30); ctx.lineTo(-20, 26);
          ctx.moveTo(20, 30); ctx.lineTo(20, 26);
        } else if (s.type === 3) {
          // Protractor / Arch blueprint
          ctx.arc(0, 0, 50, Math.PI, Math.PI * 2);
          ctx.arc(0, 0, 45, Math.PI, Math.PI * 2);
          for(let a=Math.PI; a<=Math.PI*2; a+=Math.PI/12) {
             ctx.moveTo(Math.cos(a)*45, Math.sin(a)*45);
             ctx.lineTo(Math.cos(a)*50, Math.sin(a)*50);
          }
          ctx.moveTo(-60, 0); ctx.lineTo(60, 0);
        }
        
        ctx.stroke();
        
        // Annotations
        if (s.type === 0 || s.type === 1) {
           ctx.strokeStyle = 'rgba(220, 235, 255, ' + (0.02 + pulse * 0.01) + ')';
           ctx.beginPath();
           ctx.moveTo(-80, 20); ctx.lineTo(80, 20);
           ctx.moveTo(-80, 15); ctx.lineTo(-80, 25);
           ctx.moveTo(80, 15); ctx.lineTo(80, 25);
           ctx.stroke();
           ctx.fillStyle = 'rgba(220, 235, 255, ' + (0.03 + pulse * 0.02) + ')';
           ctx.font = "8px monospace";
           ctx.fillText("4500 mm", -15, 32);
        }
        
        ctx.restore();
      });

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

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
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
     Enhanced Reveal on Scroll
     (supports: .reveal, .reveal-left, .reveal-right, .reveal-scale)
     ────────────────────────────────────── */
  var allRevealClasses = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
  var revealElements = document.querySelectorAll(allRevealClasses);

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Staggered delay
          var parent = entry.target.parentElement;
          if (parent) {
            var siblings = Array.from(parent.querySelectorAll(allRevealClasses));
            var idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = (idx * 0.1) + 's';
          }
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ──────────────────────────────────────
     Parallax-lite scroll effect on sections
     ────────────────────────────────────── */
  var parallaxSections = document.querySelectorAll('#hizmetler, #hakkimizda, #galeri, #iletisim');

  function updateParallax() {
    var scrollY = window.scrollY;
    var winH = window.innerHeight;

    parallaxSections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      var sectionMid = rect.top + rect.height / 2;
      var viewMid = winH / 2;
      var delta = (sectionMid - viewMid) / winH;
      // Subtle upward parallax on bg
      var shift = delta * -12;
      section.style.transform = 'translateY(' + shift + 'px)';
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });

  /* ──────────────────────────────────────
     Tilt effect on service cards
     ────────────────────────────────────── */
  if (!isTouchDevice) {
    document.querySelectorAll('.service-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-8px) perspective(600px) rotateX(' + (y * -6) + 'deg) rotateY(' + (x * 6) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ──────────────────────────────────────
     Count-Up Animation
     ────────────────────────────────────── */
  var statNumbers = document.querySelectorAll('.stat-number');

  var countObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var countEl = el.querySelector('.count');
          animateCount(countEl, 0, target, 2000);
          countObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  statNumbers.forEach(function (el) {
    countObserver.observe(el);
  });

  function animateCount(el, start, end, duration) {
    var startTime = performance.now();
    function step(now) {
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
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
     Dynamic Gallery Initialization & Load More
     ────────────────────────────────────── */
  var galleryGrid = document.getElementById('galleryGrid');
  var loadMoreContainer = document.getElementById('galleryLoadMoreContainer');
  var galleryCount = document.getElementById('galleryCount');
  
  var galleryData = [];
  var currentFilter = 'all';
  var itemsPerPage = 12;
  var currentPage = 0;
  var filteredData = [];
  var galleryItems = document.querySelectorAll('.gallery-item'); // Initialize

  if (galleryGrid) {
    for (var j = 1; j <= 8; j++) galleryData.push({ type: 'video', index: j });
    for (var i = 1; i <= 95; i++) galleryData.push({ type: 'image', index: i });
    
    // Shuffle the array for a diverse layout
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    shuffle(galleryData);

    function createGalleryItem(data) {
      var type = data.type;
      var index = data.index;

      var item = document.createElement('div');
      item.className = 'gallery-item reveal-scale';
      item.setAttribute('data-type', type);

      var overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = '<span>' + (type === 'image' ? 'Görüntüle' : 'Oynat') + '</span>';

      if (type === 'image') {
        var img = document.createElement('img');
        img.loading = 'lazy';
        img.onerror = function() { item.remove(); };
        img.src = 'galeri/images/' + index + '.jpeg';
        item.appendChild(img);
      } else {
        var vid = document.createElement('video');
        vid.muted = true;
        vid.loop = true;
        vid.preload = 'none';
        vid.onerror = function() { item.remove(); };
        vid.src = 'galeri/videos/' + index + '.mp4';
        item.appendChild(vid);

        var vidObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              vid.load();
              // Try to play if possible
              var playPromise = vid.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {});
              }
              vidObserver.unobserve(vid);
            }
          });
        });
        vidObserver.observe(vid);

        var indicator = document.createElement('div');
        indicator.className = 'video-indicator';
        indicator.innerHTML = '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>';
        item.appendChild(indicator);
      }
      
      item.appendChild(overlay);
      revealObserver.observe(item);
      return item;
    }

    function renderGallery() {
      var start = currentPage * itemsPerPage;
      var end = start + itemsPerPage;
      var itemsToRender = filteredData.slice(start, end);
      
      itemsToRender.forEach(function(data) {
        galleryGrid.appendChild(createGalleryItem(data));
      });

      if (end >= filteredData.length) {
        loadMoreContainer.style.display = 'none';
        end = filteredData.length;
      } else {
        loadMoreContainer.style.display = 'block';
      }
      
      if (galleryCount) {
        galleryCount.textContent = end + ' / ' + filteredData.length + ' görsel gösteriliyor';
      }
      
      galleryItems = document.querySelectorAll('.gallery-item');
      
      // Update lightbox items
      currentItems = getVisibleItems();
    }

    function applyFilter(filter) {
      currentFilter = filter;
      if (filter === 'all') {
        filteredData = galleryData;
      } else {
        filteredData = galleryData.filter(item => item.type === filter);
      }
      galleryGrid.innerHTML = '';
      currentPage = 0;
      renderGallery();
    }

    filteredData = galleryData;
    renderGallery();

    // Infinite scroll observer to auto-load more items when near the bottom
    var infiniteScrollObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && loadMoreContainer.style.display !== 'none') {
          if (window.isAutoScrolling) return; // Prevent loading during smooth scroll to anchor
          currentPage++;
          renderGallery();
        }
      });
    }, { rootMargin: '0px 0px 600px 0px' });
    
    infiniteScrollObserver.observe(loadMoreContainer);

    /* ──────────────────────────────────────
       Gallery Filters
       ────────────────────────────────────── */
    var filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');

        if (typeof trackEvent === 'function') trackEvent('gallery_filter_click', { filter_type: filter });

        applyFilter(filter);
      });
    });
  }

  /* ──────────────────────────────────────
     Lightbox
     ────────────────────────────────────── */
  var lightbox = document.getElementById('lightbox');
  var lbContent = document.getElementById('lbContent');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var lbCounter = document.getElementById('lbCounter');

  var currentItems = [];
  var currentIndex = 0;

  function getVisibleItems() {
    return Array.from(galleryItems).filter(function (item) {
      return item.style.display !== 'none' && item.parentNode !== null;
    });
  }

  function openLightbox(index) {
    currentItems = getVisibleItems();
    currentIndex = index;
    showLightboxItem();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (typeof trackEvent === 'function') {
      var item = currentItems[index];
      if (item) trackEvent('lightbox_open', { item_type: item.getAttribute('data-type') });
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    var vid = lbContent.querySelector('video');
    if (vid) vid.pause();
    lbContent.innerHTML = '';
  }

  function showLightboxItem() {
    var prevVid = lbContent.querySelector('video');
    if (prevVid) prevVid.pause();
    lbContent.innerHTML = '';

    var item = currentItems[currentIndex];
    var type = item.getAttribute('data-type');

    if (type === 'video') {
      var vid = item.querySelector('video');
      var newVid = document.createElement('video');
      newVid.src = vid.src;
      newVid.autoplay = true;
      newVid.muted = true;
      newVid.loop = true;
      newVid.controls = false; // no controls so user cannot unmute
      newVid.style.maxWidth = '90vw';
      newVid.style.maxHeight = '85vh';
      newVid.style.borderRadius = '6px';
      lbContent.appendChild(newVid);
    } else {
      var img = item.querySelector('img');
      var newImg = document.createElement('img');
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

  if (galleryGrid) {
    galleryGrid.addEventListener('click', function (e) {
      var item = e.target.closest('.gallery-item');
      if (!item) return;
      var visibleItems = getVisibleItems();
      var idx = visibleItems.indexOf(item);
      if (idx > -1) {
        openLightbox(idx);
      }
    });
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevItem);
  lbNext.addEventListener('click', nextItem);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevItem();
    if (e.key === 'ArrowRight')  nextItem();
  });

  // Mouse wheel navigation for lightbox with throttle
  var wheelTimeout = null;
  lightbox.addEventListener('wheel', function(e) {
    if (!lightbox.classList.contains('active')) return;
    e.preventDefault(); // prevent page scroll
    
    if (wheelTimeout) return; // ignore events if we just scrolled
    
    if (e.deltaY > 0) {
      nextItem();
    } else if (e.deltaY < 0) {
      prevItem();
    }
    
    // Lock scrolling for 400ms to prevent skipping multiple items
    wheelTimeout = setTimeout(function() {
      wheelTimeout = null;
    }, 400);
  }, { passive: false });

  // Swipe & Grab Navigation for Lightbox
  var startX = 0;
  var endX = 0;
  var isDragging = false;

  function handleSwipe() {
    var threshold = 50; // Minimum swipe distance
    var distance = endX - startX;
    if (Math.abs(distance) > threshold) {
      if (distance < 0) {
        nextItem(); // Swipe left -> Next
      } else {
        prevItem(); // Swipe right -> Prev
      }
    }
  }

  // Touch Events (Mobile)
  lightbox.addEventListener('touchstart', function(e) {
    if (!lightbox.classList.contains('active')) return;
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function(e) {
    if (!lightbox.classList.contains('active')) return;
    endX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  // Mouse Events (Desktop Drag)
  lightbox.addEventListener('mousedown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.target.closest('button')) return; // Don't trigger if clicking navigation buttons
    isDragging = true;
    startX = e.clientX;
    lightbox.style.cursor = 'grabbing';
  });

  lightbox.addEventListener('mouseup', function(e) {
    if (!isDragging || !lightbox.classList.contains('active')) return;
    isDragging = false;
    endX = e.clientX;
    lightbox.style.cursor = '';
    handleSwipe();
  });

  lightbox.addEventListener('mouseleave', function() {
    if (isDragging) {
      isDragging = false;
      lightbox.style.cursor = '';
    }
  });

  /* ──────────────────────────────────────
     Section title glow on scroll
     ────────────────────────────────────── */
  document.querySelectorAll('.section-title').forEach(function (title) {
    var glowObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          title.style.transition = 'text-shadow 1s';
          title.style.textShadow = '0 0 60px rgba(220, 235, 255,.2), 0 0 120px rgba(220, 235, 255,.08)';
        }
      });
    }, { threshold: 0.5 });
    glowObserver.observe(title);
  });

  /* ──────────────────────────────────────
     Cookie Consent
     ────────────────────────────────────── */
  const cookieConsent = document.getElementById('cookieConsent');
  const ccAccept = document.getElementById('ccAccept');
  const ccDecline = document.getElementById('ccDecline');

  if (cookieConsent && ccAccept && ccDecline) {
    const consent = localStorage.getItem('ga_consent');
    
    if (!consent) {
      setTimeout(function() {
        cookieConsent.classList.add('show');
      }, 2000);
    }

    ccAccept.addEventListener('click', function() {
      localStorage.setItem('ga_consent', 'granted');
      cookieConsent.classList.remove('show');
      
      // Load GA dynamically
      if (typeof window.dataLayer === 'undefined' || (window.dataLayer && window.dataLayer.length === 0)) {
        let script = document.createElement('script');
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=G-ZVEB9FZZJP";
        document.head.appendChild(script);

        gtag('js', new Date());
        gtag('config', 'G-ZVEB9FZZJP');
      }
    });

    ccDecline.addEventListener('click', function() {
      localStorage.setItem('ga_consent', 'denied');
      cookieConsent.classList.remove('show');
    });
  }

  /* ──────────────────────────────────────
     Init
     ────────────────────────────────────── */
  onScroll();
  updateActiveLink();
})();
