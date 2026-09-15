# GEKA Yapı

Static construction and decoration site. No build step is required.

## Preview

Run `python -m http.server 8765` from this directory, then visit http://localhost:8765.
Use HTTP rather than opening index.html directly: the page fetches data.json and loads a JavaScript module.

## Content

Edit `data.json` to change navigation, section text, services, featured projects, contact information, privacy labels and the complete media archive. Each archive entry has a type, source, title and (for videos) poster. Original files remain in `galeri/`.

`index.html` retains static SEO and social metadata, loading and no-JavaScript/error fallbacks. Update these when changing the business name or description.

## Design and motion

- `style.css`: responsive layouts, locally hosted Manrope, off-white / matte navy palette.
- `script.js`: JSON rendering, gallery filters and pagination, accessible photo/video dialog, mobile navigation, scroll reveals and parallax, consent-gated existing analytics.
- `scene.js`: procedural Three.js architectural pavilion with scroll-driven exploded layers, pointer response, motion pause, reduced-motion support and photo fallback.
- `vendor/`: pinned Three.js 0.180.0 and Manrope variable font, with licenses. No runtime CDN is required for the design or 3D scene.

Analytics loads only after consent. Existing `ga_consent` preferences are respected; preferences can be changed from the footer. WhatsApp and Instagram open their external sites.

## Validation

Verified in headless Chrome at 1440px and 390px: 3D initialization, no horizontal overflow, image/video filtering, pagination, dialog keyboard navigation and closing, video cleanup, mobile navigation and reduced-motion behavior. All 103 original media files resolve. JavaScript syntax and git whitespace checks pass.
