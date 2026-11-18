/* =====================================================================
   FlashTok+ : bouton Réviser, session guidée, QCM concours (A–E),
   schémas à compléter, plan de colle, mes erreurs, mode écoute
   (chargé après le script principal : il réutilise S, ALL, rec, box…)
   ===================================================================== */
(function () {
"use strict";

document.head.insertAdjacentHTML("beforeend", `<style>
  /* ---- hub Réviser ---- */
  .hubgo { width:100%; display:flex; align-items:center; gap:14px; padding:18px; border-radius:20px; text-align:left;
    background:linear-gradient(135deg,var(--red),#ff7a3d); box-shadow:0 14px 40px rgba(254,44,85,.35); }
  .hubgo .hg-ic { width:52px; height:52px; border-radius:50%; background:#fff; color:#000; display:grid; place-items:center; flex:none; }
  .hubgo b { font-size:20px; display:block; } .hubgo small { font-size:13px; opacity:.92; display:block; margin-top:3px; }
  .sesspick { display:flex; align-items:center; gap:6px; margin-top:12px; font-size:13px; color:var(--muted); font-weight:700; }
  .sesspick span { flex:1; } .sesspick button { min-width:44px; padding:8px 10px; border-radius:999px; background:#1d1d1d; font-weight:800; font-size:14px; color:#fff; }
  .sesspick button.on { background:#fff; color:#000; }
  .hubgoal { margin:12px 2px 0; font-size:12px; color:var(--muted); } .hubgoal .meter { background:#222; margin:0 0 6px; } .hubgoal .meter i { background:var(--cyan); }
  .hubcc { width:100%; display:flex; align-items:center; gap:12px; margin-top:16px; padding:14px; border-radius:16px; background:#121212; text-align:left; border:1px solid #222; }
  .hubcc b { display:block; font-size:15px; } .hubcc small { color:var(--muted); font-size:12px; display:block; margin-top:2px; } .hubcc .chev { margin-left:auto; font-size:22px; color:var(--muted); }
  .hubgrid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
  .hubgrid button { background:#121212; border:1px solid #1f1f1f; border-radius:16px; padding:14px; text-align:left; min-height:96px; display:flex; flex-direction:column; justify-content:space-between; gap:8px; }
  .hubgrid button b { font-size:15px; display:block; } .hubgrid button small { color:var(--muted); font-size:12px; display:block; margin-top:2px; }
  .hubgrid .hi { width:34px; height:34px; border-radius:10px; display:grid; place-items:center; background:var(--hc,#333); }
  .inst { margin-top:18px; } .inst b { display:block; margin-bottom:6px; } .inst p { font-size:13px; color:#bbb; line-height:1.45; }
  .inst .rowbtn { margin-top:10px; padding:10px; font-size:13px; }

  /* ---- QCM concours ---- */
  .qcm .content { right:16px; top:calc(var(--st) + 58px); bottom:18px; overflow-y:auto; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; }
  .qcmbox { padding-bottom:20px; }
  .qstem { font-size:15px; line-height:1.4; margin-bottom:12px; } .qstem b { font-size:16px; }
  .qprop { width:100%; display:flex; gap:10px; align-items:flex-start; text-align:left; padding:11px 12px; border-radius:12px; background:rgba(255,255,255,.13); margin-top:8px; font-size:14px; line-height:1.35; border:2px solid transparent; }
  .qprop .ql { width:24px; height:24px; border-radius:50%; flex:none; display:grid; place-items:center; background:rgba(0,0,0,.35); font-weight:900; font-size:13px; }
  .qprop .qt { flex:1; min-width:0; overflow-x:auto; }
  .qprop.sel { background:#fff; color:#000; } .qprop.sel .ql { background:#000; color:#fff; }
  .qprop.vrai { border-color:#2fd27a; } .qprop.faux.sel { border-color:#fe2c55; }
  .qprop.erreur .ql { background:#fe2c55; color:#fff; } .qprop.juste .ql { background:#2fd27a; color:#000; }
  .qwhy { font-size:12.5px; line-height:1.4; padding:6px 10px 2px 44px; color:#eee; } .qwhy b { margin-right:4px; }
  .qval { width:100%; margin-top:14px; padding:13px; border-radius:12px; background:#fff; color:#000; font-weight:900; font-size:16px; }
  .qres { margin-top:14px; padding:14px; border-radius:14px; background:rgba(0,0,0,.4); text-align:center; }
  .qres b { font-size:24px; } .qres small { display:block; margin-top:6px; color:#ccc; font-size:11.5px; } .qres span { display:block; margin-top:8px; font-size:13px; font-weight:700; }

  /* ---- schémas à compléter ---- */
  .mskwrap { position:relative; margin:0 auto; width:min(100%, calc(38vh * var(--ar))); aspect-ratio:var(--ar); }
  .schemabox .mskwrap img { position:absolute; inset:0; width:100%; height:100%; max-height:none; object-fit:fill; }
  .msk { position:absolute; padding:0; border-radius:4px; background:#ffcf3a; box-shadow:inset 0 0 0 1px rgba(0,0,0,.25); display:grid; place-items:center; overflow:hidden; }
  .msk::after { content:"?"; font-size:10px; font-weight:900; color:#6b4a00; line-height:1; }
  .msk.open { background:transparent; box-shadow:0 0 0 2px #2fd27a; animation:mskpop .35s ease; } .msk.open::after { content:""; }
  @keyframes mskpop { 0% { transform:scale(1.25); } 100% { transform:scale(1); } }
  .mskbar { display:flex; align-items:center; justify-content:center; gap:10px; margin-top:10px; color:#111; font-size:13px; font-weight:800; }
  .mskbar .mskall { padding:6px 12px; border-radius:999px; background:#111; color:#fff; font-size:12px; font-weight:800; }
  .mskbar .zoom2 { width:30px; height:30px; border-radius:50%; background:#111; color:#fff; display:grid; place-items:center; }
  .mskbar.fini .mskn { color:#13a35a; }
  .mskbar [hidden], .qwhy[hidden], .qres[hidden] { display:none !important; }
  #acct .chaprow { flex-wrap:wrap; row-gap:10px; } #acct .chaprow .t { flex:1 1 100%; }

  /* ---- plan de colle ---- */
  .plancard { margin-bottom:16px; } .plancard .ph { display:flex; align-items:center; gap:10px; } .plancard .ph b { font-size:17px; flex:1; }
  .pj { background:var(--red); padding:4px 10px; border-radius:999px; font-weight:900; font-size:13px; }
  .pdate { color:var(--muted); font-size:12px; display:block; margin-top:2px; text-transform:capitalize; }
  .ptoday { margin-top:12px; padding:12px; border-radius:12px; background:#1b1b1b; font-size:14px; display:flex; flex-wrap:wrap; gap:4px; align-items:center; }
  .ptoday small { color:var(--muted); width:100%; }
  .pwarn { margin-top:8px; font-size:12.5px; color:#face15; }
  .pstrip { display:flex; gap:6px; overflow-x:auto; margin:12px -2px 4px; padding:2px; }
  .pstrip div { flex:none; width:62px; padding:8px 4px; border-radius:10px; background:#1b1b1b; text-align:center; font-size:11px; line-height:1.3; color:#ccc; }
  .pstrip div b { display:block; font-size:12px; color:#fff; text-transform:capitalize; } .pstrip .td { outline:2px solid var(--cyan); } .pstrip .rv { background:#2a1f05; } .pstrip .jj { background:var(--red); color:#fff; }
  .pleg { display:flex; flex-wrap:wrap; gap:10px; font-size:11px; color:var(--muted); margin:10px 0 4px; } .pleg span { display:flex; align-items:center; gap:4px; }
  .pdot { width:10px; height:10px; border-radius:50%; flex:none; display:inline-block; } .pdot.vert { background:#2fd27a; } .pdot.orange { background:#ff9f1a; } .pdot.rouge { background:#fe2c55; }
  .prow { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid #1e1e1e; }
  .prow .ptx { flex:1; min-width:0; } .prow b { font-size:14px; display:block; } .prow small { color:var(--muted); font-size:11.5px; }
  .prow button { width:34px; height:34px; border-radius:50%; background:#1f1f1f; display:grid; place-items:center; flex:none; }
  .pmiss { font-size:12px; color:var(--muted); margin-top:10px; }

  /* ---- mode écoute ---- */
  #listen .lsset { padding:0 16px 30px; overflow-y:auto; }
  #listen .lsbody { flex:1; margin:4px 16px 0; border-radius:22px; padding:22px 18px; overflow-y:auto; background:linear-gradient(160deg,var(--c1),var(--c2)); display:flex; flex-direction:column; }
  .lsmeta { font-size:12px; font-weight:800; opacity:.8; margin-bottom:12px; }
  .lsq { font-size:22px; font-weight:800; line-height:1.3; }
  .lsphase { margin:16px 0; font-size:14px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; opacity:.9; display:flex; align-items:center; gap:8px; }
  .lsphase i { width:9px; height:9px; border-radius:50%; background:#fff; animation:lspulse 1s infinite; }
  @keyframes lspulse { 50% { opacity:.25; } }
  .lsa { font-size:15.5px; line-height:1.5; background:rgba(0,0,0,.28); border-radius:14px; padding:14px; }
  .lsrate { display:flex; gap:8px; padding:12px 16px 0; } .lsrate button { flex:1; padding:11px; border-radius:12px; font-weight:800; }
  .lsrate .g0 { background:#3a1220; color:#ff6b8a; } .lsrate .g1 { background:#3a2f10; color:#face15; } .lsrate .g2 { background:#0f3324; color:#2fd27a; }
  .lsctl { display:flex; align-items:center; justify-content:center; gap:26px; padding:14px 0 18px; }
  .lsctl button { width:52px; height:52px; border-radius:50%; background:#1b1b1b; display:grid; place-items:center; font-size:18px; font-weight:900; }
  .lsctl .big { width:74px; height:74px; background:#fff; color:#000; }
  .lsend { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; text-align:center; padding:20px; }
  .lsend b { font-size:22px; }
</style>`);

/* ---------- petits outils ---------- */
const keyOf = c => c.matiere + "|" + (c.chapitre || "—");
const chLabel = ch => { const m = /^S(\d+)\s*·\s*(.*)$/.exec(ch || ""); return m ? "S" + m[1] + " · " + m[2] : (ch || ""); };
const pl = (n, w, ws) => n + " " + (n > 1 ? (ws || w + "s") : w);
const fmtNote = n => String(Math.round(n * 100) / 100).replace(".", ",");
const firstToday = c => !!(rec(c) && rec(c).first === TODAY());
const everKo = c => isKo(c) || !!(rec(c) && (rec(c).ko || 0) > 0);
const piege = c => /⚠/.test(c.astuce || "");
const chip = (attr, on, txt) => `<button type="button" ${attr} class="${on ? "on" : ""}">${txt}</button>`;
const back = (attr, title) => `<div class="ohead" style="padding:0 0 10px"><button class="x" ${attr}>‹</button><div class="tt" style="text-align:center;margin-right:46px">${title}</div></div>`;
const PLAY = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>`;
const PAUSE = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;

// ordre du cours : matière → séance → ordre des cartes dans le fichier
function courseSort(cs){
  const ix = new Map(ALL.map((c, i) => [c, i]));
  const ord = c => { const mi = MATIERES.findIndex(m => m.nom === c.matiere), ch = (matOf(c.matiere).chapitres || []).indexOf(c.chapitre || "—");
    return (mi < 0 ? 99 : mi) * 1000 + (ch < 0 ? 999 : ch); };
  return cs.slice().sort((a, b) => ord(a) - ord(b) || ix.get(a) - ix.get(b));
}
// à revoir (ko) → dues → nouvelles → le reste
function reviewSort(cs){
  const cls = c => isKo(c) ? 0 : isDue(c) ? 1 : isNew(c) ? 2 : 3;
  return shuffle(cs.slice()).sort((a, b) => cls(a) - cls(b) || ccBoost(b) - ccBoost(a));
}
// cartes + un quiz toutes les 4 cartes (+ un QCM concours toutes les 8, et un à la fin)
function withQuizzes(cards, qcm){
  const out = [];
  cards.forEach((c, i) => {
    out.push({ c });
    if (i % 4 === 3) { const q = makeQuiz(cards[Math.max(0, i - 2 - (Math.random() * 2 | 0))]); if (q) out.push(q); }
    if (qcm && i % 8 === 7) { const q = qcmFromCards(cards.slice(Math.max(0, i - 7), i + 1)); if (q) out.push(q); }
  });
  if (qcm && cards.length >= 4 && cards.length % 8 >= 3) { const q = qcmFromCards(cards); if (q) out.push(q); }
  return out;
}

/* =====================================================================
   PLAN DE COLLE
   ===================================================================== */
function ccPlan(x){
  const j = Math.max(0, x.date - TODAY());                    // jours avant le CC (aujourd'hui compris)
  const scope = ALL.filter(c => inCC(x, c));
  const todo = scope.filter(c => isNew(c) || firstToday(c));  // nouvelles au début de la journée
  const newDays = j <= 2 ? Math.max(1, j) : j - 2;            // les 2 derniers jours : révision + QCM
  const perDay = todo.length ? Math.ceil(todo.length / newDays) : 0;
  const doneToday = scope.filter(firstToday).length;
  return { x, j, scope, todo, newDays, perDay, doneToday,
    left: Math.min(scope.filter(isNew).length, Math.max(0, perDay - doneToday)),
    due: scope.filter(c => isKo(c) || isDue(c)).length,
    mastered: scope.filter(c => box(c) >= MASTER).length };
}
// les nouvelles cartes prévues aujourd'hui (CC le plus proche d'abord, sans doublon)
function todaysNew(){
  const plans = ccActive().map(ccPlan).filter(p => p.scope.length);
  const chosen = new Set();
  for (const p of plans) {
    const already = p.scope.filter(c => chosen.has(c)).length;
    courseSort(p.scope.filter(c => isNew(c) && !chosen.has(c))).slice(0, Math.max(0, p.left - already)).forEach(c => chosen.add(c));
  }
  if (!plans.length) {                                         // pas de CC : 8 nouvelles par jour dans l'ordre du cours
    const n = Math.max(0, 8 - ALL.filter(firstToday).length);
    courseSort(ALL.filter(isNew)).slice(0, n).forEach(c => chosen.add(c));
  }
  return [...chosen];
}
function planCard(p, idx){
  const groups = new Map();
  courseSort(p.scope).forEach(c => { const k = keyOf(c); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(c); });
  const rows = [...groups].map(([k, cs]) => {
    const [mat, ch] = k.split("|"), m = cs.filter(c => box(c) >= MASTER).length, seen = cs.filter(c => rec(c)).length;
    const st = m / cs.length >= .8 ? "vert" : seen ? "orange" : "rouge";
    return `<div class="prow"><i class="pdot ${st}"></i><div class="ptx"><b>${esc(chLabel(ch))}</b><small>${esc(mat)} · ${m}/${cs.length} maîtrisées${seen < cs.length ? " · " + (cs.length - seen) + " jamais vues" : ""}</small></div>
      <button data-pr="${esc(k)}" aria-label="Réviser">${ic("play", 14)}</button>${qcmPossible(mat, ch) ? `<button data-pq="${esc(k)}" aria-label="QCM">${ic("listcheck", 15)}</button>` : ""}<button data-pl="${esc(k)}" aria-label="Écouter">${ic("vol2", 15)}</button></div>`;
  }).join("");
  const missing = ccMats(p.x).filter(m => !p.scope.some(c => c.matiere === m));
  const days = [];
  for (let k = 0; k < Math.min(p.j, 14); k++) {
    const d = TODAY() + k, lbl = new Date(d * 86400000).toLocaleDateString("fr-FR", { weekday:"short", day:"numeric", timeZone:"UTC" });
    const rv = p.j > 2 && k >= p.j - 2, n = Math.max(0, Math.min(p.perDay, p.todo.length - p.perDay * k));
    days.push(`<div class="${k === 0 ? "td " : ""}${rv ? "rv" : ""}"><b>${k === 0 ? "auj." : esc(lbl)}</b>${rv ? "révision<br>+ QCM" : n ? n + "<br>nouv." : "révision"}</div>`);
  }
  if (p.j <= 14) days.push(`<div class="jj"><b>Jour J</b>${ic("trophy", 16, "#fff")}</div>`);
  return `<div class="card2 plancard">
    <div class="ph"><b>${esc(p.x.nom)}</b><span class="pj">${p.j ? "J-" + p.j : "Aujourd'hui"}</span></div>
    <small class="pdate">${esc(dateFr(p.x.date))}</small>
    ${p.scope.length ? `<div class="ptoday">${ic("target", 16)} Aujourd'hui : <b>${pl(p.left, "nouvelle")}</b> + <b>${p.due} à revoir</b>${p.doneToday ? `<small>${pl(p.doneToday, "nouvelle")} déjà vue${p.doneToday > 1 ? "s" : ""} aujourd'hui</small>` : ""}</div>
    ${p.perDay > 40 ? `<div class="pwarn">Gros rythme : ${p.perDay} nouvelles par jour. Fais 2 ou 3 sessions dans la journée.</div>` : ""}
    <div class="pstrip">${days.join("")}</div>
    <div class="pleg"><span><i class="pdot vert"></i>maîtrisée à 80 %</span><span><i class="pdot orange"></i>en cours</span><span><i class="pdot rouge"></i>pas commencée</span></div>
    ${rows}` : ""}
    ${missing.length ? `<div class="pmiss">Pas encore de cartes pour : ${esc(missing.join(", "))}.</div>` : ""}
    ${idx === 0 && p.scope.length ? `<button class="submit" data-p="go">Lancer la session du jour</button>` : ""}
  </div>`;
}
window.renderPlan = function(){
  const ps = ccActive().map(ccPlan).sort((a, b) => (!b.scope.length) - (!a.scope.length) || a.j - b.j);
  $("pgPlan").innerHTML = back('data-p="back"', `<span class="ico-row">${ic("calendar", 18)} Plan de colle</span>`)
    + (ps.length ? ps.map(planCard).join("") : `<div class="card2"><p class="note" style="margin:0">Aucun CC à venir. Ajoute la date de ta prochaine colle pour avoir ton plan jour par jour.</p></div>`)
    + `<button class="rowbtn" data-p="cc"><span class="ico-row">${ic("pen", 16)} Modifier mes CC</span></button>`;
};
$("pgPlan").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return; Sound.SFX.tap();
  if (b.dataset.p === "back") openPage("hub");
  else if (b.dataset.p === "cc") openPage("cc");
  else if (b.dataset.p === "go") startSession();
  else if (b.dataset.pr) { const [mat, ch] = b.dataset.pr.split("|"); openCustom({ key:"chap:" + b.dataset.pr, nom:mat + " · " + seanceLbl(ch).replace("Séance ", "S"), mode:"card", f:c => keyOf(c) === b.dataset.pr }); }
  else if (b.dataset.pq) { const [mat, ch] = b.dataset.pq.split("|"); startQcm([b.dataset.pq], 10, mat + " · " + seanceLbl(ch).replace("Séance ", "S")); }
  else if (b.dataset.pl) { const k = b.dataset.pl, [mat, ch] = k.split("|"); openListen({ k:"seance", nom:mat + " · " + seanceLbl(ch).replace("Séance ", "S"), cards:reviewSort(ALL.filter(c => keyOf(c) === k)) }); }
});

