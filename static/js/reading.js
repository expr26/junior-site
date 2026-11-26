/* Reading help (26 Nov 2026), adapted for ages 9 to 14 from ExaminerPrep's reading settings and Support row.
   Loaded in <head> without defer so saved choices apply before the first paint.
   Everything is saved in this browser only (localStorage "js-rs"). Nothing is asked about the child and nothing leaves the device.
   - Panel "Reading help": easy-read fonts, text size, line and letter spacing, background colour, reading ruler,
     focus mode, calm mode (no confetti, no moving pictures, plain background), and read-aloud buttons.
   - "Read it to me" button above every question (.q-text): reads the question and its answer choices with the device voice,
     maths symbols spoken as words, and highlights what is being read. */
(function () {
  var root = document.documentElement, KEY = "js-rs";
  var FONTS = {
    atkinson: { name: "Atkinson Hyperlegible", files: [["atkinson-hyperlegible-latin-400-normal", "400", "normal"], ["atkinson-hyperlegible-latin-700-normal", "700", "normal"]] },
    lexend: { name: "Lexend", files: [["lexend-latin-400-normal", "400", "normal"], ["lexend-latin-700-normal", "700", "normal"]] },
    opendyslexic: { name: "OpenDyslexic", files: [["opendyslexic-latin-400-normal", "400", "normal"], ["opendyslexic-latin-700-normal", "700", "normal"]] }
  };
  var OPTS = [
    { k: "font", label: "Letters", v: [["", "Normal"], ["atkinson", "Atkinson"], ["lexend", "Lexend"], ["opendyslexic", "OpenDyslexic"]],
      note: "Try each one and keep the one that feels easiest to read." },
    { k: "size", label: "Text size", v: [["", "Normal"], ["115", "Big"], ["130", "Bigger"], ["150", "Huge"]] },
    { k: "lh", label: "Space between lines", v: [["", "Normal"], ["18", "More"], ["20", "Lots"]] },
    { k: "sp", label: "Space between letters", v: [["", "Normal"], ["wide", "Wider"]] },
    { k: "bg", label: "Page colour", v: [["", "Colourful"], ["cream", "Cream"], ["blue", "Soft blue"], ["plain", "Plain white"]] },
    { k: "ruler", label: "Reading ruler", v: [["", "Off"], ["on", "On"]], note: "A bright band follows your finger or mouse and dims the other lines." },
    { k: "focus", label: "Focus mode", v: [["", "Off"], ["on", "On"]], note: "Hides the owl, pictures in the background and other extras, so you see just the work." },
    { k: "calm", label: "Calm mode", v: [["", "Off"], ["on", "On"]], note: "No confetti and nothing moving on its own. You still earn all your stars." },
    { k: "say", label: "Read it to me buttons", v: [["", "Show"], ["off", "Hide"]], note: "A button above each question reads it out loud with your device's voice." }
  ];
  var s = {};
  try { s = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { s = {}; }
  /* calm mode is also on when the device asks for reduced motion */
  var sysStill = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function loadFont(id) {
    var f = FONTS[id]; if (!f || !("FontFace" in window) || f.done) return;
    f.done = true;
    f.files.forEach(function (x) {
      try {
        var ff = new FontFace(f.name, "url(/static/fonts/a11y/" + x[0] + ".woff2) format('woff2')", { weight: x[1], style: x[2], display: "swap" });
        ff.load().then(function (l) { document.fonts.add(l); }).catch(function () {});
      } catch (e) {}
    });
  }
  function apply() {
    OPTS.forEach(function (o) { if (s[o.k]) root.setAttribute("data-rs-" + o.k, s[o.k]); else root.removeAttribute("data-rs-" + o.k); });
    if (sysStill) root.setAttribute("data-rs-calm", "on");
    if (s.font) loadFont(s.font);
  }
  apply();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} apply(); ruler(); sayButtons(); }

  /* ---------- reading ruler ---------- */
  var rul = null;
  function ruler() {
    if (s.ruler === "on" && !rul && document.body) {
      rul = document.createElement("div"); rul.className = "rs-ruler no-print"; rul.setAttribute("aria-hidden", "true");
      rul.innerHTML = '<div class="rs-r-top"></div><div class="rs-r-bot"></div>';
      document.body.appendChild(rul);
      var y = innerHeight / 2;
      var place = function () { var h = Math.max(40, parseFloat(getComputedStyle(document.body).fontSize) * 2.8); rul.firstChild.style.height = Math.max(0, y - h / 2) + "px"; rul.lastChild.style.top = (y + h / 2) + "px"; };
      rul._m = function (e) { y = e.clientY; place(); };
      rul._t = function (e) { if (e.touches && e.touches[0]) { y = e.touches[0].clientY - 60; place(); } };
      addEventListener("mousemove", rul._m, { passive: true }); addEventListener("touchmove", rul._t, { passive: true }); addEventListener("touchstart", rul._t, { passive: true });
      place();
    } else if (s.ruler !== "on" && rul) {
      removeEventListener("mousemove", rul._m); removeEventListener("touchmove", rul._t); removeEventListener("touchstart", rul._t);
      rul.remove(); rul = null;
    }
  }

  /* ---------- the panel ---------- */
  var dlg = null, opener = null;
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function build() {
    dlg = document.createElement("div"); dlg.className = "rs-wrap no-print"; dlg.hidden = true;
    var h = '<div class="rs-back" data-close="1"></div><div class="rs-dlg" role="dialog" aria-modal="true" aria-labelledby="rs-title">' +
      '<div class="rs-head"><h2 id="rs-title">Reading help</h2><button type="button" class="rs-x" data-close="1" aria-label="Close reading help">×</button></div>' +
      '<p class="rs-sub">Make the site easier to read your way. Your choices stay on this device.</p><form class="rs-form" onsubmit="return false">';
    OPTS.forEach(function (o) {
      h += '<fieldset class="rs-f"><legend>' + esc(o.label) + '</legend><div class="rs-opts">';
      o.v.forEach(function (v, i) {
        var id = "rs-" + o.k + "-" + i;
        h += '<input type="radio" id="' + id + '" name="rs-' + o.k + '" value="' + esc(v[0]) + '"><label for="' + id + '"' +
          (o.k === "font" && v[0] ? ' style="font-family:\'' + FONTS[v[0]].name + '\',var(--sans)"' : "") + ">" + esc(v[1]) + "</label>";
      });
      h += "</div>" + (o.note ? '<p class="rs-note">' + esc(o.note) + "</p>" : "") + "</fieldset>";
    });
    h += '</form><div class="rs-foot"><button type="button" class="btn ghost rs-reset">Reset all</button><button type="button" class="btn" data-close="1">Done</button></div>' +
      '<p class="rs-more"><a href="/reading-help/">About reading help (for parents)</a></p></div>';
    dlg.innerHTML = h;
    document.body.appendChild(dlg);
    dlg.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) close(); });
    dlg.querySelector(".rs-reset").addEventListener("click", function () { s = {}; save(); sync(); });
    dlg.querySelector(".rs-form").addEventListener("change", function (e) {
      var t = e.target; if (!t.name) return; var k = t.name.slice(3);
      if (t.value) s[k] = t.value; else delete s[k];
      /* load every easy-read font once the panel is used, so the buttons show what each looks like */
      save();
    });
    Object.keys(FONTS).forEach(loadFont);
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab") return;
      var f = Array.prototype.filter.call(dlg.querySelectorAll("button, a[href], input[type=radio]:checked"), function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  function sync() {
    if (!dlg) return;
    OPTS.forEach(function (o) {
      var cur = s[o.k] || "";
      Array.prototype.forEach.call(dlg.querySelectorAll('input[name="rs-' + o.k + '"]'), function (r) { r.checked = r.value === cur; });
    });
  }
  function open(e) {
    if (e) e.preventDefault();
    if (!dlg) build();
    sync(); opener = document.activeElement; dlg.hidden = false; root.classList.add("rs-open");
    var c = dlg.querySelector("input:checked") || dlg.querySelector("input"); if (c) c.focus();
  }
  function close() {
    if (!dlg) return; dlg.hidden = true; root.classList.remove("rs-open");
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-rs-open]");
    if (b) open(e);
  });

  /* ---------- Read it to me ---------- */
  var TTS = "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
  var SYM = { "−": " minus ", "+": " plus ", "×": " times ", "÷": " divided by ", "=": " equals ", "≈": " is about ", "<": " is less than ", ">": " is greater than ",
    "≤": " is less than or equal to ", "≥": " is greater than or equal to ", "°": " degrees ", "π": " pi ", "√": " the square root of ", "±": " plus or minus ",
    "¼": " one quarter ", "½": " one half ", "¾": " three quarters ", "⅓": " one third ", "⅔": " two thirds ", "²": " squared ", "³": " cubed ", "→": " to ", "Ω": " ohms ", "%": " percent " };
  function speakable(t) {
    return t
      .replace(/(\d)\s*\/\s*(\d)/g, "$1 over $2")
      .replace(/(\d),(\d{3})/g, "$1$2")
      .replace(/(\d)\s*-\s*(\d)/g, "$1 minus $2")
      .replace(/(^|[\s(])-(\d)/g, "$1minus $2")
      .replace(/\bm\/s\b/g, "metres per second").replace(/\bN\/kg\b/g, "newtons per kilogram").replace(/\bkg\/m³/g, "kilograms per cubic metre")
      .replace(/(\d)\s*cm²/g, "$1 square centimetres").replace(/(\d)\s*m²/g, "$1 square metres").replace(/(\d)\s*cm³/g, "$1 cubic centimetres")
      .replace(/[−+×÷=≈<>≤≥°π√±¼½¾⅓⅔²³→Ω%]/g, function (c) { return SYM[c] || c; })
      .replace(/_{2,}|…{1,}|\?{2,}/g, " blank ")
      .replace(/\s+/g, " ").trim();
  }
  function textOf(el) {
    var c = el.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll("svg, .sr, [aria-hidden=true], .rs-say"), function (x) { x.remove(); });
    return speakable(c.textContent || "");
  }
  var voice = null;
  function pickVoice() {
    if (!TTS) return;
    var vs = speechSynthesis.getVoices() || [];
    voice = vs.filter(function (v) { return /^en-GB/i.test(v.lang); })[0] || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  if (TTS) { pickVoice(); try { speechSynthesis.addEventListener("voiceschanged", pickVoice); } catch (e) {} }
  var reading = null;
  function stop() {
    if (!TTS) return;
    speechSynthesis.cancel();
    if (reading) { reading.btn.setAttribute("aria-pressed", "false"); reading.btn.lastChild.textContent = "Read it to me"; reading.parts.forEach(function (p) { p.classList.remove("rs-cur"); }); reading = null; }
  }
  function read(btn, qtext) {
    if (reading && reading.btn === btn) { stop(); return; }
    stop();
    var parts = [qtext], box = qtext.closest(".qcard, .qb-q, li, .q-card") || qtext.parentNode;
    var opts = box ? box.querySelectorAll(".q-options .opt") : [];
    Array.prototype.forEach.call(opts, function (o) { parts.push(o); });
    reading = { btn: btn, parts: parts };
    btn.setAttribute("aria-pressed", "true"); btn.lastChild.textContent = "Stop";
    var me = reading;
    parts.forEach(function (p, i) {
      var t = textOf(p); if (!t) return;
      if (i > 0) t = "Choice " + i + ": " + t;
      var u = new SpeechSynthesisUtterance(t);
      u.lang = "en-GB"; if (voice) u.voice = voice; u.rate = 0.9;
      u.onstart = function () { if (reading !== me) return; parts.forEach(function (x) { x.classList.remove("rs-cur"); }); p.classList.add("rs-cur"); };
      if (i === parts.length - 1) u.onend = u.onerror = function () { if (reading === me) stop(); };
      speechSynthesis.speak(u);
    });
  }
  function sayButtons() {
    if (!TTS || !document.body) return;
    var off = s.say === "off";
    Array.prototype.forEach.call(document.querySelectorAll(".q-text"), function (q) {
      var b = q.previousElementSibling && q.previousElementSibling.classList.contains("rs-say") ? q.previousElementSibling : null;
      if (off) { if (b) b.remove(); return; }
      if (b || q.closest(".qb-ws-q, .no-say")) return;
      b = document.createElement("button"); b.type = "button"; b.className = "rs-say no-print"; b.setAttribute("aria-pressed", "false");
      b.innerHTML = '<span aria-hidden="true">🔊</span><span>Read it to me</span>';
      b.addEventListener("click", function () { read(b, q); });
      q.parentNode.insertBefore(b, q);
    });
    if (off) stop();
  }
  /* questions are drawn by the practice, question-bank and video scripts, so watch for new ones */
  var pending = false;
  function watch() {
    if (!TTS || !("MutationObserver" in window)) return;
    new MutationObserver(function () {
      if (pending) return; pending = true;
      requestAnimationFrame(function () { pending = false; sayButtons(); });
    }).observe(document.body, { childList: true, subtree: true });
  }
  addEventListener("pagehide", stop);

  function ready() { ruler(); sayButtons(); watch(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready); else ready();
  window.JRS = { open: open, calm: function () { return root.getAttribute("data-rs-calm") === "on"; } };
})();
