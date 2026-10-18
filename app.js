(function () {
  'use strict';

  const T = window.Theory;
  const MAX_FRET = 24;
  const STORAGE_KEY = 'fretmap.state.v1';
  const ROOTS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
  const SINGLE_INLAYS = [3, 5, 7, 9, 15, 17, 19, 21];
  const DOUBLE_INLAYS = [12, 24];

  // Strings are listed low → high.
  const TUNINGS = [
    { id: 'e_std', group: '6-string', name: 'E Standard', notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { id: 'eb_std', group: '6-string', name: 'E♭ Standard', notes: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4'] },
    { id: 'd_std', group: '6-string', name: 'D Standard', notes: ['D2', 'G2', 'C3', 'F3', 'A3', 'D4'] },
    { id: 'cs_std', group: '6-string', name: 'C♯ Standard', notes: ['C#2', 'F#2', 'B2', 'E3', 'G#3', 'C#4'] },
    { id: 'c_std', group: '6-string', name: 'C Standard', notes: ['C2', 'F2', 'Bb2', 'Eb3', 'G3', 'C4'] },
    { id: 'b_std', group: '6-string', name: 'B Standard', notes: ['B1', 'E2', 'A2', 'D3', 'F#3', 'B3'] },
    { id: 'a_std', group: '6-string', name: 'A Standard', notes: ['A1', 'D2', 'G2', 'C3', 'E3', 'A3'] },
    { id: 'g_std', group: '6-string', name: 'G Standard', notes: ['G1', 'C2', 'F2', 'Bb2', 'D3', 'G3'] },
    { id: 'drop_d', group: '6-string drop', name: 'Drop D', notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { id: 'drop_cs', group: '6-string drop', name: 'Drop C♯', notes: ['C#2', 'G#2', 'C#3', 'F#3', 'A#3', 'D#4'] },
    { id: 'drop_c', group: '6-string drop', name: 'Drop C', notes: ['C2', 'G2', 'C3', 'F3', 'A3', 'D4'] },
    { id: 'drop_b', group: '6-string drop', name: 'Drop B', notes: ['B1', 'F#2', 'B2', 'E3', 'G#3', 'C#4'] },
    { id: 'drop_a', group: '6-string drop', name: 'Drop A', notes: ['A1', 'E2', 'A2', 'D3', 'F#3', 'B3'] },
    { id: 'drop_g', group: '6-string drop', name: 'Drop G', notes: ['G1', 'D2', 'G2', 'C3', 'E3', 'A3'] },
    { id: 'drop_f', group: '6-string drop', name: 'Drop F', notes: ['F1', 'C2', 'F2', 'Bb2', 'D3', 'G3'] },
    { id: 'dadgad', group: '6-string open', name: 'DADGAD', notes: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'] },
    { id: 'open_g', group: '6-string open', name: 'Open G', notes: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'] },
    { id: 'open_d', group: '6-string open', name: 'Open D', notes: ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'] },
    { id: 'open_e', group: '6-string open', name: 'Open E', notes: ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'] },
    { id: 'b_std7', group: '7-string', name: 'B Standard (7)', notes: ['B1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { id: 'a_std7', group: '7-string', name: 'A Standard (7)', notes: ['A1', 'D2', 'G2', 'C3', 'F3', 'A3', 'D4'] },
    { id: 'g_std7', group: '7-string', name: 'G Standard (7)', notes: ['G1', 'C2', 'F2', 'Bb2', 'Eb3', 'G3', 'C4'] },
    { id: 'drop_a7', group: '7-string', name: 'Drop A (7)', notes: ['A1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { id: 'drop_g7', group: '7-string', name: 'Drop G (7)', notes: ['G1', 'D2', 'G2', 'C3', 'F3', 'A3', 'D4'] },
    { id: 'drop_f7', group: '7-string', name: 'Drop F (7)', notes: ['F1', 'C2', 'F2', 'Bb2', 'Eb3', 'G3', 'C4'] },
    { id: 'fs_std8', group: '8-string', name: 'F♯ Standard (8)', notes: ['F#1', 'B1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { id: 'e_std8', group: '8-string', name: 'E Standard (8)', notes: ['E1', 'A1', 'D2', 'G2', 'C3', 'F3', 'A3', 'D4'] },
    { id: 'drop_e8', group: '8-string', name: 'Drop E (8)', notes: ['E1', 'B1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
  ];

  const DEFAULTS = {
    tuningId: 'e_std',
    tuning: TUNINGS[0].notes.slice(),
    root: 'A',
    scaleId: 'minor_pentatonic',
    position: null,
    chordKey: null,
    showIntervals: false,
    showAll: false,
    lowOnTop: false,
    lefty: false,
  };

  const $ = (sel) => document.querySelector(sel);
  const els = {
    tuning: $('#tuning-select'),
    strings: $('#tuning-strings'),
    addString: $('#string-add'),
    removeString: $('#string-remove'),
    root: $('#root-select'),
    scale: $('#scale-select'),
    intervals: $('#opt-intervals'),
    all: $('#opt-all'),
    lowTop: $('#opt-lowtop'),
    lefty: $('#opt-lefty'),
    summary: $('#scale-summary'),
    fretboard: $('#fretboard'),
    legend: $('#legend'),
    positions: $('#positions'),
    chords: $('#chords'),
    chordInfo: $('#chord-info'),
  };

  let state = loadState();
  let model = null;

  // ---------- persistence ----------

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        const s = { ...DEFAULTS, ...saved };
        s.tuning.forEach((n) => T.parseNote(n)); // throws on corrupt data
        T.parseNote(s.root);
        return s;
      }
    } catch (e) { /* fall back to defaults */ }
    return { ...DEFAULTS, tuning: DEFAULTS.tuning.slice() };
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function setState(patch) {
    state = { ...state, ...patch };
    update();
  }

  // ---------- model ----------

  function buildModel() {
    const scale = T.SCALES.find((s) => s.id === state.scaleId) || T.SCALES[0];
    const notes = T.scaleNotes(state.root, scale);
    const flats = notes.some((n) => n.name.slice(1).includes('b'));
    const tuning = state.tuning.map((n) => T.parseNote(n).midi);
    const positions = T.computePositions(tuning, scale, notes, MAX_FRET);
    const chords = T.findChords(state.root, scale);

    if (state.position !== null && state.position >= positions.length) state.position = null;
    const chord = chords.find((c) => c.key === state.chordKey) || null;
    if (!chord) state.chordKey = null;
    const position = state.position === null ? null : positions[state.position];

    return {
      scale, notes, flats, tuning, positions, chords, chord, position,
      pcInfo: new Map(notes.map((n) => [n.pc, n])),
      posCells: position ? new Set(position.cells.map((c) => c.string + ':' + c.fret)) : null,
    };
  }

  // ---------- controls ----------

  function initControls() {
    const groups = new Map();
    TUNINGS.forEach((t) => {
      if (!groups.has(t.group)) groups.set(t.group, []);
      groups.get(t.group).push(t);
    });
    let html = '';
    groups.forEach((list, group) => {
      html += `<optgroup label="${group}">` +
        list.map((t) => `<option value="${t.id}">${t.name} — ${t.notes.map(stripOctave).map(T.display).join(' ')}</option>`).join('') +
        '</optgroup>';
    });
    html += '<option value="custom">Custom</option>';
    els.tuning.innerHTML = html;

    els.root.innerHTML = ROOTS.map((r) => `<option value="${r}">${T.display(r)}</option>`).join('');

    const scaleGroups = new Map();
    T.SCALES.forEach((s) => {
      if (!scaleGroups.has(s.group)) scaleGroups.set(s.group, []);
      scaleGroups.get(s.group).push(s);
    });
    els.scale.innerHTML = [...scaleGroups].map(([group, list]) =>
      `<optgroup label="${group}">` + list.map((s) => `<option value="${s.id}">${s.name}</option>`).join('') + '</optgroup>'
    ).join('');

    els.tuning.addEventListener('change', () => {
      const preset = TUNINGS.find((t) => t.id === els.tuning.value);
      if (preset) setState({ tuningId: preset.id, tuning: preset.notes.slice() });
    });
    els.root.addEventListener('change', () => setState({ root: els.root.value }));
    els.scale.addEventListener('change', () => setState({ scaleId: els.scale.value, position: null, chordKey: null }));
    els.intervals.addEventListener('change', () => setState({ showIntervals: els.intervals.checked }));
    els.all.addEventListener('change', () => setState({ showAll: els.all.checked }));
    els.lowTop.addEventListener('change', () => setState({ lowOnTop: els.lowTop.checked }));
    els.lefty.addEventListener('change', () => setState({ lefty: els.lefty.checked }));

    els.strings.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-string]');
      if (btn) retune(+btn.dataset.string, +btn.dataset.step);
    });
    els.addString.addEventListener('click', () => {
      const lowest = T.parseNote(state.tuning[0]);
      const name = T.midiToName(lowest.midi - 5, lowest.acc < 0);
      setCustomTuning([name, ...state.tuning]);
    });
    els.removeString.addEventListener('click', () => setCustomTuning(state.tuning.slice(1)));

    els.positions.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-pos]');
      if (btn) setState({ position: btn.dataset.pos === 'all' ? null : +btn.dataset.pos });
    });
    els.chords.addEventListener('click', (e) => {
      const play = e.target.closest('button[data-play]');
      if (play) {
        playChord(model.chords.find((c) => c.key === play.dataset.play));
        return;
      }
      const btn = e.target.closest('button[data-chord]');
      if (btn) setState({ chordKey: state.chordKey === btn.dataset.chord ? null : btn.dataset.chord });
    });
    els.fretboard.addEventListener('click', (e) => {
      const note = e.target.closest('.note');
      if (note) pluck(+note.dataset.midi);
    });

    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
      const count = model.positions.length;
      if (e.key === 'ArrowRight') {
        setState({ position: state.position === null ? 0 : state.position + 1 < count ? state.position + 1 : null });
      } else if (e.key === 'ArrowLeft') {
        setState({ position: state.position === null ? count - 1 : state.position > 0 ? state.position - 1 : null });
      } else if (e.key === 'Escape') {
        setState({ chordKey: null });
      } else return;
      e.preventDefault();
    });
  }

  function retune(stringIndex, step) {
    const n = T.parseNote(state.tuning[stringIndex]);
    const midi = n.midi + step;
    if (midi < 16 || midi > 84) return;
    const tuning = state.tuning.slice();
    tuning[stringIndex] = T.midiToName(midi, n.acc < 0);
    setCustomTuning(tuning);
  }

  function setCustomTuning(tuning) {
    if (tuning.length < 4 || tuning.length > 9) return;
    const key = tuning.join(' ');
    const preset = TUNINGS.find((t) => t.notes.join(' ') === key);
    setState({ tuning, tuningId: preset ? preset.id : 'custom' });
  }

  function syncControls() {
    els.tuning.value = state.tuningId;
    els.root.value = state.root;
    els.scale.value = model.scale.id;
    els.intervals.checked = state.showIntervals;
    els.all.checked = state.showAll;
    els.lowTop.checked = state.lowOnTop;
    els.lefty.checked = state.lefty;
    els.addString.disabled = state.tuning.length >= 9;
    els.removeString.disabled = state.tuning.length <= 4;

    els.strings.innerHTML = state.tuning.map((name, i) => {
      const n = T.parseNote(name);
      return `<div class="string-chip" title="String ${state.tuning.length - i}">
        <button data-string="${i}" data-step="1" title="Up a semitone">▲</button>
        <span>${T.display(stripOctave(name))}<sub>${n.octave}</sub></span>
        <button data-string="${i}" data-step="-1" title="Down a semitone">▼</button>
      </div>`;
    }).join('');
  }

  // ---------- rendering ----------

  function stripOctave(name) {
    return name.replace(/-?\d+$/, '');
  }

  function roleOf(deg) {
    const num = T.parseDegree(deg).num;
    return num === 1 ? 'R' : num === 3 ? '3' : num === 5 ? '5' : num === 7 ? '7' : 'x';
  }

  function renderSummary() {
    const m = model;
    els.summary.innerHTML =
      `<span class="title">${T.display(state.root)} ${m.scale.name}</span>` +
      '<span class="chips">' + m.notes.map((n) =>
        `<span class="chip ${n.deg === '1' ? 'root' : ''}"><b>${T.display(n.name)}</b><small>${T.displayDegree(n.deg)}</small></span>`
      ).join('') + '</span>';
  }

  function geometry(stringCount) {
    const labelW = 34;
    const openW = 46;
    const nutX = labelW + openW;
    const neckLen = 1640;
    const ratio = 0.972; // gentle taper so the high frets stay readable
    const w0 = neckLen * (1 - ratio) / (1 - Math.pow(ratio, MAX_FRET));
    const fretX = [nutX];
    for (let f = 1; f <= MAX_FRET; f++) fretX[f] = fretX[f - 1] + w0 * Math.pow(ratio, f - 1);

    const spacing = 36;
    const neckTop = 14;
    const edge = 18;
    const neckBottom = neckTop + 2 * edge + (stringCount - 1) * spacing;
    const width = fretX[MAX_FRET] + 24;
    const height = neckBottom + 28;

    return {
      nutX, fretX, width, height, neckTop, neckBottom, labelW,
      X: (x) => (state.lefty ? width - x : x),
      noteX: (f) => (f === 0 ? nutX - openW / 2 : (fretX[f - 1] + fretX[f]) / 2),
      stringY: (s) => neckTop + edge + (state.lowOnTop ? s : stringCount - 1 - s) * spacing,
    };
  }

  function renderFretboard() {
    const m = model;
    const n = m.tuning.length;
    const G = geometry(n);
    const { X } = G;
    const out = [];
    const rect = (xa, xb, y, h, attrs) => {
      const x = Math.min(X(xa), X(xb));
      out.push(`<rect x="${x}" y="${y}" width="${Math.abs(X(xb) - X(xa))}" height="${h}" ${attrs}/>`);
    };

    out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${G.width}" height="${G.height}" viewBox="0 0 ${G.width} ${G.height}">`);
    out.push(`<defs>
      <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3d2617"/><stop offset=".5" stop-color="#4a2e1b"/><stop offset="1" stop-color="#2e1b10"/>
      </linearGradient>
      <linearGradient id="fretMetal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#8e939b"/><stop offset=".5" stop-color="#e4e7ec"/><stop offset="1" stop-color="#8e939b"/>
      </linearGradient>
    </defs>`);

    const neckH = G.neckBottom - G.neckTop;
    rect(G.nutX, G.fretX[MAX_FRET] + 12, G.neckTop, neckH, 'fill="url(#wood)" rx="3"');

    // highlighted area of the selected position
    if (m.position) {
      m.position.ranges.forEach(([lo, hi]) => {
        const xa = lo === 0 ? G.nutX - 44 : G.fretX[lo - 1] + 2;
        const xb = G.fretX[hi] - 2;
        rect(xa, xb, G.neckTop - 6, neckH + 12, 'class="pos-band" rx="8"');
      });
    }

    // inlays sit in the gaps between strings, never on a string
    const gapY = (i) => (G.stringY(i) + G.stringY(i + 1)) / 2;
    const inlay = (f, y) => out.push(`<circle cx="${X(G.noteX(f))}" cy="${y}" r="7" fill="#e9e1cf" opacity=".75"/>`);
    SINGLE_INLAYS.forEach((f) => inlay(f, gapY(Math.floor((n - 2) / 2))));
    DOUBLE_INLAYS.forEach((f) => {
      inlay(f, gapY(Math.round((n - 2) * 0.25)));
      inlay(f, gapY(Math.round((n - 2) * 0.75)));
    });

    // frets and nut
    for (let f = 1; f <= MAX_FRET; f++) {
      rect(G.fretX[f] - 1.5, G.fretX[f] + 1.5, G.neckTop, neckH, 'fill="url(#fretMetal)"');
    }
    rect(G.nutX - 7, G.nutX, G.neckTop - 2, neckH + 4, 'fill="#efe8d6" rx="1.5"');

    // strings (thicker toward the low end), extended over the open-string area
    for (let s = 0; s < n; s++) {
      const y = G.stringY(s);
      const w = (0.9 + (n - 1 - s) * 0.38).toFixed(2);
      out.push(`<line x1="${X(G.nutX - 44)}" x2="${X(G.nutX - 7)}" y1="${y}" y2="${y}" stroke="#6f6a60" stroke-width="${w}"/>`);
      out.push(`<line x1="${X(G.nutX)}" x2="${X(G.fretX[MAX_FRET] + 12)}" y1="${y}" y2="${y}" stroke="#d6cfbf" stroke-width="${w}"/>`);
      out.push(`<text class="tuning-label" x="${X(G.labelW / 2)}" y="${y}">${T.display(stripOctave(state.tuning[s]))}</text>`);
    }

    // fret numbers
    for (let f = 0; f <= MAX_FRET; f++) {
      const inlay = SINGLE_INLAYS.includes(f) || DOUBLE_INLAYS.includes(f);
      out.push(`<text class="fret-num${inlay ? ' inlay' : ''}" x="${X(G.noteX(f))}" y="${G.neckBottom + 18}">${f}</text>`);
    }

    // notes
    for (let s = 0; s < n; s++) {
      for (let f = 0; f <= MAX_FRET; f++) {
        const marker = markerFor(s, f);
        if (marker) out.push(noteSvg(X(G.noteX(f)), G.stringY(s), s, f, marker));
      }
    }

    out.push('</svg>');
    els.fretboard.innerHTML = out.join('');
  }

  function markerFor(s, f) {
    const m = model;
    const midi = m.tuning[s] + f;
    const pc = T.mod(midi, 12);
    const scaleNote = m.pcInfo.get(pc);
    const inPos = !m.posCells || m.posCells.has(s + ':' + f);

    if (m.chord) {
      const tone = m.chord.tones.find((t) => t.pc === pc);
      if (tone) return { midi, cls: `role-${roleOf(tone.deg)}${inPos ? '' : ' ghost'}`, label: tone.name, deg: tone.deg, full: true };
      if (scaleNote && inPos) return { midi, cls: 'faint', label: scaleNote.name, deg: scaleNote.deg };
    } else if (scaleNote) {
      return { midi, cls: (scaleNote.deg === '1' ? 'root' : 'scale') + (inPos ? '' : ' ghost'), label: scaleNote.name, deg: scaleNote.deg, full: true };
    }
    if (state.showAll && !scaleNote) return { midi, cls: 'chrom', label: T.noteName(pc, m.flats) };
    return null;
  }

  function noteSvg(x, y, s, f, mk) {
    const big = mk.full;
    const withDeg = big && state.showIntervals;
    const r = big ? (withDeg ? 15 : 13.5) : 10;
    const name = T.display(mk.label);
    const degText = mk.deg ? ` (${T.displayDegree(mk.deg)})` : '';
    const title = `${T.display(T.midiToName(mk.midi, model.flats))} · string ${model.tuning.length - s}, fret ${f}${degText}`;
    let text;
    if (withDeg) {
      text = `<text y="-4">${name}</text><text class="sub" y="7">${T.displayDegree(mk.deg)}</text>`;
    } else {
      text = `<text>${name}</text>`;
    }
    return `<g class="note ${mk.cls}" data-midi="${mk.midi}" transform="translate(${x.toFixed(1)},${y})"><title>${title}</title><circle r="${r}"/>${text}</g>`;
  }

  function renderLegend() {
    const sw = (color, label) => `<span class="item"><span class="swatch" style="background:${color}"></span>${label}</span>`;
    let html;
    if (model.chord) {
      const roles = new Set(model.chord.tones.map((t) => roleOf(t.deg)));
      html = sw('var(--root)', 'Root');
      if (roles.has('3')) html += sw('var(--third)', '3rd');
      if (roles.has('5')) html += sw('var(--fifth)', '5th');
      if (roles.has('7')) html += sw('var(--seventh)', '7th');
      if (roles.has('x')) html += sw('var(--ext)', '2nd / 4th / 6th / 9th');
      html += sw('rgba(10,10,10,.6)', 'Other scale notes');
    } else {
      html = sw('var(--root)', 'Root') + sw('var(--scale)', 'Scale note');
    }
    if (model.position) html += sw('rgba(120,120,120,.25)', 'Outside selected position');
    if (state.showAll) html += sw('rgba(255,255,255,.08)', 'Not in scale');
    html += '<span class="item">Click any note to hear it</span>';
    els.legend.innerHTML = html;
  }

  function renderPositions() {
    const m = model;
    let html = `<button class="pos-btn ${state.position === null ? 'active' : ''}" data-pos="all"><b>All</b><small>whole neck</small></button>`;
    m.positions.forEach((p, i) => {
      const [lo, hi] = p.ranges[0];
      const startNote = m.notes.find((nn) => nn.deg === p.startDeg);
      html += `<button class="pos-btn ${state.position === i ? 'active' : ''}" data-pos="${i}" title="Starts on ${T.display(startNote.name)} (${T.displayDegree(p.startDeg)}) on the lowest string">
        <b>Position ${i + 1}</b><small>frets ${lo}–${hi} · from ${T.display(startNote.name)}</small></button>`;
    });
    els.positions.innerHTML = html;
  }

  function renderChords() {
    const m = model;
    const btn = (c) => `<div class="chord-item"><button class="chord-btn ${c.diatonic ? 'diatonic' : ''} ${state.chordKey === c.key ? 'active' : ''}"
      data-chord="${c.key}" title="${T.display(c.rootName)} ${c.type.name}: ${c.tones.map((t) => T.display(t.name)).join(' ')}">
      <b>${T.display(c.rootName)}${c.type.suffix}</b><small>${c.roman}</small></button><button class="play-btn" data-play="${c.key}" title="Play ${T.display(c.rootName)}${c.type.suffix}">▶</button></div>`;

    const sections = m.notes.length === 7
      ? [
        ['Diatonic triads', m.chords.filter((c) => c.diatonic && c.type.group === 'triad')],
        ['Diatonic seventh chords', m.chords.filter((c) => c.diatonic && c.type.group === 'seventh')],
        ['More chords from this scale', m.chords.filter((c) => !c.diatonic)],
      ]
      : [
        ['Triads', m.chords.filter((c) => c.type.group === 'triad')],
        ['Seventh chords', m.chords.filter((c) => c.type.group === 'seventh')],
        ['Sus, added & extended', m.chords.filter((c) => c.type.group === 'other')],
      ];

    const html = sections.filter(([, list]) => list.length).map(([title, list]) =>
      `<div class="chord-group"><h3>${title}</h3><div class="btn-row">${list.map(btn).join('')}</div></div>`
    ).join('');
    els.chords.innerHTML = html || '<div class="empty">No common chords fit entirely inside this scale.</div>';

    if (m.chord) {
      const c = m.chord;
      els.chordInfo.innerHTML = `<b>${T.display(c.rootName)}${c.type.suffix}</b> (${c.roman}, ${c.type.name}) — ` +
        c.tones.map((t) => `<b>${T.display(t.name)}</b> ${T.displayDegree(t.deg)}`).join(' · ') + ' · Esc to clear';
    } else {
      els.chordInfo.textContent = 'Click a chord to show every place its notes occur · Esc to clear';
    }
  }

  function update() {
    model = buildModel();
    syncControls();
    renderSummary();
    renderFretboard();
    renderLegend();
    renderPositions();
    renderChords();
    saveState();
  }

  // ---------- sound ----------

  let audio = null;
  // Strum the chord low → high: root between A2 and G♯3, each tone stacked above
  // the previous one, and the root doubled an octave up for a fuller sound.
  function playChord(chord) {
    if (!chord) return;
    let midi = 45 + T.mod(chord.tones[0].pc - 45, 12);
    const voicing = [midi];
    chord.tones.slice(1).forEach((t) => {
      midi += T.mod(t.pc - midi, 12) || 12;
      voicing.push(midi);
    });
    voicing.push(voicing[0] + 12);
    voicing.sort((a, b) => a - b).forEach((m, i) => pluck(m, i * 0.045));
  }

  function pluck(midi, delay = 0) {
    audio = audio || new AudioContext();
    const t = audio.currentTime + delay;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);

    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.35, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);

    const filter = audio.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 8, 12000), t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 200), t + 0.6);

    [['sawtooth', 1, 0.5], ['triangle', 2, 0.3], ['sine', 1, 0.6]].forEach(([type, mult, level]) => {
      const osc = audio.createOscillator();
      const g = audio.createGain();
      osc.type = type;
      osc.frequency.value = freq * mult;
      g.gain.value = level;
      osc.connect(g).connect(filter);
      osc.start(t);
      osc.stop(t + 1.9);
    });
    filter.connect(gain).connect(audio.destination);
  }

  initControls();
  update();
})();
