/* ─────────────────────────────────────────────────────────────
   ONE PLACE TO SWAP THE LIVE TOOL URL.
   These answer pages are served from the same Vercel deployment as
   the voiceprint MVP (this app's root), so the tool lives at "/".
   To point at a separately-hosted tool, paste its full URL here and
   every page (button + embed) updates automatically.
   ───────────────────────────────────────────────────────────── */
window.VOICEPRINT_URL = "/"; // same-origin MVP root

/* Wires up every [data-voiceprint-link] href and every
   [data-voiceprint-embed] iframe on the page. Loaded at end of body. */
(function () {
  var url = window.VOICEPRINT_URL;
  document.querySelectorAll("[data-voiceprint-link]").forEach(function (a) {
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });
  document.querySelectorAll("[data-voiceprint-embed]").forEach(function (f) {
    f.setAttribute("src", url);
  });
})();
