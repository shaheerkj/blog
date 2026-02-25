# Blog Site Project Guide

## Project Layout

```
blog-site/
├── hugo.toml          ← Main site configuration (theme, title, params)
├── config.toml        ← Legacy config (ignored by Hugo 0.110+, can delete)
├── archetypes/        ← Templates for new content (hugo new content ...)
│   └── default.md
├── content/           ← ALL your blog posts and pages live here
│   ├── _index.md      ← Homepage content
│   └── posts/         ← Your blog section
│       ├── _index.md  ← Section list page (controls how posts are listed)
│       └── *.md       ← Individual blog posts
├── layouts/           ← Override theme templates here
├── assets/            ← Override theme CSS/JS here
├── static/            ← Static files: images, PDFs, favicons, etc.
├── data/              ← Data files (JSON/YAML/TOML) for use in templates
├── i18n/              ← Translation string overrides
├── resources/         ← Hugo's build cache (auto-generated, don't edit)
├── public/            ← Built site output (auto-generated, don't edit)
└── themes/
    └── hugo-brewm/    ← The theme (NEVER edit files here directly)
```

---

## What Each Folder Does

### `hugo.toml`
The main configuration file. Controls everything: site title, description, theme selection, author info, fonts, features, menus, and more. This is where most non-content customizations happen.

### `content/`
Where all your written content lives. Each `.md` file is a page. Subfolders become "sections" (e.g., `content/posts/` is the "posts" section).

- `_index.md` in any folder controls that section's list page.
- `content/_index.md` is your homepage.

### `layouts/`
Override any theme template by placing a file with the same relative path here. Your version takes priority over the theme's version. This is how you customize HTML structure without touching the theme.

### `assets/`
Override theme CSS or JS files. For example, `assets/css/custom.css` replaces the theme's `custom.css`.

### `static/`
Files placed here are copied as-is to the built site root. Use for images, downloadable files, favicons, etc.
- `static/images/photo.jpg` → accessible at `/images/photo.jpg`

### `data/`
Structured data files (JSON, YAML, TOML) that can be accessed by templates. Useful for things like lists, galleries, or repeated data.

### `archetypes/`
Templates used when you run `hugo new content`. The `default.md` archetype is used unless a section-specific one exists.

### `i18n/`
Override or add translation strings. Useful if you want to change labels the theme uses (like "Read More", "Share", etc.).

### `themes/hugo-brewm/`
The theme itself, pulled in as a Git submodule. **Never edit files here directly** — updates will overwrite your changes. Always override by creating files in your project root with matching paths.

---

## Common Customizations

### Change Site Title, Description, Author
Edit `hugo.toml`:
```toml
title = 'My Blog'

[params]
  title = "My Blog"
  description = "A personal blog about tech and life"
  copyright = "Copyright 2026 © Your Name"

  [params.author]
    name = 'Your Name'
    email = 'you@example.com'
```

### Write a New Blog Post
Create a file in `content/posts/` with this format:

```markdown
---
title: "My Post Title"
date: 2026-02-25
draft: false
author: "Your Name"
type: post
tags: ["tag1", "tag2"]
categories: ["category1"]
description: "A short summary of the post"
cover: "/images/my-cover.jpg"
alt: "Description of the cover image"
---

Your blog content here in Markdown.

## A Heading

Some text, **bold**, *italic*, [a link](https://example.com).
```

Or use the CLI to auto-generate from the archetype:
```sh
hugo new content posts/my-post.md
```

**Important:** Set `draft: false` to publish. Drafts are hidden unless you run `hugo serve -D`.

### Front Matter Fields Reference

| Field         | Purpose                                                      |
|---------------|--------------------------------------------------------------|
| `title`       | Post title                                                   |
| `date`        | Publication date (YYYY-MM-DD)                                |
| `draft`       | `true` = hidden, `false` = published                         |
| `description` | Summary/excerpt shown in listings and social cards           |
| `author`      | Author name (string or list like `['Name']`)                 |
| `type`        | Use `post` for blog entries                                  |
| `tags`        | Tags for the post (taxonomy)                                 |
| `categories`  | Categories for the post (taxonomy)                           |
| `cover`       | URL or path to a cover image                                 |
| `alt`         | Alt text for the cover image                                 |
| `stage`       | Content maturity: `seedling`, `budding`, `evergreen`         |
| `comments`    | `false` to disable comments on this post                     |
| `secnum`      | `true` to enable section numbering                           |
| `coffee`      | Coffee metric number (if `coffeeStat` is enabled)            |

### Edit the Homepage
Edit `content/_index.md`. The front matter can include a `cover` image.

