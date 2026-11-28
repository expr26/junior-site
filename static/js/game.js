/* Game layer: stars (XP), levels, daily streak, badges and celebrations.
   Everything is saved only in this browser (localStorage key "js-game-v1"); nothing is sent anywhere.
   Rewards go to effort, accuracy and fixing mistakes, never to speed. No leaderboards, no comparing children.
   Other scripts use window.JG. */
(function () {
  var KEY = 'js-game-v1';

  var LEVELS = [   // [stars needed, title]
    [0, 'Starter'], [50, 'Explorer'], [150, 'Thinker'], [300, 'Problem Solver'], [500, 'Puzzle Pro'],
    [800, 'Bright Spark'], [1200, 'Brainiac'], [1700, 'Mastermind'], [2300, 'Genius'], [3000, 'Legend']
  ];

  var BADGES = [
    { id: 'first-step', icon: '👣', name: 'First step', desc: 'Answer your first question.' },
    { id: 'first-unit', icon: '🏁', name: 'Finisher', desc: 'Finish a whole unit.' },
    { id: 'combo-5', icon: '🔥', name: 'On a roll', desc: 'Get 5 right in a row.' },
    { id: 'fixer', icon: '🛠️', name: 'Mistake fixer', desc: 'Fix 5 mistakes on your second try.' },
    { id: 'curious', icon: '🔍', name: 'Curious mind', desc: 'Use 5 hints and keep going.' },
    { id: 'perfect', icon: '💎', name: 'Perfect set', desc: 'Get everything right first time in a unit or game.' },
    { id: 'three-stars', icon: '🌟', name: 'Star collector', desc: 'Earn 3 stars in a unit or game.' },
    { id: 'try-again', icon: '🔁', name: 'Never give up', desc: 'Do a unit again to beat your score.' },
    { id: 'streak-3', icon: '📅', name: '3-day streak', desc: 'Practise 3 days in a row.' },
    { id: 'streak-7', icon: '🗓️', name: 'Week warrior', desc: 'Practise 7 days in a row.' },
    { id: 'streak-30', icon: '🏆', name: 'Month marvel', desc: 'Practise 30 days in a row.' },
    { id: 'q-50', icon: '🧠', name: 'Fifty!', desc: 'Answer 50 questions.' },
    { id: 'q-200', icon: '🚀', name: 'Two hundred!', desc: 'Answer 200 questions.' },
    { id: 'all-rounder', icon: '🌍', name: 'All-rounder', desc: 'Finish a unit in Maths and a unit in Science.' },
    { id: 'topic-fractions', icon: '🍕', name: 'Fraction hero', desc: 'Finish every Fractions unit.' },
    { id: 'topic-forces-and-motion', icon: '🧲', name: 'Force master', desc: 'Finish every Forces and motion unit.' },
    { id: 'first-game', icon: '🎮', name: 'Game on', desc: 'Finish your first game.' },
    { id: 'first-video', icon: '🎬', name: 'Watch and learn', desc: 'Watch a whole theory video.' },
    { id: 'daily-1', icon: '☀️', name: 'Daily starter', desc: 'Finish your first daily challenge.' },
    { id: 'daily-7', icon: '📆', name: 'Challenge champ', desc: 'Finish 7 daily challenges.' },
    { id: 'mender-10', icon: '🩹', name: 'Mistake mender', desc: 'Get 10 old mistakes right in My mistakes.' },
    { id: 'topic-times-tables', icon: '✖️', name: 'Times table hero', desc: 'Finish every Times tables unit.' },
    { id: 'topic-place-value', icon: '🔢', name: 'Place value pro', desc: 'Finish every Place value unit.' },
    { id: 'topic-mental-maths', icon: '🧠', name: 'Brain power', desc: 'Finish every Mental maths unit.' },
    { id: 'topic-telling-the-time', icon: '⏰', name: 'Time keeper', desc: 'Finish every Telling the time unit.' },
    { id: 'topic-money', icon: '💷', name: 'Money whizz', desc: 'Finish every Money unit.' },
    { id: 'topic-decimals-and-percentages', icon: '💯', name: 'Percentage pro', desc: 'Finish every Decimals and percentages unit.' },
    { id: 'topic-written-methods', icon: '✏️', name: 'Column champion', desc: 'Finish every Written methods unit.' },
    { id: 'topic-graphs-and-data', icon: '📊', name: 'Chart champion', desc: 'Finish every Graphs and data unit.' },
    { id: 'topic-measurement', icon: '📏', name: 'Measuring master', desc: 'Finish every Measurement unit.' },
    { id: 'topic-shapes', icon: '🔷', name: 'Shape spotter', desc: 'Finish every Shapes unit.' },
    { id: 'topic-missions', icon: '🚀', name: 'Mission complete', desc: 'Finish every Real-life maths mission.' },
    { id: 'level-check', icon: '🧭', name: 'Know where I am', desc: 'Finish a level check, like Ready for Year 7?' },
    { id: 'tt-map', icon: '🗺️', name: 'Times table map', desc: 'Colour in the whole times table map in the Times Table Trainer.' },
    { id: 'welcome-back', icon: '👋', name: 'Welcome back', desc: 'Come back after a few days away.' }
  ];

  var POINTS = { first: 10, second: 5, effort: 2, unit: 20, perfect: 20, daily: 5 };
  var DAILY_GOAL = 40;

  function today(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dayDiff(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5); }

  function blank() { return { v: 1, xp: 0, days: {}, streak: 0, best: 0, last: '', answered: 0, right: 0, fixed: 0, hints: 0, units: {}, games: {}, badges: {}, subjects: {} }; }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return Object.assign(blank(), s); } catch (e) {}
    return blank();
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  function level(xp) {
    var i = 0; while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][0]) i++;
    var next = LEVELS[i + 1];
    return { n: i + 1, title: LEVELS[i][1], from: LEVELS[i][0], to: next ? next[0] : null,
      pct: next ? Math.round(100 * (xp - LEVELS[i][0]) / (next[0] - LEVELS[i][0])) : 100 };
  }

  /* ---------- earning ---------- */
  var pending = [];   // badges earned since the last drain(), for the end-of-set screen
  var quiet = false;   // true while finishing a unit: the end card shows the new badges itself
  function award(id) {
    if (S.badges[id]) return;
    var b = BADGES.filter(function (x) { return x.id === id; })[0];
    if (!b) return;
    S.badges[id] = Date.now(); pending.push(b);
    if (!quiet) { toast(b.icon + ' New badge: ' + b.name, 't-badge'); confetti(60); }
  }

  function touchDay() {   // first activity today: streak and a small daily bonus
    var t = today();
    if (S.last === t) return 0;
    var gap = S.last ? dayDiff(S.last, t) : null;
    S.streak = gap === 1 ? S.streak + 1 : 1;
    if (gap !== null && gap >= 4) award('welcome-back');
    S.last = t; S.best = Math.max(S.best, S.streak);
    if (S.streak >= 3) award('streak-3');
    if (S.streak >= 7) award('streak-7');
    if (S.streak >= 30) award('streak-30');
    return POINTS.daily;
  }

  function addXP(n) {
    var before = level(S.xp).n;
    S.xp += n; var t = today(); S.days[t] = (S.days[t] || 0) + n;
    var after = level(S.xp);
    if (after.n > before) { toast('⬆️ Level ' + after.n + ': ' + after.title + '!', 't-level'); confetti(120); }
    if (S.days[t] >= DAILY_GOAL && S.days[t] - n < DAILY_GOAL) toast('🎯 Daily goal done! Brilliant.', 't-goal');
    chip(); save();
  }

  /* outcome: 'first' | 'second' | 'missed' ; combo = right answers in a row in this set */
  function answer(outcome, combo, usedHint, subject) {
    var bonus = touchDay();
    S.answered++;
    if (outcome !== 'missed') S.right++;
    if (outcome === 'second') S.fixed++;
    if (usedHint) S.hints++;
    award('first-step');
    if (combo >= 5) award('combo-5');
    if (S.fixed >= 5) award('fixer');
    if (S.hints >= 5) award('curious');
    if (S.answered >= 50) award('q-50');
    if (S.answered >= 200) award('q-200');
    var pts = POINTS[outcome === 'missed' ? 'effort' : outcome] + bonus;
    addXP(pts);
    return pts;
  }

  function stars(firstTry, total) { var p = firstTry / total; return p >= 0.9 ? 3 : p >= 0.7 ? 2 : 1; }

  function finishUnit(d, firstTry, total) {
    var key = d.key, u = S.units[key] || { stars: 0, best: 0, runs: 0 };
    var st = stars(firstTry, total), improved = st > u.stars;
    if (u.runs > 0) award('try-again');
    u.runs++; u.best = Math.max(u.best, firstTry); u.total = total; u.stars = Math.max(u.stars, st); u.at = Date.now();
    S.units[key] = u;
    S.subjects[d.subject] = 1;
    var pts = POINTS.unit + (firstTry === total ? POINTS.perfect : 0);
    quiet = true;
    award('first-unit');
    if (firstTry === total) award('perfect');
    if (st === 3) award('three-stars');
    if (S.subjects.maths && S.subjects.science) award('all-rounder');
    if (d.topicUnits.every(function (s) { return S.units[d.topic + '/' + s]; })) award('topic-' + d.topic);
    quiet = false;
    addXP(pts);
    return { stars: st, improved: improved, points: pts };
  }

  /* a game from /games/ (d = { key, subject }): same stars rule as a unit, saved under S.games */
  function finishGame(d, firstTry, total) {
    var g = S.games[d.key] || { stars: 0, best: 0, runs: 0 };
    var st = stars(firstTry, total), improved = st > g.stars;
    if (g.runs > 0) award('try-again');
    g.runs++; g.best = Math.max(g.best, firstTry); g.total = total; g.stars = Math.max(g.stars, st); g.at = Date.now();
    S.games[d.key] = g;
    var pts = POINTS.unit + (firstTry === total ? POINTS.perfect : 0);
    quiet = true;
    award('first-game');
    if (firstTry === total) award('perfect');
    if (st === 3) award('three-stars');
    quiet = false;
    addXP(pts);
    return { stars: st, improved: improved, points: pts };
  }

  /* a theory video from /videos/ (d = { key, subject }): stars from the quick checks, saved under S.videos */
  function finishVideo(d, firstTry, total) {
    S.videos = S.videos || {};
    var v = S.videos[d.key] || { stars: 0, best: 0, runs: 0 };
    var st = stars(firstTry, total), improved = st > v.stars;
    v.runs++; v.best = Math.max(v.best, firstTry); v.total = total; v.stars = Math.max(v.stars, st); v.at = Date.now();
    S.videos[d.key] = v;
    var pts = POINTS.unit + (firstTry === total ? POINTS.perfect : 0);
    quiet = true;
    award('first-video');
    if (firstTry === total) award('perfect');
    if (st === 3) award('three-stars');
    quiet = false;
    addXP(pts);
    return { stars: st, improved: improved, points: pts };
  }

  /* the daily challenge (d = { date, subject }): stars as for a unit, saved under S.daily[date]; only the first finish of a day earns the bonus */
  function finishDaily(d, firstTry, total) {
    S.daily = S.daily || {};
    var had = S.daily[d.date], st = stars(firstTry, total);
    S.daily[d.date] = { stars: Math.max(st, had ? had.stars : 0), first: Math.max(firstTry, had ? had.first : 0), total: total };
    var pts = had ? 0 : POINTS.unit + (firstTry === total ? POINTS.perfect : 0);
    quiet = true;
    award('daily-1');
    if (Object.keys(S.daily).length >= 7) award('daily-7');
    if (firstTry === total) award('perfect');
    if (st === 3) award('three-stars');
    quiet = false;
    if (pts) addXP(pts); else save();
    return { stars: st, points: pts, again: !!had };
  }

  /* an old mistake answered right in My mistakes */
  function mended() {
    S.mended = (S.mended || 0) + 1;
    if (S.mended >= 10) award('mender-10');
    save();
  }

  function drain() { var p = pending; pending = []; return p; }

  /* ---------- show ---------- */
  function chip() {
    var c = document.querySelector('.me-chip'); if (!c) return;
    c.hidden = false;
    c.innerHTML = '<span title="Stars">⭐ ' + S.xp + '</span><span title="Day streak">🔥 ' + (S.last && dayDiff(S.last, today()) <= 1 ? S.streak : 0) + '</span>';
    c.setAttribute('aria-label', 'My progress: ' + S.xp + ' stars, ' + S.streak + ' day streak');
  }

  var tbox;
  function toast(text, kind) {
    if (!tbox) { tbox = document.createElement('div'); tbox.className = 'toasts'; tbox.setAttribute('role', 'status'); document.body.appendChild(tbox); }
    while (tbox.children.length >= 2) tbox.firstChild.remove();
    var t = document.createElement('div'); t.className = 'toast ' + (kind || ''); t.textContent = text; tbox.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 400); }, 3200);
  }

  var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-rs-calm') === 'on';
  function confetti(n) {
    if (still || document.documentElement.getAttribute('data-rs-calm') === 'on') return;
    var cv = document.createElement('canvas'), ctx = cv.getContext('2d'), W = cv.width = innerWidth, H = cv.height = innerHeight;
    cv.className = 'confetti'; document.body.appendChild(cv);
    var colours = ['#E2C67E', '#8A6416', '#1D5FA8', '#1F6B45', '#C2410C', '#8DB8F0'], ps = [];
    for (var i = 0; i < n; i++) ps.push({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35, vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 4,
      r: Math.random() * 6 + 4, a: Math.random() * 6, c: colours[i % colours.length] });
    var t0 = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, W, H);
      ps.forEach(function (p) { p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += .2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (t - t0 < 1800) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }

  window.JG = { state: function () { return S; }, level: level, LEVELS: LEVELS, BADGES: BADGES, POINTS: POINTS, DAILY_GOAL: DAILY_GOAL,
    answer: answer, finishUnit: finishUnit, finishGame: finishGame, finishVideo: finishVideo, finishDaily: finishDaily, mended: mended, award: award, save: save, stars: stars, drain: drain, toast: toast, confetti: confetti, today: today, dayDiff: dayDiff, chip: chip };

  function ready() {
    chip();
    var mend = document.querySelector('[data-has-mistakes]');   /* home page: show "My mistakes" once there are some */
    if (mend && S.qb) for (var q in S.qb) if (q.indexOf('_done_') && S.qb[q].r !== 'good') { mend.hidden = false; break; }
    var dc = document.querySelector('.daily-card small');
    if (dc && S.daily && S.daily[today()]) dc.textContent = '✅ Done today! Come back tomorrow for five new questions.';
    document.querySelectorAll('[data-stars]').forEach(function (el) {   // stars on topic maps
      var u = S.units[el.getAttribute('data-stars')]; var n = u ? u.stars : 0;
      el.querySelectorAll('i').forEach(function (i, k) { if (k < n) i.className = 'on'; });
      if (u) el.closest('.unit-card') && el.closest('.unit-card').classList.add('done');
    });
    document.querySelectorAll('[data-game]').forEach(function (el) {   // stars on the Games page
      var g = S.games['game/' + el.getAttribute('data-game')]; var n = g ? g.stars : 0;
      el.querySelectorAll('.g-stars i').forEach(function (i, k) { if (k < n) i.className = 'on'; });
    });
    document.querySelectorAll('[data-tv]').forEach(function (el) {   // stars on the Videos page
      var v = (S.videos || {})['video/' + el.getAttribute('data-tv')]; var n = v ? v.stars : 0;
      el.querySelectorAll('.g-stars i').forEach(function (i, k) { if (k < n) i.className = 'on'; });
    });
    document.querySelectorAll('.unit-path').forEach(function (ol) {   // "start here" on the first unfinished unit
      var first = [].filter.call(ol.querySelectorAll('.unit-card'), function (a) { return !a.classList.contains('done'); })[0];
      if (first) first.classList.add('next');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