/* =====================================================================
   SESSION GUIDÉE (bouton Réviser)
   ===================================================================== */
const SESS = [10, 20, 30, 50];
function sessionCards(){
  const N = S.sessN || 20;
  const dueAll = ALL.filter(c => isKo(c) || isDue(c)).sort((a, b) => (isKo(b) - isKo(a)) || (ccBoost(b) - ccBoost(a)) || (box(a) - box(b)) || (rec(a).due - rec(b).due));
  const fresh = todaysNew();
  const nNew0 = Math.min(fresh.length, Math.max(N - dueAll.length, Math.round(N * 0.3)));
  const due = dueAll.slice(0, N - nNew0);
  let nw = fresh.slice(0, nNew0);
  // pas assez de cartes prévues ? on complète jusqu'au nombre choisi (nouvelles dans l'ordre du cours, puis les moins maîtrisées)
  if (due.length + nw.length < N) {
    const used = new Set([...due, ...nw]);
    const more = [...courseSort(ALL.filter(c => isNew(c) && !used.has(c))), ...shuffle(ALL.filter(c => !isNew(c) && !used.has(c))).sort((a, b) => box(a) - box(b))];
    nw = nw.concat(more.slice(0, N - due.length - nw.length));
  }
  const nNew = nNew0;
  // échauffement sur 3 cartes à revoir, puis on alterne nouvelle / à revoir
  const cards = due.slice(0, 3); let a = 3, b = 0;
  while (a < due.length || b < nw.length) { if (b < nw.length) cards.push(nw[b++]); if (a < due.length) cards.push(due[a++]); }
  return { cards, nDue:due.length, nNew:nw.filter(isNew).length, leftNew:Math.max(0, fresh.length - nNew) };
}
function sessionInfo(){
  const s = sessionCards(), nq = Math.floor(s.cards.length / 4);
  return { ...s, mins: Math.max(1, Math.round(s.cards.length * 0.35 + nq * 0.2)) };
}
function startSession(){
  const s = sessionCards();
  if (!s.cards.length) { toast("Tout est à jour : lance un QCM ou les schémas", "party"); return; }
  const withExo = (l, cs) => typeof exoInsert === "function" ? exoInsert(l, { f:c => cs.includes(c) }) : l;
  let first = withExo(withQuizzes(s.cards, false), s.cards);
  openCustom({ key:"session", nom:"Session du jour", mode:"card", f:() => false,
    build:() => { if (first) { const l = first; first = null; return l; } const n = sessionCards(); return withExo(withQuizzes(n.cards, false), n.cards); } });
}
window.startSession = startSession;

