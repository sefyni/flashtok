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
function tapePool(){
  const out = [];
  scopeCards().forEach(c => (c.trous || []).forEach(tr => { const m = tr.t.match(CLOZE); if (m && !/\$/.test(m[1]) && plain(m[1]).length <= 30) out.push({ c, ans:plain(m[1]), txt:tr.t }); }));
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
   REGISTRE (page Jeux)
   ===================================================================== */
const R = F.register;
R({ k:"stories", sec:"apprendre", icon:"play", col:"#ff7a1a", name:"Stories de séance", desc:"Les notions clés d'une séance en stories, avant de jouer.", ok:cs => cs.length >= 2, start:startStories, noSurprise:true });
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
window.exoClick = function(e){
  const s = e.target.closest(".slide[data-exo]"); if (!s) return false;
  const b = e.target.closest("[data-exogo]");
  if (b) { const it = XREG[+b.dataset.exogo]; if (it) openGame(it.kind, it.arg); }
  return true;
};
})();
