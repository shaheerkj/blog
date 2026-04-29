(function () {
  var toc = document.querySelector('[data-toc]');
  var list = document.querySelector('[data-toc-list]');
  if (!toc || !list) return;

  var headings = Array.prototype.slice.call(
    document.querySelectorAll('.prose h2, .prose h3')
  ).filter(function (h) { return h.id; });

  if (headings.length < 2) {
    toc.setAttribute('hidden', '');
    return;
  }

  var linkMap = Object.create(null);

  headings.forEach(function (h) {
    var li = document.createElement('li');
    li.className = 'toc__item toc__item--' + h.tagName.toLowerCase();

    var a = document.createElement('a');
    a.className = 'toc__link';
    a.href = '#' + h.id;
    a.textContent = h.textContent;

    li.appendChild(a);
    list.appendChild(li);
    linkMap[h.id] = a;
  });

  if (!('IntersectionObserver' in window)) return;

  var visible = new Set();

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) visible.add(e.target.id);
      else visible.delete(e.target.id);
    });

    var activeId = null;
    for (var i = 0; i < headings.length; i++) {
      if (visible.has(headings[i].id)) { activeId = headings[i].id; break; }
    }

    if (!activeId) {
      var scrollY = window.scrollY + 120;
      for (var j = 0; j < headings.length; j++) {
        if (headings[j].offsetTop <= scrollY) activeId = headings[j].id;
        else break;
      }
    }

    Object.keys(linkMap).forEach(function (id) {
      var link = linkMap[id];
      if (id === activeId) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'location');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  }, {
    rootMargin: '-72px 0px -65% 0px',
    threshold: [0, 1]
  });

  headings.forEach(function (h) { observer.observe(h); });
})();