/* =====================================================================
   HUB « Réviser »
   ===================================================================== */
const standalone = () => { try { return matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch (e) { return false; } };
const hubTile = (h, icon, col, title, sub) => `<button data-h="${h}"><span class="hi" style="--hc:${col}">${ic(icon, 18, "#fff")}</span><span><b>${title}</b><small>${sub}</small></span></button>`;
window.renderHub = function(){
  const s = sessionInfo(), ps = ccActive().map(ccPlan).filter(p => p.scope.length), nx = ps[0];
  const err = ALL.filter(everKo).length, pg = ALL.filter(piege).length, msk = ALL.filter(c => c.masks).length;
  const goal = goalNow(), done = S.today.reviews;
  $("pgHub").innerHTML = `<h2>Réviser</h2>
    <button class="hubgo" data-h="go"><span class="hg-ic">${PLAY}</span><span><b>Réviser maintenant</b>
      <small>${s.cards.length ? `${pl(s.cards.length, "carte")} · ${s.nDue ? s.nDue + " à revoir · " : ""}${pl(s.nNew, "nouvelle")} · ~${s.mins} min` : "Tout est à jour !"}</small></span></button>
    <div class="sesspick"><span>Nombre de cartes</span>${SESS.map(n => `<button data-h="n${n}" class="${(S.sessN || 20) === n ? "on" : ""}">${n}</button>`).join("")}</div>
    <div class="hubgoal"><div class="meter"><i style="width:${Math.min(100, done / Math.max(1, goal) * 100).toFixed(0)}%"></i></div>Objectif du jour : ${done} / ${goal} révisions${s.leftNew ? ` · encore ${s.leftNew} nouvelles prévues après cette session` : ""}</div>
    ${nx ? `<button class="hubcc" data-h="plan">${ic("calendar", 20, "#25f4ee")}<span><b>${esc(nx.x.nom)} · ${nx.j ? "J-" + nx.j : "aujourd'hui"}</b><small>${nx.mastered}/${nx.scope.length} cartes maîtrisées · aujourd'hui ${pl(nx.left, "nouvelle")} + ${nx.due} à revoir</small></span><span class="chev">›</span></button>` : ""}
    ${nx && nx.j <= 2 ? `<button class="hubcc" data-h="boss" style="border-color:#c9a400;background:linear-gradient(135deg,#2a2208,#1a0b2e)">${ic("crown", 20, "#face15")}<span><b>Le boss de ${esc(nx.x.nom)} t'attend</b><small>Tous les exercices mélangés, 3 vies : bats-le avant le jour J</small></span><span class="chev">›</span></button>` : ""}
    <div class="sect">Modes</div>
    <div class="hubgrid">
      ${hubTile("jeux", "zap", "#ff2d87", "Jeux", "Swipe, légendes, paires, survie")}
      ${hubTile("plan", "calendar", "#0a7cff", "Plan de colle", nx ? "Jour par jour jusqu'au " + (nx.j ? "J-" + nx.j : "CC") : "Ajoute une date")}
      ${hubTile("qcm", "listcheck", "#fe2c55", "QCM concours", "5 propositions A–E")}
      ${hubTile("mots", "bulb", "#25b8ee", "Mots", ((window.EXOS && EXOS.vocab && EXOS.vocab.length) || 0) + " mots à connaître")}
      ${hubTile("tableaux", "file", "#c9a400", "Mes tableaux", ((window.EXOS && EXOS.tables.length) || 0) + " tableaux à remplir")}
      ${hubTile("legende", "puzzle", "#7b3cff", "Schémas à compléter", msk + " schémas à légender")}
      ${hubTile("erreurs", "target", "#ff7a1a", "Mes erreurs", `${pl(err, "ratée")} · ${pl(pg, "piège")} ⚠`)}
      ${hubTile("ecoute", "vol2", "#13a35a", "Mode écoute", "Questions lues à voix haute")}
      ${hubTile("exam", "exam", "#444", "Contrôle blanc", "Noté sur 20, chronométré")}
      ${hubTile("cc", "alarm", "#444", "Mes CC", "Dates des colles et examens")}
      ${hubTile("add", "plus", "#444", "Ajouter une carte", "Écrite à la main")}
    </div>
    ${standalone() || S.hideInstall ? "" : `<div class="card2 inst"><b><span class="ico-row">${ic("upload", 16)} Mettre FlashTok sur l'écran d'accueil</span></b>
      <p>Dans Safari, ouvre la version GitHub de FlashTok, touche Partager puis « Sur l'écran d'accueil ». Elle s'ouvre alors en plein écran comme une vraie appli et marche sans réseau.</p>
      <button class="rowbtn" data-h="hideinst">J'ai compris</button></div>`}`;
};
$("pgHub").addEventListener("click", e => {
  const b = e.target.closest("[data-h]"); if (!b) return; Sound.SFX.tap();
  const h = b.dataset.h;
  if (h === "go") startSession();
  else if (h === "plan") openPage(ccActive().length ? "plan" : "cc");
  else if (h === "qcm") openPage("qcm");
  else if (h === "jeux") openPage("jeux");
  else if (h === "boss") openGame("boss");
  else if (h === "tableaux") openGame("tabs");
  else if (h === "mots") openGame("mots");
  else if (h === "legende") openCustom({ key:"legende", nom:"Schémas à compléter", mode:"schema", f:c => !!c.masks });
  else if (h === "erreurs") openErreurs();
  else if (h === "ecoute") openListen();
  else if (h === "exam") openExamSetup();
  else if (h === "cc") openPage("cc");
  else if (h === "add") openPage("add");
  else if (h === "hideinst") { S.hideInstall = 1; save(); renderHub(); }
  else if (/^n\d+$/.test(h)) { S.sessN = +h.slice(1); save(); renderHub(); }
});

/* =====================================================================
   MES ERREURS
   ===================================================================== */
function openErreurs(){
  if (!ALL.some(c => everKo(c) || piege(c))) { toast("Aucune erreur pour l'instant", "party"); return; }
  openCustom({ key:"erreurs", nom:"Mes erreurs", mode:"card", f:c => everKo(c) || piege(c), build:() => {
    const ko = shuffle(ALL.filter(isKo)), past = ALL.filter(c => !isKo(c) && everKo(c)).sort((a, b) => (rec(b).ko || 0) - (rec(a).ko || 0));
    return withQuizzes([...ko, ...past, ...shuffle(ALL.filter(c => piege(c) && !everKo(c)))], false);
  } });
}

/* =====================================================================
   QCM CONCOURS (5 propositions A–E, une ou plusieurs exactes)
   ===================================================================== */
const QREG = [];
// propositions tirées de tes cartes : les vrai/faux tels quels, les phrases à trous (juste ou avec un piège)
function stmtPool(cs){
  const out = [];
  cs.forEach(c => {
    (c.vf || []).forEach(v => out.push({ fixed:true, v:!!v.v, t:v.t, why:v.pourquoi || "", c }));
    (c.trous || []).forEach(tr => { const m = tr.t.match(CLOZE); if (m && (tr.faux || []).length) out.push({ fixed:false, tr, ans:m[1], c }); });
  });
  return out;
}
function realize(s, v){
  if (s.fixed) return { t:s.t, v:s.v, why:s.why, c:s.c };
  if (v) return { t:elide(s.tr.t.replace(CLOZE, () => s.ans)), v:true, why:`C'est bien « ${s.ans} ».`, c:s.c };
  const f = s.tr.faux[Math.random() * s.tr.faux.length | 0];
  return { t:elide(s.tr.t.replace(CLOZE, () => f)), v:false, why:`Il fallait « ${s.ans} », pas « ${f} ».`, c:s.c };
}
function makeQcm(pool, title){
  if (pool.length < 5) return null;
  const fT = pool.filter(s => s.fixed && s.v).length, fF = pool.filter(s => s.fixed && !s.v).length, fl = pool.filter(s => !s.fixed).length;
  const lo = Math.max(1, 5 - (fF + fl)), hi = Math.min(4, fT + fl);
  if (lo > hi) return null;
  const choices = [1, 2, 2, 3, 3, 4].filter(n => n >= lo && n <= hi);
  for (let tries = 0; tries < 40; tries++) {
    const nT = choices.length ? choices[Math.random() * choices.length | 0] : lo, nF = 5 - nT;
    let t = 0, f = 0; const props = [];
    for (const s of shuffle(pool.slice())) {
      if (props.length === 5) break;
      if (s.fixed) { if (s.v && t < nT) { props.push(realize(s)); t++; } else if (!s.v && f < nF) { props.push(realize(s)); f++; } }
      else {
        const wantT = t < nT, wantF = f < nF; if (!wantT && !wantF) continue;
        const v = wantT && wantF ? Math.random() < (nT - t) / (nT - t + nF - f) : wantT;
        props.push(realize(s, v)); v ? t++ : f++;
      }
    }
    if (props.length === 5 && t === nT) { const q = { qcm:true, title, props:shuffle(props), c:props[0].c }; q.id = QREG.push(q) - 1; return q; }
  }
  return null;
}
const sig = q => q.props.map(p => p.t).sort().join("§");
function qcmFor(key){
  const [mat, ch] = key.split("|");
  const own = ch === "*" ? null : makeQcm(stmtPool(ALL.filter(c => keyOf(c) === key)), chLabel(ch));
  return own || makeQcm(stmtPool(ALL.filter(c => c.matiere === mat)), mat);
}
function qcmFromCards(cs){
  const cnt = {}; cs.forEach(c => { const k = keyOf(c); cnt[k] = (cnt[k] || 0) + 1; });
  for (const k of Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])) { const q = qcmFor(k); if (q) return q; }
  return null;
}
// n QCM différents (pas deux fois les mêmes propositions)
function qcmSet(gen, n){
  const out = [], seen = new Set();
  for (let k = 0; k < n * 4 && out.length < n; k++) { const q = gen(k); if (q && !seen.has(sig(q))) { seen.add(sig(q)); out.push(q); } }
  return out;
}
function runQcms(gen, n, nom){
  const first = qcmSet(gen, n);
  if (!first.length) { toast("Pas assez de propositions pour un QCM ici"); return; }
  if (first.length < n) toast(`${pl(first.length, "QCM différent")} possible${first.length > 1 ? "s" : ""} ici`, "listcheck");
  let l = first;
  openCustom({ key:"qcm", nom, mode:"card", f:() => false, build:() => { if (l) { const r = l; l = null; return r; } return qcmSet(gen, n); } });
}
window.qcmPossible = (mat, ch) => stmtPool(ALL.filter(c => c.matiere === mat && (c.chapitre || "—") === ch)).length >= 5;
window.startQcm = (keys, n, title) => { const ks = shuffle(keys.slice()); runQcms(k => qcmFor(ks[k % ks.length]), n, "QCM · " + title); };

