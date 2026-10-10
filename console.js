// The console: a form editor for content.js with a live preview.
//
// How it works
//   1. It loads window.SITE from content.js.
//   2. Every edit is kept as a draft in this browser's localStorage and the
//      preview on the right reloads with it (index.html?preview=1&draft=1).
//   3. "Download content.js" writes the draft out as a new content.js.
//      Replace the file in this folder with it, then git add / commit / push.
// Nothing here runs on the live site; visitors never see drafts.
(function () {
  var KEY = 'portfolio-draft';
  try { localStorage.setItem('portfolio-preview', '1'); } catch (e) {}   // unlock the preview in this browser
  var base = JSON.parse(JSON.stringify(window.SITE || {}));
  function hashOf(o) { var s = JSON.stringify(o), h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h); }
  var BASE_HASH = hashOf(base);                 // to notice when content.js on disk changed under a draft
  var S = null;
  try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; }
  var pushedHash = null;
  try { pushedHash = localStorage.getItem(KEY + '-pushed'); } catch (e) {}
  // A draft identical to the published file is not a draft any more.
  if (S && hashOf(S) === BASE_HASH) {
    S = null;
    try { localStorage.removeItem(KEY); localStorage.removeItem(KEY + '-base'); localStorage.removeItem(KEY + '-pushed'); } catch (e) {}
  }
  var dirty = !!S;
  // Just published, but GitHub Pages is still serving the previous content.js.
  var propagating = dirty && !!pushedHash && hashOf(S) === pushedHash;
  var staleDraft = dirty && !propagating && localStorage.getItem(KEY + '-base') !== BASE_HASH;
  if (!S) S = JSON.parse(JSON.stringify(base));

  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function cap(k) { return k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase(); }

  // ------------------------------------------------------------ schemas
  var KINDS = ['Paper', 'Preprint', 'Competition entry', 'Project', 'Talk', 'Thesis', 'Award', 'Software', 'Other'];
  var LINK = [{ k: 'label' }, { k: 'url', l: 'URL' }];
  var ICONLINK = LINK;
  var AUTHOR = [{ k: 'name' }, { k: 'url', l: 'URL' }, { k: 'affiliation' }];
  var FIG = [{ k: 'heading' }, { k: 'text', t: 'paragraphs' }, { k: 'image', t: 'image' }, { k: 'caption' }, { k: 'width', l: 'Width (e.g. 70%)' }];
  var PAGE = [
    { k: 'authors', t: 'list', schema: AUTHOR, label: 'name' },
    { k: 'venue' }, { k: 'year' },
    { k: 'buttons', t: 'list', schema: LINK, label: 'label', hint: 'Paper, Code, Video, Slides, Data ...' },
    { k: 'hero', t: 'object', schema: [{ k: 'image', t: 'image', l: 'Hero image or gif' }, { k: 'caption' }, { k: 'width', l: 'Width (e.g. 70%)' }] },
    { k: 'abstractTitle', l: 'Abstract heading', hint: 'Default "Abstract". Use "Summary" for projects.' },
    { k: 'abstract', t: 'paragraphs' },
    { k: 'sections', l: 'Figures and sections', t: 'list', schema: FIG, label: 'heading' },
    { k: 'bibtex', t: 'textarea', l: 'BibTeX' },
    { k: 'status', hint: 'Small grey line at the end, e.g. "Under submission".' }
  ];
  var ITEM = [
    { k: 'hidden', t: 'check', cls: 'hiddencb', l: 'Hidden: keep it but do not show it on the site' },
    { k: 'title' },
    { k: 'kind', t: 'combo', opts: KINDS },
    { k: 'venue' }, { k: 'year' },
    { k: 'when', hint: 'Only for compact sections (News, Talks ...): the date shown on the left.' },
    { k: 'authors', l: 'Authors (one line, for the list)' },
    { k: 'description', t: 'textarea' },
    { k: 'url', l: 'URL', hint: 'Where the title goes if the item has no project page.' },
    { k: 'image', t: 'image', l: 'Thumbnail' },
    { k: 'gif', t: 'image', l: 'Hover gif' },
    { k: 'links', t: 'list', schema: LINK, label: 'label', hint: 'Small links under the description.' },
    { k: 'slug', hint: 'Folder name of its project page, e.g. my-paper. Copy _template to a folder with this name.' },
    { k: 'page', t: 'optional', l: 'Project page', schema: PAGE }
  ];
  var SECTION = [
    { k: 'title' },
    { k: 'type', t: 'select', opts: ['list', 'lines'], hint: '"list" = thumbnails and descriptions. "lines" = one dated line per item (News, Talks, Awards).' },
    { k: 'hidden', t: 'check', l: 'Hidden: keep it but do not show it on the site' },
    { k: 'intro', hint: 'Optional paragraph under the heading.' },
    { k: 'items', t: 'list', schema: ITEM, label: 'title' }
  ];
  var TIMELINE = [{ k: 'hidden', t: 'check', cls: 'hiddencb', l: 'Hidden: keep it but do not show it on the site' }, { k: 'logo', t: 'image' }, { k: 'when' }, { k: 'what', l: 'Role or degree' }, { k: 'where', l: 'Organisation' }, { k: 'url', l: 'URL' }, { k: 'note' }];
  var SITEF = [
    { k: 'live', t: 'select', opts: [true, false], l: 'Portfolio up?', hint: 'false shows visitors only the holding line and your links.' },
    { k: 'holdingLine' },
    { k: 'name' },
    { k: 'photo', t: 'image', hint: 'Put the file next to index.html.' },
    { k: 'bio', t: 'paragraphs', hint: 'Blank line between paragraphs. Simple HTML is fine.' },
    { k: 'footer', hint: 'Small grey line at the bottom. Simple HTML is fine.' }
  ];
  var PRESETS = [
    ['News', 'lines'], ['Talks', 'lines'], ['Teaching', 'lines'], ['Awards', 'lines'], ['Service', 'lines'],
    ['Students', 'lines'], ['Writing', 'list'], ['Software', 'list'], ['Misc', 'lines'], ['Custom', 'list']
  ];

  // ------------------------------------------------------------ state
  var saveTimer = null;
  function changed() {
    dirty = true;
    $('status').textContent = 'Draft, unsaved';
    $('status').className = 'status dirty';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(S)); localStorage.setItem(KEY + '-base', BASE_HASH); } catch (e) {}
      $('status').textContent = 'Draft saved in this browser, not on disk. Download content.js when done.';
      // Reload the preview by resetting its address (works for file:// too, where reload() is blocked).
      var fr = $('frame'); fr.src = 'index.html?preview=1&draft=1&t=' + Date.now();
    }, 500);
  }

  // ------------------------------------------------------------ form builder
  // `path` is the field's address in content.js (e.g. sections.1.items.2.description);
  // it is stamped on the control as data-path so the preview can jump here.
  function field(parent, obj, f, onLabel, path) {
    var t = f.t || 'text';
    var label = f.l || cap(f.k);
    var pth = path ? path + '.' + f.k : f.k;
    var wrap, input;

    if (t === 'list') {
      wrap = el('fieldset'); wrap.dataset.path = pth;
      wrap.appendChild(el('legend', null, label));
      if (f.hint) wrap.appendChild(el('div', 'hint', f.hint));
      renderList(wrap, obj, f, pth);
      parent.appendChild(wrap);
      return;
    }
    if (t === 'object') {
      if (!obj[f.k] || typeof obj[f.k] !== 'object') obj[f.k] = {};
      wrap = el('fieldset'); wrap.dataset.path = pth;
      wrap.appendChild(el('legend', null, label));
      f.schema.forEach(function (sf) { field(wrap, obj[f.k], sf, null, pth); });
      parent.appendChild(wrap);
      return;
    }
    if (t === 'optional') {
      wrap = el('fieldset'); wrap.dataset.path = pth;
      var head = el('label', 'f check');
      var cb = el('input'); cb.type = 'checkbox'; cb.checked = !!obj[f.k];
      head.appendChild(cb); head.appendChild(el('span', 'l', 'Has a ' + label.toLowerCase()));
      wrap.appendChild(el('legend', null, label));
      wrap.appendChild(head);
      var inner = el('div');
      wrap.appendChild(inner);
      function draw() {
        inner.innerHTML = '';
        if (obj[f.k]) f.schema.forEach(function (sf) { field(inner, obj[f.k], sf, null, pth); });
      }
      cb.onchange = function () {
        if (cb.checked) { if (!obj[f.k]) obj[f.k] = { authors: [], buttons: [], hero: {}, abstract: [], sections: [] }; }
        else { delete obj[f.k]; }
        draw(); changed();
      };
      draw();
      parent.appendChild(wrap);
      return;
    }

    wrap = el('label', 'f' + (t === 'check' ? ' check' : ''));
    wrap.dataset.path = pth;
    if (t === 'check') {
      input = el('input'); input.type = 'checkbox'; input.checked = !!obj[f.k];
      if (f.cls) input.className = f.cls;
      input.onchange = function () { if (input.checked) obj[f.k] = true; else delete obj[f.k]; changed(); if (onLabel) onLabel(); };
      wrap.appendChild(input); wrap.appendChild(el('span', 'l', label));
      parent.appendChild(wrap);
      if (f.hint) parent.appendChild(el('div', 'hint', f.hint));
      return;
    }
    wrap.appendChild(el('span', 'l', label));
    if (t === 'textarea' || t === 'paragraphs') {
      input = el('textarea');
      input.value = t === 'paragraphs' ? (Array.isArray(obj[f.k]) ? obj[f.k].join('\n\n') : (obj[f.k] || '')) : (obj[f.k] || '');
      input.oninput = function () {
        if (t === 'paragraphs') obj[f.k] = input.value.split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
        else obj[f.k] = input.value;
        changed(); if (onLabel) onLabel();
      };
    } else if (t === 'select') {
      input = el('select');
      f.opts.forEach(function (o) {
        var op = el('option', null, String(o)); op.value = String(o);
        if (String(obj[f.k] === undefined ? '' : obj[f.k]) === String(o)) op.selected = true;
        input.appendChild(op);
      });
      input.onchange = function () {
        var v = input.value;
        if (v === 'true') v = true; else if (v === 'false') v = false;
        if (v === '') delete obj[f.k]; else obj[f.k] = v;
        changed(); if (onLabel) onLabel();
      };
    } else {
      input = el('input'); input.type = 'text'; input.value = obj[f.k] == null ? '' : obj[f.k];
      if (t === 'combo') {
        var dl = el('datalist'); dl.id = 'dl-' + f.k;
        f.opts.forEach(function (o) { var op = el('option'); op.value = o; dl.appendChild(op); });
        wrap.appendChild(dl); input.setAttribute('list', dl.id);
      }
      input.oninput = function () { obj[f.k] = input.value; changed(); if (onLabel) onLabel(); if (pv) showPreview(); };
    }
    wrap.appendChild(input);
    var pv = null;
    if (t === 'image') {
      var upl = el('input'); upl.type = 'file'; upl.accept = 'image/*'; upl.className = 'upload'; upl.title = 'Upload to images/ in the repository (needs a GitHub token)';
      upl.onclick = function (e) { e.stopPropagation(); };
      upl.onchange = function () {
        if (!upl.files[0]) return;
        uploadImage(upl.files[0]).then(function (path) { obj[f.k] = path; input.value = path; changed(); showPreview(); }).catch(function () {});
      };
      wrap.appendChild(upl);
      pv = el('img', 'preview');
      pv.onload = function () { pv.style.display = 'block'; };
      pv.onerror = function () { pv.style.display = 'none'; };
      wrap.appendChild(pv);
    }
    function showPreview() { if (obj[f.k]) pv.src = obj[f.k]; else pv.style.display = 'none'; }
    if (pv) showPreview();
    parent.appendChild(wrap);
    if (f.hint) parent.appendChild(el('div', 'hint', f.hint));
  }

  function renderList(wrap, obj, f, path) {
    if (!Array.isArray(obj[f.k])) obj[f.k] = [];
    var list = obj[f.k];
    path = path || f.k;
    var box = el('div');
    wrap.appendChild(box);
    var head = el('div', 'listhead');
    head.appendChild(el('span', 'l', list.length + ' entr' + (list.length === 1 ? 'y' : 'ies') + '. Newest first is the convention.'));
    var add = el('button', 'small', '+ Add'); add.type = 'button';
    add.onclick = function () { list.unshift({}); changed(); redraw(true); };
    head.appendChild(add);
    wrap.appendChild(head);

    function redraw(openFirst) {
      box.innerHTML = '';
      list.forEach(function (entry, i) {
        var d = el('details', 'entry'); d.dataset.path = path + '.' + i;
        if (openFirst && i === 0) d.open = true;
        var sum = el('summary');
        var n = el('span', 'n', String(i + 1));
        var t = el('span', 't', entry[f.label || 'title'] || '');
        var hasToggle = f.schema.some(function (sf) { return sf.k === 'hidden'; });
        var sw = null;
        if (hasToggle) {                               // show / hide switch in the header row
          sw = el('label', 'sw'); sw.title = 'Shown on the site';
          var cb = el('input'); cb.type = 'checkbox'; cb.checked = !entry.hidden;
          cb.onclick = function (e) { e.stopPropagation(); };
          cb.onchange = function () {
            if (cb.checked) delete entry.hidden; else entry.hidden = true;
            d.classList.toggle('off', !!entry.hidden);
            var inner = d.querySelector('.body .hiddencb'); if (inner) inner.checked = !!entry.hidden;
            changed();
          };
          sw.appendChild(cb); sw.appendChild(el('span', null, 'on site'));
          sw.onclick = function (e) { e.stopPropagation(); };
        }
        if (entry.hidden) d.classList.add('off');
        var up = el('button', 'small', '↑'); up.type = 'button'; up.title = 'Move up';
        var down = el('button', 'small', '↓'); down.type = 'button'; down.title = 'Move down';
        var del = el('button', 'small danger', '×'); del.type = 'button'; del.title = 'Remove';
        up.onclick = function (e) { e.preventDefault(); if (i > 0) { list.splice(i - 1, 2, list[i], list[i - 1]); changed(); redraw(); } };
        down.onclick = function (e) { e.preventDefault(); if (i < list.length - 1) { list.splice(i, 2, list[i + 1], list[i]); changed(); redraw(); } };
        del.onclick = function (e) { e.preventDefault(); if (confirm('Remove this entry?')) { list.splice(i, 1); changed(); redraw(); } };
        sum.appendChild(n); sum.appendChild(t);
        if (sw) sum.appendChild(sw);
        sum.appendChild(up); sum.appendChild(down); sum.appendChild(del);
        d.appendChild(sum);
        var body = el('div', 'body');
        f.schema.forEach(function (sf) {
          field(body, entry, sf, function () {
            t.textContent = entry[f.label || 'title'] || '';
            if (sf.k === 'hidden') {                   // keep the header switch in step with the checkbox inside
              d.classList.toggle('off', !!entry.hidden);
              if (sw) sw.querySelector('input').checked = !entry.hidden;
            }
          }, path + '.' + i);
        });
        d.appendChild(body);
        box.appendChild(d);
      });
      head.firstChild.textContent = list.length + ' entr' + (list.length === 1 ? 'y' : 'ies') + '. Newest first is the convention.';
    }
    redraw(false);
  }

  // ------------------------------------------------------------ pages of the console
  var current = 'site';
  function nav() {
    var n = $('nav'); n.innerHTML = '';
    function link(id, text, cls) {
      var a = el('a', (current === id ? 'on ' : '') + (cls || ''), text); a.href = '#';
      a.onclick = function (e) { e.preventDefault(); current = id; show(); };
      n.appendChild(a);
    }
    n.appendChild(el('div', 'group', 'Site'));
    link('site', 'Settings and bio');
    link('links', 'Links');
    link('timeline', 'Timeline');
    n.appendChild(el('div', 'group', 'Sections'));
    (S.sections || []).forEach(function (sec, i) {
      link('sec' + i, (sec.title || '(untitled)') + (sec.hidden ? ' (hidden)' : ''), sec.hidden ? 'hiddensec' : '');
    });
    var sel = el('select');
    sel.appendChild(el('option', null, '+ Add section…'));
    PRESETS.forEach(function (p) { var o = el('option', null, p[0]); o.value = p[0]; sel.appendChild(o); });
    sel.onchange = function () {
      var p = PRESETS.filter(function (x) { return x[0] === sel.value; })[0];
      if (!p) return;
      S.sections = S.sections || [];
      S.sections.push({ title: p[0] === 'Custom' ? 'New section' : p[0], type: p[1], hidden: true, items: [] });
      current = 'sec' + (S.sections.length - 1);
      changed(); show();
    };
    n.appendChild(sel);
    n.appendChild(el('div', 'group', 'Publishing'));
    link('github', 'GitHub' + (gh.token ? '' : ' (no token)'));
    link('help', 'How to publish');
  }

  function show() {
    nav();
    var f = $('form'); f.innerHTML = '';
    if (current === 'site') {
      f.appendChild(el('h2', null, 'Settings and bio'));
      SITEF.forEach(function (sf) { field(f, S, sf); });
    } else if (current === 'links') {
      f.appendChild(el('h2', null, 'Links'));
      f.appendChild(el('div', 'hint', 'Shown as text under the bio, separated by slashes: Email / GitHub / Kaggle / LinkedIn.'));
      renderList(f, S, { k: 'links', schema: ICONLINK, label: 'label' }, 'links');
    } else if (current === 'timeline') {
      f.appendChild(el('h2', null, 'Timeline'));
      f.appendChild(el('div', 'hint', 'Education and work only, newest first. Logos go in images/logos/.'));
      renderList(f, S, { k: 'timeline', schema: TIMELINE, label: 'where' }, 'timeline');
    } else if (current === 'github') {
      f.appendChild(el('h2', null, 'GitHub'));
      f.appendChild(el('div', 'hint', 'With a token here, <b>Update site</b> pushes content.js (and any missing project page folders) straight to the repository, and image fields get an Upload button. The token is kept only in this browser.'));
      var GHF = [
        { k: 'repo', l: 'Repository (owner/name)' },
        { k: 'branch', l: 'Branch' },
        { k: 'token', l: 'Fine-grained personal access token', t: 'password', hint: 'GitHub → Settings → Developer settings → Personal access tokens → Fine-grained → Generate. Repository access: only this repository. Permissions: Contents, Read and write. Paste it here.' }
      ];
      GHF.forEach(function (gf) {
        var wrap = el('label', 'f'); wrap.appendChild(el('span', 'l', gf.l));
        var input = el('input'); input.type = gf.t || 'text'; input.value = gh[gf.k] || '';
        input.oninput = function () { gh[gf.k] = input.value.trim(); ghSave(); nav(); };
        wrap.appendChild(input); f.appendChild(wrap);
        if (gf.hint) f.appendChild(el('div', 'hint', gf.hint));
      });
      var test = el('button', null, 'Test connection');
      test.onclick = function () {
        status('Testing ...');
        ghApi('GET', 'content.js').then(function (r) {
          status(r.ok ? 'Connected. content.js found in ' + gh.repo + '.' : 'GitHub said: ' + r.status + ' ' + (r.json && r.json.message || ''), !r.ok);
        }).catch(function (e) { status('Could not reach GitHub: ' + e.message, true); });
      };
      f.appendChild(test);
    } else if (current === 'help') {
      f.appendChild(el('h2', null, 'How to publish'));
      f.innerHTML += '<ol>' +
        '<li>Edit anything here. The preview on the right shows the result. Your draft stays in this browser until you publish it.</li>' +
        '<li><b>Update site</b> publishes. Without a token it copies the new content.js and opens GitHub\'s editor for the file: click in the editor, Ctrl+A, Ctrl+V, "Commit changes". With a token (GitHub panel) it pushes directly and also creates new project page folders.</li>' +
        '<li>Or by hand: <b>Download content.js</b>, replace the file in the Portfolio folder, then <code>git add -A</code>, <code>git commit -m "Update site"</code>, <code>git push</code>.</li>' +
        '<li>Images: with a token, use the Upload button next to an image field. Otherwise put the file in <code>images/</code> and type its path.</li>' +
        '<li>To take the portfolio live, set <b>Portfolio up?</b> to true in Settings and update.</li>' +
        '</ol><p class="hint">Hidden sections and hidden items are kept in content.js but not shown on the site until you switch them on.</p>';
    } else if (/^sec\d+$/.test(current)) {
      var i = +current.slice(3); var sec = S.sections[i];
      if (!sec) { current = 'site'; return show(); }
      f.appendChild(el('h2', null, sec.title || 'Section'));
      var bar = el('div', 'secbar');
      var up = el('button', 'small', '↑ Move up'); up.onclick = function () { if (i > 0) { S.sections.splice(i - 1, 2, sec, S.sections[i - 1]); current = 'sec' + (i - 1); changed(); show(); } };
      var down = el('button', 'small', '↓ Move down'); down.onclick = function () { if (i < S.sections.length - 1) { S.sections.splice(i, 2, S.sections[i + 1], sec); current = 'sec' + (i + 1); changed(); show(); } };
      var del = el('button', 'small danger', '× Remove section'); del.onclick = function () { if (confirm('Remove the section "' + sec.title + '" and everything in it?')) { S.sections.splice(i, 1); current = 'site'; changed(); show(); } };
      bar.appendChild(up); bar.appendChild(down); bar.appendChild(del);
      f.appendChild(bar);
      SECTION.forEach(function (sf) { field(f, sec, sf, function () { nav(); }, 'sections.' + i); });
    }
  }

  // ------------------------------------------------------------ jump from the preview to a field
  // The preview posts { type: 'edit', path } on a double-click; open that panel and focus the control.
  function jumpTo(path) {
    var m = path.match(/^sections\.(\d+)/);
    var target = m ? 'sec' + m[1] : /^timeline/.test(path) ? 'timeline' : /^links/.test(path) ? 'links' : 'site';
    if (current !== target) { current = target; show(); }
    var segs = path.split('.'), node = null;
    while (segs.length && !node) {
      node = document.querySelector('#form [data-path="' + segs.join('.') + '"]');
      if (!node) segs.pop();
    }
    if (!node) return;
    var d = node.closest('details');
    while (d) { d.open = true; d = d.parentElement ? d.parentElement.closest('details') : null; }
    node.scrollIntoView({ block: 'center', behavior: 'smooth' });
    var ctl = /^(INPUT|TEXTAREA|SELECT)$/.test(node.tagName) ? node : node.querySelector('input:not([type=file]), textarea, select');
    if (ctl) ctl.focus({ preventScroll: true });
    document.querySelectorAll('.flash').forEach(function (x) { x.classList.remove('flash'); });
    node.classList.add('flash');
    setTimeout(function () { node.classList.remove('flash'); }, 1800);
  }
  window.addEventListener('message', function (ev) {
    if (ev.data && ev.data.type === 'edit' && ev.data.path) jumpTo(String(ev.data.path));
  });

  // ------------------------------------------------------------ GitHub: publish from the console
  var GH_KEY = 'portfolio-github';
  var gh = { repo: 'harshakalluri1403/harshakalluri1403.github.io', branch: 'main', token: '' };
  try { var g0 = JSON.parse(localStorage.getItem(GH_KEY) || 'null'); if (g0) { for (var gk in g0) gh[gk] = g0[gk]; } } catch (e) {}
  function ghSave() { try { localStorage.setItem(GH_KEY, JSON.stringify(gh)); } catch (e) {} }
  function status(text, bad) { $('status').textContent = text; $('status').className = 'status' + (bad ? ' dirty' : ''); }
  function ghApi(method, path, body) {
    var url = 'https://api.github.com/repos/' + gh.repo + '/contents/' + path + (method === 'GET' ? '?ref=' + encodeURIComponent(gh.branch) : '');
    return fetch(url, {
      method: method,
      headers: { 'Authorization': 'Bearer ' + gh.token, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, json: j }; }); });
  }
  function b64(str) { return btoa(unescape(encodeURIComponent(str))); }
  // Create or update one file; `content` is text, or base64 when isB64 is true.
  function putFile(path, content, message, isB64) {
    return ghApi('GET', path).then(function (r) {
      var body = { message: message, content: isB64 ? content : b64(content), branch: gh.branch };
      if (r.ok && r.json.sha) body.sha = r.json.sha;
      return ghApi('PUT', path, body);
    });
  }
  var PAGE_TEMPLATE = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Project</title>\n<link rel="icon" href="../favicon.ico" sizes="any">\n<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&display=swap">\n<link rel="stylesheet" href="../site.css">\n</head>\n<body>\n<!-- Project page, created by console.html. It fills itself from content.js using the folder name. -->\n<main id="app" class="proj"></main>\n<script>window.SITE_BASE = \'../\';</script>\n<script src="../content.js"></script>\n<script src="../project.js"></script>\n</body>\n</html>\n';
  // Without a token: copy the new content.js and open GitHub's own editor for the file,
  // where pasting and clicking "Commit changes" publishes it. No setup needed.
  function updateViaGitHubEditor() {
    var url = 'https://github.com/' + gh.repo + '/edit/' + gh.branch + '/content.js';
    var text = fileText();
    var done = function () {
      window.open(url, '_blank');
      status('Copied the new content.js. In the GitHub tab that opened: click inside the editor, press Ctrl+A then Ctrl+V, then "Commit changes". The site updates within a minute.');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { $('download').click(); done(); });
    else { $('download').click(); done(); }
  }
  function updateSite() {
    if (!gh.token) { updateViaGitHubEditor(); return; }
    var btn = $('update'); btn.disabled = true;
    status('Pushing content.js to ' + gh.repo + ' ...');
    putFile('content.js', fileText(), 'Update site from console').then(function (r) {
      if (!r.ok) throw new Error(r.status + ' ' + (r.json.message || '') + (r.status === 404 ? ' (does the repository exist, and does the token have Contents: write on it?)' : ''));
      var slugs = [];
      (S.sections || []).forEach(function (sec) { (sec.items || []).forEach(function (it) { if (it.slug && it.page) slugs.push(it.slug); }); });
      return slugs.reduce(function (p, slug) {
        return p.then(function (made) {
          return ghApi('GET', slug + '/index.html').then(function (r) {
            if (r.ok) return made;
            return ghApi('PUT', slug + '/index.html', { message: 'Add project page ' + slug, content: b64(PAGE_TEMPLATE), branch: gh.branch })
              .then(function (r2) { if (r2.ok) made.push(slug); return made; });
          });
        });
      }, Promise.resolve([]));
    }).then(function (made) {
      try { localStorage.setItem(KEY, JSON.stringify(S)); localStorage.setItem(KEY + '-pushed', hashOf(S)); } catch (e) {}
      status('Updated. The live site changes within about a minute.' + (made.length ? ' New page folders: ' + made.join(', ') + '.' : ''));
    }).catch(function (e) { status('Update failed: ' + e.message, true); })
      .then(function () { btn.disabled = false; });
  }
  $('update').onclick = updateSite;
  // The on/off switch in the bar: on = live. Publishes at once when a token is set.
  var sw = $('livesw');
  function syncSwitch() { sw.checked = S.live !== false; }
  sw.onchange = function () {
    S.live = sw.checked;
    changed();
    if (current === 'site') show();
    if (gh.token) { setTimeout(updateSite, 600); }
    else status(sw.checked ? 'Set to live in the draft. Click Update site to publish it.' : 'Set to off in the draft. Click Update site to publish it.', true);
  };
  syncSwitch();
  var _show = show; show = function () { _show(); syncSwitch(); };
  // Upload an image file to images/<name> in the repository and return its path.
  function uploadImage(file) {
    if (!gh.token) { alert('Add a GitHub token in the GitHub panel to upload. Otherwise put the file in images/ and type its path.'); return Promise.reject(new Error('no token')); }
    if (file.size > 20 * 1024 * 1024) { alert('That file is over 20 MB. Please make it smaller first.'); return Promise.reject(new Error('too big')); }
    var name = file.name.replace(/[^\w.\-]+/g, '-').toLowerCase();
    return new Promise(function (res, rej) {
      var rd = new FileReader();
      rd.onload = function () {
        var data = String(rd.result).split(',')[1];
        status('Uploading ' + name + ' ...');
        putFile('images/' + name, data, 'Add image ' + name, true).then(function (r) {
          if (!r.ok) { status('Upload failed: ' + r.status + ' ' + (r.json.message || ''), true); rej(new Error('upload failed')); }
          else { status('Uploaded images/' + name + '. It appears in the preview once the site has rebuilt.'); res('images/' + name); }
        });
      };
      rd.readAsDataURL(file);
    });
  }

  // ------------------------------------------------------------ export, import, discard
  function fileText() {
    return '// content.js, written by console.html on ' + new Date().toISOString().slice(0, 10) + '.\n' +
      '// Edit it in console.html (open it in a browser) or by hand. The site rebuilds from it on every load.\n' +
      'window.SITE = ' + JSON.stringify(S, null, 2) + ';\n';
  }
  $('download').onclick = function () {
    var blob = new Blob([fileText()], { type: 'text/javascript' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'content.js';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    $('status').textContent = 'Downloaded. Replace content.js in the Portfolio folder with it, then push.';
    $('status').className = 'status';
  };
  $('copy').onclick = function () {
    navigator.clipboard.writeText(fileText()).then(function () { $('status').textContent = 'Copied content.js to the clipboard.'; });
  };
  $('discard').onclick = function () {
    if (!confirm('Discard the draft and reload the content.js on disk?')) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  };
  $('importfile').onchange = function () {
    var file = this.files[0]; if (!file) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var w = {}; new Function('window', r.result)(w);
        if (!w.SITE) throw new Error('no window.SITE');
        S = w.SITE; changed(); current = 'site'; show();
        $('status').textContent = 'Imported ' + file.name + ' as the draft.';
      } catch (e) { alert('Could not read that file as content.js: ' + e.message); }
    };
    r.readAsText(file);
  };

  if (propagating) {
    $('status').textContent = 'Your last update is published. GitHub is still refreshing the site, which can take a few minutes; showing what you published.';
    $('status').className = 'status';
  } else if (dirty) {
    $('status').textContent = staleDraft
      ? 'Resumed an older draft, but content.js on disk has changed since it was saved. Click Discard draft to load the file, or keep editing the draft.'
      : 'Resumed a draft saved in this browser. Discard it to go back to content.js on disk.';
    $('status').className = 'status dirty';
  }
  show();
})();
