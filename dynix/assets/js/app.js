/* =========================================================
   DYNIX EXPERIENCE — app.js
   Zero-dependency runtime (GSAP loaded from CDN).
   Degrades gracefully when GSAP or JS motion is unavailable.
   ========================================================= */

(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = typeof window.ScrollTrigger !== "undefined";

  if (hasGSAP && hasST) gsap.registerPlugin(ScrollTrigger);

  var EASE = "power3.out";

  /* ---------------------------------------------------------
     Split text into animated characters
  --------------------------------------------------------- */
  function splitChars(el) {
    if (!el || el.dataset.splitDone) return [];
    var text = el.textContent;
    var frag = document.createDocumentFragment();
    var chars = [];

    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (c === " ") {
        var sp = document.createElement("span");
        sp.className = "sp";
        frag.appendChild(sp);
        continue;
      }
      var s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      frag.appendChild(s);
      chars.push(s);
    }

    el.textContent = "";
    el.appendChild(frag);
    el.dataset.splitDone = "1";
    return chars;
  }

  function splitWord(el) {
    if (!el) return [];
    var text = el.textContent;
    el.textContent = "";
    return text.split("").map(function (c) {
      var i = document.createElement("i");
      i.textContent = c === " " ? "\u00A0" : c;
      el.appendChild(i);
      return i;
    });
  }

  /* ---------------------------------------------------------
     Loading screen
  --------------------------------------------------------- */
  function runLoader(done) {
    var loader = $("#loader");
    var fill = $("#loaderFill");
    var pct = $("#loaderPct");
    var word = $("#loaderWord");

    splitWord(word);

    if (reduceMotion || !hasGSAP) {
      if (fill) fill.style.width = "100%";
      if (pct) pct.textContent = "100";
      if (word) $$("i", word).forEach(function (i) { i.style.transform = "none"; });
      setTimeout(done, 350);
      return;
    }

    gsap.to("#loaderWord i", {
      y: 0,
      duration: 1,
      ease: "expo.out",
      stagger: 0.05,
      delay: 0.1
    });

    var state = { v: 0 };
    gsap.to(state, {
      v: 100,
      duration: 1.9,
      ease: "power2.inOut",
      onUpdate: function () {
        var v = Math.round(state.v);
        if (fill) fill.style.width = v + "%";
        if (pct) pct.textContent = v;
      },
      onComplete: function () {
        gsap.to("#loaderWord i", {
          y: "-115%",
          duration: 0.7,
          ease: "expo.in",
          stagger: 0.03,
          delay: 0.12
        });
        setTimeout(done, 620);
      }
    });
  }

  /* ---------------------------------------------------------
     Custom cursor
  --------------------------------------------------------- */
  function initCursor() {
    if (!finePointer || reduceMotion) return;
    var cursor = $("#cursor");
    var label = $("#cursorLabel");
    if (!cursor) return;

    var dot = $(".cursor__dot", cursor);
    var ring = $(".cursor__ring", cursor);
    var x = window.innerWidth / 2, y = window.innerHeight / 2;
    var rx = x, ry = y;

    window.addEventListener("mousemove", function (e) {
      x = e.clientX; y = e.clientY;
      dot.style.transform = "translate(" + x + "px," + y + "px)";
    }, { passive: true });

    (function loop() {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      if (label) label.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%, -50%)";
      requestAnimationFrame(loop);
    })();

    var hoverables = "a, button, [data-tilt], [data-cursor]";
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest(hoverables);
      if (!t) return;
      cursor.classList.add("is-active");
      var l = t.getAttribute("data-cursor");
      if (label) label.textContent = l ? l : (t.tagName === "A" || t.tagName === "BUTTON" ? "" : "");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hoverables) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(hoverables))) {
        cursor.classList.remove("is-active");
      }
    });
  }

  /* ---------------------------------------------------------
     Ambient particles (hero)
  --------------------------------------------------------- */
  function initParticles() {
    var canvas = $("#particles");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, parts = [], raf = null;

    var GOLD = "214, 183, 121";
    var LAV = "169, 155, 255";

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      var count = Math.round(Math.min(90, Math.max(26, (w * h) / 16000)));
      if (window.innerWidth < 760) count = Math.round(count * 0.45);
      parts = [];
      for (var i = 0; i < count; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.7 + 0.4,
          vx: (Math.random() - 0.5) * 0.16,
          vy: -(Math.random() * 0.24 + 0.05),
          a: Math.random() * 0.5 + 0.15,
          tw: Math.random() * Math.PI * 2,
          c: Math.random() > 0.72 ? LAV : GOLD
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy; p.tw += 0.02;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        var alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.c + "," + alpha.toFixed(3) + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      draw();
      // pause when hero is off-screen (perf)
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { if (!raf) draw(); }
            else { cancelAnimationFrame(raf); raf = null; }
          });
        }, { threshold: 0 });
        io.observe(canvas);
      }
    }
  }

  /* ---------------------------------------------------------
     Nav: sticky state, active link + indicator, scroll progress
  --------------------------------------------------------- */
  function initNav() {
    var nav = $("#nav");
    var progressBar = $("#progressBar");
    var hud = $("#hud");
    var hudFill = $("#hudFill");
    var hudNum = $("#hudNum");
    var hudName = $("#hudName");
    var links = $$("#navLinks a");
    var indicator = $("#navIndicator");
    var ticking = false;

    function moveIndicator(active) {
      if (!indicator || !active) { if (indicator) indicator.style.width = "0px"; return; }
      indicator.style.width = active.offsetWidth + "px";
      indicator.style.transform = "translateX(" + active.offsetLeft + "px)";
    }

    function update() {
      var y = window.scrollY || window.pageYOffset;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var p = docH > 0 ? y / docH : 0;

      if (progressBar) progressBar.style.width = (p * 100).toFixed(2) + "%";
      if (hudFill) hudFill.style.height = (p * 100).toFixed(2) + "%";

      if (nav) nav.classList.toggle("is-stuck", y > 40);

      // active chapter
      var mid = y + window.innerHeight * 0.4;
      var chapters = $$("[data-chapter]");
      var current = chapters[0];
      chapters.forEach(function (c) {
        if (c.offsetTop <= mid) current = c;
      });
      if (current && hudNum) {
        var num = current.getAttribute("data-chapter");
        if (hudNum.textContent !== num) {
          hudNum.textContent = num;
          hudName.textContent = current.getAttribute("data-name");
          if (hasGSAP) {
            gsap.fromTo([hudNum, hudName], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: EASE });
          }
        }
      }
      if (hud && y > 100) hud.classList.add("is-on");
      else if (hud) hud.classList.remove("is-on");

      // nav active link
      var id = current ? current.id : "";
      var activeLink = null;
      links.forEach(function (l) {
        var on = l.getAttribute("data-section") === id;
        l.classList.toggle("is-active", on);
        if (on) activeLink = l;
      });
      moveIndicator(activeLink);

      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();

    // smooth anchor scroll
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - (id === "#hero" ? 0 : 10),
          behavior: reduceMotion ? "auto" : "smooth"
        });
        history.replaceState(null, "", id);
      });
    });
  }

  /* ---------------------------------------------------------
     Magnetic buttons
  --------------------------------------------------------- */
  function initMagnetic() {
    if (!finePointer || reduceMotion || !hasGSAP) return;
    $$("[data-magnetic]").forEach(function (el) {
      var strength = 0.32;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.setProperty("--bx", (mx * strength) + "px");
        el.style.setProperty("--by", (my * strength) + "px");
      });
      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--bx", "0px");
        el.style.setProperty("--by", "0px");
      });
    });
  }

  /* ---------------------------------------------------------
     Card 3D tilt + moving glow
  --------------------------------------------------------- */
  function initTilt() {
    if (!finePointer || reduceMotion) return;
    $$("[data-tilt]").forEach(function (card) {
      var glow = $(".card__glow", card);
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", ((px - 0.5) * 11).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((0.5 - py) * 11).toFixed(2) + "deg");
        if (glow) {
          glow.style.setProperty("--gx", (px * 100) + "%");
          glow.style.setProperty("--gy", (py * 100) + "%");
        }
      });
      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  /* ---------------------------------------------------------
     Scroll choreography
  --------------------------------------------------------- */
  function initScrollAnimations() {
    // split anything that needs letter animation
    $$("[data-split]").forEach(splitChars);

    if (!hasGSAP || !hasST || reduceMotion) {
      // Static fallback: make sure everything is visible
      $$("[data-line], [data-fade], [data-plate], [data-card], [data-wish], [data-mline]").forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    /* --- HERO intro (after loader) --- */
    // pre-hide so nothing flashes behind the loader
    gsap.set(".hero__eyebrow, .hero__lede, .hero__cta, .hero__meta, .hero__watermark",
      { opacity: 0, y: 24 });

    function heroIntro() {
      var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(".hero__eyebrow", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, 0)
        .to(".hero__line .ch", { y: "0%", rotate: 0, duration: 1.35, stagger: 0.035 }, 0.12)
        .fromTo(".hero__lede", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1 }, 0.75)
        .fromTo(".hero__cta", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1 }, 0.9)
        .fromTo(".hero__meta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.1 }, 1.0)
        .fromTo(".hero__watermark", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2 }, 0.2);
      return tl;
    }
    window.__heroIntro = heroIntro;

    /* --- Hero parallax on scroll --- */
    gsap.to(".hero__watermark", {
      yPercent: 34,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
    });
    gsap.to(".hero__inner", {
      yPercent: -14,
      opacity: 0.25,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
    });
    gsap.to(".hero__bg", {
      yPercent: 16,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 }
    });

    /* --- Generic line reveals --- */
    $$("[data-line]").forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 44, filter: "blur(6px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 1.15, ease: EASE,
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        });
    });

    $$("[data-fade]").forEach(function (el) {
      if (el.closest(".hero")) return; // handled by hero intro
      gsap.fromTo(el,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 1, ease: EASE, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });

    /* --- Image/plate mask reveal --- */
    $$("[data-plate]").forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 60, clipPath: "inset(18% 8% 18% 8% round 6px)" },
        {
          opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 6px)",
          duration: 1.4, ease: EASE,
          scrollTrigger: { trigger: el, start: "top 85%", once: true }
        });
      gsap.to($(".plate__art", el), {
        yPercent: -12, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 }
      });
    });

    /* --- Cards staggered entrance --- */
    if ($("[data-card]")) {
      gsap.fromTo("[data-card]",
        { opacity: 0, y: 60, rotateX: -6 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 1.1, ease: EASE, stagger: 0.15,
          scrollTrigger: { trigger: "#cards", start: "top 82%", once: true }
        });
    }

    /* --- DYNIX mega parallax --- */
    if ($("#dynixMega")) {
      splitWord($("#dynixMega"));
      var letters = $$("#dynixMega i");
      gsap.fromTo(letters,
        { yPercent: 28, opacity: 0 },
        {
          yPercent: 0, opacity: 1, duration: 1.2, ease: EASE, stagger: 0.05,
          scrollTrigger: { trigger: "#dynixMega", start: "top 92%", once: true }
        });
      gsap.to("#dynixMega", {
        xPercent: -4, ease: "none",
        scrollTrigger: { trigger: "#dynix", start: "top bottom", end: "bottom top", scrub: 1 }
      });
    }

    /* --- Message: slow scrubbed reveal --- */
    $$("[data-mline]").forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0.08, y: 34 },
        {
          opacity: 1, y: 0, ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "top 52%",
            scrub: 0.7,
            onEnter: function () { el.classList.add("is-lit"); },
            onLeaveBack: function () { el.classList.remove("is-lit"); }
          }
        });
    });
    gsap.fromTo(".message__sign",
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 1.3, ease: EASE, scrollTrigger: { trigger: ".message__sign", start: "top 92%", once: true } });

    /* --- Wishes: horizontal pinned storytelling (desktop) --- */
    setupHorizontalWishes();

    /* --- Wish cards individual reveal (mobile / fallback) --- */
    if (!document.body.classList.contains("h-scroll")) {
      $$("[data-wish]").forEach(function (el, i) {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1, ease: EASE, delay: (i % 3) * 0.1,
            scrollTrigger: { trigger: el, start: "top 92%", once: true }
          });
      });
    }

    /* --- Gift entrance --- */
    gsap.fromTo(".gift__stage",
      { opacity: 0, scale: 0.86, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 1.3, ease: EASE, scrollTrigger: { trigger: ".gift", start: "top 85%", once: true } });
    gsap.fromTo("#unwrapBtn",
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 1, ease: EASE, delay: 0.15, scrollTrigger: { trigger: ".gift", start: "top 85%", once: true } });

    /* --- Finale --- */
    gsap.fromTo(".finale__title .ch",
      { y: "115%" },
      {
        y: "0%", duration: 1.2, ease: "expo.out", stagger: 0.03,
        scrollTrigger: { trigger: ".finale", start: "top 62%", once: true }
      });
    gsap.fromTo(".finale__wish, .finale__sub, .finale .btn",
      { opacity: 0, y: 26 },
      {
        opacity: 1, y: 0, duration: 1, ease: EASE, stagger: 0.12,
        scrollTrigger: { trigger: ".finale", start: "top 55%", once: true }
      });

    ScrollTrigger.refresh();
  }

  /* ---------------------------------------------------------
     Horizontal wishes section (desktop only)
  --------------------------------------------------------- */
  function setupHorizontalWishes() {
    var viewport = $("#wishesViewport");
    var track = $("#wishesTrack");
    if (!viewport || !track) return;

    var desktop = window.matchMedia("(min-width: 981px)").matches;
    if (!desktop || reduceMotion || !hasST) {
      document.body.classList.remove("h-scroll");
      return;
    }

    document.body.classList.add("h-scroll");

    var getScrollAmount = function () {
      return track.scrollWidth - viewport.clientWidth;
    };

    var tween = gsap.to(track, {
      x: function () { return -getScrollAmount(); },
      ease: "none",
      scrollTrigger: {
        trigger: ".wishes",
        start: "top top",
        end: function () { return "+=" + getScrollAmount(); },
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: function (self) {
          if (self.progress === 0) gsap.set(track, { x: 0 });
        }
      }
    });

    // wish cards fade in as they enter the horizontal view
    gsap.utils.toArray("[data-wish]").forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0.25, y: 34 },
        {
          opacity: 1, y: 0, ease: "power2.out", duration: 1,
          scrollTrigger: {
            trigger: el,
            containerAnimation: tween,
            start: "left 88%",
            once: true
          }
        });
    });

    // ensure viewport itself starts scrollable at 0
    viewport.style.overflow = "hidden";
  }

  /* ---------------------------------------------------------
     Sound: WebAudio chime (no assets, never autoplays)
  --------------------------------------------------------- */
  var Sound = (function () {
    var ctx = null;
    var enabled = false;
    var btn = $("#soundBtn");

    function ensure() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }

    function note(freq, start, dur, gain) {
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + start);
      g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    }

    function shimmer() {
      if (!ensure() || !enabled) return;
      var notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach(function (f, i) { note(f, i * 0.11, 1.6, 0.11); });
      note(261.63, 0, 2.4, 0.07);
      note(392, 0.05, 2.2, 0.06);
      // sparkle
      [1567.98, 1975.53, 2637.02].forEach(function (f, i) {
        note(f, 0.6 + i * 0.14, 0.7, 0.035);
      });
    }

    function tick() {
      if (!ensure() || !enabled) return;
      note(880, 0, 0.16, 0.05);
    }

    function set(state) {
      enabled = state;
      if (enabled) ensure();
      if (btn) {
        btn.setAttribute("aria-pressed", enabled ? "true" : "false");
        $(".sound__text", btn).textContent = enabled ? "Sound on" : "Sound off";
      }
    }

    if (btn) {
      btn.addEventListener("click", function () { set(!enabled); if (enabled) tick(); });
    }

    return {
      play: shimmer,
      tick: tick,
      isEnabled: function () { return enabled; },
      enable: function () { if (!enabled) set(true); }
    };
  })();

  /* ---------------------------------------------------------
     Confetti — elegant gold ribbons
  --------------------------------------------------------- */
  var Confetti = (function () {
    var canvas = $("#confetti");
    var ctx = canvas ? canvas.getContext("2d") : null;
    var pieces = [];
    var raf = null;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    var COLORS = ["#D6B779", "#F0DFB8", "#A99BFF", "#F5F3EF", "#B9985F"];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function burst(x, y, amount) {
      if (!ctx || reduceMotion) return;
      resize();
      for (var i = 0; i < amount; i++) {
        var angle = (Math.random() * Math.PI) - Math.PI / 2 + (Math.random() - 0.5) * 1.4;
        var speed = Math.random() * 11 + 5;
        pieces.push({
          x: x, y: y,
          vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
          vy: Math.sin(angle) * speed - Math.random() * 4,
          w: Math.random() * 8 + 4,
          h: Math.random() * 5 + 3,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.3,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          life: 1,
          decay: 0.0055 + Math.random() * 0.005,
          sway: Math.random() * 0.06 + 0.02
        });
      }
      if (!raf) loop();
    }

    function loop() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i = pieces.length - 1; i >= 0; i--) {
        var p = pieces[i];
        p.vy += 0.24;
        p.vx *= 0.99;
        p.x += p.vx + Math.sin(p.rot) * p.sway * 8;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= p.decay;
        if (p.life <= 0 || p.y > window.innerHeight + 60) {
          pieces.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (pieces.length) raf = requestAnimationFrame(loop);
      else { raf = null; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
    }

    window.addEventListener("resize", resize);
    resize();

    return {
      burst: burst,
      reset: function () { pieces = []; if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
    };
  })();

  /* ---------------------------------------------------------
     Surprise: unwrap interaction
  --------------------------------------------------------- */
  function initSurprise() {
    var gift = $("#gift");
    var btn = $("#unwrapBtn");
    var reveal = $("#reveal");
    var again = $("#againBtn");
    if (!gift || !btn || !reveal) return;

    var open = false;

    function playReveal() {
      if (!hasGSAP || reduceMotion) {
        $$(".reveal__title .ch", reveal).forEach(function (c) {
          c.style.transform = "none"; c.style.opacity = "1";
        });
        return;
      }
      gsap.fromTo($$(".reveal__title .ch", reveal),
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.035 });
      gsap.fromTo(".reveal__eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.1, ease: EASE });
      gsap.fromTo(".reveal__sub", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, delay: 0.55, ease: EASE });
      gsap.fromTo(".reveal__actions .btn", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.75, stagger: 0.1, ease: EASE });
    }

    function unwrap(isReplay) {
      if (!isReplay && open) return;
      open = true;

      gift.classList.add("is-open");
      Sound.enable();

      var r = gift.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;

      setTimeout(function () {
        Confetti.burst(cx, cy, window.innerWidth < 760 ? 90 : 170);
        setTimeout(function () { Confetti.burst(cx * 0.5, cy * 0.4, window.innerWidth < 760 ? 50 : 90); }, 260);
        setTimeout(function () { Confetti.burst(cx * 1.5, cy * 0.5, window.innerWidth < 760 ? 50 : 90); }, 460);
        Sound.play();
      }, 380);

      setTimeout(function () {
        reveal.hidden = false;
        playReveal();
        if (hasST) setTimeout(function () { ScrollTrigger.refresh(); }, 600);
      }, 700);

      if (btn) btn.style.display = "none";
      if (hasST) setTimeout(function () { ScrollTrigger.refresh(); }, 1400);
    }

    btn.addEventListener("click", function () { unwrap(false); });

    if (again) {
      again.addEventListener("click", function () {
        reveal.hidden = true;
        gift.classList.remove("is-open");
        Confetti.reset();
        if (btn) btn.style.display = "";
        open = false;
        Sound.play();
        setTimeout(function () { unwrap(false); }, 900);
      });
    }
  }

  /* ---------------------------------------------------------
     Replay
  --------------------------------------------------------- */
  function initReplay() {
    var replay = $("#replayBtn");
    if (!replay) return;
    replay.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      if (hasGSAP && !reduceMotion) {
        setTimeout(function () {
          if (window.__heroIntro) window.__heroIntro().restart();
        }, 750);
      }
    });
  }

  /* ---------------------------------------------------------
     Boot
  --------------------------------------------------------- */
  function boot() {
    initCursor();
    initParticles();
    initNav();
    initMagnetic();
    initTilt();
    initScrollAnimations();
    initSurprise();
    initReplay();

    runLoader(function () {
      document.body.classList.remove("is-loading");
      var loader = $("#loader");
      if (loader) loader.classList.add("is-done");
      if (hasGSAP && !reduceMotion && window.__heroIntro) {
        setTimeout(window.__heroIntro, 180);
      } else {
        $$(".hero__line .ch").forEach(function (c) { c.style.transform = "none"; });
      }
      if (hasST) setTimeout(function () { ScrollTrigger.refresh(); }, 400);
      setTimeout(function () { if (loader) loader.style.display = "none"; }, 1200);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
