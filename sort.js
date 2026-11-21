// Daily Sort: 10 Pokémon and one stat a day; drag them into order. Everyone gets the same puzzle for a given local date.
// Requires data.js and pokecore.js.
(function () {
  'use strict';
  var $ = PokeCore.$, POOL = PokeCore.POOL, STATS = PokeCore.STAT_NAMES;
  var LAUNCH = Date.UTC(2026, 10, 19); // puzzle #1
  var SAVE_KEY = 'pokeSort', HIST_KEY = 'pokeSortHistory';
  var N = 10, MAX_TRIES = 5, ROW = 54; // ROW = row pitch in px (must match .sort-item height + gap in CSS)

  // ---- Seeded randomness (same as the other daily game) --------------------
  function hash(str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^ (h >>> 16)) >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function dayNumber(key) { var p = key.split('-'); return Math.round((Date.UTC(+p[0], +p[1] - 1, +p[2]) - LAUNCH) / 86400000) + 1; }
  function previousKey(key) { var p = key.split('-'); return dateKey(new Date(+p[0], +p[1] - 1, +p[2] - 1)); }

  // ---- Puzzle --------------------------------------------------------------
  // One stat (HP..Speed) and a direction; 10 Pokémon with ten different values so the order is never ambiguous.
  function makePuzzle(key) {
    var rand = mulberry32(hash('pokesort-daily-' + key));
    var stat = Math.floor(rand() * 6), highFirst = rand() < 0.5;
    var picks = [], used = {};
    var guard = 0;
    while (picks.length < N && guard++ < 10000) {
      var p = POOL[Math.floor(rand() * POOL.length)], v = p.stats[stat];
      if (used[v] || picks.indexOf(p) !== -1) continue;
      used[v] = true; picks.push(p);
    }
    var solution = picks.slice().sort(function (a, b) { return highFirst ? b.stats[stat] - a.stats[stat] : a.stats[stat] - b.stats[stat]; });
    // starting order: a seeded shuffle that is never already solved
    var start;
    do {
      start = picks.slice();
      for (var i = start.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)); var t = start[i]; start[i] = start[j]; start[j] = t; }
    } while (start.every(function (p, i) { return p === solution[i]; }));
    return { stat: stat, highFirst: highFirst, solution: solution, start: start };
  }

  // ---- Scoring -------------------------------------------------------------
  // 5 points per Pokémon in the right spot on the last try (max 50), plus a bonus for solving: 50, 42, 34, 26, 18 by try.
  function score(correct, solved, tries) { return correct * 5 + (solved ? 50 - 8 * (tries - 1) : 0); }

  function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  function average(l) { return l.reduce(function (a, b) { return a + b; }, 0) / l.length; }

  // ---- State ---------------------------------------------------------------
  var today = dateKey(), puz = makePuzzle(today);
  var order = puz.start.slice();        // what's on screen right now
  var history = [];                     // per try: array of 10 booleans (right spot?)
  var done = false, items = [];
  var saved = load(SAVE_KEY);
  if (saved && saved.date === today && Array.isArray(saved.tries)) {
    var byName = {}; POOL.forEach(function (p) { byName[p.name] = p; });
    var restored = (saved.order || []).map(function (n) { return byName[n]; });
    if (restored.length === N && restored.every(Boolean)) order = restored;
    history = saved.tries.map(function (t) {
      if (Array.isArray(t)) return { ok: t, order: null }; // older save format
      return t && Array.isArray(t.ok) ? { ok: t.ok, order: Array.isArray(t.order) ? t.order : null } : null;
    }).filter(Boolean).slice(0, MAX_TRIES);
  }
  function persist() { save(SAVE_KEY, { date: today, order: order.map(function (p) { return p.name; }), tries: history }); }
  function correctMap(ord) { return ord.map(function (p, i) { return p === puz.solution[i]; }); }
  function lastCorrect() { return history.length ? history[history.length - 1].ok : null; }
  // A Pokémon that was in the right spot on the last submit is locked there for good.
  function isLocked(i) { var c = lastCorrect(); return !!c && c[i] && order[i] === puz.solution[i]; }
  function freeSlots() { var s = []; for (var i = 0; i < N; i++) if (!isLocked(i)) s.push(i); return s; }
  // Spots each Pokémon has already been wrongly submitted in (1-based), from every earlier try.
  function ruledOut(p) {
    var out = [];
    history.forEach(function (t) {
      if (!t.order) return;
      var i = t.order.indexOf(p.name);
      if (i !== -1 && !t.ok[i] && out.indexOf(i + 1) === -1) out.push(i + 1);
    });
    return out.sort(function (a, b) { return a - b; });
  }
  function isSolved() { var l = lastCorrect(); return !!l && l.every(Boolean); }

  // ---- Rendering -----------------------------------------------------------
  var list = $('sortList');
  function build() {
    list.textContent = '';
    items = {};
    order.forEach(function (p) {
      var li = document.createElement('li');
      li.className = 'sort-item'; li.setAttribute('data-name', p.name);
      var grip = document.createElement('span'); grip.className = 'grip'; grip.textContent = '⠿'; grip.setAttribute('aria-hidden', 'true');
      var rank = document.createElement('span'); rank.className = 'rank';
      var name = document.createElement('span'); name.className = 'sort-name'; name.textContent = p.name;
      var tried = document.createElement('span'); tried.className = 'tried';
      var val = document.createElement('span'); val.className = 'sort-val'; val.hidden = true;
      var btns = document.createElement('span'); btns.className = 'sort-btns';
      var up = document.createElement('button'); up.type = 'button'; up.textContent = '▲'; up.setAttribute('aria-label', 'Move ' + p.name + ' up');
      var dn = document.createElement('button'); dn.type = 'button'; dn.textContent = '▼'; dn.setAttribute('aria-label', 'Move ' + p.name + ' down');
      up.addEventListener('click', function () { move(p, -1); });
      dn.addEventListener('click', function () { move(p, 1); });
      btns.appendChild(up); btns.appendChild(dn);
      [grip, rank, name, tried, val, btns].forEach(function (e) { li.appendChild(e); });
      li.addEventListener('pointerdown', function (e) { startDrag(e, p, li); });
      list.appendChild(li);
      items[p.name] = li;
    });
    list.style.height = (N * ROW - 6) + 'px';
  }
  function layout(skip) {
    order.forEach(function (p, i) {
      var li = items[p.name];
      li.style.top = (i * ROW) + 'px';
      li.querySelector('.rank').textContent = i + 1;
      if (p !== skip) li.style.transform = '';
    });
  }
  function colour() {
    var c = history.length ? lastCorrect() : null;
    order.forEach(function (p, i) {
      var li = items[p.name], locked = done || isLocked(i);
      li.classList.remove('right', 'wrong');
      if (locked) li.classList.add('right');
      else if (c && submittedKey === orderKey()) li.classList.add('wrong');
      li.classList.toggle('locked', locked);
      li.querySelector('.sort-btns').hidden = locked;
      li.querySelector('.grip').textContent = locked ? '🔒' : '⠿';
      var t = li.querySelector('.tried'), r = done ? [] : ruledOut(p);
      t.textContent = '';
      if (r.length && !locked) {
        t.appendChild(document.createTextNode('not '));
        r.forEach(function (n) {
          var chip = document.createElement('span');
          chip.className = 'tried-chip' + (n === i + 1 ? ' repeat' : '');
          chip.textContent = n;
          chip.title = n === i + 1 ? 'You already tried this spot' : 'Tried spot ' + n;
          t.appendChild(chip);
        });
      }
    });
  }
  var submittedKey = '';
  function orderKey() { return order.map(function (p) { return p.name; }).join('|'); }
  function render() {
    layout(); colour();
    $('attempts').textContent = done ? '' : 'Try ' + (history.length + 1) + ' of ' + MAX_TRIES;
    $('submitBtn').disabled = done;
  }

  // ---- Moving --------------------------------------------------------------
  // Reorder only the unlocked Pokémon; locked ones keep their slots.
  function placeFree(freeItems, slots) { freeItems.forEach(function (p, k) { order[slots[k]] = p; }); }
  function move(p, delta) {
    if (done) return;
    var slots = freeSlots(), free = slots.map(function (s) { return order[s]; });
    var k = free.indexOf(p), k2 = k + delta;
    if (k === -1 || k2 < 0 || k2 >= free.length) return;
    free.splice(k, 1); free.splice(k2, 0, p);
    placeFree(free, slots);
    afterMove(); render();
    var btn = items[p.name].querySelectorAll('button')[delta < 0 ? 0 : 1]; if (btn) btn.focus();
  }
  function afterMove() { persist(); $('message').textContent = ' '; }

  var drag = null;
  function startDrag(e, p, li) {
    if (done || isLocked(order.indexOf(p)) || e.target.closest('button') || (e.button !== undefined && e.button !== 0)) return;
    var rect = list.getBoundingClientRect();
    drag = { p: p, li: li, startY: e.clientY, startTop: order.indexOf(p) * ROW, rectTop: rect.top, moved: false, id: e.pointerId };
    try { li.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
    li.classList.add('dragging');
    e.preventDefault();
  }
  document.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var y = drag.startTop + (e.clientY - drag.startY);
    y = Math.max(0, Math.min((N - 1) * ROW, y));
    if (Math.abs(e.clientY - drag.startY) > 3) drag.moved = true;
    drag.li.style.top = y + 'px';
    var slots = freeSlots(), free = slots.map(function (s) { return order[s]; });
    var cur = free.indexOf(drag.p), best = 0;
    slots.forEach(function (s, k) { if (Math.abs(s * ROW - y) < Math.abs(slots[best] * ROW - y)) best = k; });
    if (best !== cur) { free.splice(cur, 1); free.splice(best, 0, drag.p); placeFree(free, slots); layout(drag.p); drag.li.style.top = y + 'px'; }
  });
  function endDrag() {
    if (!drag) return;
    var d = drag; drag = null;
    d.li.classList.remove('dragging');
    if (d.moved) afterMove();
    render();
  }
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);

  // ---- Submit / finish -----------------------------------------------------
  function submit() {
    if (done) return;
    var prev = history.length ? history[history.length - 1].order : null;
    if (prev && prev.join('|') === orderKey()) { $('message').textContent = 'Move something first — that exact order was already tried.'; return; }
    var c = correctMap(order);
    history.push({ ok: c, order: order.map(function (p) { return p.name; }) });
    submittedKey = orderKey();
    persist();
    var n = c.filter(Boolean).length;
    if (n === N || history.length >= MAX_TRIES) { finish(); return; }
    $('message').textContent = n + ' of ' + N + ' in the right spot. Keep going!';
    render();
  }
  function finalScore() { var c = lastCorrect(); return score(c.filter(Boolean).length, c.every(Boolean), history.length); }
  function shareText() {
    var rows = history.map(function (t) { return t.ok.map(function (x) { return x ? '🟩' : '⬛'; }).join(''); }).join('\n');
    return 'Pokémon Daily Sort #' + dayNumber(today) + ' (' + STATS[puz.stat] + ')\n' + finalScore() + '/100  ' + history.length + '/' + MAX_TRIES + '\n' + rows + '\n' +
      location.href.split('?')[0].replace(/[^/]*$/, 'sort.html');
  }
  function finish() {
    done = true;
    // reveal the true order and the values
    order = puz.solution.slice();
    submittedKey = orderKey();
    Array.prototype.forEach.call(list.querySelectorAll('.sort-val'), function (v) { v.hidden = false; });
    order.forEach(function (p) { items[p.name].querySelector('.sort-val').textContent = p.stats[puz.stat]; });
    // keep the colours of the player's last submitted try on the revealed order? show everything as the answer key instead
    persist();
    render();
    order.forEach(function (p) { items[p.name].classList.remove('wrong'); items[p.name].classList.add('right'); });
    $('play').querySelector('.controls').hidden = true;
    $('message').textContent = ' ';
    $('final').hidden = false;
    var s = finalScore(), solved = isSolved();
    $('score').textContent = s;
    $('verdict').textContent = solved ? 'Solved in ' + history.length + (history.length === 1 ? ' try!' : ' tries!') : 'Not quite — the correct order is shown above.';
    var h = load(HIST_KEY) || {};
    if (h[today] === undefined) { h[today] = s; save(HIST_KEY, h); }
    var keys = Object.keys(h).sort(), scores = keys.map(function (k) { return h[k]; });
    var streak = 0, k = h[today] !== undefined ? today : previousKey(today);
    while (h[k] !== undefined) { streak++; k = previousKey(k); }
    $('statPlayed').textContent = keys.length;
    $('statAvg').textContent = Math.round(average(scores));
    $('statBest').textContent = Math.max.apply(null, scores);
    $('statStreak').textContent = streak;
    $('shareText').textContent = shareText();
    tick();
  }

  var timer = null;
  function tick() {
    if (dateKey() !== today) { location.reload(); return; }
    var now = new Date(), next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var s = Math.max(0, Math.floor((next - now) / 1000));
    $('countdown').textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60);
    if (!timer) timer = setInterval(tick, 1000);
  }
  function copyShare() {
    var btn = $('shareBtn');
    function d(ok) { btn.textContent = ok ? 'Copied!' : 'Copy failed — select the text below'; setTimeout(function () { btn.textContent = 'Copy result'; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(shareText()).then(function () { d(true); }, function () { d(false); });
    else d(false);
  }

  // ---- Start ---------------------------------------------------------------
  $('dayLabel').textContent = 'Daily Sort #' + dayNumber(today) + ' · ' + today;
  $('lede').textContent = 'Ten Pokémon, one stat: put them in order by base ' + STATS[puz.stat] + '. Everyone gets the same ten today.';
  $('topEnd').textContent = puz.highFirst ? '▲ Highest ' + STATS[puz.stat] + ' at the top' : '▲ Lowest ' + STATS[puz.stat] + ' at the top';
  $('bottomEnd').textContent = puz.highFirst ? '▼ Lowest at the bottom' : '▼ Highest at the bottom';
  build();
  $('submitBtn').addEventListener('click', submit);
  $('shareBtn').addEventListener('click', copyShare);
  if (history.length && (isSolved() || history.length >= MAX_TRIES)) { done = true; finish(); }
  else { if (history.length) submittedKey = orderKey(); render(); }

  window.DailySort = { makePuzzle: makePuzzle, score: score, dateKey: dateKey, _puz: function () { return puz; },
    _order: function () { return order.map(function (p) { return p.name; }); }, _history: function () { return history; } };
})();
