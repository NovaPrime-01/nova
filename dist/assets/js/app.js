/* =============================================================================
   NOVA — APP
   Renders content from NOVA_DATA and wires up all interactions.
   No external dependencies.
   ============================================================================= */
(function () {
  "use strict";

  var D = window.NOVA_DATA;
  if (!D) { console.error("NOVA_DATA missing"); return; }
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------------------------------------------------------------------------
     GENERATIVE PLACEHOLDER ART
     Deterministic, on-brand abstract visuals (dark + faint accent).
     Replace project `preview` with a real image URL to override.
  --------------------------------------------------------------------------- */
  function makeArt(seed) {
    var s = (seed + 1) * 9301 + 49297;
    var rnd = function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    var W = 800, H = 600;
    var bg = ["#0E0E11", "#0B0B0D", "#101013", "#0C0C0F"][Math.floor(rnd() * 4)];
    var cx = (rnd() * W).toFixed(0);
    var cy = (rnd() * H).toFixed(0);
    var r = (rnd() * 240 + 120).toFixed(0);
    var gid = "g" + seed;
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + W + " " + H + "' preserveAspectRatio='xMidYMid slice'>";
    svg += "<defs><radialGradient id='" + gid + "'><stop offset='0' stop-color='rgba(255,77,46,0.22)'/><stop offset='1' stop-color='rgba(255,77,46,0)'/></radialGradient></defs>";
    svg += "<rect width='" + W + "' height='" + H + "' fill='" + bg + "'/>";
    svg += "<circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' fill='url(#" + gid + ")'/>";
    svg += "<g stroke='rgba(255,255,255,0.06)' stroke-width='1'>";
    for (var i = 1; i < 10; i++) { var x = (W / 10) * i; svg += "<line x1='" + x + "' y1='0' x2='" + x + "' y2='" + H + "'/>"; }
    for (var j = 1; j < 8; j++) { var y = (H / 8) * j; svg += "<line x1='0' y1='" + y + "' x2='" + W + "' y2='" + y + "'/>"; }
    svg += "</g>";
    // a few geometric accents
    var shapes = Math.floor(rnd() * 3) + 2;
    for (var k = 0; k < shapes; k++) {
      var t = rnd();
      var px = (rnd() * W).toFixed(0), py = (rnd() * H).toFixed(0);
      if (t < 0.4) {
        svg += "<circle cx='" + px + "' cy='" + py + "' r='" + (rnd() * 60 + 20).toFixed(0) + "' fill='none' stroke='rgba(255,255,255,0.18)' stroke-width='1.5'/>";
      } else if (t < 0.75) {
        var sz = (rnd() * 120 + 40).toFixed(0);
        svg += "<rect x='" + px + "' y='" + py + "' width='" + sz + "' height='" + sz + "' fill='none' stroke='rgba(255,255,255,0.14)' stroke-width='1.5' transform='rotate(" + (rnd() * 45).toFixed(0) + " " + px + " " + py + ")'/>";
      } else {
        svg += "<line x1='" + px + "' y1='" + py + "' x2='" + (rnd() * W).toFixed(0) + "' y2='" + (rnd() * H).toFixed(0) + "' stroke='rgba(255,255,255,0.12)' stroke-width='1.5'/>";
      }
    }
    if (rnd() > 0.45) {
      svg += "<line x1='0' y1='" + (rnd() * H).toFixed(0) + "' x2='" + W + "' y2='" + (rnd() * H).toFixed(0) + "' stroke='rgba(255,77,46,0.55)' stroke-width='1.5'/>";
    }
    svg += "</svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function preview(item, i) {
    if (item.preview && item.preview.trim() !== "") {
      return "<img src=\"" + item.preview + "\" alt=\"" + escapeAttr(item.title) + "\" loading=\"lazy\" />";
    }
    return "<div class='art' style=\"background:url(" + makeArt(i) + ") center/cover\"></div>";
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
  function esc(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------------------------------------------------------------------------
     RENDER: NAV + MENU + SOCIAL
  --------------------------------------------------------------------------- */
  function renderChrome() {
    var navLinks = D.nav.map(function (n) {
      return "<a class='nav__link' href='#" + n.id + "' data-section='" + n.id + "' data-cursor='OPEN'>" + esc(n.label) + "</a>";
    }).join("");
    $("navLinks").innerHTML = navLinks;

    var menuLinks = D.nav.map(function (n, i) {
      return "<a class='menu__link' href='#" + n.id + "' data-menu-link>" +
        "<span class='label-mono'>0" + (i + 1) + "</span>" + esc(n.label) + "</a>";
    }).join("");
    $("menuLinks").innerHTML = menuLinks;

    var socialHtml = D.social.map(function (s) {
      return "<a href='" + s.url + "' target='_blank' rel='noopener'>" + esc(s.platform) + "</a>";
    }).join("");
    $("menuSocial").innerHTML = socialHtml;
  }

  /* ---------------------------------------------------------------------------
     RENDER: HERO
  --------------------------------------------------------------------------- */
  function renderHero() {
    var social = D.social.map(function (s) {
      return "<a href='" + s.url + "' target='_blank' rel='noopener' data-cursor='OPEN'>" + esc(s.platform) + "</a>";
    }).join("");
    var h = D.hero;
    $("hero").innerHTML =
      "<div class='hero__bg'><div class='hero__glow' id='heroGlow'></div><div class='hero__noise'></div></div>" +
      "<div class='wrap hero__inner'>" +
        "<span class='hero__status' data-reveal data-hero><span class='dot'></span>" + esc(h.status) + "</span>" +
        "<h1 class='hero__title display' id='heroTitle' data-reveal data-hero data-parallax>" + esc(h.headline) + "</h1>" +
        "<p class='hero__sub' data-reveal data-hero>" + esc(h.sub) + "</p>" +
        "<p class='hero__statement' data-reveal data-hero>" + esc(h.statement) + "</p>" +
        "<div class='hero__bottom'>" +
          "<div class='hero__social' data-reveal data-hero>" + social + "</div>" +
          "<div class='hero__scroll' data-reveal data-hero><span class='label-mono'>" + esc(h.scrollLabel) + "</span><span class='line'></span></div>" +
        "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------------
     RENDER: ABOUT
  --------------------------------------------------------------------------- */
  function renderAbout() {
    var a = D.about;
    var paras = a.paragraphs.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var facts = a.facts.map(function (f) {
      return "<div class='about__fact' data-reveal><span class='label-mono'>" + esc(f.label) + "</span><span class='val'>" + esc(f.value) + "</span></div>";
    }).join("");
    var tl = a.timeline.map(function (t) {
      return "<div class='about__tl-item' data-reveal><span class='about__tl-year'>" + esc(t.year) + "</span><span class='about__tl-text'>" + esc(t.text) + "</span></div>";
    }).join("");
    $("about").innerHTML =
      "<div class='wrap'>" +
        "<div class='section__head' data-reveal>" +
          "<span class='eyebrow'>" + esc(a.label) + "</span>" +
          "<h2 class='about__heading' id='aboutTitle'>" + esc(a.heading) + "</h2>" +
        "</div>" +
        "<div class='about__grid'>" +
          "<div class='about__text' data-reveal>" + paras + "</div>" +
          "<div data-reveal><div class='about__facts'>" + facts + "</div></div>" +
        "</div>" +
        "<div class='about__timeline'>" + tl + "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------------
     RENDER: WHAT I DO
  --------------------------------------------------------------------------- */
  function renderDo() {
    var w = D.whatIDo;
    var items = w.items.map(function (it) {
      return "<div class='do__item' data-reveal tabindex='0'>" +
        "<span class='do__num'>" + esc(it.num) + "</span>" +
        "<div class='do__main'>" +
          "<h3 class='do__title'>" + esc(it.title) + "</h3>" +
          "<p class='do__desc'>" + esc(it.desc) + "</p>" +
          "<div class='do__detail'><div><p>" + esc(it.detail) + "</p></div></div>" +
        "</div>" +
      "</div>";
    }).join("");
    $("do").innerHTML =
      "<div class='wrap'>" +
        "<div class='section__head' data-reveal>" +
          "<span class='eyebrow'>" + esc(w.label) + "</span>" +
          "<h2 class='display' id='doTitle' style='font-size:clamp(2.2rem,6vw,4.5rem);margin-top:1rem'>" + esc(w.heading) + "</h2>" +
        "</div>" +
        "<div class='do__list'>" + items + "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------------
     RENDER: SKILLS
  --------------------------------------------------------------------------- */
  function renderSkills() {
    var s = D.skills;
    var cats = s.categories.map(function (c) {
      var tags = c.items.map(function (t) { return "<span class='skills__tag'>" + esc(t) + "</span>"; }).join("");
      return "<div class='skills__cat' data-reveal><div class='skills__cat-name'>" + esc(c.name) + "</div><div class='skills__tags'>" + tags + "</div></div>";
    }).join("");
    $("skills").innerHTML =
      "<div class='wrap'>" +
        "<div class='section__head' data-reveal>" +
          "<span class='eyebrow'>" + esc(s.label) + "</span>" +
          "<h2 class='display' id='skillsTitle' style='font-size:clamp(2.2rem,6vw,4.5rem);margin-top:1rem'>" + esc(s.heading) + "</h2>" +
          "<p class='skills__intro' style='margin-top:1rem'>" + esc(s.intro) + "</p>" +
        "</div>" +
        "<div class='skills__grid'>" + cats + "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------------
     RENDER: SELECTED WORK
  --------------------------------------------------------------------------- */
  function renderWork() {
    var w = D.work;
    var cards = w.items.map(function (p, i) {
      var tools = p.tools.map(function (t) { return "<span class='work-card__tool'>" + esc(t) + "</span>"; }).join("");
      return "<article class='work-card' data-reveal data-cursor='VIEW' data-parallax-media>" +
        "<div class='work-card__media'>" +
          preview(p, i) +
          "<span class='idx'>" + esc(p.num) + "</span>" +
          "<span class='work-card__cat'>" + esc(p.category) + "</span>" +
        "</div>" +
        "<div class='work-card__body'>" +
          "<h3 class='work-card__title'>" + esc(p.title) + "</h3>" +
          "<p class='work-card__desc'>" + esc(p.desc) + "</p>" +
          "<div class='work-card__meta'>" + tools + "</div>" +
          "<div class='work-card__foot'>" +
            "<span class='work-card__year'>" + esc(p.year) + "</span>" +
            "<a class='work-card__link' href='" + p.url + "' target='_blank' rel='noopener' data-cursor='OPEN'>View project <span class='arrow'>&#8599;</span></a>" +
          "</div>" +
        "</div>" +
      "</article>";
    }).join("");
    $("work").innerHTML =
      "<div class='wrap'>" +
        "<div class='work__head section__head' data-reveal>" +
          "<div><span class='eyebrow'>" + esc(w.label) + "</span>" +
          "<h2 class='display' id='workTitle' style='font-size:clamp(2.4rem,7vw,5.5rem);margin-top:1rem'>" + esc(w.heading) + "</h2></div>" +
          "<p class='work__intro'>" + esc(w.intro) + "</p>" +
        "</div>" +
        "<div class='work__list'>" + cards + "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------------
     RENDER: GAMING / ESPORTS
  --------------------------------------------------------------------------- */
  function renderGaming() {
    var g = D.gaming;
    var pillars = g.pillars.map(function (p) {
      return "<div class='gaming__pillar' data-reveal><h4>" + esc(p.title) + "</h4><p>" + esc(p.text) + "</p></div>";
    }).join("");
    var rows = g.items.map(function (it) {
      return "<div class='gaming__row' data-reveal data-cursor='OPEN'>" +
        "<span class='t'>" + esc(it.title) + "</span>" +
        "<span class='m'>" + esc(it.meta) + "</span>" +
        "<span class='y'>" + esc(it.year) + "</span>" +
      "</div>";
    }).join("");
    $("gaming").innerHTML =
      "<div class='gaming__glow'></div><div class='wrap'>" +
        "<div class='section__head' data-reveal>" +
          "<span class='eyebrow'>" + esc(g.label) + "</span>" +
        "</div>" +
        "<div class='gaming__head'>" +
          "<div data-reveal>" +
            "<h2 class='gaming__mono' id='gamingTitle'>" + esc(g.heading) + "<span class='fill' aria-hidden='true'>" + esc(g.heading) + "</span></h2>" +
            "<span class='gaming__tag' style='display:block;margin-top:1rem'>" + esc(g.tag) + " — Gaming Identity</span>" +
          "</div>" +
        "</div>" +
        "<p class='gaming__statement' data-reveal>" + esc(g.statement) + "</p>" +
        "<div class='gaming__pillars'>" + pillars + "</div>" +
        "<div class='gaming__work'>" + rows + "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------------
     RENDER: CREATIVE PROJECTS
  --------------------------------------------------------------------------- */
  function renderCreative() {
    var c = D.creative;
    var cls = ["cg--a", "cg--b", "cg--c", "cg--d", "cg--e", "cg--f"];
    var items = c.items.map(function (it, i) {
      return "<article class='cg " + cls[i % cls.length] + "' data-reveal data-cursor='VIEW'>" +
        preview(it, i + 20) +
        "<div class='cg__body'>" +
          "<span class='cg__cat'>" + esc(it.category) + "</span>" +
          "<h3 class='cg__title'>" + esc(it.title) + "</h3>" +
          "<span class='cg__year'>" + esc(it.year) + "</span>" +
        "</div>" +
      "</article>";
    }).join("");
    $("creative").innerHTML =
      "<div class='wrap'>" +
        "<div class='section__head' data-reveal>" +
          "<span class='eyebrow'>" + esc(c.label) + "</span>" +
          "<h2 class='display' id='creativeTitle' style='font-size:clamp(2.2rem,6vw,4.5rem);margin-top:1rem'>" + esc(c.heading) + "</h2>" +
          "<p class='creative__intro'>" + esc(c.intro) + "</p>" +
        "</div>" +
        "<div class='creative__grid'>" + items + "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------------
     RENDER: PHILOSOPHY
  --------------------------------------------------------------------------- */
  function renderPhilosophy() {
    var p = D.philosophy;
    var words = p.heading.map(function (w) {
      return "<span class='word'><span>" + esc(w) + "</span></span>";
    }).join("");
    var cols = p.paragraphs.map(function (t) { return "<p data-reveal>" + esc(t) + "</p>"; }).join("");
    $("philosophy").innerHTML =
      "<div class='wrap philosophy' id='philosophyTitle' data-reveal>" +
        "<span class='eyebrow' data-reveal>" + esc(p.label) + "</span>" +
        "<h2 class='philosophy__statement' style='margin-top:1.5rem'>" + words + "</h2>" +
        "<div class='philosophy__cols'>" + cols + "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------------
     RENDER: SOCIAL
  --------------------------------------------------------------------------- */
  function renderSocial() {
    var rows = D.social.map(function (s) {
      return "<a class='social__row' href='" + s.url + "' target='_blank' rel='noopener' data-reveal data-cursor='OPEN'>" +
        "<span class='social__plat'>" + esc(s.platform) + "</span>" +
        "<span class='social__handle'>" + esc(s.handle) + " &#8599;</span>" +
      "</a>";
    }).join("");
    $("social").innerHTML =
      "<div class='wrap'>" +
        "<div class='section__head' data-reveal>" +
          "<span class='eyebrow'>Social Presence</span>" +
          "<h2 class='display' id='socialTitle' style='font-size:clamp(2.2rem,6vw,4.5rem);margin-top:1rem'>Find NOVA online</h2>" +
        "</div>" +
        "<div class='social__list'>" + rows + "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------------
     RENDER: MARQUEE BAND
  --------------------------------------------------------------------------- */
  function renderMarquee() {
    var words = D.brand.keywords || [];
    if (!words.length) return;
    var one = words.map(function (w) { return "<span class='marquee__item'>" + esc(w) + "</span>"; }).join("");
    $("marquee").innerHTML = "<div class='marquee__track'>" + one + one + "</div>";
  }

  /* ---------------------------------------------------------------------------
     RENDER: CONTACT
  --------------------------------------------------------------------------- */
  function renderContact() {
    var c = D.contact;
    var social = D.social.map(function (s) {
      return "<a href='" + s.url + "' target='_blank' rel='noopener' data-cursor='OPEN'>" + esc(s.platform) + "</a>";
    }).join(" ");
    $("contact").innerHTML =
      "<div class='wrap'>" +
        "<div class='section__head' data-reveal>" +
          "<span class='eyebrow'>" + esc(c.label) + "</span>" +
        "</div>" +
        "<h2 class='contact__heading' id='contactTitle' data-reveal>" + esc(c.heading) + "</h2>" +
        "<p class='contact__note' data-reveal>" + esc(c.note) + "</p>" +
        "<div class='contact__actions' data-reveal>" +
          "<a class='contact__email' href='mailto:" + c.email + "' data-cursor='OPEN'>" + esc(c.email) + "</a>" +
          "<button class='contact__copy' id='copyEmail' data-cursor='COPY' type='button'>Copy email</button>" +
          "<a class='work-card__link' href='mailto:" + c.email + "' data-cursor='OPEN'>" + esc(c.cta) + " <span class='arrow'>&#8599;</span></a>" +
        "</div>" +
        "<div style='margin-top:2rem;font-family:var(--f-mono);font-size:.78rem;color:var(--fg-dim);letter-spacing:.08em' data-reveal>ALSO ON — " + social + "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------------
     RENDER: FOOTER
  --------------------------------------------------------------------------- */
  function renderFooter() {
    var yr = new Date().getFullYear();
    var social = D.social.map(function (s) {
      return "<a href='" + s.url + "' target='_blank' rel='noopener' data-cursor='OPEN'>" + esc(s.platform) + "</a>";
    }).join("");
    $("footer").innerHTML =
      "<div class='wrap footer__inner'>" +
        "<div data-reveal>" +
          "<div class='footer__brand'>" + esc(D.brand.name) + "</div>" +
          "<div class='footer__tag'>" + esc(D.footer.tagline) + "</div>" +
        "</div>" +
        "<div class='footer__right' data-reveal>" +
          "<div class='footer__social'>" + social + "</div>" +
          "<div class='footer__meta'>&copy; " + yr + " " + esc(D.brand.name) + " — " + esc(D.footer.note) + "</div>" +
          "<a class='footer__top' href='#hero' data-cursor='TOP'><span class='arrow'>&#8593;</span> Back to top</a>" +
        "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------------
     LOADER
  --------------------------------------------------------------------------- */
  function runLoader(done) {
    var loader = $("loader");
    var fill = $("loaderFill");
    var pct = $("loaderPct");
    if (reduceMotion) { loader.classList.add("is-done"); done(); return; }
    var p = 0;
    var tick = setInterval(function () {
      p += Math.random() * 16 + 6;
      if (p >= 100) { p = 100; clearInterval(tick); finish(); }
      fill.style.width = p + "%";
      pct.textContent = Math.floor(p);
    }, 90);
    function finish() {
      setTimeout(function () {
        loader.classList.add("is-done");
        done();
      }, 250);
    }
  }

  /* ---------------------------------------------------------------------------
     REVEAL OBSERVER
  --------------------------------------------------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll("[data-reveal]:not([data-hero])");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      document.querySelectorAll("[data-hero]").forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  function revealHero() {
    var hero = document.querySelectorAll("[data-hero]");
    hero.forEach(function (t, i) {
      setTimeout(function () { t.classList.add("is-visible"); }, reduceMotion ? 0 : 120 + i * 110);
    });
  }

  /* ---------------------------------------------------------------------------
     NAV: scroll state + active section + progress
  --------------------------------------------------------------------------- */
  function initNav() {
    var nav = $("nav");
    var bar = $("scrollProgressBar");
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      nav.setAttribute("data-state", y > 40 ? "scrolled" : "top");
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Active section highlighting
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    var map = {};
    links.forEach(function (l) { map[l.getAttribute("data-section")] = l; });
    var sections = ["about", "work", "gaming", "contact"].map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if ("IntersectionObserver" in window) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("is-active"); });
            if (map[e.target.id]) map[e.target.id].classList.add("is-active");
          }
        });
      }, { threshold: 0.4 });
      sections.forEach(function (s) { so.observe(s); });
    }
  }

  /* ---------------------------------------------------------------------------
     MOBILE MENU
  --------------------------------------------------------------------------- */
  function initMenu() {
    var toggle = $("navToggle");
    var menu = $("mobileMenu");
    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    }
    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("is-open"));
    });
    menu.querySelectorAll("[data-menu-link]").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setOpen(false);
    });
  }

  /* ---------------------------------------------------------------------------
     CUSTOM CURSOR
  --------------------------------------------------------------------------- */
  function initCursor() {
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduceMotion) return;
    var cursor = $("cursor");
    var label = $("cursorLabel");
    var dot = cursor.querySelector(".cursor__dot");
    var ring = cursor.querySelector(".cursor__ring");
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    cursor.style.opacity = "0";

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.style.opacity = "1";
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
      var el = e.target.closest("[data-cursor], a, button, .work-card, .cg, .social__row, .gaming__row");
      if (el) {
        var txt = el.getAttribute("data-cursor");
        cursor.classList.add("is-hover");
        if (txt) { label.textContent = txt; cursor.classList.add("is-label"); }
        else { cursor.classList.remove("is-label"); }
      } else {
        cursor.classList.remove("is-hover", "is-label");
      }
    }, { passive: true });

    window.addEventListener("mousedown", function () { cursor.classList.add("is-down"); });
    window.addEventListener("mouseup", function () { cursor.classList.remove("is-down"); });
    document.addEventListener("mouseleave", function () { cursor.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { cursor.style.opacity = "1"; });

    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      label.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------------------------------------------------------------------
     HERO PARALLAX + MEDIA PARALLAX
  --------------------------------------------------------------------------- */
  function initParallax() {
    if (reduceMotion) return;
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    var title = document.querySelector("[data-parallax]");
    var media = Array.prototype.slice.call(document.querySelectorAll("[data-parallax-media]"));
    var heroEl = document.getElementById("hero");
    window.addEventListener("mousemove", function (e) {
      var nx = (e.clientX / window.innerWidth - 0.5);
      var ny = (e.clientY / window.innerHeight - 0.5);
      if (title) title.style.transform = "translate(" + (nx * 18) + "px," + (ny * 12) + "px)";
      media.forEach(function (m) {
        var img = m.querySelector("img, .art");
        if (img) img.style.transform = "scale(1.06) translate(" + (nx * -14) + "px," + (ny * -10) + "px)";
      });
      if (heroEl) {
        var r = heroEl.getBoundingClientRect();
        if (e.clientY >= r.top && e.clientY <= r.bottom) {
          heroEl.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
          heroEl.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
        }
      }
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------------
     EDITORIAL SIDE HUD (chapter indicator + scroll position)
  --------------------------------------------------------------------------- */
  function initHud() {
    var hud = $("hud");
    if (!hud) return;
    var numEl = $("hudNum"), nameEl = $("hudName"), fill = $("hudFill");
    var list = [
      { id: "hero", n: "00", label: "Intro" },
      { id: "about", n: "01", label: "About" },
      { id: "do", n: "02", label: "What I Do" },
      { id: "skills", n: "03", label: "Capabilities" },
      { id: "work", n: "04", label: "Selected Work" },
      { id: "gaming", n: "05", label: "Gaming" },
      { id: "creative", n: "06", label: "Creative" },
      { id: "philosophy", n: "07", label: "Philosophy" },
      { id: "social", n: "08", label: "Social" },
      { id: "contact", n: "09", label: "Contact" }
    ];
    var map = {};
    list.forEach(function (s) { map[s.id] = s; });
    var sections = list.map(function (s) { return document.getElementById(s.id); }).filter(Boolean);
    function setFill() {
      var y = window.scrollY || window.pageYOffset;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (y / h) : 0;
      if (fill) fill.style.top = (p * (90 - 18)) + "px";
    }
    window.addEventListener("scroll", setFill, { passive: true });
    setFill();
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var s = map[e.target.id];
            if (s) { numEl.textContent = s.n; nameEl.textContent = s.label; }
          }
        });
      }, { threshold: 0.4 });
      sections.forEach(function (s) { io.observe(s); });
    }
  }

  /* ---------------------------------------------------------------------------
     COPY EMAIL
  --------------------------------------------------------------------------- */
  function initCopy() {
    var btn = $("copyEmail");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var email = D.contact.email;
      var done = function () {
        btn.textContent = "Copied";
        btn.classList.add("is-copied");
        setTimeout(function () { btn.textContent = "Copy email"; btn.classList.remove("is-copied"); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = email; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
  }

  /* ---------------------------------------------------------------------------
     SMOOTH ANCHOR SCROLL (respect reduced motion already via CSS)
  --------------------------------------------------------------------------- */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      if (id === "hero" || document.getElementById(id)) {
        var target = id === "hero" ? 0 : document.getElementById(id).getBoundingClientRect().top + window.scrollY - 60;
        e.preventDefault();
        window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  }

  /* ---------------------------------------------------------------------------
     BOOT
  --------------------------------------------------------------------------- */
  function boot() {
    renderChrome();
    renderHero();
    renderAbout();
    renderDo();
    renderSkills();
    renderWork();
    renderGaming();
    renderCreative();
    renderMarquee();
    renderPhilosophy();
    renderSocial();
    renderContact();
    renderFooter();

    initReveal();
    initNav();
    initMenu();
    initCursor();
    initParallax();
    initHud();
    initCopy();
    initAnchors();

    runLoader(revealHero);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
