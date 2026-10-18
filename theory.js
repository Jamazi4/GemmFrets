// Music theory helpers: note spelling, scales, chords and box positions.
// Works both in the browser (window.Theory) and in Node (module.exports) for tests.
(function (global) {
  'use strict';

  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const NATURAL_PC = [0, 2, 4, 5, 7, 9, 11];
  const MAJOR_SEMIS = [0, 2, 4, 5, 7, 9, 11];
  const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  const mod = (n, m) => ((n % m) + m) % m;

  // "C#", "Bb", "F##", "Eb2" -> { letter, acc, pc, octave, midi }
  function parseNote(name) {
    const m = /^([A-Ga-g])([#b]*)(-?\d+)?$/.exec(String(name).trim());
    if (!m) throw new Error('Invalid note name: ' + name);
    const letter = LETTERS.indexOf(m[1].toUpperCase());
    let acc = 0;
    for (const c of m[2]) acc += c === '#' ? 1 : -1;
    const pc = mod(NATURAL_PC[letter] + acc, 12);
    const octave = m[3] !== undefined ? parseInt(m[3], 10) : null;
    const midi = octave !== null ? (octave + 1) * 12 + NATURAL_PC[letter] + acc : null;
    return { letter, acc, pc, octave, midi };
  }

  // "b3", "#4", "bb7", "9" -> { num, acc, semis }
  function parseDegree(deg) {
    const m = /^([#b]*)(\d+)$/.exec(deg);
    if (!m) throw new Error('Invalid degree: ' + deg);
    let acc = 0;
    for (const c of m[1]) acc += c === '#' ? 1 : -1;
    const num = parseInt(m[2], 10);
    const semis = MAJOR_SEMIS[(num - 1) % 7] + 12 * Math.floor((num - 1) / 7) + acc;
    return { num, acc, semis };
  }

  function accidentalString(acc) {
    return acc > 0 ? '#'.repeat(acc) : 'b'.repeat(-acc);
  }

  // Spell the note at a given degree above a root, keeping letter names correct
  // (e.g. spell('G#', '7') -> 'F##', spell('Db', 'b3') -> 'Fb').
  function spell(rootName, deg) {
    const r = parseNote(rootName);
    const d = parseDegree(deg);
    const letter = (r.letter + d.num - 1) % 7;
    const pc = mod(r.pc + d.semis, 12);
    const acc = mod(pc - NATURAL_PC[letter] + 6, 12) - 6;
    return LETTERS[letter] + accidentalString(acc);
  }

  // Pretty-print with real sharp/flat glyphs.
  function display(name) {
    return name.charAt(0) + name.slice(1).replace(/#/g, '♯').replace(/b/g, '♭');
  }

  function displayDegree(deg) {
    if (deg === '1') return 'R';
    return deg.replace(/b/g, '♭').replace(/#/g, '♯');
  }

  function noteName(pc, flats) {
    return (flats ? FLAT_NAMES : SHARP_NAMES)[mod(pc, 12)];
  }

  function midiToName(midi, flats) {
    return noteName(midi, flats) + (Math.floor(midi / 12) - 1);
  }

  // `base` (optional): subset used to build box shapes; the remaining notes are
  // slotted into each box (e.g. the blue note added to the pentatonic boxes).
  // `nps`: notes per string when building positions.
  const SCALES = [
    { id: 'major', name: 'Major (Ionian)', group: 'Major & modes', formula: ['1', '2', '3', '4', '5', '6', '7'] },
    { id: 'dorian', name: 'Dorian', group: 'Major & modes', formula: ['1', '2', 'b3', '4', '5', '6', 'b7'] },
    { id: 'phrygian', name: 'Phrygian', group: 'Major & modes', formula: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'] },
    { id: 'lydian', name: 'Lydian', group: 'Major & modes', formula: ['1', '2', '3', '#4', '5', '6', '7'] },
    { id: 'mixolydian', name: 'Mixolydian', group: 'Major & modes', formula: ['1', '2', '3', '4', '5', '6', 'b7'] },
    { id: 'minor', name: 'Natural Minor (Aeolian)', group: 'Major & modes', formula: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
    { id: 'locrian', name: 'Locrian', group: 'Major & modes', formula: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'] },

    { id: 'minor_pentatonic', name: 'Minor Pentatonic', group: 'Pentatonic & blues', formula: ['1', 'b3', '4', '5', 'b7'] },
    { id: 'major_pentatonic', name: 'Major Pentatonic', group: 'Pentatonic & blues', formula: ['1', '2', '3', '5', '6'] },
    { id: 'blues', name: 'Blues (Minor)', group: 'Pentatonic & blues', formula: ['1', 'b3', '4', 'b5', '5', 'b7'], base: ['1', 'b3', '4', '5', 'b7'] },
    { id: 'major_blues', name: 'Major Blues', group: 'Pentatonic & blues', formula: ['1', '2', 'b3', '3', '5', '6'], base: ['1', '2', '3', '5', '6'] },

    { id: 'harmonic_minor', name: 'Harmonic Minor', group: 'Minor variants', formula: ['1', '2', 'b3', '4', '5', 'b6', '7'] },
    { id: 'melodic_minor', name: 'Melodic Minor', group: 'Minor variants', formula: ['1', '2', 'b3', '4', '5', '6', '7'] },
    { id: 'phrygian_dominant', name: 'Phrygian Dominant', group: 'Minor variants', formula: ['1', 'b2', '3', '4', '5', 'b6', 'b7'] },
    { id: 'hungarian_minor', name: 'Hungarian Minor', group: 'Minor variants', formula: ['1', '2', 'b3', '#4', '5', 'b6', '7'] },

    { id: 'whole_tone', name: 'Whole Tone', group: 'Symmetric', formula: ['1', '2', '3', '#4', '#5', 'b7'] },
    { id: 'dim_hw', name: 'Diminished (Half-Whole)', group: 'Symmetric', formula: ['1', 'b2', 'b3', '3', '#4', '5', '6', 'b7'] },
    { id: 'dim_wh', name: 'Diminished (Whole-Half)', group: 'Symmetric', formula: ['1', '2', 'b3', '4', 'b5', '#5', '6', '7'] },
  ];

  const CHORD_TYPES = [
    { id: 'maj', suffix: '', name: 'major', group: 'triad', formula: ['1', '3', '5'] },
    { id: 'min', suffix: 'm', name: 'minor', group: 'triad', formula: ['1', 'b3', '5'] },
    { id: 'dim', suffix: '°', name: 'diminished', group: 'triad', formula: ['1', 'b3', 'b5'] },
    { id: 'aug', suffix: '+', name: 'augmented', group: 'triad', formula: ['1', '3', '#5'] },

    { id: 'maj7', suffix: 'maj7', name: 'major 7th', group: 'seventh', formula: ['1', '3', '5', '7'] },
    { id: '7', suffix: '7', name: 'dominant 7th', group: 'seventh', formula: ['1', '3', '5', 'b7'] },
    { id: 'm7', suffix: 'm7', name: 'minor 7th', group: 'seventh', formula: ['1', 'b3', '5', 'b7'] },
    { id: 'mmaj7', suffix: 'm(maj7)', name: 'minor-major 7th', group: 'seventh', formula: ['1', 'b3', '5', '7'] },
    { id: 'm7b5', suffix: 'm7♭5', name: 'half-diminished', group: 'seventh', formula: ['1', 'b3', 'b5', 'b7'] },
    { id: 'dim7', suffix: '°7', name: 'diminished 7th', group: 'seventh', formula: ['1', 'b3', 'b5', 'bb7'] },
    { id: 'augmaj7', suffix: '+maj7', name: 'augmented major 7th', group: 'seventh', formula: ['1', '3', '#5', '7'] },
    { id: 'aug7', suffix: '+7', name: 'augmented 7th', group: 'seventh', formula: ['1', '3', '#5', 'b7'] },

    { id: 'sus2', suffix: 'sus2', name: 'suspended 2nd', group: 'other', formula: ['1', '2', '5'] },
    { id: 'sus4', suffix: 'sus4', name: 'suspended 4th', group: 'other', formula: ['1', '4', '5'] },
    { id: '7sus4', suffix: '7sus4', name: 'dominant 7th sus4', group: 'other', formula: ['1', '4', '5', 'b7'] },
    { id: '6', suffix: '6', name: 'major 6th', group: 'other', formula: ['1', '3', '5', '6'] },
    { id: 'm6', suffix: 'm6', name: 'minor 6th', group: 'other', formula: ['1', 'b3', '5', '6'] },
    { id: 'add9', suffix: 'add9', name: 'added 9th', group: 'other', formula: ['1', '3', '5', '9'] },
    { id: 'madd9', suffix: 'm(add9)', name: 'minor added 9th', group: 'other', formula: ['1', 'b3', '5', '9'] },
    { id: 'maj9', suffix: 'maj9', name: 'major 9th', group: 'other', formula: ['1', '3', '5', '7', '9'] },
    { id: '9', suffix: '9', name: 'dominant 9th', group: 'other', formula: ['1', '3', '5', 'b7', '9'] },
    { id: 'm9', suffix: 'm9', name: 'minor 9th', group: 'other', formula: ['1', 'b3', '5', 'b7', '9'] },
  ];

  function scaleNotes(rootName, scale) {
    return scale.formula.map((deg) => {
      const name = spell(rootName, deg);
      return { deg, name, pc: parseNote(name).pc };
    });
  }

  function romanFor(deg, type) {
    const d = parseDegree(deg);
    let r = ROMAN[(d.num - 1) % 7];
    if (type.formula.includes('b3') && !type.formula.includes('3')) r = r.toLowerCase();
    const acc = d.acc > 0 ? '♯'.repeat(d.acc) : '♭'.repeat(-d.acc);
    let quality = '';
    if (type.id === 'dim' || type.id === 'dim7') quality = '°';
    else if (type.id === 'm7b5') quality = 'ø';
    else if (type.id.startsWith('aug')) quality = '+';
    return acc + r + quality;
  }

  const pcSetKey = (pcs) => [...new Set(pcs)].sort((a, b) => a - b).join(',');

  // Every chord type (from CHORD_TYPES) built on every scale degree whose tones all
  // lie inside the scale. For 7-note scales, stacked-thirds chords are flagged diatonic.
  function findChords(rootName, scale) {
    const notes = scaleNotes(rootName, scale);
    const inScale = new Set(notes.map((n) => n.pc));
    const heptatonic = notes.length === 7;
    const chords = [];

    notes.forEach((root, i) => {
      const stacked = (count) => pcSetKey([0, 2, 4, 6].slice(0, count).map((o) => notes[(i + o) % 7].pc));
      const triadKey = heptatonic ? stacked(3) : null;
      const seventhKey = heptatonic ? stacked(4) : null;

      for (const type of CHORD_TYPES) {
        const tones = type.formula.map((deg) => {
          const name = spell(root.name, deg);
          return { deg, name, pc: parseNote(name).pc };
        });
        if (!tones.every((t) => inScale.has(t.pc))) continue;
        const key = pcSetKey(tones.map((t) => t.pc));
        chords.push({
          key: root.deg + '|' + type.id,
          rootDeg: root.deg,
          rootName: root.name,
          type,
          name: root.name + type.suffix,
          roman: romanFor(root.deg, type),
          tones,
          diatonic: heptatonic && (key === triadKey || key === seventhKey),
        });
      }
    });
    return chords;
  }

  // Box positions. Each position starts on the next scale degree on the lowest
  // string and climbs the scale taking `nps` notes per string (2 for pentatonic
  // boxes, 3 for 3-notes-per-string patterns). Because it walks real pitches it
  // adapts to any tuning, including drop and open tunings.
  function computePositions(tuningMidis, scale, notes, maxFret) {
    const baseDegs = scale.base || scale.formula;
    const pcOf = new Map(notes.map((n) => [n.deg, n.pc]));
    const basePcs = baseDegs.map((d) => pcOf.get(d));
    const baseSet = new Set(basePcs);
    const extraPcs = new Set(notes.map((n) => n.pc).filter((pc) => !baseSet.has(pc)));
    const nps = scale.nps || (baseDegs.length <= 5 ? 2 : 3);
    const strings = tuningMidis.length;

    const nextBase = (p) => {
      let q = p + 1;
      while (!baseSet.has(mod(q, 12))) q++;
      return q;
    };

    return basePcs.map((pc, k) => {
      let pitch = tuningMidis[0] + mod(pc - tuningMidis[0], 12);
      const seq = [];
      for (let s = 0; s < strings; s++) {
        for (let j = 0; j < nps; j++) {
          seq.push({ string: s, pitch, fret: pitch - tuningMidis[s], extra: false });
          pitch = nextBase(pitch);
        }
      }

      const lo = Math.min(...seq.map((c) => c.fret));
      const hi = Math.max(...seq.map((c) => c.fret));
      const cells = seq.slice();

      // Slot the non-box notes (e.g. blue notes) between their neighbours,
      // choosing whichever string keeps them inside the box.
      if (extraPcs.size) {
        for (let i = 0; i < seq.length - 1; i++) {
          const a = seq[i];
          const b = seq[i + 1];
          for (let p = a.pitch + 1; p < b.pitch; p++) {
            if (!extraPcs.has(mod(p, 12))) continue;
            const onA = { string: a.string, fret: a.fret + (p - a.pitch) };
            const onB = { string: b.string, fret: b.fret - (b.pitch - p) };
            const dist = (c) => (c.fret < lo ? lo - c.fret : c.fret > hi ? c.fret - hi : 0);
            const pick = a.string === b.string || dist(onA) <= dist(onB) ? onA : onB;
            cells.push({ string: pick.string, pitch: p, fret: pick.fret, extra: true });
          }
        }
      }

      let minFret = Math.min(...cells.map((c) => c.fret));
      if (minFret < 0) {
        const shift = 12 * Math.ceil(-minFret / 12);
        cells.forEach((c) => { c.fret += shift; c.pitch += shift; });
      }
      minFret = Math.min(...cells.map((c) => c.fret));
      const maxCell = Math.max(...cells.map((c) => c.fret));

      // Repeat the shape in every octave where it fits on the neck.
      const placed = [];
      const ranges = [];
      for (let o = -48; o <= 48; o += 12) {
        if (minFret + o < 0 || maxCell + o > maxFret) continue;
        ranges.push([minFret + o, maxCell + o]);
        cells.forEach((c) => placed.push({ ...c, fret: c.fret + o, pitch: c.pitch + o }));
      }
      if (!placed.length) {
        cells.filter((c) => c.fret <= maxFret).forEach((c) => placed.push(c));
        ranges.push([minFret, Math.min(maxCell, maxFret)]);
      }

      return { index: k, startDeg: baseDegs[k], ranges, cells: placed };
    });
  }

  const Theory = {
    LETTERS, SHARP_NAMES, FLAT_NAMES, SCALES, CHORD_TYPES,
    mod, parseNote, parseDegree, spell, display, displayDegree, noteName, midiToName,
    scaleNotes, findChords, computePositions,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = Theory;
  else global.Theory = Theory;
})(typeof window !== 'undefined' ? window : globalThis);