### Add Navigation Menu Links
Add to `hugo.toml`:
```toml
[[menus.main]]
  name = 'Home'
  url = '/'
  weight = 1

[[menus.main]]
  name = 'Posts'
  url = '/posts/'
  weight = 2

[[menus.main]]
  name = 'About'
  url = '/about/'
  weight = 3
```

### Customize CSS (Colors, Fonts, Spacing)
Create `assets/css/custom.css` in your project root. This overrides the theme's `custom.css`. You can add any CSS rules here — they won't be lost when the theme updates.

### Change Fonts
Edit `hugo.toml`:
```toml
[params.typeface]
  webSafe = false
  roman = 'crimson'       # Options: 'Cormorant', 'EB Garamond', 'crimson'
  sans = 'inter'          # Options: 'Inter', 'Montserrat', 'Rosario', 'Lexica Ultralegible'
  localHost = true        # Host fonts locally instead of from GitHub
  minimalUI = true        # Reduce icon subset (saves ~15KB)
```

### Override Theme Templates (Header, Footer, etc.)
Copy the file from the theme into your `layouts/` folder with the **same path**:

| Customization   | Theme path                                          | Your override path                    |
|-----------------|-----------------------------------------------------|---------------------------------------|
| Header          | `themes/hugo-brewm/layouts/partials/header.html`    | `layouts/partials/header.html`        |
| Footer          | `themes/hugo-brewm/layouts/partials/footer.html`    | `layouts/partials/footer.html`        |
| Navigation      | `themes/hugo-brewm/layouts/partials/nav.html`       | `layouts/partials/nav.html`           |
| Menu            | `themes/hugo-brewm/layouts/partials/menu.html`      | `layouts/partials/menu.html`          |
| Head (meta)     | `themes/hugo-brewm/layouts/partials/head.html`      | `layouts/partials/head.html`          |
| Single post     | `themes/hugo-brewm/layouts/_default/single.html`    | `layouts/_default/single.html`        |
| Post list       | `themes/hugo-brewm/layouts/_default/list.html`      | `layouts/_default/list.html`          |
| Base layout     | `themes/hugo-brewm/layouts/_default/baseof.html`    | `layouts/_default/baseof.html`        |
| 404 page        | `themes/hugo-brewm/layouts/404.html`                | `layouts/404.html`                    |

### Add Analytics
Create `layouts/partials/analytics.html` and paste your tracking script. Then set where it loads in `hugo.toml`:
```toml
[params.analytics]
  append = 'body'   # or 'head'
```

### Enable Search (PageFind)
In `hugo.toml`:
```toml
[params.search]
  enable = true
  pagefind = true
```
Then after building, index your site:
```sh
npx pagefind --site "public"
```

### Add a Favicon
Place your favicon files in `static/` and configure in `hugo.toml`:
```toml
[params.favicon]
  png = '/favicon-96x96.png'
  svg = '/favicon.svg'
  ico = '/favicon.ico'
  apple = '/apple-touch-icon.png'
```

### Enable Comments (Giscus)
```toml
[params.comments]
  disabled = false

[params.giscus]
  repo = "username/repository"
  repoID = "R_xxx"
  category = "Comments"
  categoryID = "DIC_xxx"
  mapping = "og:title"
  reactionsEnabled = "1"
  theme = "light"
  loading = "lazy"
```

### Post Display Options
```toml
[params.posts]
  justifying = false       # Text justification
  noIndent = false          # Disable paragraph indentation
  sfdefault = false         # Use sans-serif as default body font
  colophon = true           # Show QR code section at end of posts
  disableHistory = false    # Show redaction/edit history
  related = true            # Show related posts
  share = true              # Show share buttons
  secnum = false            # Section numbering
```

### Zen Mode (Minimal Layout)
```toml
[params]
  ZenMode = true   # Disables breadcrumbs, share buttons, related posts, colophon, redaction history
```

### Configure Taxonomy
```toml
[taxonomies]
  category = 'categories'
  tag = 'tags'
  author = 'author'
  # series = 'series'       # Uncomment to enable series taxonomy
```

---

## Running the Site

### Start the dev server
```sh
hugo serve --minify --gc
```
Then visit `http://localhost:1313`.

### Build for production
```sh
hugo --minify --gc
```
Output goes to `public/`.

### Update the theme
```sh
git submodule update --remote --merge themes/hugo-brewm
```

### Clear build cache (if layouts seem stuck)
```sh
hugo mod clean
```

---

## Key Rule

**Never edit files inside `themes/hugo-brewm/`.** Always override by creating the same file path in your project root. This way you can update the theme freely without losing your customizations.
