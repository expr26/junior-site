/* What is...? pages: the quick check. One tap per question; the right answer and the reason show either way. Nothing is saved. */
document.querySelectorAll('.wi-q').forEach(function (q) {
  var bs = q.querySelectorAll('.opt');
  bs.forEach(function (b) {
    b.addEventListener('click', function () {
      bs.forEach(function (x) { x.disabled = true; if (x.getAttribute('data-ok') === '1') x.classList.add('right'); });
      if (b.getAttribute('data-ok') !== '1') b.classList.add('wrong');
      var w = q.querySelector('.wi-why'); w.hidden = false;
      w.insertAdjacentHTML('afterbegin', b.getAttribute('data-ok') === '1' ? '<b>Yes! </b>' : '<b>Not quite. </b>');
    });
  });
});
