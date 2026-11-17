// Shared helpers for every page: the Pokémon pool, name matching and filtering.
// Requires data.js (POKEMON_DATA). types.js (POKEMON_TYPES) is optional.
var PokeCore = (function () {
  'use strict';

  var STAT_NAMES = ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'];

  var POOL = POKEMON_DATA.map(function (r) {
    var stats = r.slice(2, 8);
    var types = (typeof POKEMON_TYPES !== 'undefined' && POKEMON_TYPES[r[0]]) || null;
    return {
      name: r[0],
      gen: r[1],
      stats: stats,
      total: stats.reduce(function (a, b) { return a + b; }, 0),
      isForm: r[8] === 1,
      types: types
    };
  });

  // ---- Name matching ----------------------------------------------------
  var FORM_WORDS = { alola: 'alolan', galar: 'galarian', hisui: 'hisuian', paldea: 'paldean' };

  function clean(s) {
    return String(s)
      .replace(/♀/g, ' f ')
      .replace(/♂/g, ' m ')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase();
  }
  function flatKey(s) { return clean(s).replace(/[^a-z0-9]/g, ''); }
  // order-independent, so "Charizard Mega X" matches "Mega Charizard X"
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

  var ALIASES = {
    'nidoran': ['Nidoran♀', 'Nidoran♂'],
    'nidoranf': ['Nidoran♀'], 'nidoranm': ['Nidoran♂'],
    'crocolar': ['Crocalor'],
    'paldeantauroscombatbreed': ['Paldean Tauros'],
    'paldeantaurosblazebreed': ['Paldean Tauros'],
    'paldeantaurosaquabreed': ['Paldean Tauros']
  };

  // Returns the pool indexes a typed name could mean (usually 0 or 1).
  function findMatches(typed) {
    var f = flatKey(typed), t = tokenKey(typed), hit = [];
    if (!f) return hit;
    if (BY_FLAT[f] !== undefined) hit.push(BY_FLAT[f]);
    else if (BY_TOKEN[t] !== undefined) hit.push(BY_TOKEN[t]);
    else if (ALIASES[f]) {
      ALIASES[f].forEach(function (n) {
        var i = BY_FLAT[flatKey(n)];
        if (i !== undefined) hit.push(i);
      });
    }
    return hit;
  }

  // ---- Pool helpers -----------------------------------------------------
  function sameStats(a, b) {
    for (var i = 0; i < 6; i++) if (a.stats[i] !== b.stats[i]) return false;
    return true;
  }

  // opts: { gen: 'all' | 1..9, strong: bool (total >= 450), forms: bool (default true) }
  function filterPool(opts) {
    opts = opts || {};
    var gen = opts.gen === undefined || opts.gen === 'all' ? null : parseInt(opts.gen, 10);
    return POOL.filter(function (p) {
      return (gen === null || p.gen === gen) &&
        (!opts.strong || p.total >= 450) &&
        (opts.forms !== false || !p.isForm);
    });
  }

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  // Read the standard option controls if they exist on this page.
  function readOptions() {
    function el(id) { return document.getElementById(id); }
    return {
      gen: el('Generations') ? el('Generations').value : 'all',
      strong: el('goodness') ? el('goodness').checked : false,
      forms: el('forms') ? el('forms').checked : true
    };
  }

  function $(id) { return document.getElementById(id); }

  return {
    POOL: POOL, STAT_NAMES: STAT_NAMES,
    findMatches: findMatches, sameStats: sameStats,
    filterPool: filterPool, pick: pick, readOptions: readOptions, $: $
  };
})();
