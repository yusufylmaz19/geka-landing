const $ = (s, root = document) => root.querySelector(s);
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const lines = (value) => esc(value).replace(/\n/g, "<br>");
const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
const num = (n) => String(n + 1).padStart(2, "0");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
async function boot() {
  const response = await fetch("./data.json");
  if (!response.ok) throw new Error(`Content request: ${response.status}`);
  const d = await response.json();
  const heading = (s) =>
    `<div class="section-heading reveal"><div class="eyebrow">${esc(s.eyebrow)}</div><h2>${lines(s.title)}</h2></div>`;
  $("#app").innerHTML = `
  <a class="skip" href="#main">${esc(d.ui.skip)}</a>
  <header class="header wrap" id="hero"><a class="brand" href="#hero" aria-label="${esc(d.brand.name + " " + d.brand.suffix)}"><span class="brand-symbol" aria-hidden="true"></span><span class="brand-name">${esc(d.brand.name)}<small>${esc(d.brand.suffix)}</small></span></a><nav class="nav" id="navigation" aria-label="${esc(d.ui.menu)}">${d.nav.map((n) => `<a href="${esc(n.href)}">${esc(n.label)}</a>`).join("")}</nav><a class="header-cta" href="#iletisim">${esc(d.contact.cta)} ${arrow}</a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation">${esc(d.ui.menu)} <span aria-hidden="true">☰</span></button></header>
  <main id="main"><section class="hero wrap"><div class="hero-top"><div class="eyebrow">${esc(d.hero.eyebrow)}</div><span class="availability">${esc(d.hero.availability)}</span></div><div class="hero-scroll"><div class="hero-layout"><div class="hero-copy"><h1>${esc(d.hero.title[0])}<br><span class="outline">${esc(d.hero.title[1])}</span><br>${esc(d.hero.title[2])}</h1><p>${esc(d.hero.description)}</p><div class="hero-actions"><a class="button" href="#galeri">${esc(d.hero.primary)} ${arrow}</a><a class="text-link" href="#hakkimizda">${esc(d.hero.secondary)} <span aria-hidden="true">↗</span></a></div></div><div class="model-track"><div class="model-dock"><div class="model-stage" aria-hidden="true"><img class="model-fallback" data-src="${esc(d.hero.fallback)}" alt=""><canvas id="architecture"></canvas></div><div class="model-label">${esc(d.hero.model)}</div><button class="motion-toggle" hidden>${esc(d.ui.pause)}</button></div></div></div></div><div class="hero-bottom"><a href="#featured"><span aria-hidden="true">↓</span>${esc(d.hero.scroll)}</a><span class="index">${esc(d.hero.bottom)}</span><span>${esc(d.brand.location)}</span></div></section>
  <div class="wrap"><section class="feature-image" id="featured"><img src="${esc(d.feature.image)}" alt="${esc(d.feature.alt)}" fetchpriority="high"><div class="feature-caption"><div><div class="eyebrow">${esc(d.feature.eyebrow)}</div><h2>${esc(d.feature.title)}</h2></div><a class="round-link" href="#galeri" aria-label="${esc(d.hero.primary)}">↗</a></div></section></div>
  <section class="section wrap" id="hakkimizda"><div class="section-heading reveal"><div class="eyebrow">${esc(d.about.eyebrow)}</div><h2>${lines(d.about.title)}</h2><div class="about-text">${d.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div></div><div class="stats reveal">${d.about.stats.map((s) => `<div class="stat"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join("")}</div></section>
  <section class="section services" id="hizmetler"><div class="wrap">${heading(d.services)}<div class="services-layout"><div class="services-image reveal"><img src="${esc(d.services.image)}" alt="${esc(d.services.alt)}" loading="lazy"><p><span>${esc(d.services.caption)}</span><span>01 — 06</span></p></div><div>${d.services.items.map((s, i) => `<details name="services" ${i === 0 ? "open" : ""}><summary><span class="service-number">${num(i)}</span><h3>${esc(s.title)}</h3><span class="plus" aria-hidden="true">+</span></summary><p>${esc(s.description)}</p></details>`).join("")}</div></div></div></section>
  <section class="section wrap" id="galeri"><div class="gallery-heading reveal"><div><div class="eyebrow">${esc(d.gallery.eyebrow)}</div><h2>${lines(d.gallery.title)}</h2></div><p>${esc(d.gallery.description)}</p></div><div class="project-wall">${d.gallery.projects.map((p, i) => `<figure class="project"><button data-project="${i}" aria-label="${esc(p.title + " — " + d.ui.open)}"><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy"><span class="project-open" aria-hidden="true">↗</span></button><figcaption><div><h3>${esc(p.title)}</h3><small>${esc(p.category)}</small></div><span class="project-index">/ ${num(i)}</span></figcaption></figure>`).join("")}</div><div class="archive-top"><div class="filters" aria-label="${esc(d.gallery.filters[0].label)}">${d.gallery.filters.map((f, i) => `<button class="filter" data-filter="${esc(f.id)}" aria-pressed="${i === 0}">${esc(f.label)}</button>`).join("")}</div><span class="archive-count" aria-live="polite"></span></div><div class="archive-grid"></div><div class="archive-actions"><button class="button" id="more">${esc(d.gallery.more)} <span aria-hidden="true">+</span></button></div></section>
  <section class="section process wrap">${heading(d.process)}<div class="steps">${d.process.steps.map((s, i) => `<article class="step reveal"><small>/ ${num(i)}</small><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></article>`).join("")}</div></section>
  <section class="contact" id="iletisim"><div class="wrap"><div class="eyebrow">${esc(d.contact.eyebrow)}</div><div class="contact-main"><h2>${lines(d.contact.title)}</h2><div class="contact-links"><a class="button light" href="${esc(d.contact.whatsapp)}" target="_blank" rel="noopener noreferrer">${esc(d.contact.whatsappLabel)} ${arrow}</a><a class="text-link" href="${esc(d.contact.phoneHref)}">${esc(d.contact.phone)} ${arrow}</a></div></div><div class="contact-details"><span>${esc(d.brand.name + " " + d.brand.suffix)}<br>${esc(d.contact.address)}<br><a class="text-link" href="${esc(d.contact.directionsUrl)}" target="_blank" rel="noopener noreferrer">${esc(d.contact.directionsLabel)} ${arrow}</a></span><span>${esc(d.contact.hours)}<br>${esc(d.contact.closed)}</span><a href="${esc(d.contact.instagram)}" target="_blank" rel="noopener noreferrer">${esc(d.contact.socialLabel)} ↗</a></div><footer class="footer"><span>${esc(d.contact.copyright)}</span><a href="#hero">${esc(d.contact.top)} ↑</a></footer></div></section></main>
  <dialog aria-label="${esc(d.ui.viewer)}"><div class="lightbox-bar"><span id="media-title"></span><button id="close" aria-label="${esc(d.ui.close)}">×</button></div><div class="lightbox-media"></div><div class="lightbox-controls"><button id="previous" aria-label="${esc(d.ui.previous)}">←</button><span id="media-counter" aria-live="polite"></span><button id="next" aria-label="${esc(d.ui.next)}">→</button></div></dialog>`;
  const menu = $(".menu-toggle");
  const closeMenu = () => {
    menu.setAttribute("aria-expanded", "false");
    $(".nav").classList.remove("open");
  };
  menu.onclick = () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    $(".nav").classList.toggle("open", open);
  };
  $(".nav").addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
  const archive = d.gallery.media;
  let filtered = archive,
    shown = 8,
    current = [],
    position = 0,
    opener;
  function renderArchive() {
    $(".archive-grid").innerHTML = filtered
      .slice(0, shown)
      .map(
        (p, i) =>
          `<button class="archive-item" data-media="${i}" aria-label="${esc(p.title + " — " + d.ui.open)}"><img src="${esc(p.type === "video" ? p.poster : p.src)}" alt="${esc(p.title)}" loading="lazy">${p.type === "video" ? '<span aria-hidden="true">▶</span>' : ""}</button>`,
      )
      .join("");
    $(".archive-count").textContent =
      `${Math.min(shown, filtered.length)} / ${filtered.length} ${d.gallery.countLabel}`;
    $("#more").hidden = shown >= filtered.length;
  }
  $(".filters").onclick = (e) => {
    const b = e.target.closest("[data-filter]");
    if (!b) return;
    document
      .querySelectorAll(".filter")
      .forEach((f) => f.setAttribute("aria-pressed", String(f === b)));
    filtered = archive.filter(
      (p) => b.dataset.filter === "all" || p.type === b.dataset.filter,
    );
    shown = b.dataset.filter === "video" ? filtered.length : 8;
    renderArchive();
  };
  $("#more").onclick = () => {
    const firstNew = shown;
    shown += 12;
    renderArchive();
    $(`[data-media="${firstNew}"]`)?.focus({ preventScroll: true });
  };
  const dialog = $("dialog");
  function showMedia() {
    const p = current[position];
    $(".lightbox-media").replaceChildren();
    const media = document.createElement(p.type === "video" ? "video" : "img");
    media.src = p.src;
    if (p.type === "video") {
      media.controls = true;
      media.playsInline = true;
      media.preload = "metadata";
      media.defaultMuted = true;
      media.muted = true;
      media.volume = 0;
      const keepMuted = () => {
        if (!media.muted) media.muted = true;
        if (media.volume !== 0) media.volume = 0;
      };
      media.addEventListener("volumechange", keepMuted);
      media.addEventListener("play", keepMuted);
    } else media.alt = p.title;
    $(".lightbox-media").append(media);
    $("#media-title").textContent = p.title;
    $("#media-counter").textContent = `${position + 1} / ${current.length}`;
  }
  function openMedia(items, i, button) {
    current = items;
    position = i;
    opener = button;
    showMedia();
    dialog.showModal();
    document.body.classList.add("modal-open");
    $("#close").focus();
  }
  $(".archive-grid").onclick = (e) => {
    const b = e.target.closest("[data-media]");
    if (b) openMedia(filtered, Number(b.dataset.media), b);
  };
  $(".project-wall").onclick = (e) => {
    const b = e.target.closest("[data-project]");
    if (b)
      openMedia(
        d.gallery.projects.map((p) => ({
          src: p.image,
          type: "image",
          title: p.title,
        })),
        Number(b.dataset.project),
        b,
      );
  };
  const move = (delta) => {
    position = (position + delta + current.length) % current.length;
    showMedia();
  };
  $("#previous").onclick = () => move(-1);
  $("#next").onclick = () => move(1);
  $("#close").onclick = () => dialog.close();
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(1);
    }
  });
  dialog.addEventListener("close", () => {
    $(".lightbox-media").replaceChildren();
    document.body.classList.remove("modal-open");
    opener?.focus({ preventScroll: true });
  });
  renderArchive();
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("seen");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((e) => observer.observe(e));
  import("./scene.js")
    .then((m) => m.initScene(d.ui))
    .catch((e) => {
      console.warn("Architectural scene unavailable.", e);
      const stage = $(".model-stage");
      const image = $(".model-fallback");
      image.src = image.dataset.src;
      image.onload = () => stage.classList.add("failed");
      $(".hero").classList.add("scene-failed");
    });
  initScroll();
  initPrivacy(d.privacy);
  const credit = d.contact.credit;
  $(".footer").insertAdjacentHTML(
    "afterend",
    `<div class="site-credit"><span>${esc(credit.label)} <a href="${esc(credit.website)}" target="_blank" rel="noopener noreferrer"><strong>${esc(credit.name)}</strong></a></span><div class="site-credit-links"><a href="${esc(credit.phoneHref)}">${esc(credit.phone)}</a><a href="${esc(credit.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram: ${esc(credit.instagramLabel)}">${esc(credit.instagramLabel)} ↗</a></div></div>`,
  );
}
function initPrivacy(copy) {
  const id = "G-ZVEB9FZZJP";
  let consent;
  try {
    consent = localStorage.getItem("ga_consent");
  } catch {}
  let loaded = false;
  function analytics() {
    window["ga-disable-" + id] = false;
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id);
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.append(script);
  }
  const panel = document.createElement("aside");
  panel.className = "cookie-panel";
  panel.setAttribute("aria-label", copy.title);
  panel.innerHTML = `<strong>${esc(copy.title)}</strong><p>${esc(copy.description)}</p><div class="cookie-actions"><button data-consent="denied">${esc(copy.decline)}</button><button data-consent="granted">${esc(copy.accept)}</button></div>`;
  panel.hidden = !!consent;
  document.body.append(panel);
  const settings = document.createElement("button");
  settings.className = "privacy-settings";
  settings.textContent = copy.settings;
  $(".footer").append(settings);
  settings.onclick = () => {
    panel.hidden = false;
    $("button", panel).focus();
  };
  panel.onclick = (e) => {
    const button = e.target.closest("[data-consent]");
    if (!button) return;
    consent = button.dataset.consent;
    try {
      localStorage.setItem("ga_consent", consent);
    } catch {}
    if (consent === "granted") analytics();
    else window["ga-disable-" + id] = true;
    panel.hidden = true;
    settings.focus({ preventScroll: true });
  };
  if (consent === "granted") analytics();
  document.addEventListener("click", (e) => {
    if (consent !== "granted" || !window.gtag) return;
    const link = e.target.closest("a");
    if (!link) return;
    if (link.href.includes("wa.me/")) window.gtag("event", "whatsapp_click");
    else if (link.href.startsWith("tel:")) window.gtag("event", "phone_click");
    else if (link.href.includes("instagram.com/"))
      window.gtag("event", "social_click", { network: "instagram" });
  });
}
function initScroll() {
  const feature = $(".feature-image"),
    photo = $(".feature-image img"),
    projects = [...document.querySelectorAll(".project")];
  let pending = false;
  function draw() {
    pending = false;
    if (reduced.matches) return;
    const rect = feature.getBoundingClientRect();
    const p = Math.max(
      0,
      Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)),
    );
    photo.style.transform = `translateY(${-p * 15}%)`;
    projects.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const progress = Math.max(
        -1,
        Math.min(1, (r.top - innerHeight / 2) / innerHeight),
      );
      el.style.transform = `translateY(${progress * (i % 2 ? 28 : -16)}px)`;
    });
  }
  addEventListener(
    "scroll",
    () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(draw);
      }
    },
    { passive: true },
  );
  addEventListener("resize", draw);
  reduced.addEventListener("change", () => {
    photo.style.transform = "";
    projects.forEach((p) => (p.style.transform = ""));
    draw();
  });
  draw();
}
boot().catch((error) => {
  console.error(error);
  $("#app").innerHTML =
    '<div class="loading"><h1>GEKA Yapı</h1><p>İçerik yüklenemedi. Lütfen bağlantınızı kontrol edip sayfayı yenileyin.</p><p>Yerel önizleme için siteyi bir HTTP sunucusu üzerinden açın.</p><a class="button" href="tel:+905308820849">0530 882 08 49 ↗</a></div>';
});
