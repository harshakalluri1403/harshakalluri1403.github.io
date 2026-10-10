// Builds a project page from content.js.
// The page's folder name is the item's slug, e.g. /bdb27/ shows the item with slug "bdb27".
// You should never need to touch this file; edit content.js instead.
(function () {
  var S = window.SITE || {};
  var BASE = window.SITE_BASE || '';            // "../" on a project page
  var q = new URLSearchParams(location.search);
  var PREVIEW = q.get('preview') === '1';
  var DRAFT = q.get('draft') === '1';                      // console.html's unsaved draft
  if (DRAFT) { try { var d = localStorage.getItem('portfolio-draft'); if (d) S = JSON.parse(d); } catch (e) {} }
  var QS = PREVIEW || DRAFT ? '?' + [PREVIEW ? 'preview=1' : '', DRAFT ? 'draft=1' : ''].filter(Boolean).join('&') : '';
  var LIVE = S.live !== false;

  var slug = q.get('p') || '';
  if (!slug) {
    var parts = location.pathname.split('/').filter(Boolean);
    if (parts.length && /\.html?$/i.test(parts[parts.length - 1])) parts.pop();
    slug = decodeURIComponent(parts[parts.length - 1] || '');
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function src(p) { return /^(https?:)?\/\//.test(p) ? p : BASE + p; }
  function paras(box, text, cls) {
    (Array.isArray(text) ? text : [text]).forEach(function (t) { if (t) box.appendChild(el('p', cls, t)); });
  }
  function figure(f) {
    if (!f) return null;
    if (typeof f === 'string') f = { image: f };
    if (!f.image) return null;
    var fig = el('figure');
    var im = el('img'); im.src = src(f.image); im.alt = f.alt || '';
    if (f.width) im.style.width = f.width;
    fig.appendChild(im);
    if (f.caption) fig.appendChild(el('figcaption', null, f.caption));
    return fig;
  }
  function find(slug) {
    var hit = null;
    (S.sections || []).forEach(function (sec) {
      (sec.items || []).forEach(function (it) { if (!hit && it.slug === slug) hit = it; });
    });
    return hit;
  }

  var app = document.getElementById('app');
  var home = BASE + 'index.html' + QS;

  if (!LIVE && !PREVIEW) {
    document.title = S.name || document.title;
    app.appendChild(el('h1', null, S.name || ''));
    app.appendChild(el('p', null, S.holdingLine || 'Portfolio coming soon.'));
    var lk = el('div', 'links');
    (S.links || []).forEach(function (l, i) {
      if (i) lk.appendChild(el('span', 'sep', '/'));
      var a = el('a', null, l.label); a.href = l.url; lk.appendChild(a);
    });
    app.appendChild(lk);
    return;
  }

  var it = find(slug);
  if (it && it.hidden && !PREVIEW) it = null;          // hidden items have no public page
  var back = el('a', 'back', '&larr; ' + (S.name || 'Home'));
  back.href = home;
  app.appendChild(back);

  if (!it) {
    document.title = 'Not found';
    app.appendChild(el('h1', null, 'Page not found'));
    app.appendChild(el('p', 'muted', 'No item in content.js has slug "' + slug + '".'));
    return;
  }

  var P = it.page || {};
  document.title = it.title + (S.name ? ' – ' + S.name : '');

  app.appendChild(el('h1', 'ptitle', it.title));

  // authors: a string, or a list of { name, url, affiliation }
  var authors = P.authors || it.authors;
  if (authors) {
    if (typeof authors === 'string') {
      app.appendChild(el('div', 'authors', authors));
    } else {
      var names = authors.map(function (a) {
        return a.url ? '<a href="' + a.url + '">' + a.name + '</a>' : a.name;
      }).join(', ');
      app.appendChild(el('div', 'authors', names));
      var affils = [];
      authors.forEach(function (a) { if (a.affiliation && affils.indexOf(a.affiliation) < 0) affils.push(a.affiliation); });
      if (affils.length) app.appendChild(el('div', 'affil', affils.join(' &middot; ')));
    }
  }
  var venue = [P.venue || it.venue, P.year || it.year].filter(Boolean).join(', ');
  if (venue) app.appendChild(el('div', 'venue', venue));

  var buttons = P.buttons || it.links || [];
  if (buttons.length) {
    var row = el('div', 'buttons');
    buttons.forEach(function (b) { var a = el('a', null, b.label); a.href = b.url; row.appendChild(a); });
    app.appendChild(row);
  }

  var hero = figure(P.hero || (it.gif ? { image: it.gif } : it.image));
  if (hero) app.appendChild(hero);

  if (P.abstract) {
    app.appendChild(el('h2', null, P.abstractTitle || 'Abstract'));
    paras(app, P.abstract);
  }

  (P.sections || []).forEach(function (sec) {
    if (sec.heading) app.appendChild(el('h2', null, sec.heading));
    if (sec.text) paras(app, sec.text);
    var fig = figure(sec.figure || (sec.image ? { image: sec.image, caption: sec.caption, width: sec.width } : null));
    if (fig) app.appendChild(fig);
  });

  if (P.bibtex) {
    app.appendChild(el('h2', null, 'BibTeX'));
    var pre = el('pre'); pre.textContent = P.bibtex; app.appendChild(pre);
  }
  if (P.status) app.appendChild(el('p', 'status', P.status));
})();
