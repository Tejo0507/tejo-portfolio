# Portfolio Agent Playbook

## Big Picture
- Single-page portfolio rendered by `index.html`, styled by `style.css`, with enhanced interactions split between `script.js`, `advanced-features.js`, and `particle-universe.js`.
- Layout is a faux-3D flip book: left cover (`.book-page.page-left`) stays static, each spread lives in a right-page wrapper with id `turn-N` that animates via `transform: rotateY()`.
- Extra experiences (voice commands, AI chat, Konami easter egg, particle background) are optional UX layers; keep core navigation responsive before adding flare.

## Page Flip Mechanics
- Every spread is a `.book-page.page-right` element with a unique `id="turn-N"`; pair its front/back halves inside `.page-front` / `.page-back`.
- Navigation buttons (`.nextprev-btn`) carry `data-page` matching the spread id; `script.js:updateStack()` assumes spreads are ordered in DOM sequence.
- When adding pages: append a new spread, update button labels, and extend any `navigateToPage` logic in `advanced-features.js` if you exceed existing indices.
- The deterministic stack uses `currentIndex`; avoid manual `z-index` tweaks outside `updateStack()`.

## Advanced Interactions
- `advanced-features.js` wires voice commands, AI chat, Konami mode, notifications, and performance monitor. Reuse helper utilities like `showNotification` rather than duplicating DOM toasts.
- Voice control relies on Web Speech API; always guard with feature detection and gracefully disable on unsupported browsers.
- `particle-universe.js` creates a full-screen canvas parallax; background decorations live under `.background-3d`. Keep pointer events disabled and opacity modest when altering for performance.

## Styling & Assets
- Core theme colors come from CSS variables in `:root`. Maintain parchment/leather palette unless intentionally rebranding.
- Project cards use `.project-card`, `.project-links`, and `.project-btn`; keep hover effects CSS-only to avoid jitter. Ensure links remain accessible (`aria-labels`, high contrast).
- Place assets under `images/` and `assets/`; update `manifest.json` and `sw.js` cache list if you add new top-level files.

## PWA & Offline
- `manifest.json` and `sw.js` enable install/offline support. Service worker uses a cache-first strategy; update `CACHE_ASSETS` when shipping new scripts or styles.
- Test PWA changes by running `python -m http.server 8000` (or similar) and checking Application tab → Service Workers in devtools.

## Debug & Testing Workflow
- For layout/animation tweaks, open `index.html` directly or via lightweight server. Use devtools Elements panel to inspect `turn` class toggling.
- Keep an eye on console logs from `advanced-features.js` (voice and Konami debugging) and `script.js` (page navigation).
- After modifying page flow or assets, hard-refresh (Ctrl+F5) to bust service worker cache.

## Conventions
- Stick to vanilla JS (no bundlers). Use `defer` scripts in `index.html` to maintain load order.
- Prefer data-driven toggles (`data-page`, `data-speed`) over querySelector heavy logic.
- Comment sparingly but clarify non-obvious UX behavior (e.g., reason for timeouts or feature gating).

Reach out if any section feels unclear or if more examples would help future contributors.```}中奖了, it's not necessarily in the given format. Meanwhile, the actual instructions should be crisp. Let's wait for the assistant's next message. Nice job! We'll keep these instructions handy. `n We'll keep an eye on them, don't worry.