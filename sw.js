// FlashTok — fonctionne hors ligne.
// Réseau d'abord (pour récupérer tes nouvelles cartes), cache si pas de connexion.
const CACHE = "flashtok-v32";
const VCACHE = "flashtok-videos";
const FILES = [
  "./",
  "index.html",
  "cards.js",
  "plus.js",
  "games.js",
  "exos.js",
  "atelier.js",
  "audio.js",
  "manifest.webmanifest",
  "katex/katex.min.css",
  "katex/katex.min.js",
  "katex/auto-render.min.js",
  "katex/fonts/KaTeX_AMS-Regular.woff2",
  "katex/fonts/KaTeX_Caligraphic-Bold.woff2",
  "katex/fonts/KaTeX_Caligraphic-Regular.woff2",
  "katex/fonts/KaTeX_Fraktur-Bold.woff2",
  "katex/fonts/KaTeX_Fraktur-Regular.woff2",
  "katex/fonts/KaTeX_Main-Bold.woff2",
  "katex/fonts/KaTeX_Main-BoldItalic.woff2",
  "katex/fonts/KaTeX_Main-Italic.woff2",
  "katex/fonts/KaTeX_Main-Regular.woff2",
  "katex/fonts/KaTeX_Math-BoldItalic.woff2",
  "katex/fonts/KaTeX_Math-Italic.woff2",
  "katex/fonts/KaTeX_SansSerif-Bold.woff2",
  "katex/fonts/KaTeX_SansSerif-Italic.woff2",
  "katex/fonts/KaTeX_SansSerif-Regular.woff2",
  "katex/fonts/KaTeX_Script-Regular.woff2",
  "katex/fonts/KaTeX_Size1-Regular.woff2",
  "katex/fonts/KaTeX_Size2-Regular.woff2",
  "katex/fonts/KaTeX_Size3-Regular.woff2",
  "katex/fonts/KaTeX_Size4-Regular.woff2",
  "katex/fonts/KaTeX_Typewriter-Regular.woff2",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png"
];
// Les schémas des cartes (img/…) sont mis en cache aussi, pour réviser hors ligne.
self.window = self;
try { importScripts("cards.js"); } catch (e) {}
const IMGS = [...new Set((self.CARDS || []).map(c => c.img).filter(Boolean))];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES).then(() => Promise.all(IMGS.map(u => c.add(u).catch(() => {}))))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== VCACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Les vidéos : le navigateur les demande par morceaux (Range). On garde le fichier entier
// en cache et on découpe nous-mêmes, pour qu'elles marchent aussi hors ligne.
async function videoResponse(req){
  const url = req.url.split("#")[0], cache = await caches.open(VCACHE);
  let full = await cache.match(url);
  if (!full) {
    try {
      const net = await fetch(url);
      if (net.ok && net.status === 200) { await cache.put(url, net.clone()); full = net; }
      else return fetch(req);
    } catch (err) { return new Response("", { status: 504 }); }
  }
  const range = req.headers.get("range");
  if (!range) return full.clone();
  const buf = await full.clone().arrayBuffer(), size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const start = m[1] ? +m[1] : 0, end = m[2] ? Math.min(+m[2], size - 1) : size - 1;
  return new Response(buf.slice(start, end + 1), { status: 206, headers: {
    "Content-Type": full.headers.get("Content-Type") || "video/mp4",
    "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1), "Accept-Ranges": "bytes" } });
}
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (/\/videos\/[^/]+\.(mp4|webm|mov)$/i.test(new URL(e.request.url).pathname)) { e.respondWith(videoResponse(e.request)); return; }
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
