/* ─────────────────────────────────────────────────────────────
   ONE PLACE TO SWAP THE LIVE TOOL URL.
   When Role A's voiceprint app is deployed, paste its Vercel link
   below and every page (button + embed) updates automatically.
   ───────────────────────────────────────────────────────────── */
window.VOICEPRINT_URL = "https://voiceprint-lightfern.vercel.app"; // ← PLACEHOLDER: replace with the live app link

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