window.qcmSlide = function(item, i){
  const c = item.c, m = { ...matOf(c.matiere), ...lookOf(c) };
  return `
  <section class="slide quiz qcm" data-qcm="${item.id}" style="--c1:${m.couleurs[1]};--c2:${m.couleurs[0]}">
    <div class="content"><div class="qcmbox">
      <div class="qhead"><span class="live">QCM</span> Type concours</div>
      <div class="qstem"><b>${esc(item.title)}</b>${item.title === c.matiere ? "" : " · " + esc(c.matiere)}<br>Quelle(s) proposition(s) est/sont exacte(s) ?</div>
      ${item.props.map((p, k) => `<button class="qprop" data-p="${k}"><span class="ql">${"ABCDE"[k]}</span><span class="qt">${prep(p.t)}</span></button><div class="qwhy" hidden></div>`).join("")}
      <button class="qval" data-qv="1">Valider</button>
      <div class="qres" hidden></div>
    </div></div>
    <div class="bar"><i style="width:${((i + 1) / list.length * 100).toFixed(1)}%"></i></div>
  </section>`;
};
function validateQcm(slide, ev){
  if (slide.dataset.done) return;
  const item = QREG[+slide.dataset.qcm]; if (!item) return;
  const btns = [...slide.querySelectorAll(".qprop")];
  if (!btns.some(b => b.classList.contains("sel"))) { toast("Coche au moins une proposition"); return; }
  slide.dataset.done = 1;
  let err = 0; const perCard = new Map();
  btns.forEach((b, k) => {
    const p = item.props[k], sel = b.classList.contains("sel"), ok = sel === p.v;
    if (!ok) err++;
    b.classList.add(p.v ? "vrai" : "faux", ok ? "juste" : "erreur");
    const w = b.nextElementSibling; w.hidden = false;
    w.innerHTML = `<b style="color:${p.v ? "#2fd27a" : "#ff6b8a"}">${p.v ? "Vrai" : "Faux"}.</b>${ok ? "" : " <b>Erreur.</b>"} ${prep(p.why)}`; math(w);
    perCard.set(p.c, (perCard.has(p.c) ? perCard.get(p.c) : true) && ok);
  });
  const note = [1, .5, .2][err] ?? 0, lvl = level(S.xp);
  perCard.forEach((ok, c) => srsApply(c, ok ? 2 : 0));
  const gain = [30, 15, 6][err] ?? 3; S.xp += gain;
  const r0 = slide.querySelector(".qval").getBoundingClientRect(); xpFloat(r0.left + r0.width / 2, r0.top, gain);
  if (!err) { combo++; S.quizOk++; S.today.quizOk++; S.today.maxCombo = Math.max(S.today.maxCombo, combo); confetti(70); buzz(15); Sound.SFX.quizOk(); }
  else { combo = 0; buzz([40, 30, 40]); Sound.SFX.quizKo(); }
  showCombo();
  S.qcmLog = (S.qcmLog || []).concat({ d:TODAY(), n:note }).slice(-200);
  afterProgress(lvl);
  slide.querySelector(".qval").remove();
  const r = slide.querySelector(".qres"); r.hidden = false;
  r.innerHTML = `<b style="color:${noteColor(note * 20)}">${fmtNote(note)} / 1</b> · ${err ? pl(err, "erreur") : "sans faute !"}
    <small>Barème LAS : 0 erreur = 1 · 1 erreur = 0,5 · 2 erreurs = 0,2 · 3 et plus = 0</small><span>Scrolle ↓ pour continuer</span>`;
}

