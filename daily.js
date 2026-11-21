// Daily Challenge: 6 Pokémon a day (one per stat). Guess each stat; score = average accuracy out of 100.
// Everyone gets the same puzzle for a given local calendar date (seeded from the date, no server needed).
// Requires data.js and pokecore.js.
(function () {
  'use strict';
  var $ = PokeCore.$, POOL = PokeCore.POOL, STATS = PokeCore.STAT_NAMES;
  var BAR_IDS = ['HealthBar', 'AttackBar', 'DefenseBar', 'SpecialAttackBar', 'SDFBar', 'SPDBar'];
  var LAUNCH = Date.UTC(2026, 10, 17); // puzzle #1 (month is 0-based)
  var SAVE_KEY = 'pokeDaily', HIST_KEY = 'pokeDailyHistory';
  var MAX_GUESS = 300;
  var SHORT = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];

  // ---- Seeded randomness ---------------------------------------------------
  function hash(str) { // xmur3
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
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

  // ---- Dates ---------------------------------------------------------------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function dayNumber(key) {
    var p = key.split('-');
    return Math.round((Date.UTC(+p[0], +p[1] - 1, +p[2]) - LAUNCH) / 86400000) + 1;
  }
  function previousKey(key) {
    var p = key.split('-');
    return dateKey(new Date(+p[0], +p[1] - 1, +p[2] - 1));
  }

  // ---- Puzzle & scoring ----------------------------------------------------
  function makePuzzle(key) {
    var rand = mulberry32(hash('pokestat-daily-' + key));
    var picks = [];
    while (picks.length < 6) {
      var i = Math.floor(rand() * POOL.length);
      if (picks.indexOf(i) === -1) picks.push(i);
    }
    return picks.map(function (i) { return POOL[i]; }); // index n is asked about stat n
  }

  // 100% for an exact guess, dropping linearly to 0% when you are off by the stat's whole value.
  function accuracy(guess, actual) {
    var k = 15; // prevents low stats from blowing up the error ratio
    var error = Math.abs(guess - actual) / (actual + k);
    return Math.max(0, 1 - error) * 100;
  }
  function average(list) { return list.reduce(function (a, b) { return a + b; }, 0) / list.length; }
  function tier(pct) { return pct >= 90 ? '🟩' : pct >= 70 ? '🟨' : pct >= 40 ? '🟧' : '🟥'; }
  function tierClass(pct) { return pct >= 90 ? 't-great' : pct >= 70 ? 't-good' : pct >= 40 ? 't-meh' : 't-bad'; }

  // ---- Storage (best effort: the game still works if it is blocked) --------
  function load(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ } }

  // ---- State ---------------------------------------------------------------
  var today = dateKey();
  var puzzle = makePuzzle(today);
  var guesses = [];
  var saved = load(SAVE_KEY);
  if (saved && saved.date === today && Array.isArray(saved.guesses)) {
    guesses = saved.guesses.filter(function (g) { return typeof g === 'number'; }).slice(0, 6);
  }
  var revealed = false; // a round was just answered and the result is on screen

  function accuracies() { return guesses.map(function (g, i) { return accuracy(g, puzzle[i].stats[i]); }); }
  function finalScore() { return Math.round(average(accuracies())); }
  function persist() { save(SAVE_KEY, { date: today, guesses: guesses }); }

  // ---- Rendering -----------------------------------------------------------
  function renderDots() {
    var box = $('dots'), accs = accuracies();
    box.textContent = '';
    for (var i = 0; i < 6; i++) {
      var d = document.createElement('span');
      d.className = 'dot';
      if (i < guesses.length) d.className += ' done ' + tierClass(accs[i]);
      else if (i === guesses.length && guesses.length < 6) d.className += ' current';
      d.title = STATS[i];
      d.textContent = i < guesses.length ? Math.round(accs[i]) : SHORT[i];
      box.appendChild(d);
    }
  }

  function showRound() {
    var i = guesses.length;
    revealed = false;
    $('final').hidden = true;
    $('play').hidden = false;
    $('reveal').hidden = true;
    $('ask').hidden = false;
    $('message').hidden = false;
    $('round').textContent = 'Round ' + (i + 1) + ' of 6';
    $('Question').textContent = 'What is ' + puzzle[i].name + "'s base " + STATS[i] + '?';
    $('message').textContent = ' ';
    var input = $('guessInput');
    input.value = '';
    input.focus();
    renderDots();
  }

  function setMarker(el, value) { el.style.left = Math.min(100, value / 255 * 100) + '%'; }

  function showReveal(i) {
    var actual = puzzle[i].stats[i], guess = guesses[i], pct = accuracy(guess, actual);
    $('ask').hidden = true;
    $('message').hidden = true;
    $('reveal').hidden = false;
    $('round').textContent = 'Round ' + (i + 1) + ' of 6';
    $('revealText').textContent = puzzle[i].name + "'s " + STATS[i] + ' is ' + actual + '.';
    $('revealGuess').textContent = 'You guessed ' + guess + ' — you scored ' + Math.round(pct);
    $('revealGuess').className = tierClass(pct);
    var bar = $('revealBar');
    bar.className = BAR_IDS[i];
    bar.style.setProperty('--pct', Math.min(100, actual / 255 * 100) + '%');
    bar.style.width = (actual * 50 / 200) + '%';
    setMarker($('guessMarker'), guess);
    $('nextBtn').textContent = i === 5 ? 'See my score' : 'Next Pokémon';
    $('nextBtn').focus();
    revealed = true;
    renderDots();
  }

  function histStats(history) {
    var keys = Object.keys(history).sort(), scores = keys.map(function (k) { return history[k]; });
    var streak = 0, k = history[today] !== undefined ? today : previousKey(today);
    while (history[k] !== undefined) { streak++; k = previousKey(k); }
    return {
      played: keys.length,
      avg: keys.length ? Math.round(average(scores)) : 0,
      best: keys.length ? Math.max.apply(null, scores) : 0,
      streak: streak
    };
  }

  function shareText() {
    return 'Pokémon Stat Daily #' + dayNumber(today) + ' (' + today + ')\n' +
      finalScore() + '/100  ' + accuracies().map(tier).join('') + '\n' + location.href.split('?')[0].replace(/[^/]*$/, 'daily.html');
  }

  function showFinal() {
    $('play').hidden = true;
    $('final').hidden = false;
    renderDots();
    var score = finalScore(), accs = accuracies();
    $('score').textContent = score;

    var history = load(HIST_KEY) || {};
    if (history[today] === undefined) { history[today] = score; save(HIST_KEY, history); }
    var h = histStats(history);
    $('statPlayed').textContent = h.played;
    $('statAvg').textContent = h.avg;
    $('statBest').textContent = h.best;
    $('statStreak').textContent = h.streak;

    var body = $('breakdown');
    body.textContent = '';
    puzzle.forEach(function (p, i) {
      var tr = document.createElement('tr');
      [STATS[i], p.name, String(p.stats[i]), String(guesses[i]), Math.round(accs[i]) + '%'].forEach(function (text, c) {
        var td = document.createElement(c === 0 ? 'th' : 'td');
        td.textContent = text;
        if (c === 0) td.scope = 'row';
        if (c === 4) td.className = tierClass(accs[i]);
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
    $('shareText').textContent = shareText();
    tick();
  }

  // ---- Countdown to the next puzzle (and reload when the date rolls over) --
  var timer = null;
  function tick() {
    if (dateKey() !== today) { location.reload(); return; }
    var now = new Date(), next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var s = Math.max(0, Math.floor((next - now) / 1000));
    $('countdown').textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60);
    if (!timer) timer = setInterval(tick, 1000);
  }

  // ---- Actions -------------------------------------------------------------
  function submit() {
    if (guesses.length >= 6 || revealed) return;
    var raw = $('guessInput').value.trim(), g = parseInt(raw, 10);
    if (raw === '' || isNaN(g) || g < 0 || g > MAX_GUESS) {
      $('message').textContent = 'Enter a number between 0 and ' + MAX_GUESS + '.';
      return;
    }
    guesses.push(g);
    persist();
    showReveal(guesses.length - 1);
  }

  function next() {
    if (guesses.length >= 6) showFinal(); else showRound();
  }

  function copyShare() {
    var text = shareText(), btn = $('shareBtn');
    function done(ok) { btn.textContent = ok ? 'Copied!' : 'Copy failed — select the text below'; setTimeout(function () { btn.textContent = 'Copy result'; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    else done(false);
  }

  $('submitBtn').addEventListener('click', submit);
  $('guessInput').addEventListener('keydown', function (e) {
    // preventDefault: submit() moves focus to the Next button, and the same Enter keypress would otherwise click it
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
  });
  $('nextBtn').addEventListener('click', next);
  $('shareBtn').addEventListener('click', copyShare);

  $('dayLabel').textContent = 'Daily Challenge #' + dayNumber(today) + ' · ' + today;
  if (guesses.length >= 6) showFinal();
  else if (guesses.length > 0) showRound(); // resume where they left off
  else showRound();

  window.DailyGame = { _puzzle: function () { return puzzle; }, _guesses: function () { return guesses.slice(); },
    makePuzzle: makePuzzle, accuracy: accuracy, dateKey: dateKey, dayNumber: dayNumber };
})();
