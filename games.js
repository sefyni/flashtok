/* =====================================================================
   FlashTok · JEUX : swipe chrono, légendes à placer, paires, survie
   (chargé après plus.js ; tes erreurs reviennent dans « À revoir »)
   ===================================================================== */
(function () {
"use strict";
const P = window.FT_PLUS;

document.head.insertAdjacentHTML("beforeend", `<style>
  .gtile { width:100%; display:flex; align-items:center; gap:14px; padding:16px; border-radius:18px; background:#121212; border:1px solid #1f1f1f; text-align:left; margin-bottom:10px; }
  .gtile .gi { width:52px; height:52px; border-radius:16px; display:grid; place-items:center; flex:none; background:var(--gc); }
  .gtile b { font-size:17px; display:block; } .gtile small { display:block; color:var(--muted); font-size:12.5px; margin-top:3px; line-height:1.35; }
  .gtile .rec { color:#face15; font-weight:800; font-size:12px; margin-top:5px; display:block; }
  .gtile[disabled] { opacity:.4; }
  #game .ghead { display:flex; align-items:center; gap:10px; padding:10px 14px; }
  #game .ghead .x { width:36px; height:36px; font-size:22px; border-radius:50%; background:#1a1a1a; flex:none; }
  #game .ghead .tt { flex:1; font-weight:800; font-size:15px; } #game .ghead .tt small { display:block; color:var(--muted); font-size:12px; font-weight:600; }
  #game .gstat { font-weight:900; font-size:22px; font-variant-numeric:tabular-nums; min-width:60px; text-align:right; }
  #game .gstat.low { color:var(--red); animation:lspulse .6s infinite; }
  #game .gbody { flex:1; display:flex; flex-direction:column; padding:0 16px 16px; min-height:0; }
  .gflash-ok { animation:gok .35s; } .gflash-ko { animation:gko .35s; }
  @keyframes gok { 0% { box-shadow:inset 0 0 0 999px rgba(47,210,122,.25); } 100% { box-shadow:none; } }
  @keyframes gko { 0% { box-shadow:inset 0 0 0 999px rgba(254,44,85,.3); } 100% { box-shadow:none; } }
  /* swipe */
  .swrow { display:flex; justify-content:space-between; font-size:13px; color:var(--muted); font-weight:700; margin:2px 2px 10px; }
  .swrow b { color:#fff; }
  .swstage { flex:1; position:relative; display:flex; align-items:center; justify-content:center; min-height:0; }
  .swcard { width:100%; max-height:100%; overflow-y:auto; border-radius:24px; padding:26px 22px; background:linear-gradient(160deg,var(--c1),var(--c2)); font-size:19px; font-weight:700; line-height:1.4;
    box-shadow:0 20px 50px rgba(0,0,0,.5); touch-action:none; user-select:none; -webkit-user-select:none; position:relative; transition:transform .25s, opacity .25s; }
  .swcard.drag { transition:none; }
  .swcard .swm { display:block; font-size:12px; font-weight:800; opacity:.8; margin-bottom:12px; }
  .swcard .stamp { position:absolute; top:14px; padding:4px 12px; border:3px solid; border-radius:10px; font-weight:900; font-size:20px; opacity:0; transform:rotate(-10deg); }
  .swcard .stamp.v { right:14px; color:#2fd27a; border-color:#2fd27a; transform:rotate(10deg); } .swcard .stamp.f { left:14px; color:#fe2c55; border-color:#fe2c55; }
  .swhint { text-align:center; font-size:12px; color:var(--muted); margin:10px 0 8px; }
  .swbtns { display:flex; gap:12px; } .swbtns button { flex:1; padding:17px; border-radius:16px; font-weight:900; font-size:18px; }
  .swbtns .f { background:#3a1220; color:#ff6b8a; } .swbtns .v { background:#0f3324; color:#2fd27a; }
  .swfb { min-height:44px; margin-top:10px; font-size:13px; line-height:1.4; color:#ddd; background:#161616; border-radius:12px; padding:8px 12px; opacity:0; transition:opacity .2s; }
  .swfb.on { opacity:1; } .swfb b { color:#ff6b8a; }
  /* légendes */
  .lgq { font-weight:800; font-size:16px; margin:0 0 8px; }
  .lgimg { background:#fff; border-radius:16px; padding:10px; }
  .lgimg .mskwrap { width:min(100%, calc(42vh * var(--ar))); }
  .lgimg .mskwrap img { position:absolute; inset:0; width:100%; height:100%; display:block; }
  .lgimg .msk.sel { background:#25f4ee; } .lgimg .msk.bad { background:#fe2c55; animation:shake .4s; }
  .lgchips { display:flex; flex-wrap:wrap; gap:7px; margin-top:12px; overflow-y:auto; }
  .lgchips button { padding:8px 11px; border-radius:999px; background:#1d1d1d; font-size:13px; font-weight:700; border:2px solid transparent; }
  .lgchips button.sel { border-color:#25f4ee; background:#0e2e30; } .lgchips button.bad { border-color:#fe2c55; animation:shake .4s; }
  /* paires */
  .pgrid { display:grid; grid-template-columns:1.7fr 1fr; gap:8px; overflow-y:auto; align-content:start; }
  .pgrid .col { display:flex; flex-direction:column; gap:8px; }
  .pgrid button { text-align:left; padding:11px 12px; border-radius:12px; background:#181818; font-size:13px; line-height:1.35; border:2px solid transparent; min-height:56px; }
  .pgrid .pr button { font-weight:800; text-align:center; justify-content:center; display:flex; align-items:center; }
  .pgrid button.sel { border-color:#25f4ee; background:#0e2e30; } .pgrid button.bad { border-color:#fe2c55; animation:shake .4s; }
  .pgrid button.done { background:#0f3324; color:#7be3a8; opacity:.55; pointer-events:none; }
  .blank { display:inline-block; min-width:44px; border-bottom:2px solid #888; margin:0 2px; }
  /* survie */
  .svtop { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .svlives { display:flex; gap:4px; } .svscore { font-weight:900; font-size:15px; }
  .svbar { height:6px; border-radius:3px; background:#222; overflow:hidden; margin-bottom:14px; } .svbar i { display:block; height:100%; background:var(--cyan); transform-origin:left; }
  .svbox { flex:1; overflow-y:auto; min-height:0; }
  .svboss { text-align:center; font-weight:900; color:#face15; letter-spacing:.1em; margin-bottom:8px; }
  /* fin */
  .gend { flex:1; overflow-y:auto; text-align:center; padding-top:10px; }
  .gend .big { font-size:54px; font-weight:900; line-height:1; margin:10px 0 4px; } .gend .sub { color:var(--muted); font-size:14px; }
  .gend .nrec { color:#face15; font-weight:900; margin-top:8px; }
  .gend .errs { text-align:left; margin-top:18px; } .gend .errs div { background:#141414; border-radius:12px; padding:10px 12px; font-size:13px; line-height:1.4; margin-bottom:8px; }
  .gend .errs small { display:block; color:#aaa; margin-top:4px; }
  .gend .gbtns { display:flex; gap:10px; margin-top:16px; } .gend .gbtns button { flex:1; padding:14px; border-radius:14px; font-weight:900; background:#1d1d1d; }
  .gend .gbtns .main { background:var(--red); }
</style>`);

/* ---------- outils ---------- */
const GR = () => (S.games = S.games || {});
const pick = a => a[Math.random() * a.length | 0];
const fold = t => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/<[^>]*>/g, "").trim();
const fmtT = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const HEART = on => ic("heart", 22, on ? "#fe2c55" : "#333");
const gameEl = $("game");
const GT = { tok:0, timers:[] };
function gStop(){ GT.tok++; GT.timers.forEach(t => { clearTimeout(t); clearInterval(t); }); GT.timers = []; }
const later = (fn, ms) => { const tok = GT.tok; GT.timers.push(setTimeout(() => { if (tok === GT.tok) fn(); }, ms)); };
const every = (fn, ms) => { const tok = GT.tok, id = setInterval(() => { if (tok !== GT.tok) { clearInterval(id); return; } fn(); }, ms); GT.timers.push(id); };
const flash = ok => { const b = gameEl.querySelector(".gbody"); if (!b) return; b.classList.remove("gflash-ok", "gflash-ko"); void b.offsetWidth; b.classList.add(ok ? "gflash-ok" : "gflash-ko"); };
const head = (title, sub, stat) => `<div class="ghead"><button class="x" data-g="close" aria-label="Fermer">×</button><div class="tt">${title}${sub ? `<small>${sub}</small>` : ""}</div><div class="gstat" id="gstat">${stat || ""}</div></div>`;

// sur quoi on joue
function scopes(){
  const out = [{ k:"all", nom:"Tout" }];
  const x = ccActive().find(y => ALL.some(c => inCC(y, c)));
  if (x) out.push({ k:"cc", nom:x.nom });
  MATIERES.filter(m => ALL.some(c => c.matiere === m.nom)).forEach(m => out.push({ k:"m:" + m.nom, nom:m.nom }));
  return out;
}
function scopeCards(){
  const k = S.gameScope || "all";
  if (k === "cc") { const x = ccActive().find(y => ALL.some(c => inCC(y, c))); if (x) return ALL.filter(c => inCC(x, c)); }
  if (k.startsWith("m:")) { const cs = ALL.filter(c => c.matiere === k.slice(2)); if (cs.length) return cs; }
  return ALL;
}
const scopeName = () => (scopes().find(s => s.k === (S.gameScope || "all")) || { nom:"Tout" }).nom;

// les erreurs de la partie reviennent dans « À revoir »
function flushErrors(errs){
  const seen = new Set();
  errs.forEach(e => { if (e.c && !seen.has(e.c)) { seen.add(e.c); srsApply(e.c, 0); } });
  save(); updateHud();
  return seen.size;
}
function endScreen({ title, big, sub, isRec, recTxt, errs, again }){
  gStop();
  const n = flushErrors(errs);
  if (isRec) { confetti(120); Sound.SFX.fanfare && Sound.SFX.fanfare(); }
  gameEl.innerHTML = head(title, scopeName()) + `<div class="gbody"><div class="gend">
    ${ic(isRec ? "trophy" : "party", 44, "#face15")}
    <div class="big">${big}</div><div class="sub">${sub}</div>
    ${isRec ? `<div class="nrec">Nouveau record !</div>` : recTxt ? `<div class="sub" style="margin-top:6px">${recTxt}</div>` : ""}
    ${errs.length ? `<div class="errs"><div class="sect" style="margin:0 0 8px">À retenir · ${n} carte${n > 1 ? "s" : ""} ajoutée${n > 1 ? "s" : ""} dans « À revoir »</div>${
      errs.slice(0, 12).map(e => `<div>${prep(e.t)}${e.why ? `<small>${prep(e.why)}</small>` : ""}</div>`).join("")}</div>` : `<div class="sub" style="margin-top:14px">Aucune erreur, bravo.</div>`}
    <div class="gbtns"><button data-g="back">Jeux</button><button class="main" data-g="again">Rejouer</button></div>
  </div></div>`;
  math(gameEl);
  GT.again = again;
}

/* =====================================================================
   1. SWIPE CHRONO : vrai à droite, faux à gauche
   ===================================================================== */
const SW = {};
function swPool(){ return P.stmtPool(scopeCards()); }
function swNext(){
  for (let k = 0; k < 12; k++) {
    const want = Math.random() < 0.5, cand = SW.pool.filter(s => !s.fixed || s.v === want), s = pick(cand.length ? cand : SW.pool);
    const st = P.realize(s, s.fixed ? undefined : want);
    if (!SW.recent.includes(st.t) || k === 11) { SW.recent = [st.t, ...SW.recent].slice(0, 25); return st; }
  }
}
function startSwipe(){
  gStop();
  Object.assign(SW, { pool:swPool(), time:60, score:0, streak:0, best:0, n:0, errs:[], recent:[], busy:false });
  if (SW.pool.length < 6) { toast("Pas assez d'affirmations ici : choisis « Tout »"); return closeGame(true); }
  SW.cur = swNext();
  gameEl.innerHTML = head("Swipe chrono", scopeName(), "1:00") + `<div class="gbody">
    <div class="swrow"><span>Score <b id="swS">0</b></span><span>Série <b id="swK">0</b></span></div>
    <div class="swstage" id="swStage"></div>
    <div class="swhint">← glisse à gauche si c'est faux · à droite si c'est vrai →</div>
    <div class="swbtns"><button class="f" data-sw="0">Faux</button><button class="v" data-sw="1">Vrai</button></div>
    <div class="swfb" id="swFb"></div></div>`;
  swCard();
  every(() => {
    SW.time -= 0.1;
    const el = $("gstat"); if (el) { el.textContent = fmtT(Math.ceil(SW.time)); el.classList.toggle("low", SW.time <= 10); }
    if (SW.time <= 0) swEnd();
  }, 100);
}
function swCard(){
  const st = SW.cur, m = { ...matOf(st.c.matiere), ...lookOf(st.c) };
  $("swStage").innerHTML = `<div class="swcard" id="swCard" style="--c1:${m.couleurs[0]};--c2:${m.couleurs[1]}"><span class="swm">@${esc(st.c.matiere.toLowerCase())}${st.c.chapitre ? " · " + esc(P.chLabel(st.c.chapitre)) : ""}</span>${prep(st.t)}<span class="stamp v">VRAI</span><span class="stamp f">FAUX</span></div>`;
  math($("swStage"));
  const card = $("swCard"); let x0 = null, dx = 0;
  card.addEventListener("pointerdown", e => { if (SW.busy) return; x0 = e.clientX; dx = 0; card.classList.add("drag"); card.setPointerCapture(e.pointerId); });
  card.addEventListener("pointermove", e => {
    if (x0 === null) return; dx = e.clientX - x0;
    card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
    card.querySelector(".stamp.v").style.opacity = Math.max(0, Math.min(1, dx / 90));
    card.querySelector(".stamp.f").style.opacity = Math.max(0, Math.min(1, -dx / 90));
  });
  const up = () => { if (x0 === null) return; x0 = null; card.classList.remove("drag");
    if (Math.abs(dx) > 80) swAnswer(dx > 0); else { card.style.transform = ""; card.querySelectorAll(".stamp").forEach(s => s.style.opacity = 0); } };
  card.addEventListener("pointerup", up); card.addEventListener("pointercancel", up);
}
function swAnswer(v){
  if (SW.busy || SW.time <= 0) return;
  SW.busy = true;
  const st = SW.cur, ok = v === st.v, card = $("swCard");
  SW.n++;
  if (ok) { SW.score++; SW.streak++; SW.best = Math.max(SW.best, SW.streak); SW.time = Math.min(99, SW.time + 2); Sound.SFX.ok(SW.streak); buzz(10); }
  else {
    SW.streak = 0; SW.time -= 3; Sound.SFX.ko(); buzz([30, 30, 30]);
    SW.errs.push({ c:st.c, t:st.t, why:`<b>${st.v ? "Vrai" : "Faux"}.</b> ${st.why || ""}` });
    const fb = $("swFb"); fb.innerHTML = `<b>${st.v ? "C'était vrai" : "C'était faux"}.</b> ${prep(st.why || "")}`; math(fb); fb.classList.add("on");
    clearTimeout(SW.fbT); SW.fbT = setTimeout(() => fb.classList.remove("on"), 2600);
  }
  flash(ok);
  $("swS").textContent = SW.score; $("swK").textContent = SW.streak;
  if (card) { card.style.transform = `translateX(${v ? 520 : -520}px) rotate(${v ? 25 : -25}deg)`; card.style.opacity = 0; }
  later(() => { SW.cur = swNext(); swCard(); SW.busy = false; }, 230);
}
function swEnd(){
  const g = GR(), isRec = SW.score > (g.swipe || 0);
  if (isRec) g.swipe = SW.score;
  endScreen({ title:"Swipe chrono", big:SW.score, sub:`bonnes réponses sur ${SW.n} · meilleure série ${SW.best}`, isRec, recTxt:`Record : ${g.swipe || 0}`, errs:SW.errs, again:startSwipe });
}

/* =====================================================================
   2. LÉGENDES À PLACER : choisis une étiquette, touche sa place
   ===================================================================== */
const LG = { queue:[] };
const legCards = () => ALL.filter(c => c.lab && c.masks);
function startLegendes(c){
  gStop();
  if (!c) { if (!LG.queue.length) LG.queue = shuffle(legCards().slice()); c = LG.queue.shift(); }
  if (!c) { toast("Pas de schéma légendé"); return closeGame(true); }
  const labels = shuffle([...new Set(c.lab.filter(Boolean))]);
  Object.assign(LG, { c, t0:Date.now(), errs:0, found:0, total:labels.length, sel:null, done:false });
  const masks = c.masks.map((r, k) => c.lab[k] ? `<button class="msk" data-l="${esc(c.lab[k])}" style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%" aria-label="Case ${k + 1}"></button>` : "").join("");
  gameEl.innerHTML = head("Légendes à placer", esc(c.matiere) + " · " + esc(P.chLabel(c.chapitre || "")), "0:00") + `<div class="gbody">
    <div class="lgq">${prep(c.q)} <small style="color:var(--muted);font-weight:600">· <span id="lgN">0</span>/${labels.length} · erreurs <span id="lgE">0</span></small></div>
    <div class="lgimg"><div class="mskwrap" style="--ar:${c.ar || 1.4}"><img src="${esc(c.img)}" alt="">${masks}</div></div>
    <div class="lgchips" id="lgChips">${labels.map(l => `<button data-l="${esc(l)}">${esc(l)}</button>`).join("")}</div>
    <div id="lgEnd"></div></div>`;
  every(() => { const el = $("gstat"); if (el && !LG.done) el.textContent = fmtT((Date.now() - LG.t0) / 1000); }, 500);
}
function lgSelect(kind, el){
  gameEl.querySelectorAll(".lgimg .msk.sel, .lgchips .sel").forEach(x => x.classList.remove("sel"));
  LG.sel = el ? { kind, el, l:el.dataset.l } : null;
  if (el) el.classList.add("sel");
}
function lgTry(chip, mask){
  const ok = chip.dataset.l === mask.dataset.l;
  lgSelect(null);
  if (ok) {
    gameEl.querySelectorAll(".lgimg .msk").forEach(m => { if (m.dataset.l === chip.dataset.l) m.classList.add("open"); });
    chip.remove(); LG.found++; $("lgN").textContent = LG.found; Sound.SFX.ok(LG.found); buzz(10); flash(true);
    if (LG.found === LG.total) lgDone();
  } else {
    LG.errs++; $("lgE").textContent = LG.errs; Sound.SFX.ko(); buzz([30, 30, 30]); flash(false);
    [chip, mask].forEach(x => { x.classList.remove("bad"); void x.offsetWidth; x.classList.add("bad"); setTimeout(() => x.classList.remove("bad"), 450); });
  }
}
function lgDone(){
  LG.done = true; gStop();
  const sec = (Date.now() - LG.t0) / 1000, key = LG.c.img, g = GR(); g.leg = g.leg || {};
  const prev = g.leg[key], isRec = !prev || sec < prev;
  if (isRec) g.leg[key] = Math.round(sec);
  srsApply(LG.c, LG.errs === 0 ? 2 : LG.errs >= 3 ? 0 : 1); save(); updateHud();
  if (isRec) confetti(90);
  $("gstat").textContent = fmtT(sec);
  $("lgEnd").innerHTML = `<div class="gend" style="padding-top:12px"><div class="sub"><b style="color:#fff;font-size:18px">${fmtT(sec)}</b> · ${LG.errs ? LG.errs + " erreur" + (LG.errs > 1 ? "s" : "") : "sans faute"}${isRec ? ` · <span style="color:#face15;font-weight:900">record</span>` : prev ? ` · record ${fmtT(prev)}` : ""}</div>
    <div class="gbtns"><button data-g="lgsame">Refaire</button><button class="main" data-g="lgnext">Schéma suivant</button></div></div>`;
}

/* =====================================================================
   3. PAIRES : relie chaque phrase à son mot manquant
   ===================================================================== */
const PA = {};
function paPool(){
  const out = [];
  scopeCards().forEach(c => (c.trous || []).forEach(tr => { const m = tr.t.match(CLOZE); if (m) out.push({ c, ans:m[1], txt:tr.t.replace(CLOZE, '<span class="blank"></span>') }); }));
  return out;
}
function paRound(){
  const used = new Set(), picked = [];
  for (const it of shuffle(PA.pool.slice())) {
    const k = fold(it.ans);
    if (used.has(k) || PA.seen.has(it.txt)) continue;
    used.add(k); picked.push(it); if (picked.length === 5) break;
  }
  if (picked.length < 5) { PA.seen.clear(); for (const it of shuffle(PA.pool.slice())) { const k = fold(it.ans); if (!used.has(k) && !picked.includes(it)) { used.add(k); picked.push(it); } if (picked.length === 5) break; } }
  picked.forEach(it => PA.seen.add(it.txt));
  PA.cur = picked; PA.left = picked.length; PA.sel = null;
  const body = gameEl.querySelector(".gbody");
  body.innerHTML = `<div class="swrow"><span>Manche <b>${PA.round}</b>/3</span><span>Erreurs <b id="paE">${PA.errs.length}</b> (+5 s)</span></div>
    <div class="pgrid"><div class="col pl">${picked.map((it, k) => `<button data-pa="l" data-k="${k}">${prep(it.txt)}</button>`).join("")}</div>
      <div class="col pr">${shuffle(picked.map((it, k) => k)).map(k => `<button data-pa="r" data-k="${k}">${prep(picked[k].ans)}</button>`).join("")}</div></div>`;
  math(body);
}
function startPaires(){
  gStop();
  Object.assign(PA, { pool:paPool(), round:1, errs:[], pen:0, t0:Date.now(), seen:new Set() });
  if (new Set(PA.pool.map(p => fold(p.ans))).size < 5) { toast("Pas assez de phrases à trous ici : choisis « Tout »"); return closeGame(true); }
  gameEl.innerHTML = head("Paires", scopeName(), "0:00") + `<div class="gbody"></div>`;
  paRound();
  every(() => { const el = $("gstat"); if (el) el.textContent = fmtT((Date.now() - PA.t0) / 1000 + PA.pen); }, 500);
}
function paClick(b){
  const side = b.dataset.pa;
  if (!PA.sel || PA.sel.dataset.pa === side) { gameEl.querySelectorAll(".pgrid .sel").forEach(x => x.classList.remove("sel")); PA.sel = b; b.classList.add("sel"); Sound.SFX.tap(); return; }
  const a = PA.sel; PA.sel = null; a.classList.remove("sel");
  if (a.dataset.k === b.dataset.k) {
    a.classList.add("done"); b.classList.add("done"); PA.left--; Sound.SFX.ok(5 - PA.left); buzz(10); flash(true);
    if (!PA.left) { if (PA.round < 3) { PA.round++; later(paRound, 450); } else later(paEnd, 450); }
  } else {
    const l = a.dataset.pa === "l" ? a : b, it = PA.cur[+l.dataset.k];
    PA.pen += 5; PA.errs.push({ c:it.c, t:it.txt.replace('<span class="blank"></span>', `<b>${it.ans}</b>`) });
    $("paE").textContent = PA.errs.length; Sound.SFX.ko(); buzz([30, 30, 30]); flash(false);
    [a, b].forEach(x => { x.classList.remove("bad"); void x.offsetWidth; x.classList.add("bad"); setTimeout(() => x.classList.remove("bad"), 450); });
  }
}
function paEnd(){
  const sec = Math.round((Date.now() - PA.t0) / 1000 + PA.pen), g = GR(), isRec = !g.paires || sec < g.paires;
  if (isRec) g.paires = sec;
  endScreen({ title:"Paires", big:fmtT(sec), sub:`15 paires · ${PA.errs.length} erreur${PA.errs.length > 1 ? "s" : ""} (+5 s chacune)`, isRec, recTxt:`Record : ${fmtT(g.paires)}`, errs:PA.errs, again:startPaires });
}

/* =====================================================================
   4. SURVIE : 3 vies, de plus en plus vite, un QCM « boss » toutes les 10 questions
   ===================================================================== */
const SV = {};
function svRender(inner, boss){
  gameEl.querySelector(".gbody").innerHTML = `<div class="svtop"><div class="svlives">${[0, 1, 2].map(k => HEART(k < SV.lives)).join("")}</div><div class="svscore">Score ${SV.score}</div></div>
    <div class="svbar"><i id="svBar"></i></div>${boss ? `<div class="svboss">BOSS · QCM CONCOURS</div>` : ""}<div class="svbox" id="svBox">${inner}</div>`;
  math(gameEl.querySelector(".gbody"));
}
function svTimer(sec, onEnd){
  const t0 = Date.now(), bar = () => $("svBar");
  every(() => {
    const p = 1 - (Date.now() - t0) / (sec * 1000), b = bar();
    if (b) { b.style.transform = `scaleX(${Math.max(0, p)})`; b.style.background = p < .3 ? "var(--red)" : ""; }
    const st = $("gstat"); if (st) st.textContent = Math.max(0, Math.ceil(p * sec));
    if (p <= 0) { SV.tmr = null; onEnd(); }
  }, 100);
}
function startSurvie(){
  gStop();
  const deck = scopeCards().filter(c => quizKinds(c).length);
  Object.assign(SV, { deck, lives:3, score:0, n:0, errs:[], recent:[], bosses:0 });
  if (deck.length < 8) { toast("Pas assez de cartes ici : choisis « Tout »"); return closeGame(true); }
  gameEl.innerHTML = head("Survie", scopeName(), "") + `<div class="gbody"></div>`;
  svNext();
}
function svNext(){
  gStop();
  if (SV.lives <= 0) return svEnd();
  SV.n++;
  if (SV.n % 10 === 0) { const q = P.qcmFromCards(SV.recent.slice(0, 10)); if (q) return svBoss(q); }
  let c, item;
  for (let k = 0; k < 15 && !item; k++) { c = pick(SV.deck); if (SV.recent.slice(0, 6).includes(c) && k < 14) continue; item = makeQuiz(c); }
  if (!item) return svEnd();
  SV.recent = [c, ...SV.recent].slice(0, 20); SV.item = item; SV.answered = false;
  svRender(quizInner(item));
  svTimer(Math.max(6, 15 - SV.n * 0.4), () => svAnswer(null));
}
function svAnswer(btn){
  if (SV.answered) return; SV.answered = true; gStop();
  const item = SV.item, box = $("svBox"), ok = !!btn && btn.dataset.ans === "1";
  box.querySelectorAll(".qopt").forEach(b => { if (b.dataset.ans === "1") b.classList.add("good"); });
  if (btn && !ok) btn.classList.add("bad");
  const ex = box.querySelector(".qexp");
  if (ok) { SV.score++; Sound.SFX.quizOk(); buzz(12); flash(true); }
  else {
    SV.lives--; Sound.SFX.quizKo(); buzz([40, 30, 40]); flash(false);
    const good = item.opts.find(o => o.ok);
    SV.errs.push({ c:item.c, t:item.vf ? item.prompt : `${item.kind === "def" ? item.c.q : item.prompt.replace(/\{\{[\s\S]*?\}\}/, "…")}`, why:item.vf ? item.explain : `Réponse : <b>${good ? good.h : ""}</b>` });
    if (ex) ex.hidden = false;
    if (!btn) toast("Temps écoulé", "timer");
  }
  later(svNext, ok ? 650 : 1900);
}
function svBoss(q){
  SV.boss = q; SV.bossDone = false;
  svRender(`<div class="qstem"><b>${esc(q.title)}</b><br>Quelle(s) proposition(s) est/sont exacte(s) ?</div>
    ${q.props.map((p, k) => `<button class="qprop" data-p="${k}"><span class="ql">${"ABCDE"[k]}</span><span class="qt">${prep(p.t)}</span></button><div class="qwhy" hidden></div>`).join("")}
    <button class="qval" data-g="bossok">Valider</button><div class="qres" hidden></div>`, true);
  svTimer(45, () => svBossCheck(true));
}
function svBossCheck(timeout){
  if (SV.bossDone) return; SV.bossDone = true; gStop();
  const box = $("svBox"), btns = [...box.querySelectorAll(".qprop")]; let err = 0;
  btns.forEach((b, k) => {
    const p = SV.boss.props[k], sel = b.classList.contains("sel"), ok = sel === p.v; if (!ok) err++;
    b.classList.add(p.v ? "vrai" : "faux", ok ? "juste" : "erreur");
    const w = b.nextElementSibling; w.hidden = false; w.innerHTML = `<b style="color:${p.v ? "#2fd27a" : "#ff6b8a"}">${p.v ? "Vrai" : "Faux"}.</b> ${prep(p.why)}`; math(w);
    if (!ok) SV.errs.push({ c:p.c, t:p.t, why:`<b>${p.v ? "Vrai" : "Faux"}.</b> ${p.why}` });
  });
  if (timeout) err = Math.max(err, 3);
  let msg;
  if (err === 0) { SV.lives = Math.min(3, SV.lives + 1); SV.score += 3; SV.bosses++; msg = "Boss battu ! +3 points et +1 vie"; confetti(80); Sound.SFX.quizOk(); }
  else if (err <= 2) { SV.score += 1; msg = `${err} erreur${err > 1 ? "s" : ""} : +1 point`; Sound.SFX.quizOk(); }
  else { SV.lives--; msg = timeout ? "Temps écoulé : −1 vie" : `${err} erreurs : −1 vie`; Sound.SFX.quizKo(); }
  const v = box.querySelector(".qval"); if (v) v.remove();
  const r = box.querySelector(".qres"); r.hidden = false;
  r.innerHTML = `<b style="font-size:18px">${msg}</b><button class="qval" data-g="bossnext" style="margin-top:12px">Continuer</button>`;
  gameEl.querySelector(".svlives").innerHTML = [0, 1, 2].map(k => HEART(k < SV.lives)).join("");
}
function svEnd(){
  const g = GR(), isRec = SV.score > (g.survie || 0);
  if (isRec) g.survie = SV.score;
  endScreen({ title:"Survie", big:SV.score, sub:`points · ${SV.n - 1} question${SV.n > 2 ? "s" : ""}${SV.bosses ? ` · ${SV.bosses} boss battu${SV.bosses > 1 ? "s" : ""}` : ""}`, isRec, recTxt:`Record : ${g.survie || 0}`, errs:SV.errs, again:startSurvie });
}

/* =====================================================================
   MENU DES JEUX + ÉVÉNEMENTS
   ===================================================================== */
/* =====================================================================
   MENU DES JEUX (registre : d'autres fichiers peuvent ajouter des jeux)
   ===================================================================== */
const REG = [];
const SECTIONS = [["apprendre", "Apprendre"], ["boss", "Avant la colle"], ["schemas", "Reconstruire les schémas"], ["jouer", "Jouer"]];
function register(def){ REG.push(def); }
register({ k:"swipe", sec:"jouer", icon:"zap", col:"#fe2c55", name:"Swipe chrono", desc:"Vrai à droite, faux à gauche. 60 s, +2 s par bonne réponse, −3 s par erreur.",
  rec:g => g.swipe ? "Record : " + g.swipe : "", ok:cs => P.stmtPool(cs).length >= 6, start:startSwipe });
register({ k:"legende", sec:"schemas", icon:"puzzle", col:"#7b3cff", name:"Légendes à placer", desc:"Touche une étiquette, puis sa place sur le schéma.",
  rec:g => { const n = Object.keys(g.leg || {}).length; return n ? n + " schéma" + (n > 1 ? "s" : "") + " réussi" + (n > 1 ? "s" : "") : ""; }, ok:() => legCards().length > 0, start:() => startLegendes(), count:() => legCards().length + " schémas" });
register({ k:"paires", sec:"jouer", icon:"copy", col:"#0a7cff", name:"Paires", desc:"Relie chaque phrase à son mot manquant. 3 manches de 5, le plus vite possible.",
  rec:g => g.paires ? "Record : " + fmtT(g.paires) : "", ok:() => new Set(paPool().map(p => fold(p.ans))).size >= 5, start:startPaires });
register({ k:"survie", sec:"jouer", icon:"heart", col:"#13a35a", name:"Survie", desc:"3 vies, de plus en plus vite. Un QCM boss toutes les 10 questions.",
  rec:g => g.survie ? "Record : " + g.survie : "", ok:cs => cs.filter(c => quizKinds(c).length).length >= 8, start:startSurvie });

window.renderJeux = function(){
  const g = GR(), cs = scopeCards();
  const tile = d => { const ok = d.ok(cs), rec = d.rec ? d.rec(g) : "";
    return `<button class="gtile" data-play="${d.k}" ${ok ? "" : "disabled"}><span class="gi" style="--gc:${d.col}">${ic(d.icon, 26, "#fff")}</span><span><b>${d.name}</b><small>${d.desc}${d.count ? " " + d.count(cs) + "." : ""}</small>${rec ? `<span class="rec">${ic("trophy", 12, "#face15")} ${rec}</span>` : ""}${ok ? "" : `<span class="rec" style="color:var(--muted)">Rien à jouer ici : choisis « Tout »</span>`}</span></button>`; };
  $("pgJeux").innerHTML = `<div class="ohead" style="padding:0 0 10px"><button class="x" data-j="back">‹</button><div class="tt" style="text-align:center;margin-right:46px"><span class="ico-row">${ic("zap", 18)} Jeux</span></div></div>
    <p class="note" style="margin-top:0">Tout vient de tes cours. Tes erreurs reviennent dans « À revoir ».</p>
    <div class="sect">Sur quoi</div><div class="chips">${scopes().map(s => `<button data-sc="${esc(s.k)}" class="${(S.gameScope || "all") === s.k ? "on" : ""}">${esc(s.nom)}</button>`).join("")}</div>
    <button class="gtile" data-play="surprise" style="background:linear-gradient(135deg,#fe2c55,#7b3cff);border:0"><span class="gi" style="--gc:rgba(0,0,0,.25)">${ic("shuffle", 26, "#fff")}</span><span><b>Surprise</b><small style="color:#fff;opacity:.85">Un jeu au hasard. Laisse-toi porter.</small></span></button>
    ${SECTIONS.map(([sec, nom]) => { const ds = REG.filter(d => d.sec === sec); return ds.length ? `<div class="sect">${nom}</div>` + ds.map(tile).join("") : ""; }).join("")}`;
};
$("pgJeux").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b || b.disabled) return; Sound.SFX.tap();
  if (b.dataset.j === "back") { openPage("hub"); return; }
  if (b.dataset.sc) { S.gameScope = b.dataset.sc; save(); renderJeux(); return; }
  if (b.dataset.play) openGame(b.dataset.play);
});
function openGame(k, arg){
  let d = REG.find(x => x.k === k);
  if (k === "surprise") { const cs = scopeCards(), ok = REG.filter(x => x.ok(cs) && !x.noSurprise); d = pick(ok); if (!d) return; toast("Surprise : " + d.name, "shuffle"); }
  if (!d) return;
  gameEl.classList.add("show"); Sound.SFX.swoosh && Sound.SFX.swoosh();
  GT.handler = null; GT.keys = null; GT.kind = d.k; gameEl.classList.remove("story");
  d.start(arg);
}
window.openGame = openGame;
function closeGame(silent){ gStop(); GT.handler = null; GT.keys = null; gameEl.classList.remove("story"); gameEl.classList.remove("show"); gameEl.innerHTML = ""; if (!silent) renderJeux(); updateHud(); }
gameEl.addEventListener("click", e => {
  const b = e.target.closest("button"), g = b && b.dataset.g;
  if (g === "close") {                                   // deux touches pour quitter une partie en cours
    if (gameEl.querySelector(".gend") || gameEl.querySelector(".gdone") || (LG.done && gameEl.querySelector(".lgimg")) || Date.now() - (GT.quitAsk || 0) < 2500) { GT.quitAsk = 0; closeGame(); }
    else { GT.quitAsk = Date.now(); toast("Touche encore × pour quitter"); }
    return;
  }
  if (g === "back") { closeGame(); return; }
  if (g === "again") { GT.again && GT.again(); return; }
  if (GT.handler) { GT.handler(e, b); return; }          // jeux des autres fichiers
  // légendes : on peut aussi toucher à côté d'une petite case
  if (LG.c && !LG.done && gameEl.querySelector(".lgimg")) {
    const wrap = e.target.closest(".mskwrap");
    if (wrap) { const m = e.target.closest(".msk:not(.open)") || P.nearestMask(wrap, e); if (m) { if (LG.sel && LG.sel.kind === "chip") lgTry(LG.sel.el, m); else lgSelect("mask", m); } return; }
    if (b && b.closest("#lgChips")) { if (LG.sel && LG.sel.kind === "mask") lgTry(b, LG.sel.el); else lgSelect("chip", b); return; }
  }
  if (!b) return;
  if (g === "lgnext") { startLegendes(); return; }
  if (g === "lgsame") { startLegendes(LG.c); return; }
  if (b.dataset.sw) { swAnswer(b.dataset.sw === "1"); return; }
  if (b.dataset.pa) { paClick(b); return; }
  if (b.classList.contains("qopt") && SV.item && !SV.answered) { svAnswer(b); return; }
  if (b.classList.contains("qprop") && !SV.bossDone) { b.classList.toggle("sel"); Sound.SFX.tap(); return; }
  if (g === "bossok") { if (!$("svBox").querySelector(".qprop.sel")) { toast("Coche au moins une proposition"); return; } svBossCheck(false); return; }
  if (g === "bossnext") { svNext(); return; }
});
document.addEventListener("keydown", e => {
  if (!gameEl.classList.contains("show")) return;
  if (GT.keys && GT.keys(e)) return;
  if (gameEl.querySelector("#swCard")) { if (e.key === "ArrowRight") swAnswer(true); if (e.key === "ArrowLeft") swAnswer(false); }
  if (e.key === "Escape") closeGame();
});

// pour les autres fichiers de jeux
window.FT_GAMES = { register, gameEl, head, endScreen, flushErrors, scopeCards, scopeName, gStop, later, every, flash, GR, fold, fmtT, pick, GT, closeGame, HEART };
})();