/* ---- page de réglage des QCM ---- */
const QS = { mats:null, chaps:null, n:10 };
const qcmMats = () => MATIERES.map(m => m.nom).filter(n => stmtPool(ALL.filter(c => c.matiere === n)).length >= 5);
window.renderQcmSetup = function(){
  const mats = qcmMats();
  if (!QS.mats || !QS.mats.length || !QS.mats.every(m => mats.includes(m))) { QS.mats = mats.slice(0, 1); QS.chaps = null; }
  const one = QS.mats.length === 1 ? QS.mats[0] : null;
  const chaps = one ? [...new Set(courseSort(ALL.filter(c => c.matiere === one)).map(c => c.chapitre || "—"))].filter(ch => stmtPool(ALL.filter(c => c.matiere === one && (c.chapitre || "—") === ch)).length) : [];
  const log = (S.qcmLog || []).slice(-20), avg = log.length ? log.reduce((a, b) => a + b.n, 0) / log.length : null;
  $("pgQcm").innerHTML = back('data-q="back"', `<span class="ico-row">${ic("listcheck", 18)} QCM concours</span>`) + `
    <p class="note" style="margin-top:0">Comme au concours LAS : 5 propositions de A à E, une ou plusieurs exactes. Barème : 0 erreur = 1 point, 1 erreur = 0,5, 2 erreurs = 0,2, au-delà = 0. Les propositions viennent de tes cartes.</p>
    <div class="sect">Matière</div><div class="chips">${mats.map(m => chip(`data-qm="${esc(m)}"`, QS.mats.includes(m), esc(m))).join("")}</div>
    ${one ? `<div class="sect">Séances</div><div class="chips">${chip('data-qc="*"', !QS.chaps, "Toutes")}${chaps.map(ch => chip(`data-qc="${esc(ch)}"`, !!(QS.chaps && QS.chaps.includes(ch)), esc(chLabel(ch)))).join("")}</div>` : ""}
    <div class="sect">Nombre</div><div class="chips">${[5, 10, 20].map(n => chip(`data-qn="${n}"`, QS.n === n, n + " QCM")).join("")}</div>
    ${avg !== null ? `<div class="sect">Tes résultats</div><div class="hist"><span>Moyenne sur tes ${pl(log.length, "dernier QCM", "derniers QCM")}</span><b style="color:${noteColor(avg * 20)}">${fmtNote(avg)} / 1</b></div>` : ""}
    <button class="submit" data-q="go">Lancer ${QS.n} QCM</button>`;
};
$("pgQcm").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return; Sound.SFX.tap();
  if (b.dataset.q === "back") { openPage("hub"); return; }
  if (b.dataset.q === "go") { launchQcm(); return; }
  if (b.dataset.qm) { const m = b.dataset.qm; QS.mats = QS.mats.includes(m) ? QS.mats.filter(x => x !== m) : [...QS.mats, m]; if (!QS.mats.length) QS.mats = [m]; QS.chaps = null; }
  if (b.dataset.qc) { const ch = b.dataset.qc; if (ch === "*") QS.chaps = null; else { const cur = QS.chaps || []; QS.chaps = cur.includes(ch) ? cur.filter(x => x !== ch) : [...cur, ch]; if (!QS.chaps.length) QS.chaps = null; } }
  if (b.dataset.qn) QS.n = +b.dataset.qn;
  renderQcmSetup();
});
function launchQcm(){
  if (QS.mats.length === 1 && QS.chaps) {
    const mat = QS.mats[0];
    let pool = stmtPool(ALL.filter(c => c.matiere === mat && QS.chaps.includes(c.chapitre || "—")));
    let title = QS.chaps.length === 1 ? chLabel(QS.chaps[0]) : QS.chaps.map(ch => seanceLbl(ch).replace("Séance ", "S")).join(" + ");
    if (pool.length < 5) { pool = stmtPool(ALL.filter(c => c.matiere === mat)); title = mat; toast("Pas assez de propositions : QCM sur toute la matière"); }
    runQcms(() => makeQcm(pool, title), QS.n, "QCM · " + (QS.chaps.length === 1 ? mat + " " + seanceLbl(QS.chaps[0]).replace("Séance ", "S") : mat));
  } else {
    const keys = shuffle([...new Set(ALL.filter(c => QS.mats.includes(c.matiere) && ((c.vf || []).length || (c.trous || []).length)).map(keyOf))]);
    runQcms(k => qcmFor(keys[k % keys.length]), QS.n, "QCM · " + QS.mats.join(", "));
  }
}

/* =====================================================================
   SCHÉMAS À COMPLÉTER (légendes cachées, touche pour révéler)
   ===================================================================== */
