// Guess the Pokémon by its stats — game logic.
// Requires data.js (POKEMON_DATA) to be loaded first.
(function () {
  'use strict';

  var STAT_ROWS = [
    { id: 'Health', bar: 'HealthBar', label: 'HP', row: 'row-hp' },
    { id: 'Attack', bar: 'AttackBar', label: 'Attack', row: 'row-atk' },
    { id: 'Defense', bar: 'DefenseBar', label: 'Defense', row: 'row-def' },
    { id: 'SpecialAttack', bar: 'SpecialAttackBar', label: 'Special Attack', row: 'row-spa' },
    { id: 'SpecialDefense', bar: 'SDFBar', label: 'Special Defense', row: 'row-spd' },
    { id: 'Speed', bar: 'SPDBar', label: 'Speed', row: 'row-spe' }
  ];

  // ---- Pool ---------------------------------------------------------------
  var POOL = POKEMON_DATA.map(function (r) {
    var stats = r.slice(2, 8);
    return {
      name: r[0],
      gen: r[1],
      stats: stats,
      total: stats.reduce(function (a, b) { return a + b; }, 0),
      isForm: r[8] === 1
    };
  });

  // ---- Name matching ------------------------------------------------------
  var FORM_WORDS = { alola: 'alolan', galar: 'galarian', hisui: 'hisuian', paldea: 'paldean' };

  function clean(s) {
    return String(s)
      .replace(/♀/g, ' f ')
      .replace(/♂/g, ' m ')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase();
  }
  // "mrmime" style key: letters and digits only
  function flatKey(s) { return clean(s).replace(/[^a-z0-9]/g, ''); }
  // order-independent key so "Charizard Mega X" matches "Mega Charizard X"
  function tokenKey(s) {
    return clean(s).split(/[^a-z0-9]+/).filter(Boolean).map(function (t) {
      return FORM_WORDS[t] || t;
    }).sort().join(' ');
  }

  var BY_FLAT = {}, BY_TOKEN = {};
  POOL.forEach(function (p, i) {
    p.flat = flatKey(p.name);
    p.token = tokenKey(p.name);
    BY_FLAT[p.flat] = i;
    BY_TOKEN[p.token] = i;
  });

  // Extra spellings: [typed text, canonical name(s)]
  var ALIASES = {
    'nidoran': ['Nidoran♀', 'Nidoran♂'],
    'nidoranf': ['Nidoran♀'], 'nidoranm': ['Nidoran♂'],
    'crocolar': ['Crocalor'],
    'paldean tauros combat breed': ['Paldean Tauros'],
    'paldean tauros blaze breed': ['Paldean Tauros'],
    'paldean tauros aqua breed': ['Paldean Tauros']
  };

  function findMatches(typed) {
    var f = flatKey(typed), t = tokenKey(typed);
    var hit = [];
    if (BY_FLAT[f] !== undefined) hit.push(BY_FLAT[f]);
    else if (BY_TOKEN[t] !== undefined) hit.push(BY_TOKEN[t]);
    else if (ALIASES[f] || ALIASES[typed.trim().toLowerCase()]) {
      (ALIASES[f] || ALIASES[typed.trim().toLowerCase()]).forEach(function (n) {
        var i = BY_FLAT[flatKey(n)];
        if (i !== undefined) hit.push(i);
      });
    }
    return hit;
  }

  // ---- State --------------------------------------------------------------
  var answer = -1, guesses = 0, hintLen = 0, over = true, guessed = [];

  function $(id) { return document.getElementById(id); }
  function sameStats(a, b) {
    for (var i = 0; i < 6; i++) if (a.stats[i] !== b.stats[i]) return false;
    return true;
  }
  function setText(id, text) { $(id).textContent = text; }

  function currentPool() {
    var gen = $('Generations').value;
    var strong = $('goodness').checked;
    var forms = $('forms') ? $('forms').checked : true;
    return POOL.filter(function (p) {
      return (gen === 'all' || p.gen === parseInt(gen, 10)) &&
        (!strong || p.total >= 450) &&
        (forms || !p.isForm);
    });
  }

  function renderGuesses() {
    var box = $('GuessList');
    box.textContent = '';
    guessed.forEach(function (g) {
      var span = document.createElement('span');
      span.className = 'chip ' + g.cls;
      span.textContent = g.name;
      box.appendChild(span);
      box.appendChild(document.createTextNode(' '));
    });
  }

  function renderStats(p) {
    var values = p ? p.stats : null;
    STAT_ROWS.forEach(function (s, i) {
      var v = values ? values[i] : '';
      var bar = $(s.bar);
      bar.style.visibility = p ? 'visible' : 'hidden';
      bar.style.width = p ? (v * 50 / 200) + '%' : ''; // classic scale
      bar.style.setProperty('--pct', p ? (v / 255 * 100) + '%' : '0%'); // modern scale
      setText(s.id, p ? s.label + ': ' + v : ' ');
      $(s.row).setAttribute('data-value', p ? v : '–');
    });
    setText('Total', p ? 'Total: ' + p.total : ' ');
    $('game').classList.toggle('playing', !!p);
  }

  function newGame() {
    var pool = currentPool();
    if (!pool.length) { setText('message', 'No Pokémon match those filters.'); return; }
    var p = pool[Math.floor(Math.random() * pool.length)];
    answer = POOL.indexOf(p);
    guesses = 0; hintLen = 0; over = false; guessed = [];
    renderStats(p);
    setText('message', ' ');
    setText('Hinted', ' ');
    setText('Answered', ' ');
    setText('GuessNumber', ' ');
    $('message').className = '';
    renderGuesses();
    $('answer').focus();
  }

  function feedback(text, kind) {
    var m = $('message');
    m.textContent = text;
    m.className = kind || '';
  }

  function guess(typed) {
    typed = (typed || '').trim();
    if (!typed) return;
    if (answer < 0) { feedback('Hit New Game to start!', 'info'); return; }
    if (over) { feedback('Round finished — hit New Game to play again.', 'info'); return; }

    var hits = findMatches(typed);
    $('answer').value = '';
    if (!hits.length) { feedback('Try Again...Check your spelling', 'bad'); return; }

    guesses++;
    setText('GuessNumber', 'Number of Guesses: ' + guesses);

    var target = POOL[answer];
    // exact name, or any Pokémon sharing the exact same stat line
    var win = hits.filter(function (i) { return i === answer || sameStats(POOL[i], target); })[0];
    if (win !== undefined) {
      over = true;
      guessed.push({ name: POOL[win].name, cls: 'good' });
      renderGuesses();
      if (win === answer || hits.indexOf(answer) !== -1) {
        feedback('Correct! The Pokemon was ' + target.name + '!', 'good');
      } else {
        feedback('Correct! The intended Pokemon was ' + target.name + ', but ' + POOL[win].name + ' also has the same stats!', 'good');
      }
      return;
    }

    var g = POOL[hits[0]];
    guessed.push({ name: g.name, cls: 'bad' });
    renderGuesses();
    if (g.gen === target.gen) feedback('Try Again...Same Generation', 'bad');
    else if (g.gen > target.gen) feedback('Try Again...Its from an older Generation', 'bad');
    else feedback('Try Again...Its from a newer Generation', 'bad');
  }

  function hint() {
    if (answer < 0 || over) return;
    var name = POOL[answer].name;
    if (hintLen < name.length) hintLen++;
    setText('Hinted', 'Hint: ' + name.slice(0, hintLen));
  }

  function showAnswer() {
    if (answer < 0) return;
    over = true;
    setText('Answered', 'Answer: ' + POOL[answer].name);
  }

  // ---- Wire up ------------------------------------------------------------
  $('btnNew').addEventListener('click', newGame);
  $('btnGo').addEventListener('click', function () { guess($('answer').value); });
  $('btnHint').addEventListener('click', hint);
  $('btnAnswer').addEventListener('click', showAnswer);
  $('answer').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') guess($('answer').value);
  });
  ['Generations', 'goodness', 'forms'].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('change', function () {
      if (answer >= 0) newGame();
    });
  });
  renderStats(null);

  // Handy for debugging / tests
  window.PokeGame = { POOL: POOL, findMatches: findMatches, newGame: newGame, guess: guess,
    _state: function () { return { answer: answer, over: over, guesses: guesses }; },
    _setAnswer: function (i) { answer = i; over = false; renderStats(POOL[i]); } };
})();
