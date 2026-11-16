/* =====================================================================
   FlashTok · ATELIER : reconstruire les schémas + jeux de rappel
   Montre-moi · Le bon schéma · Remets dans l'ordre · Schéma fléché · Tableau à remplir
   Classe-moi ça · L'intrus · Et après ? · Tape la réponse · Pendu · Lettres mélangées · Stories
   (chargé après games.js ; données dans exos.js)
   ===================================================================== */
(function () {
"use strict";
const F = window.FT_GAMES, P = window.FT_PLUS, E = window.EXOS || { seq:[], tables:[], groupes:[] };
const { gameEl, head, endScreen, scopeCards, scopeName, later, every, flash, GR, pick, GT } = F;

document.head.insertAdjacentHTML("beforeend", `<style>
  .atl-t { font-weight:900; font-size:17px; line-height:1.3; margin:0 0 4px; } .atl-s { color:var(--muted); font-size:12.5px; margin-bottom:12px; }
  .atl-row { display:flex; justify-content:space-between; font-size:13px; color:var(--muted); font-weight:700; margin:0 2px 10px; } .atl-row b { color:#fff; }
  .atl-scroll { flex:1; overflow-y:auto; min-height:0; padding-bottom:12px; }
  .bad { animation:shake .4s; }
  .gdone { margin-top:12px; }
  .gdone .gbtns { display:flex; gap:10px; margin-top:10px; } .gdone .gbtns button { flex:1; padding:14px; border-radius:14px; font-weight:900; background:#1d1d1d; }
  .gdone .gbtns .main { background:var(--red); }
  /* montre-moi */
  .mo-ask { text-align:center; font-size:15px; margin:2px 0 10px; } .mo-ask b { display:inline-block; margin-top:4px; padding:6px 14px; border-radius:999px; background:#25f4ee; color:#000; font-size:17px; }
  .lgimg .msk.hit { background:transparent; box-shadow:0 0 0 2px #2fd27a; } .lgimg .msk.hit::after { content:""; }
  /* bon schéma */
  .bsgrid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .bsgrid button { background:#fff; border-radius:14px; padding:6px; aspect-ratio:1; display:grid; place-items:center; border:3px solid transparent; overflow:hidden; }
  .bsgrid img { max-width:100%; max-height:100%; object-fit:contain; }
  .bsgrid button.good { border-color:#2fd27a; } .bsgrid button.bad { border-color:#fe2c55; }
  /* ordre */
  .ord-placed { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; min-height:20px; }
  .ord-placed div { padding:10px 12px; border-radius:12px; background:#0f3324; color:#bff3d6; font-size:14px; font-weight:700; display:flex; gap:10px; }
  .ord-placed div i { font-style:normal; color:#2fd27a; font-weight:900; min-width:18px; }
  .ord-pool { display:flex; flex-direction:column; gap:8px; }
  .ord-pool button, .apopts button, .inopts button { text-align:left; padding:13px 14px; border-radius:14px; background:#1a1a1a; font-size:14.5px; font-weight:700; line-height:1.35; border:2px solid transparent; }
  .apopts button.good, .inopts button.good { border-color:#2fd27a; background:#0f3324; } .apopts button.bad, .inopts button.bad { border-color:#fe2c55; }
  /* fléché */
  .flow { display:flex; flex-direction:column; align-items:center; gap:2px; }
  .fbox { width:100%; padding:11px 12px; border-radius:12px; background:#1a1a1a; text-align:center; font-size:14px; font-weight:700; line-height:1.3; border:2px solid transparent; }
  .fbox.blank { background:#2a2208; color:#face15; border:2px dashed #face15; } .fbox.sel { border-color:#25f4ee; border-style:solid; } .fbox.ok { background:#0f3324; color:#bff3d6; border:2px solid #2fd27a; }
  .farr { color:var(--muted); font-size:18px; line-height:1; }
  .fchips { display:flex; flex-wrap:wrap; gap:7px; margin-top:14px; }
  .fchips button { padding:9px 12px; border-radius:999px; background:#1d1d1d; font-size:13px; font-weight:700; border:2px solid transparent; text-align:left; }
  .fchips button.sel { border-color:#25f4ee; background:#0e2e30; }
  /* tableau */
  .ttab { width:100%; border-collapse:separate; border-spacing:4px; font-size:12.5px; line-height:1.3; }
  .ttab th { background:#222; padding:8px 6px; border-radius:8px; text-align:left; font-weight:800; }
  .ttab td { background:#151515; padding:7px 6px; border-radius:8px; vertical-align:top; }
  .ttab td.blank { background:#2a2208; color:#face15; border:2px dashed #face15; text-align:center; font-weight:900; } .ttab td.sel { border-color:#25f4ee; border-style:solid; }
  .ttab td.ok { background:#0f3324; color:#bff3d6; }
  /* tri */
  .trcard { margin:10px 0 18px; padding:28px 18px; border-radius:22px; background:linear-gradient(160deg,#7b3cff,#fe2c55); text-align:center; font-size:21px; font-weight:900; line-height:1.3; }
  .trbk { display:grid; gap:8px; } .trbk button { padding:15px 12px; border-radius:14px; background:#1a1a1a; font-weight:800; font-size:14.5px; display:flex; justify-content:space-between; align-items:center; border:2px solid transparent; }
  .trbk button small { color:var(--muted); font-weight:700; } .trbk button.good { border-color:#2fd27a; } .trbk button.bad { border-color:#fe2c55; }
  /* et après */
  .apchain { display:flex; flex-direction:column; align-items:center; gap:2px; margin-bottom:14px; }
  .apchain .fbox { background:#14243a; } .apchain .q { background:#2a2208; color:#face15; border:2px dashed #face15; }
  .apopts, .inopts { display:flex; flex-direction:column; gap:8px; }
  .apexp { margin-top:12px; font-size:13px; color:#ccc; line-height:1.5; background:#141414; border-radius:12px; padding:10px 12px; }
  /* tape */
  .tpq { font-size:17px; font-weight:700; line-height:1.45; margin:6px 0 14px; } .tpq .blank { min-width:60px; }
  #tpIn { width:100%; padding:14px; border-radius:14px; border:2px solid #333; background:#111; color:#fff; font-size:17px; font-weight:700; outline:none; }
  #tpIn:focus { border-color:#25f4ee; } #tpIn.good { border-color:#2fd27a; } #tpIn.bad { border-color:#fe2c55; }
  .tpbtns { display:flex; gap:10px; margin-top:10px; } .tpbtns button { flex:1; padding:14px; border-radius:14px; font-weight:900; background:#1d1d1d; } .tpbtns .main { background:#fff; color:#000; }
  .tpres { margin-top:12px; font-size:14px; line-height:1.45; min-height:22px; } .tpres b.g { color:#2fd27a; } .tpres b.r { color:#ff6b8a; }
  /* pendu / lettres */
  .clue { font-size:14px; line-height:1.45; color:#ddd; background:#141414; border-radius:14px; padding:12px 14px; margin-bottom:16px; }
  .clue .lbl { display:block; font-size:11px; font-weight:900; color:var(--muted); letter-spacing:.08em; margin-bottom:4px; }
  .pdword { display:flex; flex-wrap:wrap; justify-content:center; gap:6px 14px; margin:6px 0 14px; }
  .pdword .w { display:flex; gap:4px; } .pdword span { width:24px; height:34px; border-bottom:3px solid #555; display:grid; place-items:center; font-size:21px; font-weight:900; }
  .pdword span.sep { border:0; width:10px; } .pdword span.lost { color:#fe2c55; }
  .pdlives { text-align:center; color:var(--muted); font-size:13px; font-weight:700; margin-bottom:12px; } .pdlives b { color:#fe2c55; }
  .pdkb { display:grid; grid-template-columns:repeat(7,1fr); gap:6px; } .pdkb button { padding:11px 0; border-radius:10px; background:#1d1d1d; font-weight:900; font-size:15px; }
  .pdkb button.y { background:#0f3324; color:#2fd27a; } .pdkb button.n { background:#151515; color:#444; }
  .anslots span { cursor:pointer; } .antiles { display:flex; flex-wrap:wrap; justify-content:center; gap:7px; margin-top:6px; }
  .antiles button { width:40px; height:46px; border-radius:10px; background:#fff; color:#000; font-weight:900; font-size:20px; } .antiles button.used { visibility:hidden; }
  /* stories */
  .stlist button { width:100%; text-align:left; padding:14px; border-radius:14px; background:#141414; margin-bottom:8px; font-weight:800; font-size:14.5px; display:flex; justify-content:space-between; gap:10px; }
  .stlist button small { color:var(--muted); font-weight:700; white-space:nowrap; }
  #game.story { background:#000; }
  .stbars { display:flex; gap:3px; padding:6px 14px 0; } .stbars i { flex:1; height:3px; border-radius:2px; background:rgba(255,255,255,.25); overflow:hidden; } .stbars i b { display:block; height:100%; width:0; background:#fff; }
  .stbars i.done b { width:100%; } .stbars i.cur b { animation:stfill var(--dur,8s) linear forwards; }
  @keyframes stfill { to { width:100%; } }
  .stview { flex:1; margin:10px 14px 16px; border-radius:22px; padding:24px 20px; background:linear-gradient(165deg,var(--c1),var(--c2)); display:flex; flex-direction:column; overflow-y:auto; position:relative; }
  .stview .sm { font-size:12px; font-weight:800; opacity:.8; } .stview h3 { font-size:26px; line-height:1.15; margin:10px 0 16px; font-weight:900; }
  .stview ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:9px; } .stview li { background:rgba(0,0,0,.25); border-radius:12px; padding:10px 12px; font-size:15px; font-weight:700; line-height:1.35; }
  .stview .sdef { font-size:16px; line-height:1.5; font-weight:600; background:rgba(0,0,0,.25); border-radius:12px; padding:12px 14px; }
  .stview img { max-width:100%; max-height:30vh; object-fit:contain; background:#fff; border-radius:12px; margin-top:12px; align-self:center; }
  .stview .tapz { position:absolute; inset:0; display:flex; } .stview .tapz div { flex:1; }
  .sthint { text-align:center; font-size:11.5px; color:var(--muted); margin-bottom:10px; }
  /* carte mentale */
  .mmtop { display:flex; gap:8px; margin-bottom:12px; } .mmtop button { padding:9px 12px; border-radius:999px; background:#1d1d1d; font-size:13px; font-weight:800; display:flex; gap:6px; align-items:center; }
  .mmtop button.on { background:#25f4ee; color:#000; }
  .mmroot { display:inline-block; padding:12px 18px; border-radius:16px; background:#fff; color:#000; font-weight:900; font-size:18px; } .mmroot small { display:block; font-size:12px; color:#666; font-weight:700; }
  .mmbranches { margin-left:22px; padding:8px 0 0 18px; border-left:3px solid #333; display:flex; flex-direction:column; gap:10px; }
  .mmb { position:relative; } .mmb::before { content:""; position:absolute; left:-18px; top:20px; width:16px; border-top:3px solid var(--bc); }
  .mmn { display:flex; justify-content:space-between; gap:10px; width:100%; text-align:left; padding:10px 14px; border-radius:14px; background:var(--bc); color:#fff; font-weight:800; font-size:14.5px; line-height:1.3; }
  .mmn span { font-weight:900; opacity:.8; }
  .mmleaves { margin:8px 0 2px 16px; padding-left:14px; border-left:2px dashed var(--bc); display:flex; flex-direction:column; gap:6px; }
  .mml { text-align:left; padding:8px 12px; border-radius:12px; background:#161616; font-size:13.5px; line-height:1.35; border:1px solid #262626; }
  .mml.hid { background:#2a2208; color:#face15; border:1px dashed #face15; text-align:center; font-weight:900; } .mml.seen { animation:mskpop .3s; }
  .mmleaves img { max-width:100%; max-height:24vh; object-fit:contain; background:#fff; border-radius:10px; }
  /* flash */
  .mskwrap.peek .msk:not(.open) { visibility:hidden; }
  /* mots croisés */
  .cwgrid { display:grid; gap:2px; margin:0 auto 12px; justify-content:center; }
  .cwc { background:#f4f4f4; color:#000; border-radius:3px; position:relative; display:grid; place-items:center; font-weight:900; font-size:clamp(11px, 3.4vw, 17px); }
  .cwc.empty { background:transparent; } .cwc.sel { background:#bff7f5; } .cwc.ok { background:#c9f3dc; color:#0b6b3a; }
  .cwc i { position:absolute; top:1px; left:2px; font-size:8px; font-style:normal; color:#666; font-weight:700; }
  .cwask { background:#141414; border-radius:14px; padding:12px; margin-bottom:12px; }
  #cwIn, #boIn { width:100%; padding:12px; border-radius:12px; border:2px solid #333; background:#0c0c0c; color:#fff; font-size:17px; font-weight:800; outline:none; letter-spacing:.06em; }
  #cwIn:focus, #boIn:focus { border-color:#25f4ee; } #boIn.good { border-color:#2fd27a; } #boIn.bad { border-color:#fe2c55; }
  .cwclues button { display:block; width:100%; text-align:left; padding:9px 10px; border-radius:10px; font-size:13px; line-height:1.4; margin-bottom:4px; background:#121212; }
  .cwclues button.sel { background:#0e2e30; } .cwclues button.done { opacity:.4; text-decoration:line-through; } .cwclues small { color:var(--muted); }
  /* boss */
  .bossbar { background:linear-gradient(135deg,#2a0b14,#1a0b2e); border:1px solid #3a1630; border-radius:16px; padding:12px; margin-bottom:12px; }
  .bossname { font-weight:900; font-size:15px; display:flex; align-items:center; gap:6px; margin-bottom:8px; }
  .hp { height:12px; border-radius:6px; background:#000; overflow:hidden; } .hp i { display:block; height:100%; background:linear-gradient(90deg,#fe2c55,#ff7a1a); transition:width .4s; }
  .hp.hit { animation:shake .35s; }
  .bossrow { display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:13px; }
  /* exercice dans le feed */
  .exo .content { left:16px; right:16px; top:calc(var(--st) + 70px); bottom:120px; display:flex; flex-direction:column; justify-content:center; }
  .exobox { background:rgba(0,0,0,.35); border-radius:22px; padding:20px 18px; }
  .exobox .xk { display:inline-block; background:#face15; color:#000; font-weight:900; font-size:11px; letter-spacing:.1em; padding:5px 10px; border-radius:6px; }
  .exobox h3 { font-size:22px; line-height:1.2; margin:12px 0 6px; } .exobox p { font-size:14px; opacity:.85; margin:0 0 14px; line-height:1.4; }
  .exobox .ximg { background:#fff; border-radius:14px; padding:6px; overflow:hidden; margin-bottom:14px; } .exobox .ximg .mskwrap img { position:absolute; inset:0; width:100%; height:100%; }
  .exobox .xgo { width:100%; padding:15px; border-radius:14px; background:#fff; color:#000; font-weight:900; font-size:17px; }
  .exobox .xsteps { display:flex; flex-direction:column; gap:4px; margin-bottom:14px; } .exobox .xsteps span { background:rgba(255,255,255,.12); border-radius:8px; padding:6px 10px; font-size:13px; font-weight:700; }
</style>`);

/* ---------- outils ---------- */
const cardOf = x => ALL.find(c => c.q === x.carte && c.matiere === x.matiere) || null;
function inScope(x){ const cs = scopeCards(); if (cs === ALL) return true; const c = cardOf(x); return c ? cs.includes(c) : cs.some(k => k.matiere === x.matiere); }
const itemsIn = arr => arr.filter(inScope);
const setH = fn => { GT.handler = fn; };
const shake = el => { if (!el) return; el.classList.remove("bad"); void el.offsetWidth; el.classList.add("bad"); setTimeout(() => el.classList.remove("bad"), 450); };
const yes = n => { Sound.SFX.ok(n || 1); buzz(10); flash(true); };
const no = () => { Sound.SFX.ko(); buzz([30, 30, 30]); flash(false); };
const norm = s => F.fold(s).replace(/[’']/g, " ").replace(/[^a-z0-9α-ω]+/g, " ").replace(/^(le|la|les|l|un|une|des|du|de|d) /, "").trim();
function lev(a, b){ const m = a.length, n = b.length; if (!m) return n; if (!n) return m; let prev = Array.from({ length:n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; } return prev[n]; }
const sub = x => esc(x.matiere) + (x.chapitre ? " · " + esc(P.chLabel(x.chapitre)) : "");
const timerHead = t0 => every(() => { const el = $("gstat"); if (el) el.textContent = F.fmtT((Date.now() - t0) / 1000); }, 500);
const doneBtns = (a, b) => `<div class="gdone"><div class="gbtns">${a}${b}</div></div>`;
const PINE = new Set();   // cartes déjà marquées « à revoir » pendant la partie
function errOf(x, t, why){ return { c:cardOf(x), t, why }; }
// les termes (pendu, lettres mélangées) : notions courtes de tes cartes, avec la définition comme indice
function termPool(){
  return scopeCards().filter(c => /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{4,22}$/.test(c.q.trim()) && !/[œæ]/i.test(c.q) && c.q.trim().split(/\s+/).length <= 3 && shortDef(c.a))
    .map(c => ({ c, w:c.q.trim(), clue:maskTerm(shortDef(c.a), c.q) }));
}
const letterOf = ch => F.fold(ch).toUpperCase();

/* =====================================================================
   1. MONTRE-MOI : « Touche le glomérule »
   ===================================================================== */
const MO = { queue:[] };
function startMontre(c){
  F.gStop();
  if (!c || !c.lab) { const pool = ALL.filter(x => x.lab && scopeCards().includes(x)); if (!MO.queue.length) MO.queue = shuffle((pool.length ? pool : ALL.filter(x => x.lab)).slice()); c = MO.queue.shift(); }
  const labels = shuffle([...new Set(c.lab.filter(Boolean))]);
  Object.assign(MO, { c, labels, k:0, errs:0, t0:Date.now(), done:false });
  gameEl.innerHTML = head("Montre-moi", sub(c), "0:00") + `<div class="gbody"><div class="atl-scroll">
    <div class="mo-ask">Touche : <br><b id="moL"></b></div>
    <div class="lgimg"><div class="mskwrap" style="--ar:${c.ar || 1.4}"><img src="${esc(c.img)}" alt="">${c.masks.map((r, k) => c.lab[k] ? `<button class="msk" data-l="${esc(c.lab[k])}" style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%"></button>` : "").join("")}</div></div>
    <div class="atl-row" style="margin-top:10px"><span>${prep(c.q)}</span><span><b id="moN">0</b>/${labels.length} · erreurs <b id="moE">0</b></span></div>
    <div id="moEnd"></div></div></div>`;
  $("moL").textContent = labels[0];
  timerHead(MO.t0);
  setH((e, b) => {
    if (MO.done) { if (b && b.dataset.mo === "next") startMontre(); else if (b && b.dataset.mo === "same") startMontre(MO.c); return; }
    const wrap = e.target.closest(".mskwrap"); if (!wrap) return;
    const m = e.target.closest(".msk:not(.hit)") || P.nearestMask(wrap, e); if (!m || m.classList.contains("hit")) return;
    if (m.dataset.l === MO.labels[MO.k]) {
      gameEl.querySelectorAll(".lgimg .msk").forEach(x => { if (x.dataset.l === m.dataset.l) x.classList.add("hit"); });
      MO.k++; $("moN").textContent = MO.k; yes(MO.k);
      if (MO.k === MO.labels.length) moDone(); else $("moL").textContent = MO.labels[MO.k];
    } else { MO.errs++; $("moE").textContent = MO.errs; shake(m); no(); toast("Ça, c'est : " + m.dataset.l); }
  });
}
function moDone(){
  MO.done = true; F.gStop();
  const sec = Math.round((Date.now() - MO.t0) / 1000), g = GR(); g.montre = g.montre || {};
  const prev = g.montre[MO.c.img], rec = !prev || sec < prev; if (rec) g.montre[MO.c.img] = sec;
  srsApply(MO.c, MO.errs === 0 ? 2 : MO.errs >= 3 ? 0 : 1); save(); updateHud(); if (rec) confetti(80);
  $("moL").textContent = "Bravo !";
  $("moEnd").innerHTML = `<div class="atl-s" style="text-align:center;margin-top:8px"><b style="color:#fff;font-size:17px">${F.fmtT(sec)}</b> · ${MO.errs ? MO.errs + " erreur" + (MO.errs > 1 ? "s" : "") : "sans faute"}${rec ? ` · <b style="color:#face15">record</b>` : prev ? ` · record ${F.fmtT(prev)}` : ""}</div>`
    + doneBtns(`<button data-mo="same">Refaire</button>`, `<button class="main" data-mo="next">Schéma suivant</button>`);
}

/* =====================================================================
   2. LE BON SCHÉMA : 4 images, laquelle est « le néphron » ?
   ===================================================================== */
const BS = {};
function startBonSchema(){
  F.gStop();
  let pool = scopeCards().filter(c => c.img); if (pool.length < 6) pool = ALL.filter(c => c.img);
  Object.assign(BS, { pool, i:0, n:10, score:0, errs:[], recent:[] });
  gameEl.innerHTML = head("Le bon schéma", scopeName(), "") + `<div class="gbody"><div class="atl-row"><span>Question <b id="bsI">1</b>/10</span><span>Score <b id="bsS">0</b></span></div><div class="atl-scroll" id="bsBox"></div></div>`;
  bsRound();
  setH((e, b) => { if (!b || !b.dataset.bs || BS.lock) return;
    BS.lock = true; const ok = b.dataset.bs === "1";
    if (ok) { BS.score++; yes(BS.score); b.classList.add("good"); }
    else { no(); b.classList.add("bad"); gameEl.querySelector('[data-bs="1"]').classList.add("good"); BS.errs.push({ c:BS.c, t:"Le schéma « " + BS.c.q + " »" }); }
    $("bsS").textContent = BS.score;
    later(() => { BS.i++; if (BS.i >= BS.n) bsEnd(); else bsRound(); }, ok ? 650 : 1500);
  });
}
function bsRound(){
  BS.lock = false;
  let c; for (let k = 0; k < 20; k++) { c = pick(BS.pool); if (!BS.recent.includes(c.img)) break; }
  BS.recent = [c.img, ...BS.recent].slice(0, 8); BS.c = c;
  const same = shuffle(ALL.filter(x => x.img && x.img !== c.img && x.matiere === c.matiere)), other = shuffle(ALL.filter(x => x.img && x.img !== c.img && x.matiere !== c.matiere));
  const imgs = [...new Set([...same, ...other].map(x => x.img))].slice(0, 3);
  const opts = shuffle([{ img:c.img, ok:1 }, ...imgs.map(i => ({ img:i, ok:0 }))]);
  $("bsI").textContent = BS.i + 1;
  $("bsBox").innerHTML = `<div class="atl-t">Où est : ${prep(c.q)} ?</div><div class="atl-s">${esc(c.matiere)} · ${esc(P.chLabel(c.chapitre || ""))}</div>
    <div class="bsgrid">${opts.map(o => `<button data-bs="${o.ok}"><img src="${esc(o.img)}" alt=""></button>`).join("")}</div>`;
  math($("bsBox"));
}
function bsEnd(){
  const g = GR(), isRec = BS.score > (g.bonschema || 0); if (isRec) g.bonschema = BS.score;
  endScreen({ title:"Le bon schéma", big:BS.score + "/10", sub:"schémas reconnus", isRec, recTxt:"Record : " + (g.bonschema || 0) + "/10", errs:BS.errs, again:startBonSchema });
}

/* =====================================================================
   3. REMETS DANS L'ORDRE
   ===================================================================== */
const OR = {};
function startOrdre(item){
  F.gStop();
  const pool = itemsIn(E.seq).filter(x => x.etapes.length >= 3);
  const list = item ? [item] : shuffle(pool.slice()).slice(0, 5);
  if (!list.length) { toast("Pas de séquence ici : choisis « Tout »"); return F.closeGame(true); }
  Object.assign(OR, { list, i:0, perfect:0, errs:[], t0:Date.now() });
  gameEl.innerHTML = head("Remets dans l'ordre", scopeName(), "0:00") + `<div class="gbody"><div class="atl-row"><span>Séquence <b id="orI">1</b>/${list.length}</span><span>Sans faute <b id="orP">0</b></span></div><div class="atl-scroll" id="orBox"></div></div>`;
  timerHead(OR.t0); orRound();
  setH((e, b) => {
    if (!b) return;
    if (b.dataset.or === "next") { OR.i++; if (OR.i >= OR.list.length) orEnd(); else orRound(); return; }
    if (b.dataset.oi === undefined || OR.lock) return;
    const x = OR.list[OR.i], k = +b.dataset.oi;
    if (k === OR.pos) {
      const d = document.createElement("div"); d.innerHTML = `<i>${k + 1}</i><span>${esc(x.etapes[k])}</span>`; $("orPlaced").appendChild(d);
      b.remove(); OR.pos++; Sound.SFX.tap(); buzz(8);
      if (OR.pos === x.etapes.length) { if (!OR.faute) { OR.perfect++; $("orP").textContent = OR.perfect; } yes(3); OR.lock = true;
        $("orBox").insertAdjacentHTML("beforeend", `<div class="gdone"><div class="atl-s" style="text-align:center">${OR.faute ? OR.faute + " erreur" + (OR.faute > 1 ? "s" : "") : "Sans faute !"}</div><div class="gbtns"><button class="main" data-or="next">${OR.i + 1 < OR.list.length ? "Suivante" : "Terminer"}</button></div></div>`); }
    } else { if (!OR.faute) OR.errs.push(errOf(x, x.titre, x.etapes.map((s, j) => (j + 1) + ") " + s).join("<br>"))); OR.faute++; shake(b); no(); }
  });
}
function orRound(){
  const x = OR.list[OR.i]; OR.lock = false; OR.faute = 0;
  OR.pos = x.boucle ? 1 : 0;
  const idx = shuffle(x.etapes.map((_, k) => k).filter(k => k >= OR.pos));
  $("orI").textContent = OR.i + 1;
  $("orBox").innerHTML = `<div class="atl-t">${esc(x.titre)}</div><div class="atl-s">${sub(x)} · touche les étapes dans l'ordre${x.boucle ? " (c'est une boucle : on part de la 1re)" : ""}</div>
    <div class="ord-placed" id="orPlaced">${x.boucle ? `<div><i>1</i><span>${esc(x.etapes[0])}</span></div>` : ""}</div>
    <div class="ord-pool">${idx.map(k => `<button data-oi="${k}">${esc(x.etapes[k])}</button>`).join("")}</div>`;
}
function orEnd(){
  const g = GR(), n = OR.list.length, isRec = n >= 5 && OR.perfect > (g.ordre || 0); if (isRec) g.ordre = OR.perfect;
  endScreen({ title:"Remets dans l'ordre", big:OR.perfect + "/" + n, sub:"séquences sans faute · " + F.fmtT((Date.now() - OR.t0) / 1000), isRec, recTxt:n >= 5 ? "Record : " + (g.ordre || 0) + "/5" : "", errs:OR.errs, again:() => startOrdre(n === 1 ? OR.list[0] : null) });
}

/* =====================================================================
   4. SCHÉMA FLÉCHÉ À COMPLÉTER
   ===================================================================== */
const FL = {};
function startFleche(item){
  F.gStop();
  const pool = itemsIn(E.seq).filter(x => x.etapes.length >= 3);
  const list = item ? [item] : shuffle(pool.slice()).slice(0, 4);
  if (!list.length) { toast("Pas de schéma fléché ici : choisis « Tout »"); return F.closeGame(true); }
  Object.assign(FL, { list, i:0, perfect:0, errs:[], t0:Date.now() });
  gameEl.innerHTML = head("Schéma fléché", scopeName(), "0:00") + `<div class="gbody"><div class="atl-row"><span>Schéma <b id="flI">1</b>/${list.length}</span><span>Sans faute <b id="flP">0</b></span></div><div class="atl-scroll" id="flBox"></div></div>`;
  timerHead(FL.t0); flRound();
  setH((e, b) => pairClick(b, FL, "fl", flCheck, () => { FL.i++; if (FL.i >= FL.list.length) flEnd(); else flRound(); }));
}
function flRound(){
  const x = FL.list[FL.i], L = x.etapes.length; FL.faute = 0; FL.sel = null;
  const cand = shuffle(x.etapes.map((_, k) => k).filter(k => k > 0)), nh = Math.min(cand.length, Math.max(2, Math.ceil(L * 0.55)));
  const hid = new Set(cand.slice(0, nh));
  const others = shuffle(E.seq.filter(y => y !== x && y.matiere === x.matiere).flatMap(y => y.etapes).filter(s => !x.etapes.includes(s))).slice(0, 2);
  FL.left = hid.size;
  $("flI").textContent = FL.i + 1;
  $("flBox").innerHTML = `<div class="atl-t">${esc(x.titre)}</div><div class="atl-s">${sub(x)} · touche une étiquette, puis sa case</div>
    <div class="flow">${x.etapes.map((s, k) => (k ? `<div class="farr">↓</div>` : "") + (hid.has(k) ? `<button class="fbox blank" data-flb="${k}">?</button>` : `<div class="fbox">${esc(s)}</div>`)).join("")}${x.boucle ? `<div class="farr">↺ et ça recommence</div>` : ""}</div>
    <div class="fchips">${shuffle([...[...hid].map(k => x.etapes[k]), ...others]).map(t => `<button data-flc="${esc(t)}">${esc(t)}</button>`).join("")}</div>`;
}
function flCheck(blank, chip){
  const x = FL.list[FL.i], k = +blank.dataset.flb;
  if (x.etapes[k] === chip.dataset.flc) { blank.textContent = x.etapes[k]; blank.classList.remove("blank"); blank.classList.add("ok"); blank.disabled = true; chip.remove(); yes(); return --FL.left === 0; }
  if (!FL.faute) FL.errs.push(errOf(x, x.titre, x.etapes.join(" → "))); FL.faute++; shake(blank); shake(chip); no(); return false;
}
// sélection « case vide + étiquette » commune au schéma fléché et au tableau
function pairClick(b, ST, p, check, next){
  if (!b) return;
  if (b.dataset[p + "n"] !== undefined || b.dataset.nx === p) { next(); return; }
  const isBlank = b.dataset[p + "b"] !== undefined, isChip = b.dataset[p + "c"] !== undefined;
  if (!isBlank && !isChip) return;
  if (ST.sel && ST.sel.isBlank !== isBlank) {
    const blank = isBlank ? b : ST.sel.el, chip = isBlank ? ST.sel.el : b;
    ST.sel.el.classList.remove("sel"); ST.sel = null;
    if (check(blank, chip)) { if (!ST.faute) { ST.perfect++; const el = $(p + "P"); if (el) el.textContent = ST.perfect; }
      $(p + "Box").insertAdjacentHTML("beforeend", `<div class="gdone"><div class="atl-s" style="text-align:center">${ST.faute ? ST.faute + " erreur" + (ST.faute > 1 ? "s" : "") : "Sans faute !"}</div><div class="gbtns"><button class="main" data-nx="${p}">${ST.i + 1 < ST.list.length ? "Suivant" : "Terminer"}</button></div></div>`); }
    return;
  }
  if (ST.sel) ST.sel.el.classList.remove("sel");
  ST.sel = { el:b, isBlank }; b.classList.add("sel"); Sound.SFX.tap();
}
function flEnd(){
  const g = GR(), n = FL.list.length, isRec = n >= 4 && FL.perfect > (g.fleche || 0); if (isRec) g.fleche = FL.perfect;
  endScreen({ title:"Schéma fléché", big:FL.perfect + "/" + n, sub:"schémas sans faute · " + F.fmtT((Date.now() - FL.t0) / 1000), isRec, recTxt:n >= 4 ? "Record : " + (g.fleche || 0) + "/4" : "", errs:FL.errs, again:() => startFleche(n === 1 ? FL.list[0] : null) });
}

/* =====================================================================
   5. TABLEAU À REMPLIR
   ===================================================================== */
const TB = {};
function startTableau(item){
  F.gStop();
  const list = item ? [item] : shuffle(itemsIn(E.tables).slice()).slice(0, 3);
  if (!list.length) { toast("Pas de tableau ici : choisis « Tout »"); return F.closeGame(true); }
  Object.assign(TB, { list, i:0, perfect:0, errs:[], t0:Date.now() });
  gameEl.innerHTML = head("Tableau à remplir", scopeName(), "0:00") + `<div class="gbody"><div class="atl-row"><span>Tableau <b id="tbI">1</b>/${list.length}</span><span>Sans faute <b id="tbP">0</b></span></div><div class="atl-scroll" id="tbBox"></div></div>`;
  timerHead(TB.t0); tbRound();
  setH((e, b) => {
    const td = e.target.closest("td.blank"); if (td && !b) b = td;
    pairClick(b, TB, "tb", tbCheck, () => { TB.i++; if (TB.i >= TB.list.length) tbEnd(); else tbRound(); });
  });
}
function tbRound(){
  const t = TB.list[TB.i]; TB.faute = 0; TB.sel = null;
  const cells = []; t.rows.forEach((r, ri) => r.forEach((v, ci) => { if (ci > 0 && v && v !== "—") cells.push(ri + "-" + ci); }));
  const nh = Math.min(cells.length, Math.max(2, Math.ceil(cells.length * 0.6))), hid = new Set(shuffle(cells).slice(0, nh));
  TB.left = hid.size;
  $("tbI").textContent = TB.i + 1;
  const val = id => { const [ri, ci] = id.split("-").map(Number); return t.rows[ri][ci]; };
  $("tbBox").innerHTML = `<div class="atl-t">${esc(t.titre)}</div><div class="atl-s">${sub(t)} · touche une étiquette, puis sa case</div>
    <table class="ttab"><tr>${t.cols.map(h => `<th>${esc(h)}</th>`).join("")}</tr>${t.rows.map((r, ri) => `<tr>${r.map((v, ci) => ci === 0 ? `<th>${esc(v)}</th>` : hid.has(ri + "-" + ci) ? `<td class="blank" data-tbb="${ri}-${ci}">?</td>` : `<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</table>
    <div class="fchips">${shuffle([...hid].map(id => val(id))).map(v => `<button data-tbc="${esc(v)}">${esc(v)}</button>`).join("")}</div>`;
}
function tbCheck(cell, chip){
  const t = TB.list[TB.i], [ri, ci] = cell.dataset.tbb.split("-").map(Number);
  if (t.rows[ri][ci] === chip.dataset.tbc) { cell.textContent = t.rows[ri][ci]; cell.classList.remove("blank"); cell.classList.add("ok"); delete cell.dataset.tbb; chip.remove(); yes(); return --TB.left === 0; }
  if (!TB.faute) TB.errs.push(errOf(t, t.titre, t.rows.map(r => `<b>${esc(r[0])}</b> : ${r.slice(1).map(esc).join(" · ")}`).join("<br>"))); TB.faute++; shake(cell); shake(chip); no(); return false;
}
function tbEnd(){
  const g = GR(), n = TB.list.length, isRec = n >= 3 && TB.perfect > (g.tableau || 0); if (isRec) g.tableau = TB.perfect;
  endScreen({ title:"Tableau à remplir", big:TB.perfect + "/" + n, sub:"tableaux sans faute · " + F.fmtT((Date.now() - TB.t0) / 1000), isRec, recTxt:n >= 3 ? "Record : " + (g.tableau || 0) + "/3" : "", errs:TB.errs, again:() => startTableau(n === 1 ? TB.list[0] : null) });
}

/* =====================================================================
   6. CLASSE-MOI ÇA
   ===================================================================== */
const TR = {};
function startTri(item){
  F.gStop();
  const list = item ? [item] : shuffle(itemsIn(E.groupes).slice()).slice(0, 3);
  if (!list.length) { toast("Rien à classer ici : choisis « Tout »"); return F.closeGame(true); }
  Object.assign(TR, { list, i:0, ok:0, tot:0, errs:[], t0:Date.now() });
  gameEl.innerHTML = head("Classe-moi ça", scopeName(), "0:00") + `<div class="gbody"><div class="atl-row"><span>Série <b id="trI">1</b>/${list.length}</span><span>Bien classés <b id="trS">0</b></span></div><div class="atl-scroll" id="trBox"></div></div>`;
  timerHead(TR.t0); trRound();
  setH((e, b) => {
    if (!b || b.dataset.trk === undefined || TR.lock) return;
    const it = TR.items[TR.j], ok = b.dataset.trk === it.cat; TR.tot++; TR.lock = true;
    if (ok) { TR.ok++; $("trS").textContent = TR.ok; b.classList.add("good"); yes(TR.ok); const sm = b.querySelector("small"); sm.textContent = +sm.textContent + 1; }
    else { b.classList.add("bad"); no(); gameEl.querySelector(`.trbk [data-trk="${CSS.escape(it.cat)}"]`).classList.add("good"); TR.errs.push(errOf(TR.list[TR.i], it.t, "→ " + esc(it.cat))); }
    later(() => { gameEl.querySelectorAll(".trbk button").forEach(x => x.classList.remove("good", "bad")); TR.lock = false; TR.j++; if (TR.j < TR.items.length) trShow(); else { TR.i++; if (TR.i < TR.list.length) trRound(); else trEnd(); } }, ok ? 380 : 1100);
  });
}
function trRound(){
  const x = TR.list[TR.i]; TR.j = 0;
  TR.items = shuffle(Object.entries(x.g).flatMap(([cat, arr]) => arr.map(t => ({ t, cat }))));
  $("trI").textContent = TR.i + 1;
  $("trBox").innerHTML = `<div class="atl-t">${esc(x.titre)}</div><div class="atl-s">${sub(x)} · <span id="trN"></span></div><div class="trcard" id="trCard"></div>
    <div class="trbk">${Object.keys(x.g).map(cat => `<button data-trk="${esc(cat)}"><span>${esc(cat)}</span><small>0</small></button>`).join("")}</div>`;
  trShow();
}
function trShow(){ $("trCard").textContent = TR.items[TR.j].t; $("trN").textContent = (TR.j + 1) + "/" + TR.items.length; }
function trEnd(){
  const g = GR(), pct = Math.round(TR.ok / Math.max(1, TR.tot) * 100), isRec = TR.list.length >= 3 && pct > (g.tri || 0); if (isRec) g.tri = pct;
  endScreen({ title:"Classe-moi ça", big:pct + " %", sub:`${TR.ok}/${TR.tot} bien classés · ${F.fmtT((Date.now() - TR.t0) / 1000)}`, isRec, recTxt:"Record : " + (g.tri || 0) + " %", errs:TR.errs, again:() => startTri(TR.list.length === 1 ? TR.list[0] : null) });
}

/* =====================================================================
   7. L'INTRUS
   ===================================================================== */
const IN = {};
function intrusPool(){ return itemsIn(E.groupes).filter(x => Object.keys(x.g).length >= 2 && Object.values(x.g).some(a => a.length >= 3)); }
function startIntrus(){
  F.gStop();
  const pool = intrusPool(); if (!pool.length) { toast("Pas d'intrus ici : choisis « Tout »"); return F.closeGame(true); }
  Object.assign(IN, { pool, i:0, n:10, score:0, errs:[] });
  gameEl.innerHTML = head("L'intrus", scopeName(), "") + `<div class="gbody"><div class="atl-row"><span>Question <b id="inI">1</b>/10</span><span>Score <b id="inS">0</b></span></div><div class="atl-scroll" id="inBox"></div></div>`;
  inRound();
  setH((e, b) => {
    if (!b) return;
    if (b.dataset.inx) { IN.i++; if (IN.i >= IN.n) inEnd(); else inRound(); return; }
    if (b.dataset.in === undefined || IN.lock) return;
    IN.lock = true; const ok = b.dataset.in === "1";
    if (ok) { IN.score++; $("inS").textContent = IN.score; b.classList.add("good"); yes(IN.score); }
    else { b.classList.add("bad"); no(); gameEl.querySelector('[data-in="1"]').classList.add("good"); IN.errs.push(errOf(IN.x, `Intrus : ${esc(IN.intrus)}`, `${esc(IN.intrus)} → ${esc(IN.catB)} ; les autres → ${esc(IN.catA)}`)); }
    $("inBox").insertAdjacentHTML("beforeend", `<div class="apexp"><b>${esc(IN.intrus)}</b> : « ${esc(IN.catB)} ». Les trois autres : « ${esc(IN.catA)} ».</div><div class="gdone"><div class="gbtns"><button class="main" data-inx="1">${IN.i + 1 < IN.n ? "Suivante" : "Terminer"}</button></div></div>`);
  });
}
function inRound(){
  IN.lock = false;
  const x = pick(IN.pool), cats = Object.keys(x.g), A = pick(cats.filter(c => x.g[c].length >= 3)), B = pick(cats.filter(c => c !== A));
  const three = shuffle(x.g[A].slice()).slice(0, 3), intrus = pick(x.g[B]);
  Object.assign(IN, { x, catA:A, catB:B, intrus });
  $("inI").textContent = IN.i + 1;
  $("inBox").innerHTML = `<div class="atl-t">Trois de ces éléments sont « ${esc(A)} ». Lequel est l'intrus ?</div><div class="atl-s">${sub(x)} · ${esc(x.titre)}</div>
    <div class="inopts">${shuffle([...three.map(t => ({ t, ok:0 })), { t:intrus, ok:1 }]).map(o => `<button data-in="${o.ok}">${esc(o.t)}</button>`).join("")}</div>`;
}
function inEnd(){
  const g = GR(), isRec = IN.score > (g.intrus || 0); if (isRec) g.intrus = IN.score;
  endScreen({ title:"L'intrus", big:IN.score + "/10", sub:"intrus trouvés", isRec, recTxt:"Record : " + (g.intrus || 0) + "/10", errs:IN.errs, again:startIntrus });
}

/* =====================================================================
   8. ET APRÈS ?
   ===================================================================== */
const AP = {};
function startApres(){
  F.gStop();
  const pool = itemsIn(E.seq).filter(x => x.etapes.length >= 3);
  if (!pool.length) { toast("Pas de chaîne ici : choisis « Tout »"); return F.closeGame(true); }
  Object.assign(AP, { pool, i:0, n:10, score:0, errs:[], recent:[] });
  gameEl.innerHTML = head("Et après ?", scopeName(), "") + `<div class="gbody"><div class="atl-row"><span>Question <b id="apI">1</b>/10</span><span>Score <b id="apS">0</b></span></div><div class="atl-scroll" id="apBox"></div></div>`;
  apRound();
  setH((e, b) => {
    if (!b) return;
    if (b.dataset.apx) { AP.i++; if (AP.i >= AP.n) apEnd(); else apRound(); return; }
    if (b.dataset.ap === undefined || AP.lock) return;
    AP.lock = true; const ok = b.dataset.ap === "1", x = AP.x;
    if (ok) { AP.score++; $("apS").textContent = AP.score; b.classList.add("good"); yes(AP.score); }
    else { b.classList.add("bad"); no(); gameEl.querySelector('[data-ap="1"]').classList.add("good"); AP.errs.push(errOf(x, `${esc(x.etapes[AP.k])} → ?`, "→ " + esc(x.etapes[AP.k + 1]))); }
    $("apBox").insertAdjacentHTML("beforeend", `<div class="apexp">${x.etapes.map((s, j) => j === AP.k + 1 ? `<b style="color:#2fd27a">${esc(s)}</b>` : esc(s)).join(" → ")}</div><div class="gdone"><div class="gbtns"><button class="main" data-apx="1">${AP.i + 1 < AP.n ? "Suivante" : "Terminer"}</button></div></div>`);
  });
}
function apRound(){
  AP.lock = false;
  let x; for (let t = 0; t < 10; t++) { x = pick(AP.pool); if (!AP.recent.includes(x)) break; }
  AP.recent = [x, ...AP.recent].slice(0, 4);
  const k = Math.random() * (x.etapes.length - 1) | 0, good = x.etapes[k + 1];
  const later2 = x.etapes.slice(k + 2), others = shuffle(E.seq.filter(y => y !== x && y.matiere === x.matiere).flatMap(y => y.etapes));
  const wrong = [...shuffle(later2), ...others].filter(s => s !== good && !x.etapes.slice(0, k + 1).includes(s));
  const opts = shuffle([{ t:good, ok:1 }, ...[...new Set(wrong)].slice(0, 2).map(t => ({ t, ok:0 }))]);
  Object.assign(AP, { x, k });
  $("apI").textContent = AP.i + 1;
  $("apBox").innerHTML = `<div class="atl-t">${esc(x.titre)}</div><div class="atl-s">${sub(x)}</div>
    <div class="apchain">${k > 1 ? `<div class="farr">…</div>` : ""}${k > 0 ? `<div class="fbox">${esc(x.etapes[k - 1])}</div><div class="farr">↓</div>` : ""}<div class="fbox">${esc(x.etapes[k])}</div><div class="farr">↓</div><div class="fbox q">Et après ?</div></div>
    <div class="apopts">${opts.map(o => `<button data-ap="${o.ok}">${esc(o.t)}</button>`).join("")}</div>`;
}
function apEnd(){
  const g = GR(), isRec = AP.score > (g.apres || 0); if (isRec) g.apres = AP.score;
  endScreen({ title:"Et après ?", big:AP.score + "/10", sub:"bonnes suites", isRec, recTxt:"Record : " + (g.apres || 0) + "/10", errs:AP.errs, again:startApres });
}

/* =====================================================================
   9. TAPE LA RÉPONSE (sans propositions)
   ===================================================================== */
const TP = {};
function tapePool(cs){
  const out = [];
  (cs || scopeCards()).forEach(c => (c.trous || []).forEach(tr => { const m = tr.t.match(CLOZE); if (m && !/\$/.test(m[1]) && plain(m[1]).length <= 30) out.push({ c, ans:plain(m[1]), txt:tr.t }); }));
  return out;
}
function startTape(){
  F.gStop();
  const pool = tapePool(); if (pool.length < 5) { toast("Pas assez de phrases ici : choisis « Tout »"); return F.closeGame(true); }
  Object.assign(TP, { pool, i:0, n:10, score:0, errs:[], recent:[], state:"ask" });
  gameEl.innerHTML = head("Tape la réponse", scopeName(), "") + `<div class="gbody"><div class="atl-row"><span>Question <b id="tpI">1</b>/10</span><span>Score <b id="tpS">0</b></span></div>
    <div class="atl-scroll"><div class="atl-s" id="tpM"></div><div class="tpq" id="tpQ"></div>
    <input id="tpIn" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="go" placeholder="Écris le mot manquant">
    <div class="tpbtns"><button data-tp="hint">Indice</button><button class="main" data-tp="go" id="tpGo">Valider</button></div><div class="tpres" id="tpR"></div></div></div>`;
  tpRound();
  setH((e, b) => { if (!b || !b.dataset.tp) return; if (b.dataset.tp === "hint") tpHint(); else tpGo(); });
  GT.keys = e => { if (e.key === "Enter" && $("tpIn")) { e.preventDefault(); tpGo(); return true; } return false; };
  setTimeout(() => { const i = $("tpIn"); if (i) i.focus(); }, 60);
}
function tpRound(){
  let it; for (let t = 0; t < 20; t++) { it = pick(TP.pool); if (!TP.recent.includes(it.txt)) break; }
  TP.recent = [it.txt, ...TP.recent].slice(0, 15); TP.it = it; TP.hints = 0; TP.state = "ask";
  $("tpI").textContent = TP.i + 1; $("tpM").innerHTML = esc(it.c.matiere) + " · " + esc(P.chLabel(it.c.chapitre || ""));
  $("tpQ").innerHTML = prep(it.txt.replace(CLOZE, '<span class="blank"></span>')); math($("tpQ"));
  const inp = $("tpIn"); inp.value = ""; inp.className = ""; inp.disabled = false; inp.placeholder = "Écris le mot manquant";
  $("tpR").innerHTML = ""; $("tpGo").textContent = "Valider";
}
function tpHint(){
  if (TP.state !== "ask") return;
  TP.hints = Math.min(TP.it.ans.length, TP.hints + 1 + (TP.it.ans.length > 8 ? 1 : 0));
  const inp = $("tpIn"); inp.value = TP.it.ans.slice(0, TP.hints); inp.focus(); Sound.SFX.tap();
}
function tpGo(){
  const inp = $("tpIn"); if (!inp) return;
  if (TP.state === "shown") { TP.i++; if (TP.i >= TP.n) return tpEnd(); tpRound(); inp.focus(); return; }
  const a = norm(inp.value), b = norm(TP.it.ans); if (!a) { toast("Écris ta réponse (ou demande un indice)"); return; }
  const tol = b.length <= 4 ? 0 : b.length <= 8 ? 1 : 2, ok = a === b || lev(a, b) <= tol;
  TP.state = "shown"; inp.classList.add(ok ? "good" : "bad");
  if (ok) { const pts = TP.hints ? 0.5 : 1; TP.score += pts; $("tpS").textContent = String(TP.score).replace(".", ","); yes(Math.ceil(TP.score));
    $("tpR").innerHTML = `<b class="g">Bravo${TP.hints ? " (avec indice : ½ point)" : ""} !</b>${a !== b ? ` On écrit : <b>${esc(TP.it.ans)}</b>` : ""}`; }
  else { no(); TP.errs.push({ c:TP.it.c, t:TP.it.txt.replace(CLOZE, `<b>${esc(TP.it.ans)}</b>`) }); $("tpR").innerHTML = `<b class="r">Raté.</b> La réponse : <b>${esc(TP.it.ans)}</b>`; }
  $("tpGo").textContent = TP.i + 1 < TP.n ? "Suivante" : "Terminer";
}
function tpEnd(){
  GT.keys = null;
  const g = GR(), isRec = TP.score > (g.tape || 0); if (isRec) g.tape = TP.score;
  endScreen({ title:"Tape la réponse", big:String(TP.score).replace(".", ",") + "/10", sub:"mots retrouvés de mémoire", isRec, recTxt:"Record : " + String(g.tape || 0).replace(".", ",") + "/10", errs:TP.errs, again:startTape });
}

/* =====================================================================
   10. PENDU
   ===================================================================== */
const PD = {};
function startPendu(){
  F.gStop();
  const pool = termPool(); if (pool.length < 5) { toast("Pas assez de notions ici : choisis « Tout »"); return F.closeGame(true); }
  Object.assign(PD, { pool, i:0, n:5, score:0, errs:[], recent:[] });
  gameEl.innerHTML = head("Pendu", scopeName(), "") + `<div class="gbody"><div class="atl-row"><span>Mot <b id="pdI">1</b>/5</span><span>Trouvés <b id="pdS">0</b></span></div><div class="atl-scroll" id="pdBox"></div></div>`;
  pdRound();
  setH((e, b) => {
    if (!b) return;
    if (b.dataset.pdx) { PD.i++; if (PD.i >= PD.n) pdEnd(); else pdRound(); return; }
    if (!b.dataset.pk || PD.over) return;
    pdGuess(b.dataset.pk);
  });
  GT.keys = e => { if (/^[a-z]$/i.test(e.key) && !PD.over && gameEl.querySelector(".pdkb")) { pdGuess(e.key.toUpperCase()); return true; } return false; };
}
function pdRound(){
  let t; for (let k = 0; k < 20; k++) { t = pick(PD.pool); if (!PD.recent.includes(t.w)) break; }
  PD.recent = [t.w, ...PD.recent].slice(0, 10);
  Object.assign(PD, { t, got:new Set(), miss:new Set(), lives:7, over:false });
  $("pdI").textContent = PD.i + 1;
  $("pdBox").innerHTML = `<div class="clue"><span class="lbl">INDICE · ${esc(t.c.matiere)} · ${esc(P.chLabel(t.c.chapitre || ""))}</span>${prep(t.clue)}</div>
    <div class="pdword" id="pdW"></div><div class="pdlives" id="pdL"></div>
    <div class="pdkb">${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(L => `<button data-pk="${L}">${L}</button>`).join("")}</div><div id="pdEnd"></div>`;
  math($("pdBox")); pdDraw();
}
function pdDraw(reveal){
  const w = PD.t.w;
  $("pdW").innerHTML = w.split(" ").map(word => `<div class="w">${[...word].map(ch => /[\p{L}]/u.test(ch) ? `<span class="${reveal && !PD.got.has(letterOf(ch)) ? "lost" : ""}">${PD.got.has(letterOf(ch)) || reveal ? ch.toUpperCase() : ""}</span>` : `<span class="sep">${ch}</span>`).join("")}</div>`).join("");
  $("pdL").innerHTML = `Vies : <b>${"●".repeat(PD.lives)}</b>${"○".repeat(7 - PD.lives)}`;
}
function pdGuess(L){
  if (PD.got.has(L) || PD.miss.has(L)) return;
  const btn = gameEl.querySelector(`[data-pk="${L}"]`);
  const letters = new Set([...PD.t.w].filter(ch => /[\p{L}]/u.test(ch)).map(letterOf));
  if (letters.has(L)) { PD.got.add(L); btn && btn.classList.add("y"); Sound.SFX.tap(); buzz(8); }
  else { PD.miss.add(L); PD.lives--; btn && btn.classList.add("n"); Sound.SFX.ko(); buzz(20); }
  const won = [...letters].every(x => PD.got.has(x)), lost = PD.lives <= 0;
  pdDraw(lost);
  if (won || lost) {
    PD.over = true;
    if (won) { PD.score++; $("pdS").textContent = PD.score; yes(PD.score); }
    else { no(); PD.errs.push({ c:PD.t.c, t:`<b>${esc(PD.t.w)}</b>`, why:PD.t.clue }); }
    $("pdEnd").innerHTML = `<div class="gdone"><div class="atl-s" style="text-align:center">${won ? "Trouvé !" : "C'était : <b style=\"color:#fff\">" + esc(PD.t.w) + "</b>"}</div><div class="gbtns"><button class="main" data-pdx="1">${PD.i + 1 < PD.n ? "Mot suivant" : "Terminer"}</button></div></div>`;
  }
}
function pdEnd(){
  GT.keys = null;
  const g = GR(), isRec = PD.score > (g.pendu || 0); if (isRec) g.pendu = PD.score;
  endScreen({ title:"Pendu", big:PD.score + "/5", sub:"mots trouvés", isRec, recTxt:"Record : " + (g.pendu || 0) + "/5", errs:PD.errs, again:startPendu });
}

/* =====================================================================
   11. LETTRES MÉLANGÉES
   ===================================================================== */
const AN = {};
function startAnagramme(){
  F.gStop();
  const pool = termPool().filter(t => t.w.replace(/[^\p{L}]/gu, "").length <= 16); if (pool.length < 5) { toast("Pas assez de notions ici : choisis « Tout »"); return F.closeGame(true); }
  Object.assign(AN, { pool, i:0, n:5, score:0, errs:[], recent:[] });
  gameEl.innerHTML = head("Lettres mélangées", scopeName(), "") + `<div class="gbody"><div class="atl-row"><span>Mot <b id="anI">1</b>/5</span><span>Trouvés <b id="anS">0</b></span></div><div class="atl-scroll" id="anBox"></div></div>`;
  anRound();
  setH((e, b) => {
    if (!b && e.target.closest(".anslots span[data-s]")) { anUnplace(+e.target.closest("span[data-s]").dataset.s); return; }
    if (!b) return;
    if (b.dataset.anx) { AN.i++; if (AN.i >= AN.n) anEnd(); else anRound(); return; }
    if (b.dataset.an === "skip" && !AN.over) { anFinish(false); return; }
    if (b.dataset.at !== undefined && !AN.over) anPlace(+b.dataset.at);
  });
}
function anRound(){
  let t; for (let k = 0; k < 20; k++) { t = pick(AN.pool); if (!AN.recent.includes(t.w)) break; }
  AN.recent = [t.w, ...AN.recent].slice(0, 10);
  const chars = [...t.w].filter(ch => /[\p{L}]/u.test(ch)).map(ch => ch.toUpperCase());
  let order; for (let k = 0; k < 10; k++) { order = shuffle(chars.map((_, j) => j)); if (order.some((v, j) => v !== j)) break; }
  Object.assign(AN, { t, chars, order, slots:Array(chars.length).fill(null), over:false, tries:0 });
  $("anI").textContent = AN.i + 1;
  $("anBox").innerHTML = `<div class="clue"><span class="lbl">INDICE · ${esc(t.c.matiere)} · ${esc(P.chLabel(t.c.chapitre || ""))}</span>${prep(t.clue)}</div>
    <div class="pdword anslots" id="anW"></div><div class="antiles" id="anT"></div>
    <div class="tpbtns" style="margin-top:16px"><button data-an="skip">Je sèche</button></div><div id="anEnd"></div>`;
  math($("anBox")); anDraw();
}
function anDraw(){
  let si = 0;
  $("anW").innerHTML = AN.t.w.split(" ").map(word => `<div class="w">${[...word].map(ch => { if (!/[\p{L}]/u.test(ch)) return `<span class="sep">${ch}</span>`; const k = si++, v = AN.slots[k]; return `<span data-s="${k}">${v === null ? "" : AN.chars[v]}</span>`; }).join("")}</div>`).join("");
  $("anT").innerHTML = AN.order.map(j => `<button data-at="${j}" class="${AN.slots.includes(j) ? "used" : ""}">${AN.chars[j]}</button>`).join("");
}
function anPlace(j){
  if (AN.slots.includes(j)) return;
  const k = AN.slots.indexOf(null); if (k < 0) return;
  AN.slots[k] = j; Sound.SFX.tap(); anDraw();
  if (!AN.slots.includes(null)) {
    const got = AN.slots.map(v => letterOf(AN.chars[v])).join(""), want = AN.chars.map(letterOf).join("");
    if (got === want) anFinish(true);
    else { AN.tries++; no(); shake($("anW")); toast("Pas tout à fait : touche une lettre pour la retirer"); }
  }
}
function anUnplace(k){ if (AN.over || AN.slots[k] === null) return; AN.slots[k] = null; Sound.SFX.tap(); anDraw(); }
function anFinish(won){
  AN.over = true;
  if (won) { AN.score++; $("anS").textContent = AN.score; yes(AN.score); }
  else { no(); AN.slots = AN.chars.map((_, j) => j); anDraw(); AN.errs.push({ c:AN.t.c, t:`<b>${esc(AN.t.w)}</b>`, why:AN.t.clue }); }
  $("anEnd").innerHTML = `<div class="gdone"><div class="atl-s" style="text-align:center">${won ? "Bien joué !" : "C'était : <b style=\"color:#fff\">" + esc(AN.t.w) + "</b>"}</div><div class="gbtns"><button class="main" data-anx="1">${AN.i + 1 < AN.n ? "Mot suivant" : "Terminer"}</button></div></div>`;
}
function anEnd(){
  const g = GR(), isRec = AN.score > (g.anagramme || 0); if (isRec) g.anagramme = AN.score;
  endScreen({ title:"Lettres mélangées", big:AN.score + "/5", sub:"mots reconstitués", isRec, recTxt:"Record : " + (g.anagramme || 0) + "/5", errs:AN.errs, again:startAnagramme });
}

/* =====================================================================
   12. STORIES DE SÉANCE : les points clés avant de jouer
   ===================================================================== */
const ST = {};
function startStories(key){
  F.gStop(); gameEl.classList.remove("story");
  const cs = scopeCards(), groups = new Map();
  P.courseSort(cs).forEach(c => { const k = P.keyOf(c); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(c); });
  if (key && groups.has(key)) return stPlay(key, groups.get(key));
  gameEl.innerHTML = head("Stories de séance", scopeName(), "") + `<div class="gbody"><div class="atl-s">Choisis une séance : ses notions défilent en stories, comme sur Insta. Touche à droite pour avancer, à gauche pour revenir.</div>
    <div class="atl-scroll stlist">${[...groups].filter(([, a]) => a.length >= 2).map(([k, a]) => { const [m, ch] = k.split("|"); return `<button data-stk="${esc(k)}"><span>${esc(P.chLabel(ch))}<br><small style="white-space:normal">${esc(m)}</small></span><small>${a.length} notions</small></button>`; }).join("")}</div></div>`;
  setH((e, b) => { if (b && b.dataset.stk) stPlay(b.dataset.stk, groups.get(b.dataset.stk)); });
}
function stPlay(key, cards){
  Object.assign(ST, { key, cards, i:0 });
  gameEl.classList.add("story"); stShow();
  setH((e, b) => {
    if (b && b.dataset.stq) { const k = ST.key; F.closeGame(true); gameEl.classList.remove("story"); const [m, ch] = k.split("|"); openCustom({ key:"chap:" + k, nom:m + " · " + seanceLbl(ch).replace("Séance ", "S"), mode:"card", f:c => P.keyOf(c) === k }); return; }
    if (b && b.dataset.sto) { startStories(); return; }
    if (b && b.dataset.stz) { stStep(+b.dataset.stz); return; }
  });
  GT.keys = e => { if (e.key === "ArrowRight") { stStep(1); return true; } if (e.key === "ArrowLeft") { stStep(-1); return true; } return false; };
}
function stStep(d){
  if (ST.i >= ST.cards.length) return;
  ST.i = Math.max(0, ST.i + d); Sound.SFX.tap();
  if (ST.i >= ST.cards.length) stEnd(); else stShow();
}
function stShow(){
  F.gStop();
  const c = ST.cards[ST.i], m = { ...matOf(c.matiere), ...lookOf(c) };
  const body = c.cle && c.cle.length ? `<ul>${c.cle.map(k => `<li>${prep(k)}</li>`).join("")}</ul>` : `<div class="sdef">${prep(shortDef(c.a) || c.a)}</div>`;
  const dur = 6 + Math.min(8, (c.cle || []).length * 1.5);
  gameEl.innerHTML = head(esc(P.chLabel(c.chapitre || "")), esc(c.matiere), `<span style="font-size:13px">${ST.i + 1}/${ST.cards.length}</span>`) +
    `<div class="stbars">${ST.cards.map((_, k) => `<i class="${k < ST.i ? "done" : k === ST.i ? "cur" : ""}" style="--dur:${dur}s"><b></b></i>`).join("")}</div>
    <div class="stview" style="--c1:${m.couleurs[0]};--c2:${m.couleurs[1]}"><span class="sm">@${esc(c.matiere.toLowerCase())}</span><h3>${prep(c.q)}</h3>${body}${c.img ? `<img src="${esc(c.img)}" alt="">` : ""}
      <div class="tapz"><div data-stz="-1"></div><div data-stz="1"></div></div></div>
    <div class="sthint">◂ revenir · avancer ▸</div>`;
  gameEl.querySelectorAll(".tapz div").forEach(d => d.addEventListener("click", ev => { ev.stopPropagation(); stStep(+d.dataset.stz); }));
  math(gameEl);
  later(() => stStep(1), dur * 1000);
}
function stEnd(){
  F.gStop(); gameEl.classList.remove("story"); GT.keys = null;
  const [m, ch] = ST.key.split("|");
  gameEl.innerHTML = head("Stories de séance", esc(m), "") + `<div class="gbody"><div class="gend">${ic("party", 44, "#face15")}
    <div class="big" style="font-size:30px;margin-top:14px">${esc(P.chLabel(ch))}</div><div class="sub">${ST.cards.length} notions vues. Maintenant, teste-toi !</div>
    <div class="gbtns" style="flex-direction:column"><button class="main" data-stq="1">Les cartes de cette séance</button><button data-sto="1">Une autre séance</button></div></div></div>`;
}

/* =====================================================================
   13. CARTE MENTALE DE SÉANCE
   ===================================================================== */
function seanceGroups(){
  const groups = new Map();
  P.courseSort(scopeCards()).forEach(c => { const k = P.keyOf(c); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(c); });
  return groups;
}
function seancePicker(title, attr, intro){
  const groups = seanceGroups();
  gameEl.innerHTML = head(title, scopeName(), "") + `<div class="gbody"><div class="atl-s">${intro}</div>
    <div class="atl-scroll stlist">${[...groups].filter(([, a]) => a.length >= 2).map(([k, a]) => { const [m, ch] = k.split("|"); return `<button data-${attr}="${esc(k)}"><span>${esc(P.chLabel(ch))}<br><small style="white-space:normal">${esc(m)}</small></span><small>${a.length} notions</small></button>`; }).join("")}</div></div>`;
  return groups;
}
const MMCOL = ["#fe2c55", "#25b8ee", "#7b3cff", "#13a35a", "#ff7a1a", "#d4a900", "#ff2d87", "#0a7cff"];
const MM = {};
const mmLeaves = c => c.cle && c.cle.length ? c.cle : [shortDef(c.a) || plain(c.a).slice(0, 140)];
function startMindmap(key){
  F.gStop();
  const groups = key ? seanceGroups() : seancePicker("Carte mentale", "mmk", "Choisis une séance : toutes ses notions en une seule carte. Le mode quiz cache les détails, à toi de les retrouver.");
  if (key && groups.has(key)) return mmShow(key, groups.get(key));
  setH((e, b) => { if (b && b.dataset.mmk) mmShow(b.dataset.mmk, groups.get(b.dataset.mmk)); });
}
function mmShow(key, cards){
  Object.assign(MM, { key, cards, quiz:false, open:new Set(), seen:new Set() });
  mmRender();
  setH((e, b) => {
    if (!b) return;
    if (b.dataset.mm === "quiz") { MM.quiz = !MM.quiz; MM.seen.clear(); if (MM.quiz) MM.cards.forEach((_, i) => MM.open.add(i)); mmRender(); return; }
    if (b.dataset.mm === "all") { if (MM.open.size === MM.cards.length) MM.open.clear(); else MM.cards.forEach((_, i) => MM.open.add(i)); mmRender(); return; }
    if (b.dataset.mm === "back") { startMindmap(); return; }
    if (b.dataset.mmb !== undefined) { const i = +b.dataset.mmb; MM.open.has(i) ? MM.open.delete(i) : MM.open.add(i); Sound.SFX.tap(); mmRender(); return; }
    if (b.dataset.mml && MM.quiz && !MM.seen.has(b.dataset.mml)) { MM.seen.add(b.dataset.mml); const [i, j] = b.dataset.mml.split("-").map(Number); b.innerHTML = prep(mmLeaves(MM.cards[i])[j]); b.classList.add("seen"); math(b); Sound.SFX.tap(); buzz(8); }
  });
}
function mmRender(){
  const [m, ch] = MM.key.split("|"), sc = gameEl.querySelector(".atl-scroll"), y = sc ? sc.scrollTop : 0;
  gameEl.innerHTML = head("Carte mentale", esc(m), "") + `<div class="gbody">
    <div class="mmtop"><button data-mm="quiz" class="${MM.quiz ? "on" : ""}">${ic("eye", 15)} Mode quiz</button><button data-mm="all">${MM.open.size === MM.cards.length ? "Tout fermer" : "Tout ouvrir"}</button><button data-mm="back">Séances</button></div>
    <div class="atl-scroll"><div class="mm"><div class="mmroot">${esc(P.chLabel(ch))}<small>${MM.cards.length} notions</small></div>
    <div class="mmbranches">${MM.cards.map((c, i) => { const col = MMCOL[i % MMCOL.length];
      return `<div class="mmb" style="--bc:${col}"><button class="mmn" data-mmb="${i}">${prep(c.q)}<span>${MM.open.has(i) ? "−" : "+"}</span></button>${MM.open.has(i) ? `<div class="mmleaves">${mmLeaves(c).map((t, j) => `<button class="mml ${MM.quiz && !MM.seen.has(i + "-" + j) ? "hid" : "seen"}" data-mml="${i}-${j}">${MM.quiz && !MM.seen.has(i + "-" + j) ? "?" : prep(t)}</button>`).join("")}${c.img && !MM.quiz ? `<img src="${esc(c.img)}" alt="" loading="lazy">` : ""}</div>` : ""}</div>`; }).join("")}</div></div></div></div>`;
  math(gameEl);
  const s2 = gameEl.querySelector(".atl-scroll"); if (s2) s2.scrollTop = y;
}

/* =====================================================================
   14. FLASH 3 SECONDES : regarde le schéma, puis reconstruis-le
   ===================================================================== */
const FS = { queue:[] };
function startFlash(c){
  F.gStop();
  if (!c || !c.lab) { const pool = ALL.filter(x => x.lab && scopeCards().includes(x)); if (!FS.queue.length) FS.queue = shuffle((pool.length ? pool : ALL.filter(x => x.lab)).slice()); c = FS.queue.shift(); }
  const labels = [...new Set(c.lab.filter(Boolean))];
  Object.assign(FS, { c, labels, found:0, errs:0, reflash:0, sel:null, done:false, t0:0 });
  gameEl.innerHTML = head("Flash 3 secondes", sub(c), "3") + `<div class="gbody"><div class="atl-scroll">
    <div class="mo-ask" id="fsAsk"><b style="background:#face15">Mémorise !</b></div>
    <div class="lgimg"><div class="mskwrap peek" id="fsWrap" style="--ar:${c.ar || 1.4}"><img src="${esc(c.img)}" alt="">${c.masks.map((r, k) => c.lab[k] ? `<button class="msk" data-l="${esc(c.lab[k])}" style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%"></button>` : "").join("")}</div></div>
    <div class="atl-row" style="margin-top:10px"><span>${prep(c.q)}</span><span><b id="fsN">0</b>/${labels.length} · erreurs <b id="fsE">0</b></span></div>
    <div class="lgchips" id="fsChips"></div><div id="fsEnd"></div></div></div>`;
  fsPeek(() => {
    FS.t0 = Date.now();
    $("fsChips").innerHTML = shuffle(labels.slice()).map(l => `<button data-l="${esc(l)}">${esc(l)}</button>`).join("") + `<button data-fs="again" style="border-color:#face15">${ic("eye", 13)} Revoir 3 s (+5 s)</button>`;
    timerHead(FS.t0);
  });
  setH((e, b) => {
    if (FS.done) { if (b && b.dataset.fs === "next") startFlash(); else if (b && b.dataset.fs === "same") startFlash(FS.c); return; }
    if (!FS.t0 || $("fsWrap").classList.contains("peek")) return;
    if (b && b.dataset.fs === "again") { FS.reflash++; fsPeek(() => {}); return; }
    const wrap = e.target.closest(".mskwrap");
    if (wrap) { const m = e.target.closest(".msk:not(.open)") || P.nearestMask(wrap, e); if (!m) return; if (FS.sel && FS.sel.kind === "chip") fsTry(FS.sel.el, m); else fsSel("mask", m); return; }
    if (b && b.closest("#fsChips") && b.dataset.l) { if (FS.sel && FS.sel.kind === "mask") fsTry(b, FS.sel.el); else fsSel("chip", b); }
  });
}
function fsPeek(after){
  const w = $("fsWrap"), ask = $("fsAsk"); w.classList.add("peek"); let s = 3;
  ask.innerHTML = `<b style="background:#face15">Mémorise ! ${s}</b>`; $("gstat").textContent = s;
  F.gStop();
  const tick = () => { s--; if (s <= 0) { w.classList.remove("peek"); ask.innerHTML = `<b>Replace les légendes</b>`; Sound.SFX.swoosh && Sound.SFX.swoosh(); if (FS.t0) timerHead(FS.t0); after(); return; }
    ask.innerHTML = `<b style="background:#face15">Mémorise ! ${s}</b>`; $("gstat").textContent = s; later(tick, 1000); };
  later(tick, 1000);
}
function fsSel(kind, el){ gameEl.querySelectorAll(".lgimg .msk.sel, #fsChips .sel").forEach(x => x.classList.remove("sel")); FS.sel = el ? { kind, el } : null; if (el) el.classList.add("sel"); }
function fsTry(chip, mask){
  fsSel(null);
  if (chip.dataset.l === mask.dataset.l) {
    gameEl.querySelectorAll(".lgimg .msk").forEach(m => { if (m.dataset.l === chip.dataset.l) m.classList.add("open"); });
    chip.remove(); FS.found++; $("fsN").textContent = FS.found; yes(FS.found);
    if (FS.found === FS.labels.length) fsDone();
  } else { FS.errs++; $("fsE").textContent = FS.errs; shake(chip); shake(mask); no(); }
}
function fsDone(){
  FS.done = true; F.gStop();
  const sec = Math.round((Date.now() - FS.t0) / 1000 + FS.reflash * 5), g = GR(); g.flash = g.flash || {};
  const prev = g.flash[FS.c.img], rec = !prev || sec < prev; if (rec) g.flash[FS.c.img] = sec;
  srsApply(FS.c, FS.errs === 0 && !FS.reflash ? 2 : FS.errs >= 3 ? 0 : 1); save(); updateHud(); if (rec) confetti(80);
  $("gstat").textContent = F.fmtT(sec); $("fsAsk").innerHTML = `<b>Bravo !</b>`;
  const ag = gameEl.querySelector('[data-fs="again"]'); if (ag) ag.remove();
  $("fsEnd").innerHTML = `<div class="atl-s" style="text-align:center;margin-top:10px"><b style="color:#fff;font-size:17px">${F.fmtT(sec)}</b> · ${FS.errs ? FS.errs + " erreur" + (FS.errs > 1 ? "s" : "") : "sans faute"}${FS.reflash ? " · " + FS.reflash + " flash en plus" : ""}${rec ? ` · <b style="color:#face15">record</b>` : prev ? ` · record ${F.fmtT(prev)}` : ""}</div>`
    + doneBtns(`<button data-fs="same">Refaire</button>`, `<button class="main" data-fs="next">Schéma suivant</button>`);
}

/* =====================================================================
   15. MOTS CROISÉS (notions de tes cours, définitions en indices)
   ===================================================================== */
const CW = {};
const cwKey = w => F.fold(w).toUpperCase().replace(/[^A-Z]/g, "");
function cwPool(){
  const seen = new Set();
  return termPool().filter(t => !/ et /i.test(t.w)).map(t => ({ ...t, ans:cwKey(t.w.replace(/^(les?|la|l')\s*/i, "")) })).filter(t => t.ans.length >= 4 && t.ans.length <= 12 && !seen.has(t.ans) && seen.add(t.ans));
}
function cwBuild(items){
  let best = null;
  for (let att = 0; att < 60; att++) {
    const cand = shuffle(items.slice()).slice(0, 18).sort((a, b) => b.ans.length - a.ans.length + (Math.random() - .5) * 3);
    if (cand[0].ans.length > 11) cand.push(cand.shift());   // on démarre par un mot moyen : grille plus compacte
    const cells = new Map(), placed = [];
    const put = (it, x, y, d) => { for (let k = 0; k < it.ans.length; k++) { const key = (x + (d ? 0 : k)) + "," + (y + (d ? k : 0)); const c = cells.get(key) || { L:it.ans[k], dirs:new Set() }; c.dirs.add(d); cells.set(key, c); } placed.push({ ...it, x, y, d }); };
    const fits = (w, x, y, d) => {
      const dx = d ? 0 : 1, dy = d ? 1 : 0; let inter = 0;
      if (cells.has((x - dx) + "," + (y - dy)) || cells.has((x + dx * w.length) + "," + (y + dy * w.length))) return -1;
      for (let k = 0; k < w.length; k++) {
        const cx = x + dx * k, cy = y + dy * k, c = cells.get(cx + "," + cy);
        if (c) { if (c.L !== w[k] || c.dirs.has(d)) return -1; inter++; }
        else if (cells.has((cx + dy) + "," + (cy + dx)) || cells.has((cx - dy) + "," + (cy - dx))) return -1;
      }
      return inter;
    };
    put(cand[0], 0, 0, 0);
    for (const it of cand.slice(1)) {
      if (placed.length >= 7) break;
      let opts = [];
      cells.forEach((c, key) => { const [cx, cy] = key.split(",").map(Number);
        for (let i = 0; i < it.ans.length; i++) if (it.ans[i] === c.L) for (const d of [0, 1]) { if (c.dirs.has(d)) continue;
          const x = d ? cx : cx - i, y = d ? cy - i : cy, n = fits(it.ans, x, y, d); if (n > 0) opts.push({ x, y, d, n }); } });
      if (opts.length) {
        // la grille la plus compacte possible (avec le plus de croisements)
        const xs0 = [...cells.keys()].map(k => +k.split(",")[0]), ys0 = [...cells.keys()].map(k => +k.split(",")[1]);
        const area = o => { const x2 = o.x + (o.d ? 0 : it.ans.length - 1), y2 = o.y + (o.d ? it.ans.length - 1 : 0);
          const w = Math.max(...xs0, x2) - Math.min(...xs0, o.x) + 1, h = Math.max(...ys0, y2) - Math.min(...ys0, o.y) + 1; return Math.max(w, h) * 4 + w * h / 10 - o.n * 6; };
        opts.sort((a, b) => area(a) - area(b));
        const o = pick(opts.slice(0, 2)); put(it, o.x, o.y, o.d);
      }
    }
    const xs = [...cells.keys()].map(k => +k.split(",")[0]), ys = [...cells.keys()].map(k => +k.split(",")[1]);
    const W = Math.max(...xs) - Math.min(...xs) + 1, H = Math.max(...ys) - Math.min(...ys) + 1;
    const score = placed.length * 10 - Math.max(W, H) * 0.6;
    const fitsScreen = W <= 13 && H <= 15;
    if ((!best || (fitsScreen && !best.fit) || (fitsScreen === best.fit && score > best.score)) && placed.length >= 4) best = { placed, cells, minX:Math.min(...xs), minY:Math.min(...ys), W, H, score, fit:fitsScreen };
  }
  return best;
}
function startCroises(){
  F.gStop();
  const pool = cwPool(); if (pool.length < 6) { toast("Pas assez de notions ici : choisis « Tout »"); return F.closeGame(true); }
  const L = cwBuild(pool); if (!L || L.placed.length < 4) { toast("Grille impossible ici, réessaie"); return F.closeGame(true); }
  L.placed.forEach(p => { p.x -= L.minX; p.y -= L.minY; });
  const starts = [...new Set(L.placed.map(p => p.y * 100 + p.x))].sort((a, b) => a - b);
  L.placed.forEach(p => { p.num = starts.indexOf(p.y * 100 + p.x) + 1; p.found = false; p.hint = 0; });
  Object.assign(CW, { L, sel:null, t0:Date.now(), hints:0, errs:[], gave:0 });
  cwRender(); timerHead(CW.t0);
  setH((e, b) => {
    const cell = e.target.closest(".cwc[data-xy]");
    if (cell) { const [x, y] = cell.dataset.xy.split(",").map(Number); const ws = CW.L.placed.filter(p => !p.found && cwHas(p, x, y)); if (ws.length) { const i = ws.indexOf(CW.sel); cwSelect(ws[(i + 1) % ws.length]); } return; }
    if (!b) return;
    if (b.dataset.cw !== undefined) { cwSelect(CW.L.placed[+b.dataset.cw]); return; }
    if (b.dataset.cwa === "go") cwGo();
    else if (b.dataset.cwa === "hint") cwHint();
    else if (b.dataset.cwa === "give") cwGive();
  });
  GT.keys = e => { if (e.key === "Enter" && $("cwIn")) { e.preventDefault(); cwGo(); return true; } return false; };
}
const cwHas = (p, x, y) => p.d ? (x === p.x && y >= p.y && y < p.y + p.ans.length) : (y === p.y && x >= p.x && x < p.x + p.ans.length);
function cwRender(){
  const L = CW.L, grid = [];
  for (let y = 0; y < L.H; y++) for (let x = 0; x < L.W; x++) {
    const ws = L.placed.filter(p => cwHas(p, x, y));
    if (!ws.length) { grid.push(`<div class="cwc empty"></div>`); continue; }
    const num = L.placed.find(p => p.x === x && p.y === y), shown = ws.find(p => p.found) || ws.find(p => p.hint > (p.d ? y - p.y : x - p.x));
    const letter = shown ? shown.ans[shown.d ? y - shown.y : x - shown.x] : "";
    const sel = CW.sel && cwHas(CW.sel, x, y);
    grid.push(`<div class="cwc${ws.some(p => p.found) ? " ok" : ""}${sel ? " sel" : ""}" data-xy="${x},${y}">${num ? `<i>${num.num}</i>` : ""}${letter}</div>`);
  }
  const clues = d => L.placed.map((p, i) => [p, i]).filter(([p]) => p.d === d).sort((a, b) => a[0].num - b[0].num)
    .map(([p, i]) => `<button data-cw="${i}" class="${p.found ? "done" : ""}${CW.sel === p ? " sel" : ""}"><b>${p.num}.</b> ${prep(p.clue)} <small>(${p.ans.length})</small></button>`).join("");
  const found = L.placed.filter(p => p.found).length;
  gameEl.innerHTML = head("Mots croisés", scopeName(), $("gstat") ? $("gstat").textContent : "0:00") + `<div class="gbody">
    <div class="atl-row"><span>Trouvés <b>${found}</b>/${L.placed.length}</span><span>Indices <b>${CW.hints}</b></span></div>
    <div class="atl-scroll"><div class="cwgrid" style="--cs:calc((min(100vw - 40px, ${L.W * 31}px) - ${(L.W - 1) * 2}px) / ${L.W});grid-template-columns:repeat(${L.W},var(--cs));grid-auto-rows:var(--cs)">${grid.join("")}</div>
    ${CW.sel && !CW.sel.found ? `<div class="cwask"><div class="atl-s" style="margin:0 0 6px"><b style="color:#fff">${CW.sel.num} ${CW.sel.d ? "vertical" : "horizontal"}</b> · ${CW.sel.ans.length} lettres</div>
      <input id="cwIn" type="text" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go" placeholder="Ta réponse">
      <div class="tpbtns"><button data-cwa="give">Je sèche</button><button data-cwa="hint">Une lettre</button><button class="main" data-cwa="go">Valider</button></div></div>` : `<div class="atl-s" style="text-align:center;margin:12px 0">Touche une définition ou une case.</div>`}
    <div class="cwclues"><div class="sect">Horizontalement</div>${clues(0)}<div class="sect">Verticalement</div>${clues(1)}</div></div></div>`;
  math(gameEl);
}
function cwSelect(p){ if (!p || p.found) return; CW.sel = p; Sound.SFX.tap(); cwRender(); const i = $("cwIn"); if (i) { i.focus(); i.closest(".cwask").scrollIntoView({ block:"center", behavior:"smooth" }); } }
function cwGo(){
  const p = CW.sel, inp = $("cwIn"); if (!p || !inp) return;
  const a = cwKey(inp.value); if (!a) return;
  if (a === p.ans || (p.ans.length >= 8 && lev(a, p.ans) <= 1)) { p.found = true; yes(); cwAfter(); }
  else { shake(inp); no(); }
}
function cwHint(){ const p = CW.sel; if (!p) return; p.hint = Math.min(p.ans.length, p.hint + 1); CW.hints++; Sound.SFX.tap(); if (p.hint >= p.ans.length) { p.found = true; CW.errs.push({ c:p.c, t:`<b>${esc(p.w)}</b>`, why:p.clue }); cwAfter(); } else { cwRender(); const i = $("cwIn"); if (i) i.focus(); } }
function cwGive(){ const p = CW.sel; if (!p) return; p.found = true; CW.gave++; CW.errs.push({ c:p.c, t:`<b>${esc(p.w)}</b>`, why:p.clue }); no(); cwAfter(); }
function cwAfter(){
  CW.sel = CW.L.placed.find(p => !p.found && p.num > (CW.sel ? CW.sel.num : 0)) || CW.L.placed.find(p => !p.found) || null;
  if (!CW.sel) {
    GT.keys = null;
    const sec = Math.round((Date.now() - CW.t0) / 1000), g = GR(), perfect = !CW.gave && !CW.hints, isRec = perfect && (!g.croises || sec < g.croises); if (isRec) g.croises = sec;
    endScreen({ title:"Mots croisés", big:F.fmtT(sec), sub:`${CW.L.placed.length} mots · ${CW.hints} indice${CW.hints > 1 ? "s" : ""}${CW.gave ? " · " + CW.gave + " donné" + (CW.gave > 1 ? "s" : "") : ""}`, isRec, recTxt:g.croises ? "Record sans indice : " + F.fmtT(g.croises) : "", errs:CW.errs, again:startCroises });
    return;
  }
  cwRender(); const i = $("cwIn"); if (i) i.focus();
}

/* =====================================================================
   16. BOSS DE COLLE : tous les types d'exercices mélangés contre un boss
   ===================================================================== */
const BO = {};
function bossTarget(){ const x = ccActive().find(y => ALL.some(c => inCC(y, c))); return x ? { x, cards:ALL.filter(c => inCC(x, c)) } : { x:null, cards:scopeCards() }; }
function startBoss(){
  F.gStop();
  const { x, cards } = bossTarget(), set = new Set(cards);
  const own = it => { const c = cardOf(it); return c ? set.has(c) : false; };
  Object.assign(BO, { x, cards, set, seq:E.seq.filter(own), grp:E.groupes.filter(x => own(x) && Object.keys(x.g).length >= 2 && Object.values(x.g).some(a => a.length >= 3)), lab:cards.filter(c => c.lab), img:cards.filter(c => c.img),
    tape:tapePool(cards), quiz:cards.filter(c => quizKinds(c).length), hp:100, lives:3, n:0, streak:0, errs:[], t0:Date.now(), busy:false });
  if (BO.quiz.length < 5) { toast("Pas assez de cartes pour un boss"); return F.closeGame(true); }
  gameEl.innerHTML = head("Boss" + (x ? " · " + esc(x.nom) : ""), x ? (x.date - TODAY() ? "J-" + (x.date - TODAY()) : "C'est aujourd'hui") : scopeName(), "0:00") + `<div class="gbody">
    <div class="bossbar"><div class="bossname">${ic("crown", 18, "#face15")} ${x ? esc(x.nom) : "Le boss"}</div><div class="hp"><i id="boHp" style="width:100%"></i></div>
      <div class="bossrow"><span class="svlives" id="boLives">${[0, 1, 2].map(k => F.HEART(true)).join("")}</span><span id="boMsg"></span></div></div>
    <div class="atl-scroll" id="boBox"></div></div>`;
  timerHead(BO.t0); boNext();
  setH((e, b) => boClick(e, b));
  GT.keys = e => { if (e.key === "Enter" && $("boIn")) { e.preventDefault(); boTape(); return true; } return false; };
}
function boNext(){
  if (BO.hp <= 0 || BO.lives <= 0) return boEnd();
  BO.n++; BO.busy = false; BO.kind = null;
  const kinds = ["quiz", "quiz", "quiz"];
  if (BO.seq.length) kinds.push("apres", "ordre"); if (BO.grp.length) kinds.push("intrus"); if (BO.lab.length) kinds.push("montre", "montre");
  if (BO.img.length >= 2) kinds.push("schema"); if (BO.tape.length) kinds.push("tape", "tape");
  let k = pick(kinds); if (k === BO.last && Math.random() < .7) k = pick(kinds); BO.last = k; BO.kind = k;
  const box = $("boBox");
  if (k === "quiz") { const c = pick(BO.quiz), it = makeQuiz(c); if (!it) return boNext(); BO.it = it; box.innerHTML = quizInner(it); }
  else if (k === "apres") { const x = pick(BO.seq), i = Math.random() * (x.etapes.length - 1) | 0, good = x.etapes[i + 1];
    const wrong = shuffle([...x.etapes.slice(i + 2), ...E.seq.filter(y => y !== x && y.matiere === x.matiere).flatMap(y => y.etapes)]).filter(s => s !== good && !x.etapes.slice(0, i + 1).includes(s));
    BO.it = { x, i, good }; box.innerHTML = `<div class="atl-t">Et après ?</div><div class="atl-s">${esc(x.titre)}</div><div class="apchain"><div class="fbox">${esc(x.etapes[i])}</div><div class="farr">↓</div><div class="fbox q">?</div></div>
      <div class="apopts">${shuffle([{ t:good, ok:1 }, ...[...new Set(wrong)].slice(0, 2).map(t => ({ t, ok:0 }))]).map(o => `<button data-bo="${o.ok}">${esc(o.t)}</button>`).join("")}</div>`; }
  else if (k === "ordre") { const x = pick(BO.seq.filter(s => s.etapes.length <= 6)) || pick(BO.seq); BO.it = { x, pos:0, faute:false };
    box.innerHTML = `<div class="atl-t">Remets dans l'ordre</div><div class="atl-s">${esc(x.titre)}</div><div class="ord-placed" id="boPlaced"></div><div class="ord-pool">${shuffle(x.etapes.map((_, j) => j)).map(j => `<button data-boi="${j}">${esc(x.etapes[j])}</button>`).join("")}</div>`; }
  else if (k === "intrus") { const x = pick(BO.grp), cats = Object.keys(x.g), A = pick(cats.filter(c => x.g[c].length >= 3)), B = pick(cats.filter(c => c !== A)), intr = pick(x.g[B]);
    BO.it = { x, A, B, intr }; box.innerHTML = `<div class="atl-t">Trois sont « ${esc(A)} ». L'intrus ?</div><div class="atl-s">${esc(x.titre)}</div><div class="inopts">${shuffle([...shuffle(x.g[A].slice()).slice(0, 3).map(t => ({ t, ok:0 })), { t:intr, ok:1 }]).map(o => `<button data-bo="${o.ok}">${esc(o.t)}</button>`).join("")}</div>`; }
  else if (k === "montre") { const c = pick(BO.lab), l = pick([...new Set(c.lab.filter(Boolean))]); BO.it = { c, l };
    box.innerHTML = `<div class="mo-ask">Touche : <br><b>${esc(l)}</b></div><div class="lgimg"><div class="mskwrap" style="--ar:${c.ar || 1.4}"><img src="${esc(c.img)}" alt="">${c.masks.map((r, j) => c.lab[j] ? `<button class="msk" data-l="${esc(c.lab[j])}" style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%"></button>` : "").join("")}</div></div><div class="atl-s" style="margin-top:8px">${prep(c.q)}</div>`; }
  else if (k === "schema") { const c = pick(BO.img), others = shuffle([...new Set(ALL.filter(y => y.img && y.img !== c.img && y.matiere === c.matiere).map(y => y.img))]).slice(0, 3);
    BO.it = { c }; box.innerHTML = `<div class="atl-t">Où est : ${prep(c.q)} ?</div><div class="bsgrid" style="margin-top:10px">${shuffle([{ i:c.img, ok:1 }, ...others.map(i => ({ i, ok:0 }))]).map(o => `<button data-bo="${o.ok}"><img src="${esc(o.i)}" alt=""></button>`).join("")}</div>`; }
  else if (k === "tape") { const t = pick(BO.tape); BO.it = t;
    box.innerHTML = `<div class="atl-t">Écris le mot manquant</div><div class="tpq">${prep(t.txt.replace(CLOZE, '<span class="blank"></span>'))}</div><input id="boIn" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="go" placeholder="Ta réponse"><div class="tpbtns"><button class="main" data-bot="1">Valider</button></div>`;
    setTimeout(() => { const i = $("boIn"); if (i) i.focus(); }, 60); }
  math(box);
}
function boClick(e, b){
  if (!BO.kind) return;
  if (b && b.dataset.bonext) { boNext(); return; }
  if (BO.busy) return;
  const k = BO.kind, box = $("boBox");
  if (k === "quiz" && b && b.classList.contains("qopt")) { const ok = b.dataset.ans === "1"; box.querySelectorAll(".qopt").forEach(x => { if (x.dataset.ans === "1") x.classList.add("good"); }); if (!ok) b.classList.add("bad");
    const ex = box.querySelector(".qexp"); if (ex && !ok) ex.hidden = false;
    const good = BO.it.opts.find(o => o.ok); return boHit(ok, { c:BO.it.c, t:BO.it.vf ? BO.it.prompt : BO.it.kind === "def" ? BO.it.c.q : BO.it.prompt.replace(/<span class="blank">\?<\/span>/, "…"), why:BO.it.vf ? BO.it.explain : "Réponse : <b>" + (good ? good.h : "") + "</b>" }); }
  if ((k === "apres" || k === "intrus" || k === "schema") && b && b.dataset.bo !== undefined) { const ok = b.dataset.bo === "1"; b.classList.add(ok ? "good" : "bad"); const g = box.querySelector('[data-bo="1"]'); if (g) g.classList.add("good");
    const err = k === "apres" ? errOf(BO.it.x, esc(BO.it.x.etapes[BO.it.i]) + " → ?", "→ " + esc(BO.it.good)) : k === "intrus" ? errOf(BO.it.x, "Intrus : " + esc(BO.it.intr), esc(BO.it.intr) + " → " + esc(BO.it.B)) : { c:BO.it.c, t:"Le schéma « " + BO.it.c.q + " »" };
    return boHit(ok, err); }
  if (k === "ordre" && b && b.dataset.boi !== undefined) { const it = BO.it, j = +b.dataset.boi;
    if (j === it.pos) { const d = document.createElement("div"); d.innerHTML = `<i>${j + 1}</i><span>${esc(it.x.etapes[j])}</span>`; $("boPlaced").appendChild(d); b.remove(); it.pos++; Sound.SFX.tap(); if (it.pos === it.x.etapes.length) return boHit(!it.faute, errOf(it.x, it.x.titre, it.x.etapes.join(" → ")), true); }
    else { shake(b); no(); if (!it.faute) { it.faute = true; BO.lives--; boLivesDraw(); if (BO.lives <= 0) return boHit(false, errOf(it.x, it.x.titre, it.x.etapes.join(" → ")), true, true); } }
    return; }
  if (k === "montre") { const wrap = e.target.closest(".mskwrap"); if (!wrap) return; const m = e.target.closest(".msk") || P.nearestMask(wrap, e); if (!m) return;
    const ok = m.dataset.l === BO.it.l; gameEl.querySelectorAll(".lgimg .msk").forEach(x => { if (x.dataset.l === BO.it.l) x.classList.add("hit"); }); if (!ok) shake(m);
    return boHit(ok, { c:BO.it.c, t:"Sur « " + BO.it.c.q + " » : " + esc(BO.it.l) }); }
  if (k === "tape" && b && b.dataset.bot) return boTape();
}
function boTape(){
  if (BO.busy || BO.kind !== "tape") return;
  const inp = $("boIn"), a = norm(inp.value), want = norm(BO.it.ans); if (!a) return;
  const tol = want.length <= 4 ? 0 : want.length <= 8 ? 1 : 2, ok = a === want || lev(a, want) <= tol;
  inp.classList.add(ok ? "good" : "bad"); if (!ok) $("boBox").insertAdjacentHTML("beforeend", `<div class="tpres"><b class="r">Raté.</b> La réponse : <b>${esc(BO.it.ans)}</b></div>`);
  boHit(ok, { c:BO.it.c, t:BO.it.txt.replace(CLOZE, `<b>${esc(BO.it.ans)}</b>`) });
}
function boHit(ok, err, big, livesDone){
  BO.busy = true;
  if (ok) { BO.streak++; const dmg = (big ? 14 : 9) + (BO.streak >= 3 ? 5 : 0); BO.hp = Math.max(0, BO.hp - dmg); yes(BO.streak);
    $("boMsg").innerHTML = BO.streak >= 3 ? `<b style="color:#face15">COUP CRITIQUE −${dmg}</b>` : `<b style="color:#2fd27a">−${dmg} PV</b>`;
    const bar = $("boHp"); bar.style.width = BO.hp + "%"; bar.parentElement.classList.remove("hit"); void bar.offsetWidth; bar.parentElement.classList.add("hit"); }
  else { BO.streak = 0; if (!livesDone && !(BO.kind === "ordre")) BO.lives--; boLivesDraw(); no(); BO.errs.push(err); $("boMsg").innerHTML = `<b style="color:#ff6b8a">Le boss te frappe</b>`; }
  $("boBox").insertAdjacentHTML("beforeend", `<div class="gdone"><div class="gbtns"><button class="main" data-bonext="1">${BO.hp <= 0 ? "Coup final !" : BO.lives <= 0 ? "Résultat" : "Suivant"}</button></div></div>`);
  if (BO.hp <= 0 || BO.lives <= 0) later(boEnd, 1400);
}
function boLivesDraw(){ const el = $("boLives"); if (el) el.innerHTML = [0, 1, 2].map(k => F.HEART(k < BO.lives)).join(""); }
function boEnd(){
  if (BO.ended === BO.t0) return; BO.ended = BO.t0; GT.keys = null;
  const win = BO.hp <= 0, sec = Math.round((Date.now() - BO.t0) / 1000), g = GR();
  const isRec = win && (!g.boss || sec < g.boss); if (isRec) g.boss = sec;
  if (win) confetti(160);
  endScreen({ title:"Boss" + (BO.x ? " · " + BO.x.nom : ""), big:win ? "Vaincu !" : BO.hp + " PV", sub:win ? `en ${F.fmtT(sec)} · ${BO.n} questions` : "Il reste " + BO.hp + " PV au boss. Revois tes erreurs et reviens.", isRec, recTxt:g.boss ? "Record : boss vaincu en " + F.fmtT(g.boss) : "", errs:BO.errs, again:startBoss });
}

/* =====================================================================
   REGISTRE (page Jeux)
   ===================================================================== */
const R = F.register;
R({ k:"stories", sec:"apprendre", icon:"play", col:"#ff7a1a", name:"Stories de séance", desc:"Les notions clés d'une séance en stories, avant de jouer.", ok:cs => cs.length >= 2, start:startStories, noSurprise:true });
R({ k:"mindmap", sec:"apprendre", icon:"compass", col:"#13a35a", name:"Carte mentale", desc:"Toute une séance en une carte. Le mode quiz cache les détails, à toi de les retrouver.", ok:cs => cs.length >= 2, start:startMindmap, noSurprise:true });
R({ k:"boss", sec:"boss", icon:"crown", col:"#c9a400", name:"Boss de colle", desc:"Tous les types d'exercices mélangés contre un boss à 100 PV. Tu as 3 vies.",
  rec:g => g.boss ? "Record : vaincu en " + F.fmtT(g.boss) : "", ok:() => ALL.length >= 5, start:startBoss, count:() => { const t = bossTarget(); return t.x ? "Sur « " + esc(t.x.nom) + " »" : "Sur ta sélection"; } });
R({ k:"flash", sec:"schemas", icon:"zap", col:"#face15", name:"Flash 3 secondes", desc:"Le schéma s'affiche 3 secondes, puis tu replaces les légendes de mémoire.",
  rec:g => { const n = Object.keys(g.flash || {}).length; return n ? n + " schéma" + (n > 1 ? "s" : "") + " réussi" + (n > 1 ? "s" : "") : ""; }, ok:() => ALL.some(c => c.lab), start:startFlash });
R({ k:"croises", sec:"jouer", icon:"pen", col:"#ff2d87", name:"Mots croisés", desc:"Une grille avec les notions de tes cours, les définitions en indices.",
  rec:g => g.croises ? "Record sans indice : " + F.fmtT(g.croises) : "", ok:() => cwPool().length >= 6, start:startCroises });
R({ k:"montre", sec:"schemas", icon:"target", col:"#25b8ee", name:"Montre-moi", desc:"« Touche le glomérule » : trouve chaque structure sur le schéma, sans légende.",
  rec:g => { const n = Object.keys(g.montre || {}).length; return n ? n + " schéma" + (n > 1 ? "s" : "") + " réussi" + (n > 1 ? "s" : "") : ""; }, ok:() => ALL.some(c => c.lab), start:startMontre });
R({ k:"bonschema", sec:"schemas", icon:"image", col:"#0a7cff", name:"Le bon schéma", desc:"4 schémas de tes cours : lequel est celui qu'on te demande ?",
  rec:g => g.bonschema ? "Record : " + g.bonschema + "/10" : "", ok:() => ALL.filter(c => c.img).length >= 4, start:startBonSchema });
R({ k:"ordre", sec:"schemas", icon:"listcheck", col:"#13a35a", name:"Remets dans l'ordre", desc:"Les étapes d'un processus : touche-les dans le bon ordre.",
  rec:g => g.ordre ? "Record : " + g.ordre + "/5 sans faute" : "", ok:() => itemsIn(E.seq).length > 0, start:startOrdre, count:() => itemsIn(E.seq).length + " séquences" });
R({ k:"fleche", sec:"schemas", icon:"trend", col:"#ff2d87", name:"Schéma fléché", desc:"Une cascade ou une boucle avec des cases vides : remplis-les.",
  rec:g => g.fleche ? "Record : " + g.fleche + "/4 sans faute" : "", ok:() => itemsIn(E.seq).length > 0, start:startFleche });
R({ k:"tableau", sec:"schemas", icon:"file", col:"#c9a400", name:"Tableau à remplir", desc:"Les tableaux de tes cours, avec des cases vides.",
  rec:g => g.tableau ? "Record : " + g.tableau + "/3 sans faute" : "", ok:() => itemsIn(E.tables).length > 0, start:startTableau, count:() => itemsIn(E.tables).length + " tableaux" });
R({ k:"tape", sec:"jouer", icon:"pen", col:"#25b8ee", name:"Tape la réponse", desc:"Aucune proposition : écris le mot manquant de mémoire. Les accents ne comptent pas.",
  rec:g => g.tape ? "Record : " + String(g.tape).replace(".", ",") + "/10" : "", ok:() => tapePool().length >= 5, start:startTape });
R({ k:"tri", sec:"jouer", icon:"inbox", col:"#7b3cff", name:"Classe-moi ça", desc:"Range chaque élément dans la bonne catégorie, le plus vite possible.",
  rec:g => g.tri ? "Record : " + g.tri + " %" : "", ok:() => itemsIn(E.groupes).length > 0, start:startTri });
R({ k:"intrus", sec:"jouer", icon:"eye", col:"#fe2c55", name:"L'intrus", desc:"Trois éléments vont ensemble, un seul n'a rien à faire là.",
  rec:g => g.intrus ? "Record : " + g.intrus + "/10" : "", ok:() => intrusPool().length > 0, start:startIntrus });
R({ k:"apres", sec:"jouer", icon:"zap", col:"#ff7a1a", name:"Et après ?", desc:"Cause → conséquence : quelle est l'étape suivante ?",
  rec:g => g.apres ? "Record : " + g.apres + "/10" : "", ok:() => itemsIn(E.seq).length > 0, start:startApres });
R({ k:"pendu", sec:"jouer", icon:"bulb", col:"#13a35a", name:"Pendu", desc:"Retrouve la notion lettre par lettre, la définition sert d'indice.",
  rec:g => g.pendu ? "Record : " + g.pendu + "/5" : "", ok:() => termPool().length >= 5, start:startPendu });
R({ k:"anagramme", sec:"jouer", icon:"shuffle", col:"#0a7cff", name:"Lettres mélangées", desc:"Les lettres de la notion sont en vrac : remets-les dans l'ordre.",
  rec:g => g.anagramme ? "Record : " + g.anagramme + "/5" : "", ok:() => termPool().length >= 5, start:startAnagramme });

/* =====================================================================
   UN EXERCICE DE SCHÉMA DE TEMPS EN TEMPS DANS LE FEED
   ===================================================================== */
const XREG = [];
const XK = { montre:["MONTRE-MOI", "Trouve chaque structure sur le schéma, sans légende."], ordre:["REMETS DANS L'ORDRE", "Touche les étapes dans le bon ordre."],
  fleche:["SCHÉMA FLÉCHÉ", "Remplis les cases vides de la cascade."], tableau:["TABLEAU À REMPLIR", "Complète le tableau de ton cours."] };
function exoCands(filter){
  const okCard = c => !!c && (!filter || filter(c));
  const out = [];
  ALL.filter(c => c.lab && okCard(c)).forEach(c => out.push({ kind:"montre", arg:c, titre:c.q, img:c.img }));
  E.seq.filter(x => okCard(cardOf(x))).forEach(x => out.push({ kind:Math.random() < .5 ? "ordre" : "fleche", arg:x, titre:x.titre, steps:x.etapes }));
  E.tables.filter(x => okCard(cardOf(x))).forEach(x => out.push({ kind:"tableau", arg:x, titre:x.titre }));
  return out;
}
window.exoInsert = function(list, F2){
  const schemaMode = F2 && F2.mode === "schema";
  let cands = exoCands(F2 && F2.f ? (c => { try { return F2.f(c); } catch (e) { return false; } }) : null);
  if (schemaMode) cands = cands.filter(x => x.kind === "montre");
  if (!cands.length) return list;
  cands = shuffle(cands);
  const out = list.slice(); let k = 0;
  for (let pos = 9; pos < out.length && k < cands.length; pos += 11) { const x = cands[k++]; x.exo = true; x.id = XREG.push(x) - 1; out.splice(pos, 0, x); }
  return out;
};
window.exoSlide = function(it, i){
  const c = it.kind === "montre" ? it.arg : cardOf(it.arg), m = c ? { ...matOf(c.matiere), ...lookOf(c) } : { couleurs:["#7b3cff", "#fe2c55"] };
  const [lbl, desc] = XK[it.kind];
  return `<section class="slide quiz exo" data-exo="${it.id}" style="--c1:${m.couleurs[1]};--c2:${m.couleurs[0]}"><div class="content"><div class="exobox">
    <span class="xk">${ic("puzzle", 12, "#000")} ${lbl}</span><h3>${prep(it.titre)}</h3><p>${desc}</p>
    ${it.kind === "montre" ? `<div class="ximg"><div class="mskwrap" style="--ar:${c.ar || 1.4};width:min(100%, calc(25vh * var(--ar)))"><img src="${esc(c.img)}" alt="" loading="lazy">${c.masks.map((r, k) => c.lab[k] ? `<span class="msk" style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%"></span>` : "").join("")}</div></div>` : it.steps ? `<div class="xsteps">${it.steps.slice(0, 3).map(() => `<span>? ? ?</span>`).join("")}${it.steps.length > 3 ? `<span>… ${it.steps.length} étapes</span>` : ""}</div>` : ""}
    <button class="xgo" data-exogo="${it.id}">C'est parti</button></div></div>
    <div class="bar"><i style="width:${((i + 1) / list.length * 100).toFixed(1)}%"></i></div></section>`;
};
window.FT_ATL = { cwPool:() => cwPool(), cwBuild:it => cwBuild(it), termPool:() => termPool() };   // pour les tests
window.exoClick = function(e){
  const s = e.target.closest(".slide[data-exo]"); if (!s) return false;
  const b = e.target.closest("[data-exogo]");
  if (b) { const it = XREG[+b.dataset.exogo]; if (it) openGame(it.kind, it.arg); }
  return true;
};
})();