window.maskedHTML = c => `<div class="mskwrap" style="--ar:${c.ar || 1.4}"><img src="${esc(c.img)}" alt="" loading="lazy">${
  c.masks.map(([x, y, w, h], k) => `<button class="msk" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%" aria-label="Légende ${k + 1}"></button>`).join("")}</div>
  <div class="mskbar"><span class="mskn">0 / ${c.masks.length} légendes</span><button class="mskall">Tout révéler</button><button class="zoom2" data-zoom="${esc(c.img)}" hidden aria-label="Agrandir">${ic("zoom", 16)}</button></div>`;
function maskCount(boxEl){
  const all = boxEl.querySelectorAll(".msk").length, open = boxEl.querySelectorAll(".msk.open").length, bar = boxEl.querySelector(".mskbar");
  bar.querySelector(".mskn").textContent = `${open} / ${all} légendes`;
  if (open === all && !bar.classList.contains("fini")) {
    bar.classList.add("fini"); bar.querySelector(".mskall").hidden = true; bar.querySelector(".zoom2").hidden = false; buzz(15);
  }
}
function openMask(m){ if (m.classList.contains("open")) return; m.classList.add("open"); Sound.SFX.tap(); buzz(8); maskCount(m.closest(".schemabox")); }
function nearestMask(wrap, e){
  let best = null, bd = 26;
  wrap.querySelectorAll(".msk:not(.open)").forEach(m => {
    const r = m.getBoundingClientRect(), dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right), dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom), d = Math.hypot(dx, dy);
    if (d < bd) { bd = d; best = m; }
  });
  return best;
}

/* ---- clics dans le feed (QCM + masques) : appelé avant le gestionnaire principal ---- */
window.plusClick = function(e){
  const qs = e.target.closest(".slide[data-qcm]");
  if (qs) {
    const p = e.target.closest(".qprop");
    if (p && !qs.dataset.done) { p.classList.toggle("sel"); Sound.SFX.tap(); buzz(8); }
    else if (e.target.closest("[data-qv]")) validateQcm(qs, e);
    return true;
  }
  const all = e.target.closest(".mskall");
  if (all) { const bx = all.closest(".schemabox"); bx.querySelectorAll(".msk").forEach(m => m.classList.add("open")); maskCount(bx); Sound.SFX.flip(); return true; }
  const wrap = e.target.closest(".mskwrap");
  if (wrap) { const m = e.target.closest(".msk:not(.open)") || nearestMask(wrap, e); if (m) openMask(m); return true; }   // le schéma ne retourne jamais la carte
  if (e.target.closest(".mskbar") && !e.target.closest("[data-zoom]")) return true;
  return false;
};

/* =====================================================================
   MODE ÉCOUTE (question lue, pause, réponse lue)
   ===================================================================== */
const SUP = { "⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9","₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9" };
const GREEK = { alpha:"alpha", beta:"bêta", gamma:"gamma", Gamma:"gamma", delta:"delta", Delta:"delta", epsilon:"epsilon", varepsilon:"epsilon", zeta:"dzêta", eta:"êta",
  theta:"thêta", Theta:"thêta", lambda:"lambda", Lambda:"lambda", mu:"mu", nu:"nu", xi:"ksi", pi:"pi", Pi:"pi", rho:"rhô", sigma:"sigma", Sigma:"sigma", tau:"tau",
  phi:"phi", varphi:"phi", Phi:"phi", chi:"khi", psi:"psi", omega:"oméga", Omega:"oméga", kappa:"kappa" };
const TEX = { le:"inférieur ou égal à", leq:"inférieur ou égal à", leqslant:"inférieur ou égal à", ge:"supérieur ou égal à", geq:"supérieur ou égal à", geqslant:"supérieur ou égal à",
  lt:"inférieur à", gt:"supérieur à", neq:"différent de", ne:"différent de", approx:"environ", sim:"équivalent à", simeq:"environ", to:"vers", rightarrow:"vers", longrightarrow:"vers",
  mapsto:"associe", Rightarrow:"implique", implies:"implique", Longrightarrow:"implique", Leftrightarrow:"équivaut à", iff:"équivaut à", Longleftrightarrow:"équivaut à", Leftarrow:"est impliqué par",
  forall:"pour tout", exists:"il existe", nexists:"il n'existe pas", in:"appartient à", notin:"n'appartient pas à", subset:"inclus dans", subseteq:"inclus dans", supset:"contient",
  cup:"union", cap:"inter", bigcup:"union", bigcap:"intersection", emptyset:"ensemble vide", varnothing:"ensemble vide", infty:"l'infini", lim:"limite", sum:"somme", prod:"produit",
  int:"intégrale", times:"fois", cdot:"fois", pm:"plus ou moins", mp:"moins ou plus", circ:"rond", mid:"divise", nmid:"ne divise pas", equiv:"congru à", ln:"l n", log:"log",
  exp:"exponentielle", sin:"sinus", cos:"cosinus", tan:"tangente", arctan:"arc tangente", sup:"sup", inf:"inf", max:"max", min:"min", det:"déterminant", ker:"noyau",
  deg:"degré", partial:"d rond", neg:"non", lnot:"non", land:"et", lor:"ou", wedge:"et", vee:"ou", setminus:"privé de", ast:"étoile", star:"étoile", prime:"prime",
  dots:", ", ldots:", ", cdots:", ", quad:" ", qquad:" ", lfloor:"partie entière de", Re:"partie réelle de", Im:"partie imaginaire de", arg:"argument", gcd:"pgcd", perp:"orthogonal à",
  parallel:"parallèle à", angle:"angle", triangle:"triangle", propto:"proportionnel à", ell:"l", hbar:"h barre", Delta:"delta", uparrow:"augmente", downarrow:"diminue", nearrow:"augmente", searrow:"diminue" };
const ARG = "(\\{[^{}]*\\}|\\\\[a-zA-Z]+|[A-Za-z0-9])", unbr = a => a.replace(/^\{|\}$/g, "");
const ABS = /\|([^|]+)\|/g;
function sayMath(m){
  m = m.replace(/'/g, " prime ").replace(/\^\s*\{?\s*\*\s*\}?/g, " étoile ").replace(/\\(?:begin|end)\s*\{[^{}]*\}/g, " ")
       .replace(/\\(?:text|mathrm|textbf|mathbf|operatorname|textit|mathit)\s*\{([^{}]*)\}/g, " $1 ")
       .replace(/\\(?:mathbb|mathcal|mathscr|mathfrak|mathbf)\s*\{?([A-Za-z])\}?/g, " $1 ")
       .replace(/\\(?:left|right|big|Big|bigg|Bigg|displaystyle|limits)\b/g, " ")
       .replace(ABS, (_, x) => (/z/i.test(x) ? " module de " : " valeur absolue de ") + x + " ");
  const FR = new RegExp("\\\\[dt]?(frac|binom)\\s*" + ARG + "\\s*" + ARG);
  for (let k = 0; k < 8 && FR.test(m); k++) m = m.replace(FR, (_, w, a, b) => w === "frac" ? ` ${unbr(a)} sur ${unbr(b)} ` : ` ${unbr(b)} parmi ${unbr(a)} `);
  m = m.replace(/\\sqrt\s*\[([^\]]*)\]\s*\{([^{}]*)\}/g, " racine $1-ième de $2 ").replace(/\\sqrt\s*\{([^{}]*)\}/g, " racine de $1 ")
       .replace(/\\(?:overline|bar)\s*\{([^{}]*)\}/g, " $1 barre ").replace(/\\vec\s*\{([^{}]*)\}/g, " vecteur $1 ").replace(/\\(?:hat|widehat|tilde)\s*\{([^{}]*)\}/g, " $1 ")
       .replace(/\^\s*\{\s*2\s*\}|\^2(?!\d)/g, " au carré ").replace(/\^\s*\{\s*3\s*\}|\^3(?!\d)/g, " au cube ")
       .replace(/\^\s*\{\s*-\s*1\s*\}/g, " puissance moins un ")
       .replace(/\^\s*\{\s*(\d*)\s*([+-])\s*\}/g, (_, n, sg) => ` ${n} ${sg === "+" ? "plus" : "moins"} `).replace(/\^\s*([+-])/g, (_, sg) => sg === "+" ? " plus " : " moins ").replace(/\^\s*\{\s*\\prime\s*\}|\^\s*\{\s*'\s*\}/g, " prime ")
       .replace(/\^\s*\{([^{}]*)\}/g, " puissance $1 ").replace(/\^\s*(\\?\w)/g, " puissance $1 ")
       .replace(/_\s*\{([^{}]*)\}/g, " $1 ").replace(/_\s*(\\?\w)/g, " $1 ")
       .replace(/\\([a-zA-Z]+)/g, (_, w) => " " + (GREEK[w] || TEX[w] || "") + " ")
       .replace(/\\[,;:! ]/g, " ").replace(/\\\{|\\\}|[{}]/g, " ").replace(/\\\\/g, ", ")
       .replace(/(\w)\s*\(/g, "$1 de (").replace(/[()[\]]/g, " ")
       .replace(/<=|≤/g, " inférieur ou égal à ").replace(/>=|≥/g, " supérieur ou égal à ")
       .replace(/=/g, " égale ").replace(/</g, " inférieur à ").replace(/>/g, " supérieur à ")
       .replace(/\+/g, " plus ").replace(/(^|[\s\d\w])-(?=[\s\d\w\\])/g, "$1 moins ").replace(/−/g, " moins ")
       .replace(/\//g, " sur ").replace(/\|/g, " ").replace(/!/g, " factorielle ").replace(/&/g, " ");
  return " " + m + " ";
}
function speakable(html){
  // les formules d'abord (sinon « $b<a$ » ressemblerait à une balise HTML), puis le texte
  const maths = [];
  let t = String(html || "").replace(/\$\$([\s\S]*?)\$\$|\$([^$]*?)\$/g, (_, a, b) => "\u0001" + (maths.push(sayMath(a || b || "")) - 1) + "\u0002");
  t = plain(t.replace(/<\/(?:p|li|div|h\d|tr)>|<br\s*\/?>/gi, ".\n").replace(/<(?:p|li|div)\b[^>]*>/gi, "\n"));
  t = t.replace(/\u0001(\d+)\u0002/g, (_, i) => maths[+i]);
  t = t.replace(/([A-Za-z\)])\s?(\d?)([⁺+])(?=[\s,.;:)]|$)/g, "$1 $2 plus ").replace(/([A-Za-z\)])\s?(\d?)([⁻])(?=[\s,.;:)]|$)/g, "$1 $2 moins ")
       .replace(/([A-Za-z][a-z]?\d?)-(?=[\s,.;:)]|$)/g, "$1 moins ")
       .replace(/[⁰-⁹₀-₉¹²³]/g, ch => SUP[ch] || ch).replace(/⁺/g, " plus ").replace(/⁻/g, " moins ")
       .replace(/L\/min/g, " litres par minute").replace(/mL\/min/g, " millilitres par minute").replace(/\/j\b/g, " par jour").replace(/\/min\b/g, " par minute").replace(/\/h\b/g, " par heure").replace(/\/s\b/g, " par seconde")
       .replace(/mmHg/g, " millimètres de mercure").replace(/(\d)\s?mL\b/g, "$1 millilitres").replace(/(\d)\s?mV\b/g, "$1 millivolts").replace(/(\d)\s?mOsm/g, "$1 milliosmoles").replace(/(\d)\s?kPa\b/g, "$1 kilopascals")
       .replace(/°C/g, " degrés").replace(/→|⟶|⇒/g, " donne ").replace(/⇔|↔/g, " équivaut à ").replace(/↑|↗/g, " augmente ").replace(/↓|↘/g, " diminue ")
       .replace(/≈|≃|~/g, " environ ").replace(/≤/g, " inférieur ou égal à ").replace(/≥/g, " supérieur ou égal à ").replace(/≠/g, " différent de ").replace(/×/g, " fois ")
       .replace(/±/g, " plus ou moins ").replace(/∞/g, " l'infini ").replace(/∈/g, " appartient à ").replace(/∀/g, " pour tout ").replace(/∃/g, " il existe ").replace(/√/g, " racine de ")
       .replace(/[µμ]/g, " micro").replace(/⚠/g, " attention : ").replace(/[•·▸►✓✔]/g, ", ").replace(/\s*\n+\s*/g, ". ")
       .replace(/\\/g, " ").replace(/\s+([,.;:])/g, "$1").replace(/([,.;:]){2,}/g, "$1").replace(/\s{2,}/g, " ").trim();
  return t;
}
function chunks(t){
  const out = [];
  t.replace(/([.!?;:])\s+/g, "$1\n").split("\n").forEach(s => {
    while (s.length > 190) { let cut = s.lastIndexOf(",", 190); if (cut < 60) cut = s.lastIndexOf(" ", 190); if (cut < 1) cut = 190; out.push(s.slice(0, cut + 1)); s = s.slice(cut + 1); }
    if (s.trim()) out.push(s);
  });
  return out;
}
const hasTTS = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
let frVoice = null;
function pickVoice(){ try {
  const vs = speechSynthesis.getVoices().filter(v => /^fr/i.test(v.lang));
  const score = v => (/premium/i.test(v.name) ? 60 : 0) + (/enhanced|amélior|ameliore|neural|natural|naturel/i.test(v.name + " " + v.voiceURI) ? 40 : 0)
    + (/siri/i.test(v.name + " " + v.voiceURI) ? 30 : 0) + (/Google/i.test(v.name) ? 20 : 0) + (/Audrey|Amélie|Aurélie|Marie|Thomas/i.test(v.name) ? 10 : 0)
    + (/^fr[-_]FR/i.test(v.lang) ? 5 : 0) - (/compact|eloquence|grandma|grandpa|rocko|shelley|flo|reed|sandy|jacques/i.test(v.name + " " + v.voiceURI) ? 50 : 0);
  frVoice = vs.sort((a, b) => score(b) - score(a))[0] || null;
} catch (e) {} }
if (hasTTS) { pickVoice(); try { speechSynthesis.addEventListener("voiceschanged", pickVoice); } catch (e) { speechSynthesis.onvoiceschanged = pickVoice; } }

const LS = { decks:[], deckKey:"session", deck:[], i:0, title:"", playing:false, phase:"q", rate:1, pause:3, tok:0, timers:[], lock:null, heard:0 };
const listenEl = $("listen");
function lsWait(ms, tok, fn){ LS.timers.push(setTimeout(() => { if (tok === LS.tok) fn(); }, ms)); }
function lsStop(){ LS.tok++; LS.timers.forEach(clearTimeout); LS.timers = []; if (hasTTS) try { speechSynthesis.cancel(); } catch (e) {} }
function say(text, tok, done){
  if (!hasTTS || !text) { lsWait(Math.min(9000, 1200 + text.length * 55) / LS.rate, tok, done); return; }
  const parts = chunks(text); let k = 0;
  const next = () => {
    if (tok !== LS.tok) return;
    if (k >= parts.length) { done(); return; }
    const part = parts[k++], u = new SpeechSynthesisUtterance(part);
    u.lang = "fr-FR"; if (frVoice) u.voice = frVoice; u.rate = LS.rate;
    let fired = false; const fin = () => { if (fired) return; fired = true; clearTimeout(guard); next(); };
    u.onend = fin; u.onerror = fin;
    const guard = setTimeout(fin, 3000 + part.length * 110 / LS.rate);       // filet si le navigateur oublie « onend »
    try { speechSynthesis.speak(u); } catch (e) { fin(); }
  };
  next();
}
function lsDecks(){
  const d = [{ k:"session", nom:"Session du jour", cards:sessionCards().cards }];
  const nx = ccActive().find(x => ALL.some(c => inCC(x, c)));
  if (nx) d.push({ k:"cc", nom:nx.nom, cards:reviewSort(ALL.filter(c => inCC(nx, c))) });
  d.push({ k:"erreurs", nom:"Mes erreurs", cards:reviewSort(ALL.filter(c => everKo(c) || piege(c))) });
  MATIERES.filter(m => ALL.some(c => c.matiere === m.nom)).forEach(m => d.push({ k:"m:" + m.nom, nom:m.nom, cards:reviewSort(ALL.filter(c => c.matiere === m.nom)) }));
  return d.filter(x => x.cards.length);
}
function openListen(custom){
  LS.decks = lsDecks(); if (custom) { LS.decks.unshift(custom); LS.deckKey = custom.k; }
  if (!LS.decks.some(d => d.k === LS.deckKey)) LS.deckKey = LS.decks.length ? LS.decks[0].k : null;
  listenEl.classList.add("show"); Sound.SFX.swoosh(); lsSetup();
}
window.openListen = openListen;
function lsSetup(){
  listenEl.innerHTML = `<div class="ohead"><button class="x" data-l="close">×</button><div class="tt">Mode écoute<small>Révise les oreilles ouvertes</small></div></div>
    <div class="lsset">
      <p class="note" style="margin-top:0">FlashTok lit la question, te laisse quelques secondes pour répondre dans ta tête, puis lit la réponse. Parfait dans le bus ou en marchant. Garde l'écran allumé et monte le son.</p>
      ${hasTTS ? "" : `<p class="note" style="color:#face15">La voix n'est pas disponible dans ce navigateur : les cartes défileront toutes seules, sans le son.</p>`}
      <div class="sect">Quoi écouter</div><div class="chips">${LS.decks.map(d => chip(`data-ld="${esc(d.k)}"`, d.k === LS.deckKey, `${esc(d.nom)} · ${d.cards.length}`)).join("")}</div>
      <div class="sect">Vitesse de la voix</div><div class="chips">${[0.8, 1, 1.2, 1.4].map(r => chip(`data-lr="${r}"`, LS.rate === r, "×" + String(r).replace(".", ","))).join("")}</div>
      <div class="sect">Temps pour réfléchir</div><div class="chips">${[2, 3, 5, 8].map(s => chip(`data-lp="${s}"`, LS.pause === s, s + " s")).join("")}</div>
      <button class="submit" data-l="start" ${LS.deckKey ? "" : "disabled style=opacity:.4"}><span class="ico-row" style="justify-content:center">${ic("play", 16)} Lancer l'écoute</span></button>
    </div>`;
}
function lsRender(){
  const c = LS.deck[LS.i];
  if (!c) return lsEnd();
  const m = { ...matOf(c.matiere), ...lookOf(c) }, shown = LS.phase === "a" || LS.phase === "done";
  const ph = LS.phase === "q" ? "<i></i> Question" : LS.phase === "think" ? `<i></i> Réfléchis… ${LS.pause}` : LS.phase === "a" ? "<i></i> Réponse" : LS.playing ? "Carte suivante…" : "En pause";
  listenEl.innerHTML = `<div class="ohead"><button class="x" data-l="close">×</button><div class="tt">Mode écoute<small>${esc(LS.title)} · ${LS.i + 1} / ${LS.deck.length}</small></div><button class="x" data-l="setup" aria-label="Réglages" style="font-size:15px">${ic("listcheck", 17)}</button></div>
    <div class="lsbody" style="--c1:${m.couleurs[0]};--c2:${m.couleurs[1]}">
      <div class="lsmeta">@${esc(c.matiere.toLowerCase())}${c.chapitre ? " · " + esc(chLabel(c.chapitre)) : ""}</div>
      <div class="lsq">${prep(c.q)}</div>
      <div class="lsphase">${ph}</div>
      ${shown ? `<div class="lsa">${prep(c.a)}</div>` : LS.playing ? "" : `<button class="rowbtn" data-l="reveal" style="background:rgba(0,0,0,.3)">Voir la réponse</button>`}
    </div>
    <div class="lsrate" style="${shown ? "" : "visibility:hidden"}"><button class="g0" data-lg="0">Raté</button><button class="g1" data-lg="1">Hésité</button><button class="g2" data-lg="2">Facile</button></div>
    <div class="lsctl"><button data-l="prev" aria-label="Précédente">‹‹</button><button class="big" data-l="play" aria-label="${LS.playing ? "Pause" : "Lecture"}">${LS.playing ? PAUSE : PLAY}</button><button data-l="next" aria-label="Suivante">››</button></div>`;
  math(listenEl);
}
function lsPlayCard(){
  lsStop();
  const tok = LS.tok, c = LS.deck[LS.i];
  if (!c) return lsEnd();
  LS.phase = "q"; lsRender();
  say(speakable(c.q), tok, () => {
    LS.phase = "think"; lsRender();
    let s = LS.pause;
    const tickT = () => {
      if (s <= 0) { reveal(); return; }
      const el = listenEl.querySelector(".lsphase"); if (el) el.innerHTML = `<i></i> Réfléchis… ${s}`;
      s--; lsWait(1000, tok, tickT);
    };
    const reveal = () => {
      LS.phase = "a"; LS.heard++; lsRender();
      say("Réponse. " + speakable(c.a), tok, () => { LS.phase = "done"; lsRender(); lsWait(2200, tok, () => lsGo(1)); });
    };
    tickT();
  });
}
function lsGo(d){
  LS.i = Math.max(0, LS.i + d);
  if (LS.i >= LS.deck.length) { lsEnd(); return; }
  if (LS.playing) lsPlayCard(); else { lsStop(); LS.phase = "q"; lsRender(); }
}
async function lsWake(on){
  try { if (on && !LS.lock && navigator.wakeLock) LS.lock = await navigator.wakeLock.request("screen"); if (!on && LS.lock) { LS.lock.release(); LS.lock = null; } } catch (e) {}
}
function lsEnd(){
  lsStop(); LS.playing = false; lsWake(false);
  listenEl.innerHTML = `<div class="ohead"><button class="x" data-l="close">×</button><div class="tt">Mode écoute<small>${esc(LS.title)}</small></div></div>
    <div class="lsend">${ic("party", 46, "#face15")}<b>Écoute terminée</b><span class="note">${pl(LS.heard, "réponse écoutée", "réponses écoutées")}. Les cartes notées « Raté » reviennent dans « À revoir ».</span>
      <button class="cta" data-l="again"><span class="ico-row">${ic("shuffle", 18)} Réécouter</span></button><button class="rowbtn" data-l="close" style="max-width:260px">Fermer</button></div>`;
  if (hasTTS && LS.heard) try { const u = new SpeechSynthesisUtterance("Écoute terminée. Bravo !"); u.lang = "fr-FR"; if (frVoice) u.voice = frVoice; speechSynthesis.speak(u); } catch (e) {}
}
function lsClose(){ lsStop(); LS.playing = false; lsWake(false); Sound.Music.duck(false); listenEl.classList.remove("show"); updateHud(); }
listenEl.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  const l = b.dataset.l;
  if (b.dataset.ld) { LS.deckKey = b.dataset.ld; Sound.SFX.tap(); lsSetup(); return; }
  if (b.dataset.lr) { LS.rate = +b.dataset.lr; Sound.SFX.tap(); lsSetup(); return; }
  if (b.dataset.lp) { LS.pause = +b.dataset.lp; Sound.SFX.tap(); lsSetup(); return; }
  if (b.dataset.lg) {
    const c = LS.deck[LS.i], g = +b.dataset.lg; if (!c) return;
    review(c, g); g >= 1 ? Sound.SFX.ok(combo) : Sound.SFX.ko(); toast(g === 0 ? "Elle revient dans « À revoir »" : g === 1 ? "Notée : hésité" : "Notée : facile", g === 0 ? "bookmark" : "ok");
    lsGo(1); return;
  }
  if (l === "close") lsClose();
  else if (l === "setup") { lsStop(); LS.playing = false; lsWake(false); lsSetup(); }
  else if (l === "start" || l === "again") {
    const d = LS.decks.find(x => x.k === LS.deckKey); if (!d && l === "start") return;
    if (l === "start") { LS.deck = d.cards.slice(); LS.title = d.nom; } LS.i = 0; LS.heard = 0;
    Sound.unlock && Sound.unlock(); Sound.Music.duck(true); LS.playing = true; lsWake(true);
    if (hasTTS) try { speechSynthesis.cancel(); } catch (e) {}
    lsPlayCard();
  }
  else if (l === "play") {
    if (LS.playing) { LS.playing = false; lsStop(); lsWake(false); if (LS.phase !== "a" && LS.phase !== "done") LS.phase = "q"; lsRender(); }
    else { LS.playing = true; lsWake(true); lsPlayCard(); }
  }
  else if (l === "next") lsGo(1);
  else if (l === "prev") lsGo(-1);
  else if (l === "reveal") { LS.phase = "a"; LS.heard++; lsRender(); }
});
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && LS.playing && !LS.lock) lsWake(true); });

// le gestionnaire « Esc » ferme aussi l'écoute
document.addEventListener("keydown", e => { if (e.key === "Escape" && listenEl.classList.contains("show")) lsClose(); });

window.FT_PLUS = { speakable, makeQcm, stmtPool, realize, ccPlan, sessionCards, todaysNew, qcmFor, qcmFromCards, nearestMask, courseSort, keyOf, chLabel };   // pour les tests

/* ---------- bouton « Lire » sur une carte : question puis réponse ---------- */
let rdBtn = null;
function readStop(){ LS.tok++; LS.timers.forEach(clearTimeout); LS.timers = []; if (hasTTS) try { if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel(); } catch (e) {} if (rdBtn) { const s = rdBtn.querySelector("span:last-child"); if (s) s.textContent = "Lire"; rdBtn.classList.remove("reading"); rdBtn = null; } }
function readSay(text, tok, done, fail){
  const parts = chunks(text); let k = 0, plainVoice = false, tries = 0;
  const next = () => {
    if (tok !== LS.tok) return;
    if (k >= parts.length) { done(); return; }
    const u = new SpeechSynthesisUtterance(parts[k]);
    u.lang = "fr-FR"; if (frVoice && !plainVoice) u.voice = frVoice; u.rate = 0.95; u.pitch = 0.95;
    let fired = false; const t0 = Date.now();
    const ok = () => { if (fired) return; fired = true; clearTimeout(g); k++; tries = 0; next(); };
    const ko = ev => {
      if (fired) return; fired = true; clearTimeout(g);
      const code = ev && ev.error || "inconnue";
      if (code === "interrupted" || code === "canceled") return;
      if (tries < 2) { tries++; plainVoice = true; setTimeout(next, 250); return; }   // 2e essai : voix par défaut du téléphone
      fail(code);
    };
    u.onend = () => (Date.now() - t0 < 80 && parts[k].length > 8) ? ko({ error:"muet" }) : ok();
    u.onerror = ko;
    const g = setTimeout(ok, 4000 + parts[k].length * 120);
    try { speechSynthesis.speak(u); } catch (e) { ko({ error:String(e) }); }
  };
  next();
}
function readCard(c, btn){
  if (!hasTTS) { toast("Ce navigateur n'a pas de voix : ouvre l'appli dans Safari ou Chrome"); return; }
  if (rdBtn === btn) { readStop(); return; }
  readStop();
  try { speechSynthesis.resume(); } catch (e) {}
  const tok = LS.tok; rdBtn = btn; btn.classList.add("reading");
  const s = btn.querySelector("span:last-child"); if (s) s.textContent = "Stop";
  const t0 = Date.now();
  const fin = () => { if (tok !== LS.tok) return; setTimeout(() => { if (tok === LS.tok) readStop(); }, Math.max(0, 1200 - (Date.now() - t0))); };
  const fail = code => { toast("Pas de voix (erreur : " + code + "). Vérifie le mode silencieux et le volume."); fin(); };
  readSay(speakable(c.q), tok, () => { if (tok === LS.tok) readSay("Réponse. " + speakable(c.a), tok, fin, fail); }, fail);
}
document.addEventListener("visibilitychange", () => { if (document.hidden) readStop(); });
window.readCard = readCard;
})();
