/* /parent-report/: a printable summary for parents, made only from this browser's saved progress (js-game-v1 via window.JG).
   Topic names come from /static/qb-topics.json. Nothing is sent anywhere. */
(function () {
  document.addEventListener('click', function (e) { if (e.target.closest('[data-print]')) window.print(); });
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var checks = {};
  function run(topics) {
    if (!window.JG) return;
    var S = JG.state(), t = JG.today(), qb = S.qb || {}, L = JG.level(S.xp);
    document.querySelector('.pr-date').textContent = 'Report made on ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + '.';
    var days = Object.keys(S.days || {}).sort(), active = days.filter(function (d) { return S.days[d] > 0; });
    var last30 = active.filter(function (d) { return JG.dayDiff(d, t) < 30; }).length;
    var streak = S.last && JG.dayDiff(S.last, t) <= 1 ? S.streak : 0;
    /* per topic */
    var per = {};
    Object.keys(qb).forEach(function (id) {
      var r = qb[id]; if (!r.t || id.indexOf('_done_') === 0) return;
      var p = per[r.t] || (per[r.t] = { tried: 0, good: 0, fixed: 0, missed: 0 });
      p.tried++; p[r.r]++;
    });
    var keys = Object.keys(per).sort(function (a, b) { return per[b].tried - per[a].tried; });
    function name(k) { return topics[k] ? topics[k].title : k; }
    function pct(p) { return Math.round(100 * p.good / p.tried); }
    var strong = keys.filter(function (k) { return per[k].tried >= 5 && pct(per[k]) >= 80; });
    var work = keys.filter(function (k) { return per[k].tried >= 5 && pct(per[k]) < 60; });
    var games = Object.keys(S.games || {}), vids = Object.keys(S.videos || {}), dailies = Object.keys(S.daily || {});
    var h = '';
    if (!S.answered && !games.length && !vids.length) {
      h = '<p class="note">No practice saved on this device yet. Once your child answers some questions, plays a game or watches a video here, this page fills in.</p>';
    } else {
      h += '<div class="pr-stats">' +
        stat('Days practised', active.length, last30 + ' in the last 30 days') +
        stat('Day streak', '🔥 ' + streak, 'Best: ' + S.best + ' days') +
        stat('Questions answered', S.answered, S.right + ' right, ' + S.fixed + ' fixed after a hint') +
        stat('Stars and level', '⭐ ' + S.xp, 'Level ' + L.n + ': ' + esc(L.title)) +
        stat('Games and videos', games.length + ' + ' + vids.length, plural(games.length, 'game') + ' finished, ' + plural(vids.length, 'video') + ' watched') +
        stat('Daily challenges', dailies.length, 'Badges earned: ' + Object.keys(S.badges || {}).length) + '</div>';
      h += '<h2>Strengths</h2>' + (strong.length ? '<ul class="pr-list">' + strong.map(function (k) { return '<li>🌟 <b>' + esc(name(k)) + '</b>: ' + pct(per[k]) + '% right first time</li>'; }).join('') + '</ul>' :
        '<p>Not enough answers yet to show strengths (we wait for at least 5 questions in a topic).</p>');
      h += '<h2>Worth practising</h2>' + (work.length ? '<ul class="pr-list">' + work.map(function (k) { return '<li>🌱 <b>' + esc(name(k)) + '</b>: ' + pct(per[k]) + '% right first time. ' +
        (topics[k] ? '<a href="' + topics[k].href + '">Practise this topic</a>' : '') + '</li>'; }).join('') + '</ul>' :
        '<p>Nothing stands out. ' + (keys.length ? 'Keep going!' : '') + '</p>');
      if (keys.length) {
        h += '<h2>Question bank topics</h2><div class="pr-table-wrap"><table class="pr-table"><thead><tr><th>Topic</th><th>Tried</th><th>Right first time</th><th>Fixed</th><th>Still to fix</th></tr></thead><tbody>' +
          keys.map(function (k) { var p = per[k], n = topics[k] ? topics[k].n : null;
            return '<tr><td>' + esc(name(k)) + (topics[k] ? ' <small>(' + esc(topics[k].subject) + ')</small>' : '') + '</td><td>' + p.tried + (n ? ' of ' + n : '') + '</td><td>' + p.good + '</td><td>' + p.fixed + '</td><td>' + p.missed + '</td></tr>'; }).join('') +
          '</tbody></table></div>';
      }
      var dg = S.diag || {};
      Object.keys(dg).forEach(function (slug) {
        var info = checks[slug]; if (!info) return;
        var r = dg[slug], ks = Object.keys(info.areas);
        var lv = function (k) { var n = info.areas[k].n, x = r.areas[k] || 0; return x === n ? 'ready' : n > 1 && x >= n - 1 ? 'nearly' : 'practise'; };
        var todo = ks.filter(function (k) { return lv(k) === 'practise'; }), near = ks.filter(function (k) { return lv(k) === 'nearly'; });
        h += '<h2>' + esc(info.title.split('?')[0]) + '? check</h2><p>Done on ' + new Date(r.at + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) +
          ': ready in <b>' + (ks.length - todo.length - near.length) + ' of ' + ks.length + '</b> areas.</p>' +
          (todo.length ? '<p>🎯 Practise first: ' + todo.map(function (k) { var a = info.areas[k]; return '<a href="' + a.links[0][1] + '">' + esc(a.name) + '</a>'; }).join(', ') + '.</p>' : '') +
          (near.length ? '<p>🌱 Nearly there: ' + near.map(function (k) { return esc(info.areas[k].name); }).join(', ') + '.</p>' : '') +
          '<p class="small"><a href="' + info.href + '">Do the check again</a> in a few weeks to see the change.</p>';
      });
      var week = [];
      for (var k = 6; k >= 0; k--) { var d = new Date(); d.setDate(d.getDate() - k); week.push({ day: d.toLocaleDateString('en-GB', { weekday: 'short' }), xp: S.days[JG.today(d)] || 0 }); }
      var max = Math.max.apply(null, week.map(function (w) { return w.xp; }).concat([JG.DAILY_GOAL]));
      h += '<h2>The last 7 days</h2><div class="card stat week"><div class="week-bars">' + week.map(function (w) {
        return '<div><span style="height:' + Math.round(100 * w.xp / max) + '%" title="' + w.xp + ' stars"></span><small>' + w.day + '</small></div>'; }).join('') + '</div><p class="small">Stars earned each day. The daily goal is ' + JG.DAILY_GOAL + ' stars.</p></div>';
    }
    document.getElementById('pr').innerHTML = h;
  }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  function stat(k, v, sub) { return '<div class="card stat"><p class="stat-k">' + k + '</p><p class="stat-v">' + v + '</p><p class="small">' + sub + '</p></div>'; }
  function go() { fetch('/static/diag.json').then(function (r) { return r.json(); }).then(function (d) { checks = d; }).catch(function () {}).then(function () { return fetch('/static/qb-topics.json'); }).then(function (r) { return r.json(); }).catch(function () { return {}; }).then(run); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
