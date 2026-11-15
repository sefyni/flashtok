/* =====================================================================
   FlashTok — sons et musique, générés en direct (aucun fichier audio).
   SFX   : petits sons satisfaisants pour chaque action
   Music : lo-fi génératif (piano électrique, contrebasse, balais, vinyle)
           ou piano + pluie, ou tes propres mp3 (window.MUSIQUES dans cards.js)
   ===================================================================== */
(function () {
  let ac = null, master, sfxBus, musicBus, musicFilter, comp;
  const prefs = (() => { try { return JSON.parse(localStorage.getItem("flashtok-audio")) || {}; } catch (e) { return {}; } })();
  const P = Object.assign({ sfx: true, music: "lofi", vol: 0.4, sfxVol: 0.35 }, prefs);
  if (!prefs.v2) { P.vol = Math.min(P.vol, 0.4); P.sfxVol = 0.35; P.v2 = true; }   // v2 : tout plus doux
  const savePrefs = () => { try { localStorage.setItem("flashtok-audio", JSON.stringify(P)); } catch (e) {} };

  function init() {
    if (ac) { if (ac.state === "suspended") ac.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    ac = new AC();
    comp = ac.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3; comp.connect(ac.destination);
    master = ac.createGain(); master.gain.value = 0.9; master.connect(comp);
    sfxBus = ac.createGain(); sfxBus.gain.value = P.sfxVol;
    const soft = ac.createBiquadFilter(); soft.type = "lowpass"; soft.frequency.value = 4200; soft.Q.value = 0.3;   // arrondit tous les sons
    sfxBus.connect(soft); soft.connect(master);
    musicFilter = ac.createBiquadFilter(); musicFilter.type = "lowpass"; musicFilter.frequency.value = 3800; musicFilter.Q.value = 0.4;
    musicBus = ac.createGain(); musicBus.gain.value = 0; musicFilter.connect(musicBus); musicBus.connect(master);
    return true;
  }
  const now = () => ac.currentTime;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  /* ---------- briques ---------- */
  function env(g, t, a, peak, d, sustain = 0.0001) {
    g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(sustain, t + a + d);
  }
  function tone({ f, t = now(), type = "sine", a = 0.005, d = 0.2, v = 0.3, to = null, glide = 0.1, dest = sfxBus, pan = 0 }) {
    const o = ac.createOscillator(), g = ac.createGain(), p = ac.createStereoPanner();
    o.type = type; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + glide);
    env(g, t, a, v, d); p.pan.value = pan; o.connect(g); g.connect(p); p.connect(dest); o.start(t); o.stop(t + a + d + 0.05);
  }
  let noiseBuf = null;
  function noise() {
    if (noiseBuf) return noiseBuf;
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  function burst({ t = now(), d = 0.15, v = 0.2, type = "bandpass", f = 2000, to = null, q = 1, dest = sfxBus, a = 0.003 }) {
    const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noise(); s.playbackRate.value = 0.8 + Math.random() * 0.4;
    fl.type = type; fl.frequency.setValueAtTime(f, t); if (to) fl.frequency.exponentialRampToValueAtTime(to, t + d); fl.Q.value = q;
    env(g, t, a, v, d); s.connect(fl); fl.connect(g); g.connect(dest); s.start(t, Math.random()); s.stop(t + a + d + 0.05);
  }
  // cloche douce (synthèse FM) — pour les « ding »
  function bell(f, t = now(), v = 0.25, d = 1.2, dest = sfxBus, pan = 0) {
    const c = ac.createOscillator(), m = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain(), p = ac.createStereoPanner();
    c.frequency.value = f; m.frequency.value = f * 3.5;
    mg.gain.setValueAtTime(f * 2.2, t); mg.gain.exponentialRampToValueAtTime(f * 0.05, t + d * 0.6);
    m.connect(mg); mg.connect(c.frequency); env(g, t, 0.003, v, d); p.pan.value = pan;
    c.connect(g); g.connect(p); p.connect(dest); c.start(t); m.start(t); c.stop(t + d + 0.1); m.stop(t + d + 0.1);
  }

  // kalimba / marimba : son de bois chaud, très court — base de tous les « ding »
  function kalimba(f, t = now(), v = 0.2, d = 0.55, pan = 0) {
    const p = ac.createStereoPanner(); p.pan.value = pan; p.connect(sfxBus);
    [[1, 1, d], [3.9, 0.18, d * 0.25], [2, 0.08, d * 0.5]].forEach(([r, amp, dd]) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = f * r; env(g, t, 0.002, v * amp, dd); o.connect(g); g.connect(p); o.start(t); o.stop(t + dd + 0.05);
    });
    burst({ t, d: 0.012, v: v * 0.25, f: 2500, type: "lowpass" });            // petit « toc » d'attaque
  }
  // bulle qui éclate : la fréquence MONTE très vite (c'est ça qui fait « satisfaisant »)
  function bubble(t = now(), v = 0.16, f0 = 380, f1 = 1100) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + 0.035);
    env(g, t, 0.003, v, 0.07); o.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + 0.12);
  }

  /* ---------- sons d'interface ---------- */
  const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];   // gamme pentatonique : toujours harmonieux
  const SFX = {
    flip()  { if (!P.sfx || !init()) return; burst({ d: 0.07, v: 0.05, f: 1200, to: 2600, q: 0.7 }); },        // feuille qu'on tourne
    tap()   { if (!P.sfx || !init()) return; bubble(now(), 0.06, 600, 1200); },
    tick()  {},                                                // retiré : trop présent
    swoosh(){ if (!P.sfx || !init()) return; burst({ d: 0.12, v: 0.035, f: 600, to: 1800, q: 0.6 }); },
    ok(combo = 1) {                                            // bulle + note de kalimba qui monte avec le combo
      if (!P.sfx || !init()) return;
      const t = now(), step = PENTA[Math.min(combo - 1, PENTA.length - 1)];
      bubble(t, 0.14);
      kalimba(mtof(72 + step), t + 0.03, 0.2, 0.6, 0.1);
    },
    ko()    { if (!P.sfx || !init()) return; kalimba(mtof(62), now(), 0.12, 0.35); },                  // un seul « tok » grave
    quizOk(){ if (!P.sfx || !init()) return; const t = now(); bubble(t, 0.12); kalimba(mtof(76), t + 0.02, 0.17, 0.5, -0.2); kalimba(mtof(83), t + 0.11, 0.17, 0.7, 0.2); },
    quizKo(){ if (!P.sfx || !init()) return; const t = now(); kalimba(mtof(57), t, 0.13, 0.3); kalimba(mtof(56), t + 0.1, 0.1, 0.35); },
    combo(n){ if (!P.sfx || !init()) return; const t = now(); [0, 4, 7, 12].forEach((s, i) => kalimba(mtof(79 + s), t + i * 0.06, 0.1, 0.45, (i - 1.5) * 0.3)); },
    fanfare(){ if (!P.sfx || !init()) return; const t = now(); [0, 4, 7, 12, 16].forEach((s, i) => kalimba(mtof(72 + s), t + i * 0.08, 0.13, 0.8, (i - 2) * 0.25)); },
  };

  /* =====================================================================
     MUSIQUE GÉNÉRATIVE
     ===================================================================== */
  const BPM = { lofi: 74, pluie: 62, jazz: 96, foret: 50 };
  // progression lo-fi en fa : Fmaj9 – Em7 – Dm9 – Dbmaj7(#11)
  const CHORDS = [
    { bass: 41, notes: [57, 60, 64, 67] },
    { bass: 40, notes: [55, 59, 62, 66] },
    { bass: 38, notes: [53, 57, 60, 64] },
    { bass: 37, notes: [53, 56, 60, 67] },
  ];
  const MEL = [72, 74, 76, 79, 81, 84];                         // pentatonique de fa (haut)
  // jazz de nuit en si bémol : Cm9 – F13 – Bbmaj9 – G7(b9), voicings sans fondamentale
  const JCHORDS = [
    { bass: 36, tones: [36, 39, 43, 46], notes: [58, 62, 63, 67] },
    { bass: 41, tones: [41, 45, 48, 51], notes: [57, 62, 63, 67] },
    { bass: 34, tones: [34, 38, 41, 45], notes: [57, 60, 62, 65] },
    { bass: 43, tones: [43, 47, 50, 53], notes: [59, 62, 65, 68] },
  ];
  const JMEL = [70, 72, 74, 77, 79, 82];
  // forêt calme : Cmaj7 – Am9 – Fmaj7 – G6 en nappes lentes
  const FCHORDS = [ { bass: 36, notes: [55, 59, 64, 71] }, { bass: 33, notes: [55, 60, 64, 71] }, { bass: 29, notes: [57, 60, 64, 69] }, { bass: 31, notes: [55, 59, 62, 64] } ];
  let playing = null, timer = null, step = 0, nextT = 0, ambient = [], fileAudio = null;

  // piano électrique façon Rhodes : FM + petite « morsure » d'attaque + trémolo stéréo
  function rhodes(m, t, v, d) {
    const f = mtof(m);
    const c = ac.createOscillator(), mod = ac.createOscillator(), mg = ac.createGain();
    const bark = ac.createOscillator(), bg = ac.createGain(), g = ac.createGain(), p = ac.createStereoPanner(), lfo = ac.createOscillator(), lg = ac.createGain();
    c.frequency.value = f; mod.frequency.value = f;
    mg.gain.setValueAtTime(f * 1.6 * v, t); mg.gain.exponentialRampToValueAtTime(f * 0.12, t + 0.9);
    mod.connect(mg); mg.connect(c.frequency);
    bark.frequency.value = f * 14; bg.gain.setValueAtTime(f * 3 * v, t); bg.gain.exponentialRampToValueAtTime(1, t + 0.06);
    bark.connect(bg); bg.connect(c.frequency);
    env(g, t, 0.006, 0.11 * v, d);
    lfo.frequency.value = 4.2; lg.gain.value = 0.35; lfo.connect(lg); lg.connect(p.pan);
    c.connect(g); g.connect(p); p.connect(musicFilter);
    [c, mod, bark, lfo].forEach(o => { o.start(t); o.stop(t + d + 0.2); });
  }
  // contrebasse douce : sinus + triangle filtré, attaque pincée
  function bass(m, t, d) {
    const f = mtof(m), o1 = ac.createOscillator(), o2 = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain();
    o1.frequency.value = f; o2.type = "triangle"; o2.frequency.value = f; fl.type = "lowpass"; fl.frequency.setValueAtTime(900, t); fl.frequency.exponentialRampToValueAtTime(260, t + 0.25);
    const g2 = ac.createGain(); g2.gain.value = 0.35;
    env(g, t, 0.01, 0.32, d); o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(fl); fl.connect(musicFilter);
    [o1, o2].forEach(o => { o.start(t); o.stop(t + d + 0.1); });
  }
  function kick(t, v = 1) { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.13); env(g, t, 0.003, 0.5 * v, 0.28); o.connect(g); g.connect(musicFilter); o.start(t); o.stop(t + 0.35); }
  const brush = (t, v = 1) => burst({ t, d: 0.18, v: 0.07 * v, f: 2200, q: 0.6, dest: musicFilter, a: 0.008 });
  const hat = (t, v = 1) => burst({ t, d: 0.035, v: 0.03 * v, f: 9000, type: "highpass", dest: musicFilter });

  // nappe douce (forêt) : deux ondes légèrement désaccordées, attaque lente
  function pad(m, t, d, v = 0.05) {
    const f = mtof(m), fl = ac.createBiquadFilter(), g = ac.createGain(), p = ac.createStereoPanner();
    fl.type = "lowpass"; fl.frequency.value = 1100; p.pan.value = (Math.random() - 0.5) * 0.8;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + d * 0.35); g.gain.linearRampToValueAtTime(0.0001, t + d);
    [-4, 4].forEach((cents, i) => { const o = ac.createOscillator(); o.type = i ? "sine" : "triangle"; o.frequency.value = f; o.detune.value = cents; o.connect(fl); o.start(t); o.stop(t + d + 0.1); });
    fl.connect(g); g.connect(p); p.connect(musicFilter);
  }
  // petit oiseau : 2 à 4 gazouillis rapides
  function bird(t) {
    const p = ac.createStereoPanner(); p.pan.value = (Math.random() - 0.5) * 1.6; p.connect(musicFilter);
    const n = 2 + (Math.random() * 3 | 0), base = 2600 + Math.random() * 1400;
    for (let k = 0; k < n; k++) { const o = ac.createOscillator(), g = ac.createGain(), tt = t + k * (0.09 + Math.random() * 0.05);
      o.frequency.setValueAtTime(base, tt); o.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * 0.3), tt + 0.05);
      env(g, tt, 0.005, 0.018, 0.07); o.connect(g); g.connect(p); o.start(tt); o.stop(tt + 0.1); }
  }
  const ride = (t, v = 1) => burst({ t, d: 0.32, v: 0.022 * v, f: 7000, type: "highpass", dest: musicFilter, a: 0.002 });

  function loopNoise(build) {                                   // ambiance en boucle (vinyle, pluie)
    const len = ac.sampleRate * 4, b = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) build(b.getChannelData(ch));
    const s = ac.createBufferSource(); s.buffer = b; s.loop = true; return s;
  }
  function vinyl() {
    const s = loopNoise(d => { for (let i = 0; i < d.length; i++) { d[i] = (Math.random() * 2 - 1) * 0.012; if (Math.random() < 0.00018) d[i] += (Math.random() - 0.5) * 0.9; } });
    const fl = ac.createBiquadFilter(); fl.type = "bandpass"; fl.frequency.value = 3000; fl.Q.value = 0.5;
    const g = ac.createGain(); g.gain.value = 0.5; s.connect(fl); fl.connect(g); g.connect(musicBus); s.start(); return s;
  }
  function rain() {
    const s = loopNoise(d => { let last = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.04 * w) / 1.04; d[i] = last * 3 + (Math.random() < 0.002 ? (Math.random() - 0.5) * 0.25 : 0); } });
    const fl = ac.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = 1800;
    const g = ac.createGain(); g.gain.value = 0.55; s.connect(fl); fl.connect(g); g.connect(musicBus); s.start(); return s;
  }

  function wind() {
    const s = loopNoise(d => { let last = 0; for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 4; } });
    const fl = ac.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = 520;
    const g = ac.createGain(); g.gain.value = 0.3; const lfo = ac.createOscillator(), lg = ac.createGain();
    lfo.frequency.value = 0.07; lg.gain.value = 0.18; lfo.connect(lg); lg.connect(g.gain); lfo.start();
    s.connect(fl); fl.connect(g); g.connect(musicBus); s.start(); return { stop(){ s.stop(); lfo.stop(); } };
  }

  function schedule() {
    const mode = playing, spb = 60 / BPM[mode], eighth = spb / 2;
    while (nextT < now() + 0.25) {
      const bar = Math.floor(step / 8) % CHORDS.length, e = step % 8, ch = CHORDS[bar];
      const swing = e % 2 ? eighth * (mode === "jazz" ? 0.33 : 0.18) : 0, t = nextT + swing, hum = () => (Math.random() - 0.5) * 0.012;
      if (mode === "jazz") {
        const jc = JCHORDS[bar], nx = JCHORDS[(bar + 1) % JCHORDS.length];
        if (e % 2 === 0) {                                      // contrebasse qui marche : une note par temps
          const beat = e / 2, walk = [jc.tones[0], jc.tones[1 + (Math.random() * 2 | 0)], jc.tones[2 + (Math.random() * 2 | 0)] - (Math.random() < 0.3 ? 12 : 0), nx.bass + (Math.random() < 0.5 ? 1 : -1)];
          bass(walk[beat], t + hum(), spb * 0.95);
          ride(t + hum(), beat % 2 ? 1 : 0.8);
          if (beat % 2) burst({ t: t + hum(), d: 0.03, v: 0.025, f: 8000, type: "highpass", dest: musicFilter });   // charleston au pied
        } else if (e === 3 || e === 7) ride(t + hum(), 0.55);
        if (e === 1 && Math.random() < 0.7) jc.notes.forEach((n, i) => rhodes(n, t + i * 0.012 + hum(), 0.6, spb * 1.2));
        if (e === 4 && Math.random() < 0.5) jc.notes.forEach((n, i) => rhodes(n, t + i * 0.012 + hum(), 0.5, spb * 0.8));
        if (e === 6 && Math.random() < 0.35) jc.notes.slice(1).forEach((n, i) => rhodes(n, t + i * 0.012 + hum(), 0.45, spb * 0.9));
        if (Math.random() < 0.18) rhodes(JMEL[Math.random() * JMEL.length | 0], t + hum(), 0.55, spb * 0.9);
        if (e === 2 || e === 6) brush(t + hum(), 0.6);
      } else if (mode === "foret") {
        const fc = FCHORDS[bar];
        if (e === 0) { fc.notes.forEach(n => pad(n, t, spb * 4.6, 0.045)); pad(fc.bass + 12, t, spb * 4.6, 0.05); }
        if (e % 2 === 1 && Math.random() < 0.25) rhodes(MEL[Math.random() * MEL.length | 0] - 5 + 12, t + hum(), 0.35, spb * 2);
        if (Math.random() < 0.09) bird(t + Math.random() * 0.3);
      } else if (mode === "lofi") {
        if (e === 0) { ch.notes.forEach((n, i) => rhodes(n, t + i * 0.018 + hum(), 0.9, spb * 3.2)); bass(ch.bass, t, spb * 1.6); }
        if (e === 3) ch.notes.slice(1).forEach((n, i) => rhodes(n, t + i * 0.015 + hum(), 0.55, spb * 1.5));
        if (e === 5) bass(ch.bass + (Math.random() < 0.5 ? 7 : 12), t, spb * 0.9);
        if (e === 0 || (e === 5 && Math.random() < 0.5)) kick(t + hum(), e ? 0.7 : 1);
        if (e === 2 || e === 6) brush(t + hum());
        hat(t + hum(), e % 2 ? 0.6 : 1);
        if (e % 2 === 0 && Math.random() < 0.22) rhodes(MEL[Math.floor(Math.random() * MEL.length)], t + hum(), 0.6, spb * 1.4);
      } else {                                                  // piano & pluie : plus lent, sans batterie
        if (e === 0) { bass(ch.bass + 12, t, spb * 4); ch.notes.forEach((n, i) => rhodes(n, t + i * 0.06, 0.7, spb * 4)); }
        if (e % 2 === 0 && Math.random() < 0.35) rhodes(MEL[Math.floor(Math.random() * MEL.length)], t + hum(), 0.5, spb * 2.5);
      }
      nextT += eighth; step++;
    }
  }

  const Music = {
    modes() { return [{ id: "lofi", nom: "Lo-fi" }, { id: "pluie", nom: "Piano & pluie" }, { id: "jazz", nom: "Jazz de nuit", paid: true }, { id: "foret", nom: "Forêt calme", paid: true }, ...((window.MUSIQUES || []).map((m, i) => ({ id: "file" + i, nom: m.nom })))]; },
    get mode() { return P.music; },
    get on() { return !!playing; },
    start(mode = P.music) {
      if (mode === "off" || !init()) return;
      this.stop(true); P.music = mode; savePrefs();
      musicBus.gain.cancelScheduledValues(now()); musicBus.gain.setValueAtTime(0.0001, now());
      musicBus.gain.exponentialRampToValueAtTime(P.vol * 0.6 + 0.0001, now() + 3);
      if (mode.startsWith("file")) {
        const m = (window.MUSIQUES || [])[+mode.slice(4)]; if (!m) return;
        fileAudio = new Audio(m.src); fileAudio.loop = true; fileAudio.volume = P.vol; fileAudio.play().catch(() => {});
        playing = mode; return;
      }
      playing = mode; step = 0; nextT = now() + 0.1;
      if (mode !== "foret") ambient.push(vinyl()); if (mode === "pluie") ambient.push(rain()); if (mode === "foret") ambient.push(wind());
      timer = setInterval(schedule, 40); schedule();
    },
    stop(keepPref) {
      if (timer) clearInterval(timer); timer = null;
      if (fileAudio) { fileAudio.pause(); fileAudio = null; }
      if (ac && musicBus) { const t = now(); musicBus.gain.cancelScheduledValues(t); musicBus.gain.setValueAtTime(musicBus.gain.value, t); musicBus.gain.linearRampToValueAtTime(0, t + 0.4); }
      const old = ambient; ambient = []; setTimeout(() => old.forEach(s => { try { s.stop(); } catch (e) {} }), 500);
      playing = null; if (!keepPref) { P.music = "off"; savePrefs(); }
    },
    toggle() { if (playing) { this.stop(); return false; } this.start(P.music === "off" ? "lofi" : P.music); return true; },
    duck(on) {                                                 // baisse la musique pendant une vidéo
      if (fileAudio) { fileAudio.volume = on ? 0 : P.vol; return; }
      if (ac && playing) musicBus.gain.setTargetAtTime(on ? 0.0001 : P.vol * 0.6 + 0.0001, now(), on ? 0.15 : 0.6);
    },
    setVol(v) { P.vol = v; savePrefs(); if (fileAudio) fileAudio.volume = v; if (ac && playing) musicBus.gain.setTargetAtTime(v * 0.6 + 0.0001, now(), 0.1); },
    get vol() { return P.vol; },
  };

  window.Sound = {
    SFX, Music,
    get sfxOn() { return P.sfx; }, setSfx(b) { P.sfx = b; savePrefs(); },
    get sfxVol() { return P.sfxVol; }, setSfxVol(v) { P.sfxVol = v; savePrefs(); if (sfxBus) sfxBus.gain.value = v; },
    wantsMusic() { return P.music !== "off"; },
    unlock() { init(); },
  };
})();
