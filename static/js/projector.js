/* Big screen (projector) mode for teachers: on pages with a game, video, practice set, question list or level check,
   a "Big screen" button hides everything else, makes the activity large, and goes full screen where the browser allows.
   Nothing is saved or sent. */
(function () {
  var T = document.querySelector('#arcade, #runner, #tv, #diag, #qb-list');
  if (!T) return;
  var sec = T.closest('section') || T.parentNode;
  var root = document.documentElement;
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'btn ghost proj-btn no-print';
  btn.innerHTML = '<span aria-hidden="true">📽️</span> Big screen';
  btn.setAttribute('aria-pressed', 'false');
  btn.title = 'Show this on a projector or interactive whiteboard';
  var wrap = T.id === 'qb-list' ? document.getElementById('qb-filters') || T : T;
  wrap.parentNode.insertBefore(btn, wrap);
  function set(on) {
    if (on) { root.setAttribute('data-proj', 'on'); sec.classList.add('proj-keep'); }
    else { root.removeAttribute('data-proj'); sec.classList.remove('proj-keep'); }
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.innerHTML = on ? '<span aria-hidden="true">✕</span> Exit big screen' : '<span aria-hidden="true">📽️</span> Big screen';
    if (on) sec.scrollIntoView({ block: 'start' });
  }
  btn.addEventListener('click', function () {
    var on = root.getAttribute('data-proj') !== 'on';
    set(on);
    try {
      if (on && root.requestFullscreen && !document.fullscreenElement) root.requestFullscreen().catch(function () {});
      if (!on && document.fullscreenElement) document.exitFullscreen().catch(function () {});
    } catch (e) {}
  });
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && root.getAttribute('data-proj') === 'on') set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.getAttribute('data-proj') === 'on') set(false); });
})();
