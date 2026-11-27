/* Printables (/printables/): the print button. The sheets themselves are plain HTML made at build time. */
document.querySelectorAll('[data-print]').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });
