# Blog redesign plan

## Brief (from the user)

- Hates the current Chirpy look.
- Wants: **simple, minimalistic, rich text, easy to read, beautifully simple but unique** — must have its own identity, not look like every other dev blog.
- Must be SEO-friendly.
- User is not a designer, so design choices need to be made *for* them with clear reasoning.

## Current state

- **Stack:** Jekyll 4.3 + `jekyll-theme-chirpy` 7.4 (gem-based, no local overrides).
- **Hosting:** GitHub Pages via `.github/workflows/jekyll.yml`, custom domain `blog.shaheerkj.me`.
- **Content:** 4 posts in `_posts/`, tabs in `_tabs/` (about, archives, categories, tags), assets in `assets/img/`.
- **SEO already wired:** `jekyll-sitemap`, `jekyll-feed`, `jekyll-seo-tag`, `robots.txt`, `_config.yml` description/lang/url.
- **Stale doc:** `readme.md` describes a Hugo + hugo-brewm setup — does not match the actual Jekyll project. Either rewrite or delete during redesign.

## Recommended approach

**Stay on Jekyll. Ditch Chirpy. Build a small custom theme in-repo (`_layouts/`, `_includes/`, `assets/css/`).**

Why this over alternatives:
- **vs. another off-the-shelf theme:** any popular minimal theme (e.g. Minima, Klise, Hydeout) gives the "looks like every other blog" problem the user explicitly wants to avoid.
- **vs. switching to Astro/Hugo/11ty:** more design freedom, but rewrites the deploy pipeline, gem lockfile, and frontmatter conventions for marginal benefit. The bottleneck is design, not framework.
- **Custom Jekyll layouts:** ~5–8 small Liquid templates + one CSS file. Keeps the existing GH Pages workflow, post frontmatter, and image paths working unchanged. Total design control. Easy to maintain solo.

## Reference: `rmr.png` (user-supplied)

User showed a mockup and said: **font + layout = yes; color scheme = no, too dark, supposed to be warm.** What's validated:

- **Type system:** editorial serif for titles (with characterful italic — likely *Newsreader* or *Source Serif 4*); mono for dates and section labels; italic gray dek line under each title.
- **Home layout:** left sidebar (name as masthead, nav links, footer mark) + main typographic post list. Each entry: em-dash + small-caps mono date, optional "PINNED" tag in the accent color, serif title, italic dek, hairline divider.
- **Accent:** a warm rust/amber, used only on small labels (PINNED, active nav). Right call.

What to fix: the mockup's background is **cool charcoal pretending to be warm**. True warm = paper/cream or tobacco/coffee tones. Shift accordingly (see Color below).

## Design direction

The goal is "editorial / personal essay" feel rather than "developer dashboard." Identity comes from **typography + restraint**, not from heavy ornamentation. Direction below treats the `rmr.png` mockup as the structural reference, with a warmer palette.

### Typography (validated by the mockup)
- **Body / titles:** *Newsreader* (warm-modern, distinctive italic, free on Google Fonts) or *Source Serif 4* (slightly more neutral). Pick Newsreader for more personality.
- **UI / nav / dates / labels:** a mono — *JetBrains Mono* or *iA Writer Mono* — at small sizes. The mono-for-metadata move is doing a lot of identity work in the mockup; keep it.
- **Code:** same mono as UI, slightly larger.
- **Measure:** ~62–68ch line length. Line-height 1.6–1.7.
- **Section labels in small-caps + letter-spacing**, not big bold headings.

### Color — warm, paper-first

Default to **light/paper** as primary, not dark. The mockup tried to do warm dark and it read as cold; warm light is much more reliably "warm."

- **Light (primary):**
  - Background: `#F6EFE2` (warm cream / aged paper) — not pure white, not yellow-tinted.
  - Ink (body): `#2A1F17` (warm dark brown, not black).
  - Muted text (deks, dates): `#7A6A5A`.
  - Hairlines / borders: `#D9CDB8`.
  - Accent (PINNED, active nav, links on hover): `#B8542E` (warm rust/terracotta — same family as the mockup's accent, just paired against cream instead of charcoal).

- **Dark (optional, genuinely warm):**
  - Background: `#1F160E` (deep coffee/tobacco — far warmer than the mockup's near-black).
  - Ink: `#E8DDC9` (warm off-white).
  - Muted: `#9A8B78`.
  - Accent: `#D88A4A` (lifted rust — needs more luminance against the dark bg).
  - Switch via `prefers-color-scheme`, with a manual toggle deferred until v2.

Avoid: pure white, pure black, any blue, cool grays.

### Signature visual element (pick one)
1. **Monogram mark** — a small, custom "SK" glyph in the masthead / footer (mockup already hints at this with the stacked "shaheer / kj"). Refine into a proper SVG mark.
2. **Drop cap + small-caps lede** on the first paragraph of every post.
3. **Sidenotes** in the right margin on desktop, inline on mobile.
4. **Hand-drawn hairline rules** instead of default `<hr>`.

Recommendation: **#1 + #2.** The mockup's masthead already does half the work of #1; promoting it to a real mark + adding drop caps inside posts gives the site a recognizable signature without writing-discipline cost.

### Layout (matches the mockup)
- **Home:** two-column desktop — narrow left sidebar (sticky: name/mark, nav, footer URL), wide right column with typographic post list. Single column on mobile (sidebar collapses to top).
- **Post:** single column, left-aligned, generous left margin. Date + read-time + tags in small-caps mono above the title. No floating TOC; if a post needs one, inline at top, collapsed.
- **Nav:** sidebar links only — WRITING, ABOUT, ARCHIVE, RSS. No search in v1.
- **Footer:** site URL in muted mono in the sidebar bottom (as in mockup). Nothing else.

### SEO (preserved + improved)
- Keep `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-feed`.
- Per-post: ensure `description`, `image`, `tags`, `categories` always set (they already are — keep enforcing).
- Add JSON-LD `BlogPosting` structured data in the post layout (improves rich-result eligibility beyond what `seo-tag` does by default).
- Semantic HTML: `<article>`, `<header>`, `<time datetime="…">`, `<nav>`. No div soup.
- Self-host fonts via `assets/fonts/` (not Google Fonts CDN) — privacy + LCP win.
- Aim for Lighthouse 100 on Performance, A11y, SEO, Best Practices.

### Accessibility
- WCAG AA contrast in both light and dark.
- Visible focus rings.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- All images already have alt — keep enforcing.

## Phased implementation plan

**Phase 0 — Decisions (before any code).** Lock in: serif choice, accent color, signature element (monogram vs. drawn rule vs. sidenotes vs. drop cap). Without these, implementation is guesswork.

**Phase 1 — Strip Chirpy.**
- Remove `jekyll-theme-chirpy` from `Gemfile` and `_config.yml`.
- Add a minimal local theme scaffold: `_layouts/{default,home,post,page,archive}.html`, `_includes/{head,header,footer,post-meta}.html`, `assets/css/main.scss`, `assets/js/` only if strictly needed.
- Verify the existing 4 posts and tabs still render with the new layouts before doing any styling.

**Phase 2 — Typography & color system.**
- Self-host chosen fonts in `assets/fonts/` with `@font-face` and `font-display: swap`.
- CSS custom properties for palette (light + dark via `prefers-color-scheme`).
- Type scale (modular, e.g. 1.2 ratio), spacing scale, measure width.

**Phase 3 — Layouts & signature element.**
- Build home (typographic list), post (single column + meta block), tag/category archive pages.
- Implement the chosen signature element (monogram SVG + drop cap CSS, per recommendation).
- Code blocks: pick a syntax-highlight theme that fits the palette (e.g. a custom muted Rouge theme, not the loud default).

**Phase 4 — SEO & polish.**
- JSON-LD `BlogPosting` block in `_layouts/post.html`.
- Verify sitemap, feed, robots, canonical URLs.
- Run Lighthouse, fix regressions.
- 404 page in keeping with the design.

**Phase 5 — Cleanup.**
- Rewrite or delete the stale `readme.md` (currently describes Hugo, not Jekyll).
- Document the custom theme structure briefly.

## Locked decisions (2026-04-27, revised)

- **Fonts:** macOS system stack only — no web fonts loaded.
  - Serif: `ui-serif, "New York", "Iowan Old Style", "Charter", Cambria, Georgia, serif`
  - Sans: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", "Helvetica Neue", "Segoe UI", system-ui, sans-serif`
  - Mono: `ui-monospace, "SF Mono", Menlo, "Cascadia Mono", Consolas, monospace`
  - Rationale: native everywhere (SF on Apple, Segoe on Windows), zero network cost, no FOUT.
- **Palette:** warm dark only for v1.
  - bg `#1A1612` · surface `#221D18` · ink `#E8DDC9` · ink-soft `#C7BBA6` · muted `#8E8273` · rule `#342D24` · accent `#D88A4A` (warm amber/rust).
- **Signature:** monogram (dash/diamond/dash SVG) + drop cap on first post paragraph.
- **Comments:** stay off.
- **Read-time:** keep, in mono next to the date.

## Still TBD

- Optional light-mode toggle (deferred to v2).
- Final monogram glyph design — current version is a placeholder dash-diamond-dash.
