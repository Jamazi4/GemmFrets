# GemmFrets

**An interactive guitar fretboard for learning scales, box positions and chords in any tuning.**

▶ **Open it in your browser: https://jamazi4.github.io/GemmFrets/**

GemmFrets draws a full 24-fret guitar neck and shows where every note of a scale sits on it, with each note labelled by name. Pick a tuning, a root note and a scale, and the whole fretboard lights up. Narrow it down to a single box position to learn the scale one area at a time, or click a chord to see every place its notes appear.

## Features

- **24-fret neck** with every note labelled by name, correctly spelled for the key (for example, F♯ in D major and G♭ in D♭ major).
- **Tunings for 6, 7 and 8 strings:** standard tunings from E down to G, drop tunings from Drop D down to Drop F, DADGAD and open tunings. You can also retune any string a semitone at a time, or add and remove strings, to build your own.
- **18 scales:** the major modes (Ionian to Locrian), minor and major pentatonic, minor and major blues, harmonic, melodic and Hungarian minor, phrygian dominant, whole tone and both diminished scales.
- **Box positions:** pentatonic scales use the five classic boxes, and seven-note scales use 3-notes-per-string shapes. The blues boxes include the ♭5. Shapes are worked out from the actual string pitches, so they adjust to drop and open tunings.
- **Chords in the scale:** every chord that fits inside the scale, with Roman numerals and the diatonic triads and seventh chords listed first. Clicking a chord highlights all its notes across the neck, coloured by role (root, 3rd, 5th, 7th, extensions).
- **Sound:** click any note on the neck to hear it, or press ▶ next to a chord to hear it strummed.
- **Display options:** interval labels, notes outside the scale, low string on top, and a left-handed layout. Your settings are remembered in your browser.

## How to use it

1. Choose a **tuning**, a **root** note and a **scale** at the top.
2. Under **Positions**, pick a box to focus on one area of the neck, or choose **All** for the whole neck. The **←** and **→** keys step through the boxes.
3. Under **Chords in this scale**, click a chord to show its notes on the neck. Click it again, or press **Esc**, to clear it.

## Running it locally

GemmFrets is plain HTML, CSS and JavaScript, with no build step and no dependencies. Download this repository and open `index.html` in any modern browser.
