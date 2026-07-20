# Games — Eigen Studio

## Structure

```
games/
  hollow-harvest/          # Source code (Vite + Three.js)
    src/                   # TypeScript source
    vite.config.ts         # Config with base: './'
    dist/                  # Built output (copied to public/)
    package.json

eigenrealms/               # Source code (Vite + Three.js)
  src/                     # TypeScript source
  vite.config.ts           # Config with base: './'
  dist/                    # Built output
  package.json

public/games/              # Served by Next.js (Vercel)
  hollow-harvest/          # Built game (from games/hollow-harvest/dist/)
    index.html
    assets/
  sky-drifter/             # Pre-built (no source in repo)
    index.html
    assets/
  whisperwood-v2/          # Pre-built (no source in repo)
    index.html
    assets/
```

## Game Status

| Game | Score | Status | Source in Repo | Engine |
|------|-------|--------|----------------|--------|
| Hollow Harvest | 71/B | In Progress | ✅ `games/hollow-harvest/` | Three.js |
| Sky Drifter | 77/B | Deployed | ❌ Pre-built only | Three.js |
| Whisperwood | ~74/B | Deployed | ❌ Pre-built only | Three.js |
| EigenRealms | — | In Progress | ✅ `eigenrealms/` | Three.js |

## Build Commands

```bash
# Build all games with source in repo
npm run build:games

# Build a specific game
npm run build:game hollow-harvest
npm run build:game eigenrealms

# Then rebuild the Next.js site
npm run build
```

## How Games Are Embedded

Games load in iframes on `/games/{slug}/play`. The iframe `src` points to
`/games/{slug}/index.html` — a static HTML file served from `public/games/`.

### Critical: Asset Paths

Every game HTML file MUST use **relative paths** for assets:

```html
<!-- ✅ CORRECT — relative path -->
<script type="module" src="./assets/index-ABC123.js"></script>
<link rel="stylesheet" href="./assets/index-DEF456.css">

<!-- ❌ WRONG — root path (causes 404 in iframe) -->
<script type="module" src="/assets/index-ABC123.js"></script>
<link rel="stylesheet" href="/assets/index-DEF456.css">
```

**Why:** Games are served from `/games/{slug}/index.html` but embedded in
Next.js pages via iframe. Root-relative paths (`/assets/...`) resolve to
the site root, not the game directory.

**Prevention:** All Vite configs must include `base: './'`.

## Adding a New Game

1. Create `games/{slug}/` with a Vite project
2. Set `base: './'` in `vite.config.ts`
3. Build: `npm run build:game {slug}`
4. Copy `dist/` output to `public/games/{slug}/`
5. Add game metadata to `src/data/games.ts`
6. Add embed path to `src/app/games/[slug]/page.tsx` (INTERNAL_EMBEDS)
7. Add play path to `src/app/games/[slug]/play/page.tsx`
8. Rebuild site: `npm run build`

## Updating Pre-Built Games (Sky Drifter, Whisperwood)

These games have no source in the repo. To update:

1. Replace files in `public/games/{slug}/`
2. Ensure `index.html` uses `./assets/` paths (not `/assets/`)
3. Rebuild site: `npm run build`

## Troubleshooting

**Game shows blank black screen:**
- Check browser console for 404 on JS/CSS files
- Fix: ensure `index.html` uses `./assets/` not `/assets/`

**Game loads but nothing renders:**
- WebGL not supported in iframe context
- Try opening `index.html` directly to test

**Build fails:**
- Check `games/{slug}/node_modules` exists (run `npm install`)
- Check TypeScript errors: `cd games/{slug} && npx tsc --noEmit`
