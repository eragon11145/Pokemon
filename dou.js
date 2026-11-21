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

  // ---- Stat boosts ---------------------------------------------------------
  // Self-boosting moves: stat changes per use.
  var BOOST_MOVES = {
    'Swords Dance': { atk: 2 }, 'Nasty Plot': { spa: 2 }, 'Calm Mind': { spa: 1, spd: 1 }, 'Dragon Dance': { atk: 1, spe: 1 },
    'Bulk Up': { atk: 1, def: 1 }, 'Quiver Dance': { spa: 1, spd: 1, spe: 1 }, 'Coil': { atk: 1, def: 1 }, 'Agility': { spe: 2 },
    'Iron Defense': { def: 2 }, 'Acid Armor': { def: 2 }, 'Amnesia': { spd: 2 }, 'Cosmic Power': { def: 1, spd: 1 }, 'Howl': { atk: 1 },
    'Tail Glow': { spa: 3 }, 'Growth': { atk: 1, spa: 1 }, 'Tidy Up': { atk: 1, spe: 1 }, 'No Retreat': { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 },
    'Belly Drum': { atk: 6 }
  };
  var ONE_USE = { 'Belly Drum': 1, 'Tail Glow': 1, 'No Retreat': 1 };
  var NEW_BOOSTS = function () { return { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }; };
  function clampB(v) { return Math.max(-6, Math.min(6, v)); }

  // Which stat of the attacker / defender actually matters for a move.
  function offStat(moveName, moveData) {
    if (moveName === 'Body Press') return 'def';
    if (moveName === 'Foul Play') return null; // uses the defender's Attack
    return moveData.category === 'Physical' ? 'atk' : 'spa';
  }
  function defStat(moveName, moveData) {
    if (['Psyshock', 'Psystrike', 'Secret Sword'].indexOf(moveName) !== -1) return 'def';
    return moveData.category === 'Physical' ? 'def' : 'spd';
  }

  // Intimidate (and what reacts to it). Returns text for the notes, or null if nothing happened.
  var INTIMIDATE_IMMUNE = ['Clear Body', 'White Smoke', 'Hyper Cutter', 'Full Metal Body', 'Inner Focus', 'Own Tempo', 'Oblivious', 'Scrappy'];
  function intimidate(srcSet, srcBoosts, tgtSet, tgtBoosts) {
    var who = srcSet.species + '\'s Intimidate';
    if (INTIMIDATE_IMMUNE.indexOf(tgtSet.ability) !== -1) return who + ' does nothing to ' + tgtSet.species + ' (' + tgtSet.ability + ').';
    if (tgtSet.item === 'Clear Amulet') return who + ' does nothing to ' + tgtSet.species + ' (Clear Amulet).';
    if (tgtSet.ability === 'Mirror Armor') { srcBoosts.atk = clampB(srcBoosts.atk - 1); return tgtSet.species + '\'s Mirror Armor reflects ' + who + ' back (' + srcSet.species + ' -1 Atk).'; }
    var txt;
    if (tgtSet.ability === 'Guard Dog') { tgtBoosts.atk = clampB(tgtBoosts.atk + 1); txt = who + ' triggers ' + tgtSet.species + '\'s Guard Dog (+1 Atk instead of a drop).'; }
    else if (tgtSet.ability === 'Contrary') { tgtBoosts.atk = clampB(tgtBoosts.atk + 1); txt = who + ' raises ' + tgtSet.species + '\'s Atk by 1 (Contrary).'; }
    else if (tgtSet.ability === 'Simple') { tgtBoosts.atk = clampB(tgtBoosts.atk - 2); txt = who + ' lowers ' + tgtSet.species + '\'s Atk by 2 (Simple).'; }
    else {
      tgtBoosts.atk = clampB(tgtBoosts.atk - 1); txt = who + ' lowers ' + tgtSet.species + '\'s Atk by 1.';
      if (tgtSet.ability === 'Defiant') { tgtBoosts.atk = clampB(tgtBoosts.atk + 2); txt += ' Defiant then raises it by 2 (net +1).'; }
      if (tgtSet.ability === 'Competitive') { tgtBoosts.spa = clampB(tgtBoosts.spa + 2); txt += ' Competitive then raises its SpA by 2.'; }
      if (tgtSet.item === 'White Herb' && tgtBoosts.atk < 0) { tgtBoosts.atk = 0; txt += ' White Herb restores the drop.'; }
    }
    return txt;
  }

  function boostText(b) {
    var out = [];
    ['atk', 'def', 'spa', 'spd', 'spe'].forEach(function (k, i) {
      if (b[k]) out.push((b[k] > 0 ? '+' : '') + b[k] + ' ' + ['Atk', 'Def', 'SpA', 'SpD', 'Spe'][i]);
    });
    return out.join(', ');
  }
  function hasBoosts(b) { return !!boostText(b); }

  // Pick a boosting move from the set that raises the stat that matters, and "use" it 1-3 times.
  function rollSelfBoost(set, relevantStat, rand, allowBellyDrum) {
    var options = set.moves.filter(function (m) {
      return BOOST_MOVES[m] && BOOST_MOVES[m][relevantStat] > 0 && (allowBellyDrum || m !== 'Belly Drum');
    });
    if (!options.length) return null;
    var m = options[Math.floor(rand() * options.length)], r = rand();
    var uses = ONE_USE[m] ? 1 : (r < 0.6 ? 1 : r < 0.92 ? 2 : 3);
    var b = NEW_BOOSTS();
    Object.keys(BOOST_MOVES[m]).forEach(function (k) { b[k] = clampB(BOOST_MOVES[m][k] * uses); });
    return { move: m, uses: uses, boosts: b };
  }

  // ---- Scenario --------------------------------------------------------------
  // opts: { alpha, field: bool (weather/terrain/screens/Helping Hand/Terastallization), rand }
  function buildScenario(opts) {
    opts = opts || {};
    var rand = opts.rand || Math.random, alpha = opts.alpha === undefined ? 0.5 : opts.alpha;
    var useField = opts.field !== false, useBoosts = opts.boosts !== false;

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
        move = new C.Move(GEN, moveName, { ability: aSet.ability, item: aSet.item });
        var aB = NEW_BOOSTS(), dB = NEW_BOOSTS(), boostNotes = [];
        if (useBoosts) {
          // 1) Intimidate has just activated (not every time, so plain matchups still come up)
          if (aSet.ability === 'Intimidate' && rand() < 0.75) boostNotes.push(intimidate(aSet, aB, dSet, dB));
          if (dSet.ability === 'Intimidate' && rand() < 0.75) boostNotes.push(intimidate(dSet, dB, aSet, aB));
          // 2) setup moves that raise a stat this move actually uses
          var off = offStat(moveName, { category: move.category });
          var dfn = defStat(moveName, { category: move.category });
          if (off && rand() < 0.55) {
            var sb = rollSelfBoost(aSet, off, rand, true);
            if (sb) { STAT_KEYS.slice(1).forEach(function (k) { aB[k] = clampB(aB[k] + sb.boosts[k]); });
              boostNotes.push(aSet.species + ' used ' + sb.move + (sb.uses > 1 ? ' ' + sb.uses + ' times' : '') + ' (' + boostText(sb.boosts) + ').'); }
          }
          if (rand() < 0.4) {
            var sd = rollSelfBoost(dSet, dfn, rand, false);
            if (sd) { STAT_KEYS.slice(1).forEach(function (k) { dB[k] = clampB(dB[k] + sd.boosts[k]); });
              boostNotes.push(dSet.species + ' used ' + sd.move + (sd.uses > 1 ? ' ' + sd.uses + ' times' : '') + ' (' + boostText(sd.boosts) + ').'); }
          }
        }
        var aExtra = aOn ? { abilityOn: true } : {}, dExtra = dOn ? { abilityOn: true } : {};
        if (hasBoosts(aB)) aExtra.boosts = aB;
        if (hasBoosts(dB)) dExtra.boosts = dB;
        attacker = makeMon(aSet, aTera, aExtra);
        defender = makeMon(dSet, dTera, dExtra);
        result = C.calculate(GEN, attacker, defender, move, new C.Field(fieldOpts));
      } catch (e) { continue; }

      var range = result.range(), hp = defender.maxHP();
      var lo = range[0] / hp * 100, hi = range[1] / hp * 100;
      if (!(hi >= 2) || lo >= 100) continue; // immune / negligible / guaranteed KO: no puzzle there

      if (aOn) notes.push(aSet.species + '\'s ' + aSet.ability + ' is active.');
      if (dOn) notes.push(dSet.species + '\'s ' + dSet.ability + ' is active.');
      boostNotes.forEach(function (n) { notes.push(n); });
      var target = move.target;
      if (target === 'allAdjacentFoes' || target === 'allAdjacent') notes.push(moveName + ' hits both opponents, so the spread-move reduction applies.');
      if (move.hits > 1) notes.push(moveName + ' is assumed to hit ' + move.hits + ' times.');

      remember(aSet.species); remember(dSet.species);
      return {
        attacker: { set: aSet, tera: aTera, mon: attacker }, defender: { set: dSet, tera: dTera, mon: defender },
        move: moveName, moveData: move, field: { weather: weather, terrain: terrain, attackerSide: attackerSide, defenderSide: defenderSide },
        notes: notes, boosts: { atk: aB, def: dB }, result: result, lower: lo, upper: hi, hp: hp, desc: result.desc(),
        rawCalc: result.desc().replace(/:\s*\d+-\d+\s*\(.*$/, ':')
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
      ['Type', side.mon.types.join(' / ')], ['Level', String(s.level)]].concat(hasBoosts(side.mon.boosts) ? [['Boosts', boostText(side.mon.boosts)]] : []).forEach(function (p) {
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
      state = buildScenario({ alpha: parseFloat($('variety').value), field: $('fieldFx').checked, boosts: $('boostFx').checked });
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
    $('rawCalc').textContent = state.rawCalc;
    $('question').textContent = 'What % of ' + state.defender.set.species + '\'s HP does ' + state.attacker.set.species + '\'s ' + state.move + ' do?';
    ['message', 'GuessNumber', 'Hinted', 'Answered', 'calcDesc'].forEach(function (id) { $(id).textContent = ' '; });
    $('message').className = '';
    $('scenario').hidden = false;
    $('guessBarWrap').style.visibility = 'visible';
    $('guessMarks').textContent = '';
    $('rangeBand').hidden = true;
    $('answer').value = '';
    $('answer').focus();
  }

  function finish(correct) {
    over = true;
    stats.played++;
    if (correct) { stats.correct++; stats.streak++; stats.best = Math.max(stats.best, stats.streak); } else stats.streak = 0;
    renderStats();
    $('calcDesc').textContent = state.desc;
    showBand();
  }

  function guess(value) {
    if (!state) { say('Hit New Game to start!', 'info'); return; }
    if (over) { say('Round finished — hit New Game to play again.', 'info'); return; }
    var g = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (isNaN(g)) return;
    guesses++;
    $('GuessNumber').textContent = 'Number of Guesses: ' + guesses;
    $('answer').value = '';
    addMark(g);
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
    showBand();
    $('Answered').textContent = 'Answer: ' + fmt(state.lower) + '% to ' + fmt(state.upper) + '%';
    $('calcDesc').textContent = state.desc;
  }

  $('btnNew').addEventListener('click', newGame);
  $('btnGo').addEventListener('click', function () { guess($('answer').value); });
  $('btnHint').addEventListener('click', hint);
  $('btnAnswer').addEventListener('click', showAnswer);
  $('answer').addEventListener('keydown', function (e) { if (e.key === 'Enter') guess($('answer').value); });
  // ---- Click-the-bar guessing ----
  var bar = $('guessBar'), kbd = 50;
  function pctAt(clientX) {
    var r = bar.getBoundingClientRect();
    return Math.max(0, Math.min(100, Math.round((clientX - r.left) / r.width * 100)));
  }
  function showBand() {
    var band = $('rangeBand');
    band.hidden = false;
    var lo = Math.max(0, state.lower), hi = Math.min(100, state.upper);
    band.style.left = lo + '%';
    band.style.width = Math.max(0.6, hi - lo) + '%';
  }
  function addMark(g) {
    var m = el('span', 'guess-mark');
    m.style.left = Math.min(100, g) + '%';
    m.title = g + '%';
    $('guessMarks').appendChild(m);
  }
  bar.addEventListener('pointermove', function (e) {
    var p = pctAt(e.clientX), h = $('hoverMark');
    h.hidden = false; h.style.left = p + '%'; $('hoverLabel').textContent = p + '%';
  });
  bar.addEventListener('pointerleave', function () { $('hoverMark').hidden = true; });
  bar.addEventListener('click', function (e) { guess(String(pctAt(e.clientX))); });
  bar.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') kbd = Math.max(0, kbd - (e.shiftKey ? 10 : 1));
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') kbd = Math.min(100, kbd + (e.shiftKey ? 10 : 1));
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); guess(String(kbd)); return; }
    else return;
    e.preventDefault();
    bar.setAttribute('aria-valuenow', kbd);
    var h = $('hoverMark'); h.hidden = false; h.style.left = kbd + '%'; $('hoverLabel').textContent = kbd + '%';
  });

  window.DouGame = { SETS: SETS, SPECIES: SPECIES, USAGE: DOU_USAGE, buildScenario: buildScenario, damagingMoves: damagingMoves,
    speciesWeights: speciesWeights, intimidate: intimidate, NEW_BOOSTS: NEW_BOOSTS, resetRecent: function () { recent = []; }, _state: function () { return state; } };
})();
