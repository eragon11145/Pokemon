// "Guess the Damage: DOU edition". Real sets from SV Doubles OU sample teams + the official Smogon damage calculator.
// Requires vendor/smogon-calc.min.js (SmogonCalc) and dou-sets.js (DOU_SETS, DOU_USAGE).
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var C = SmogonCalc, GEN = C.Generations.get(9);
  var STAT_KEYS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
  var STAT_LABEL = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];

  // ---- Sets ------------------------------------------------------------------
  var SETS = DOU_SETS.map(function (r) {
    return { species: r[0], item: r[1], ability: r[2], nature: r[3], tera: r[4],
      evs: r[5], ivs: r[6], level: r[7] || 100, moves: r[8] };
  });
  var BY_SPECIES = {};
  SETS.forEach(function (s) { (BY_SPECIES[s.species] = BY_SPECIES[s.species] || []).push(s); });
  var SPECIES = Object.keys(BY_SPECIES);

  // Moves whose damage depends on things this game does not model (HP of the user, party size, KO counters...)
  var SKIP_MOVES = { 'Super Fang': 1, 'Seismic Toss': 1, 'Night Shade': 1, 'Endeavor': 1, 'Final Gambit': 1, 'Beat Up': 1, 'Ruination': 1,
    'Nature\'s Madness': 1, 'Rage Fist': 1, 'Last Respects': 1, 'Fling': 1, 'Natural Gift': 1, 'Present': 1, 'Magnitude': 1, 'Counter': 1,
    'Mirror Coat': 1, 'Metal Burst': 1, 'Comeuppance': 1, 'Bide': 1, 'Dragon Rage': 1, 'Sonic Boom': 1, 'Psywave': 1, 'Struggle': 1,
    'Spit Up': 1, 'Fickle Beam': 1, 'Round': 1, 'Pursuit': 1, 'Revival Blessing': 1 };

  // ---- Flattened sampling ----------------------------------------------------
  // Weight of a species = (number of sample teams it appears on) ^ alpha.
  //   alpha 1   -> exactly as common as in the teams, 0.5 -> a gentler curve, 0 -> every species equally likely.
  // Species used in the last RECENT rounds are down-weighted so the same Pokémon don't keep coming back.
  var RECENT = 6, RECENT_FACTOR = 0.15;
  var recent = [];
  function speciesWeights(alpha) {
    return SPECIES.map(function (sp) {
      var w = Math.pow(DOU_USAGE[sp] || 1, alpha);
      if (recent.indexOf(sp) !== -1) w *= RECENT_FACTOR;
      return w;
    });
  }
  function pickWeighted(items, weights, rand) {
    var total = 0, i;
    for (i = 0; i < weights.length; i++) total += weights[i];
    var r = rand() * total;
    for (i = 0; i < weights.length; i++) { r -= weights[i]; if (r < 0) return items[i]; }
    return items[items.length - 1];
  }
  function pickSet(alpha, rand, exclude) {
    var w = speciesWeights(alpha);
    if (exclude) w = w.map(function (x, i) { return SPECIES[i] === exclude ? 0 : x; });
    var sp = pickWeighted(SPECIES, w, rand);
    var list = BY_SPECIES[sp];
    return list[Math.floor(rand() * list.length)];
  }
  function remember(sp) { recent.push(sp); while (recent.length > RECENT) recent.shift(); }

  // ---- Building calc objects -------------------------------------------------
  function evObj(a) { var o = {}; STAT_KEYS.forEach(function (k, i) { o[k] = a[i]; }); return o; }

  var WEATHER_ABILITY = { 'Drought': 'Sun', 'Orichalcum Pulse': 'Sun', 'Drizzle': 'Rain', 'Sand Stream': 'Sand', 'Snow Warning': 'Snow' };
  var TERRAIN_ABILITY = { 'Electric Surge': 'Electric', 'Hadron Engine': 'Electric', 'Grassy Surge': 'Grassy', 'Psychic Surge': 'Psychic', 'Misty Surge': 'Misty' };
  var WEATHERS = ['Sun', 'Rain', 'Sand', 'Snow'], TERRAINS = ['Electric', 'Grassy', 'Psychic', 'Misty'];

  function makeMon(set, terastallized, extra) {
    var o = { level: set.level, nature: set.nature, evs: evObj(set.evs), ivs: evObj(set.ivs) };
    if (set.item) o.item = set.item;
    if (set.ability) o.ability = set.ability;
    if (terastallized && set.tera) o.teraType = set.tera;
    for (var k in (extra || {})) o[k] = extra[k];
    return new C.Pokemon(GEN, set.species, o);
  }

  function damagingMoves(set) {
    return set.moves.filter(function (m) {
      var d = GEN.moves.get(m.toLowerCase().replace(/[^a-z0-9]/g, ''));
      return d && d.category !== 'Status' && !SKIP_MOVES[m];
    });
  }

  function evText(set) {
    var parts = [];
    set.evs.forEach(function (v, i) { if (v) parts.push(v + ' ' + STAT_LABEL[i]); });
    var iv = [];
    set.ivs.forEach(function (v, i) { if (v !== 31) iv.push(v + ' ' + STAT_LABEL[i]); });
    return (parts.join(' / ') || 'no EVs') + (iv.length ? ' (IVs: ' + iv.join(', ') + ')' : '');
  }

  // ---- Scenario --------------------------------------------------------------
  // opts: { alpha, field: bool (weather/terrain/screens/Helping Hand/Terastallization), rand }
  function buildScenario(opts) {
    opts = opts || {};
    var rand = opts.rand || Math.random, alpha = opts.alpha === undefined ? 0.5 : opts.alpha;
    var useField = opts.field !== false;

    for (var attempt = 0; attempt < 200; attempt++) {
      var aSet = pickSet(alpha, rand);
      var moves = damagingMoves(aSet);
      if (!moves.length) continue;
      var dSet = pickSet(alpha, rand, aSet.species);
      var moveName = moves[Math.floor(rand() * moves.length)];

      var aTera = useField && !!aSet.tera && rand() < 0.3;
      var dTera = useField && !!dSet.tera && rand() < 0.25;

      // field
      var weather = null, terrain = null, notes = [];
      var abilities = [aSet.ability, dSet.ability];
      var weatherSetters = abilities.filter(function (a) { return WEATHER_ABILITY[a]; });
      var terrainSetters = abilities.filter(function (a) { return TERRAIN_ABILITY[a]; });
      if (weatherSetters.length) weather = WEATHER_ABILITY[weatherSetters[Math.floor(rand() * weatherSetters.length)]];
      else if (useField && rand() < 0.22) weather = WEATHERS[Math.floor(rand() * 4)];
      if (terrainSetters.length) terrain = TERRAIN_ABILITY[terrainSetters[Math.floor(rand() * terrainSetters.length)]];
      else if (useField && rand() < 0.12) terrain = TERRAINS[Math.floor(rand() * 4)];

      var attackerSide = {}, defenderSide = {};
      if (useField && rand() < 0.1) attackerSide.isHelpingHand = true;
      if (useField && rand() < 0.14) {
        var screens = weather === 'Snow' ? ['isReflect', 'isLightScreen', 'isAuroraVeil'] : ['isReflect', 'isLightScreen'];
        defenderSide[screens[Math.floor(rand() * screens.length)]] = true;
      }
      var fieldOpts = { gameType: 'Doubles', attackerSide: attackerSide, defenderSide: defenderSide };
      if (weather) fieldOpts.weather = weather;
      if (terrain) fieldOpts.terrain = terrain;

      // Protosynthesis / Quark Drive: on from Booster Energy, or from the matching weather / terrain
      function paradox(set) {
        if (set.ability === 'Protosynthesis') return set.item === 'Booster Energy' || weather === 'Sun';
        if (set.ability === 'Quark Drive') return set.item === 'Booster Energy' || terrain === 'Electric';
        return false;
      }
      var aOn = paradox(aSet), dOn = paradox(dSet);

      var attacker, defender, move, result;
      try {
        attacker = makeMon(aSet, aTera, aOn ? { abilityOn: true } : null);
        defender = makeMon(dSet, dTera, dOn ? { abilityOn: true } : null);
        move = new C.Move(GEN, moveName, { ability: aSet.ability, item: aSet.item });
        result = C.calculate(GEN, attacker, defender, move, new C.Field(fieldOpts));
      } catch (e) { continue; }

      var range = result.range(), hp = defender.maxHP();
      var lo = range[0] / hp * 100, hi = range[1] / hp * 100;
      if (!(hi >= 2) || lo >= 100) continue; // immune / negligible / guaranteed KO: no puzzle there

      if (aOn) notes.push(aSet.species + '\'s ' + aSet.ability + ' is active.');
      if (dOn) notes.push(dSet.species + '\'s ' + dSet.ability + ' is active.');
      if (aSet.ability === 'Intimidate') notes.push(aSet.species + ' just used Intimidate (the defender\'s Attack is lowered).');
      if (dSet.ability === 'Intimidate') notes.push(dSet.species + ' just used Intimidate (the attacker\'s Attack is lowered).');
      var target = move.target;
      if (target === 'allAdjacentFoes' || target === 'allAdjacent') notes.push(moveName + ' hits both opponents, so the spread-move reduction applies.');
      if (move.hits > 1) notes.push(moveName + ' is assumed to hit ' + move.hits + ' times.');

      remember(aSet.species); remember(dSet.species);
      return {
        attacker: { set: aSet, tera: aTera, mon: attacker }, defender: { set: dSet, tera: dTera, mon: defender },
        move: moveName, moveData: move, field: { weather: weather, terrain: terrain, attackerSide: attackerSide, defenderSide: defenderSide },
        notes: notes, result: result, lower: lo, upper: hi, hp: hp, desc: result.desc()
      };
    }
    throw new Error('Could not build a scenario');
  }

  // ---- UI --------------------------------------------------------------------
  var state = null, guesses = 0, over = true, hints = 0, stats = { played: 0, correct: 0, streak: 0, best: 0 };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function monCard(role, side) {
    var s = side.set, card = el('div', 'mon-card ' + role);
    card.appendChild(el('span', 'mon-role', role === 'atk' ? 'Attacker' : 'Defender'));
    card.appendChild(el('strong', 'mon-name', s.species + (side.tera ? ' (Tera ' + s.tera + ')' : '')));
    var dl = el('dl', 'mon-facts');
    [['Item', s.item || '—'], ['Ability', s.ability || '—'], ['Nature', s.nature], ['EVs', evText(s)],
      ['Type', side.mon.types.join(' / ')], ['Level', String(s.level)]].forEach(function (p) {
      dl.appendChild(el('dt', '', p[0]));
      dl.appendChild(el('dd', '', p[1]));
    });
    card.appendChild(dl);
    return card;
  }
  function fieldText(sc) {
    var f = sc.field, bits = [];
    bits.push(f.weather ? ({ Sun: 'Harsh sunlight', Rain: 'Rain', Sand: 'Sandstorm', Snow: 'Snow' })[f.weather] : 'No weather');
    bits.push(f.terrain ? f.terrain + ' Terrain' : 'No terrain');
    if (f.attackerSide.isHelpingHand) bits.push('Helping Hand on the attacker');
    if (f.defenderSide.isReflect) bits.push('Reflect up');
    if (f.defenderSide.isLightScreen) bits.push('Light Screen up');
    if (f.defenderSide.isAuroraVeil) bits.push('Aurora Veil up');
    return bits.join(' · ');
  }
  function say(text, kind) { var m = $('message'); m.textContent = text; m.className = kind || ''; }
  function fmt(x) { return (Math.round(x * 10) / 10).toFixed(1); }

  function renderStats() {
    $('statLine').textContent = stats.played ? 'First-try correct: ' + stats.correct + ' / ' + stats.played + ' · Streak: ' + stats.streak + ' (best ' + stats.best + ')' : ' ';
  }

  function newGame() {
    try {
      state = buildScenario({ alpha: parseFloat($('variety').value), field: $('fieldFx').checked });
    } catch (e) { say('Could not build a matchup, try again.', 'bad'); return; }
    guesses = 0; hints = 0; over = false;
    var cards = $('cards');
    cards.textContent = '';
    cards.appendChild(monCard('atk', state.attacker));
    cards.appendChild(monCard('def', state.defender));
    $('fieldLine').textContent = 'Field: ' + fieldText(state);
    var notes = $('notes');
    notes.textContent = '';
    state.notes.forEach(function (n) { notes.appendChild(el('li', '', n)); });
    $('question').textContent = 'What % of ' + state.defender.set.species + '\'s HP does ' + state.attacker.set.species + '\'s ' + state.move + ' do?';
    ['message', 'GuessNumber', 'Hinted', 'Answered', 'calcDesc'].forEach(function (id) { $(id).textContent = ' '; });
    $('message').className = '';
    $('scenario').hidden = false;
    $('guessButtons').style.visibility = 'visible';
    $('answer').value = '';
    $('answer').focus();
  }

  function finish(correct) {
    over = true;
    stats.played++;
    if (correct) { stats.correct++; stats.streak++; stats.best = Math.max(stats.best, stats.streak); } else stats.streak = 0;
    renderStats();
    $('calcDesc').textContent = state.desc;
  }

  function guess(value) {
    if (!state) { say('Hit New Game to start!', 'info'); return; }
    if (over) { say('Round finished — hit New Game to play again.', 'info'); return; }
    var g = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (isNaN(g)) return;
    guesses++;
    $('GuessNumber').textContent = 'Number of Guesses: ' + guesses;
    $('answer').value = '';
    if (g > state.lower - 0.7 && g < state.upper + 0.7) {
      say('Correct! The damage range was ' + fmt(state.lower) + '% to ' + fmt(state.upper) + '%.', 'good');
      finish(guesses === 1);
    } else if (g <= state.lower - 0.7) say('Too low — it does more than ' + g + '%.', 'bad');
    else say('Too high — it does less than ' + g + '%.', 'bad');
  }

  function hint() {
    if (!state || over) return;
    hints++;
    var width = hints === 1 ? 40 : 20, mid = (state.lower + state.upper) / 2;
    var lo = Math.max(0, Math.floor((mid - width / 2) / 5) * 5);
    if (lo + width < state.upper) lo = Math.ceil((state.upper - width) / 5) * 5;
    $('Hinted').textContent = 'Hint: the damage range overlaps ' + lo + '% – ' + (lo + width) + '%.' + (hints === 1 ? ' (Hint again for a narrower window.)' : '');
  }

  function showAnswer() {
    if (!state) return;
    if (!over) { over = true; stats.played++; stats.streak = 0; renderStats(); }
    $('Answered').textContent = 'Answer: ' + fmt(state.lower) + '% to ' + fmt(state.upper) + '%';
    $('calcDesc').textContent = state.desc;
  }

  $('btnNew').addEventListener('click', newGame);
  $('btnGo').addEventListener('click', function () { guess($('answer').value); });
  $('btnHint').addEventListener('click', hint);
  $('btnAnswer').addEventListener('click', showAnswer);
  $('answer').addEventListener('keydown', function (e) { if (e.key === 'Enter') guess($('answer').value); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-pct]'), function (b) {
    b.addEventListener('click', function () { guess(b.getAttribute('data-pct')); });
  });

  window.DouGame = { SETS: SETS, SPECIES: SPECIES, USAGE: DOU_USAGE, buildScenario: buildScenario, damagingMoves: damagingMoves,
    speciesWeights: speciesWeights, resetRecent: function () { recent = []; }, _state: function () { return state; } };
})();
