# robertroderick.com — Engineering Doc

> The "how it's built and how to change it" doc. For the "what and why", read [`CONTEXT.md`](./CONTEXT.md).
> Last verified against the live production deployment: **October 15, 2026**.
>
> Legend: ✅ = confirmed from the live site or the Vercel API · ⚠️ = inferred, confirm when you have the source folder.

---

## 1. Quick facts

| Thing | Value |
|---|---|
| Live URL | https://robertroderick.com (canonical, no `www`) |
| Type | Static HTML site, no framework, no server code ✅ |
| Host | Vercel, team `rob-9799s-projects`, project **`robertroderick`** ✅ |
| Vercel project ID | `prj_9jXVyCPBaJOMvu0CSwX63aGEHeaw` (team ID `team_VLlyvadxsmUbwDByqetWJPSR`) ✅ |
| How it's deployed | **Vercel CLI** from a local folder (`source: cli`). **Not** connected to GitHub. ✅ |
| Last production deploy | `dpl_Dcz9P66w6x6C9EDRx2xTq61ndPxL`, Oct 8 2026 ~22:33 UTC ✅ |
| Build step on Vercel | None. Vercel serves the uploaded files as-is (framework: none). ✅ |
| Local build step | `build.js` (Node) generates the HTML pages, sitemap and feed ⚠️ |
| Domain registrar / DNS | GoDaddy (nameservers `ns11/ns12.domaincontrol.com`), A record → Vercel ✅ |
| Analytics | **None turned on** (Vercel Web Analytics is off) ✅ |
| Search Console | Verification meta tag present on every page ✅; property status to confirm |

---

## 2. Where the code lives (read this before changing anything)

**The source of truth is a local folder on Rob's computer, not GitHub.** ✅

The deployment includes a `.vercelignore` file that keeps these working files *off* the public site:

```
# Local-only working files; not part of the public site
photos.html        # ⚠️ local photo picker / preview page
serve.py           # ⚠️ local preview web server (python)
build.js           # generates the site's HTML (main.js says "the pages that build.js writes")
render.js          # ⚠️ HTML templates/helpers used by build.js
assets/content.js  # ⚠️ the site's content data (roles, patents, hobbies, photos, videos, posts list)
posts/             # ⚠️ blog post sources
```

So the deployed files are only the **output**. Anyone without that local folder can still edit the
generated HTML by hand (see §6 and §8 for exact templates), but the next run of `build.js` from the
local folder would **overwrite** those hand edits.

**Rule:** make changes in the local source folder and rebuild. If you must hand-edit the deployed HTML,
also make the same change in the source folder (or get the source into GitHub first; see §10).

---

## 3. Architecture

```
assets/content.js + posts/*  ──►  build.js (+ render.js)  ──►  *.html, blog/*.html, sitemap.xml, feed.xml
                                                                  │
                                         vercel --prod  ◄─────────┘   (uploads the folder; .vercelignore skips the sources)
                                                                  │
                                       Vercel CDN (iad1) ──► robertroderick.com
```

- Every page is a complete, standalone HTML file with the same header, phone menu and footer. ✅
- One stylesheet (`/assets/styles.css`) and one small script (`/assets/main.js`). ✅
- `main.js` does only two things: opens/closes the phone menu, and runs the home-page slideshow
  (6 seconds per photo, lazy-loads the next photo, arrow keys and dots to navigate). ✅
- **Cache-busting:** CSS and JS are linked as `styles.css?v=YYYYMMDDHHMMSS` (currently `v=20261008223259`).
  Those files are cached for a year, so **the `v=` stamp must change whenever `styles.css` or `main.js`
  changes**, or visitors keep the old version. `build.js` stamps it with the build time. ⚠️
- Clean URLs: `about.html` is served at `/about`, `blog/hello-from-lake-tahoe.html` at `/blog/hello-from-lake-tahoe`. ✅

---

## 4. File map (deployed files)

```
/
├── index.html                  Home (slideshow)
├── work.html                   /work
├── life.html                   /life
├── about.html                  /about
├── contact.html                /contact   (not in nav or sitemap)
├── 404.html                    Not-found page (noindex)
├── blog/
│   ├── index.html              /blog
│   └── hello-from-lake-tahoe.html
├── posts/                      (empty on the server; sources are local-only)
├── assets/
│   ├── styles.css              All styling
│   ├── main.js                 Menu + slideshow
│   ├── og.jpg                  Default social share image, 1200×630
│   └── photos/                 Every photo in 3 versions (see §7)
├── sitemap.xml                 Pages + image entries
├── feed.xml                    RSS 2.0 blog feed
├── robots.txt                  Allow all + sitemap link
├── site.webmanifest            App name, theme color #1a56d6, icons
├── favicon.svg, icon-192.png, icon-512.png, apple-touch-icon.png
├── vercel.json                 Redirects + headers (see §5)
└── .vercelignore               Keeps local source files off the server
```

---

## 5. Hosting, domains and config

### Domains on the Vercel project ✅
`robertroderick.com` (primary), `www.robertroderick.com`, `robertroderick.vercel.app`,
`robertroderick-rob-9799s-projects.vercel.app`.

### DNS (at GoDaddy) ✅
- Apex `robertroderick.com` → A record `76.76.21.21` (works; Vercel now *recommends* `216.198.79.1`,
  an optional change).
- Vercel reports the domain as correctly configured (`misconfigured: false`).

### `vercel.json` ✅
- `cleanUrls: true`, `trailingSlash: false`
- **Redirects:** anything on `www.robertroderick.com` → permanent (308) redirect to `https://robertroderick.com/…`
- **Headers:**
  - `/assets/photos/*` → `Cache-Control: public, max-age=2592000` (30 days)
  - `/assets/*.css|js` → `Cache-Control: public, max-age=31536000, immutable` (1 year; hence the `?v=` stamp)
  - Every path → `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
    `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Protection ✅
Vercel SSO protection is on for all deployments **except custom domains**. So `robertroderick.com` is public,
but `*.vercel.app` preview URLs require a Vercel login.

### Design tokens (top of `styles.css`) ✅
| Token | Value | Used for |
|---|---|---|
| `--deep` | `#030817` | Page bottom / darkest |
| `--navy` | `#0a1f4a` | Mid gradient, stat tiles |
| `--blue` | `#134089` | Top of the page gradient |
| `--title` | `#9dbcf0` | h1, dates, labels, links |
| `--text` | `#dbe6fa` | Body text |
| `--white` | `#ffffff` | Headings, buttons |
| Fonts | Montserrat (body, 300/500/700/800) and Roboto Condensed 700 (display), from Google Fonts | |
| Breakpoints | 860px (phone menu, 2 columns) and 520px (1 column) | |

---

## 6. Blog: how to publish a post

### The normal way (with the local source folder) ⚠️
1. Add the post source in `posts/` (match the format of the existing hello-from-lake-tahoe source).
2. Add any new photos to `assets/photos/` in all 3 sizes (§7).
3. Run `node build.js` to regenerate the post page, `/blog`, `feed.xml` and `sitemap.xml`.
4. Preview locally with `python3 serve.py`, then open the printed local address.
5. Deploy with `vercel --prod` (§9).
6. Run the checks in §11, then request indexing for the new URL in Google Search Console.
7. Add the post to the table in CONTEXT.md §5.

### What every post must contain (use this if building by hand) ✅
A post at `/blog/<slug>` is the file `blog/<slug>.html`. Copy `blog/hello-from-lake-tahoe.html` and change:

**In `<head>`:**
- `<title>` → `<Post Title> | Rob Roderick`
- `meta description` and `og:description` → one-sentence summary (same text in both)
- `link rel="canonical"` and `og:url` → `https://robertroderick.com/blog/<slug>`
- `og:type` = `article`, `article:published_time` = `YYYY-MM-DD`
- `og:image` → the hero photo's `.jpg` URL
- Keep the **Person** JSON-LD block unchanged.
- **BlogPosting** JSON-LD: `headline`, `description`, `datePublished`, `dateModified`, `image` (array of every
  photo's `.jpg` URL), `keywords` (the tags, comma-separated), `contentLocation`, `mainEntityOfPage`, `url`;
  `author` and `publisher` stay `{"@id":"https://robertroderick.com/#rob"}`.
- **BreadcrumbList** JSON-LD: Rob Roderick → Blog → Post title.
- Keep `<link rel="alternate" type="application/rss+xml" … href="/feed.xml">`.

**In `<body>` (`class="page-post" data-page="post"`):**
```html
<article class="inner post">
  <header class="post-head">
    <h1>Post Title</h1>
    <p class="post-meta"><time datetime="YYYY-MM-DD">Month D, YYYY</time> · Lake Tahoe, Nevada</p>
  </header>
  <div class="post-body">
    <img class="post-hero" fetchpriority="high" src="/assets/photos/NAME.jpg"
         srcset="/assets/photos/NAME-1200.webp 1200w, /assets/photos/NAME-2000.webp 2000w"
         sizes="(max-width: 760px) 100vw, 48vw" alt="…" title="…">
    <p>Paragraphs…</p>
    <h2 class="left">Subheading</h2>
  </div>
  <div class="post-photos">
    <figure>
      <img src="…jpg" srcset="…-1200.webp 1200w, …-2000.webp 2000w" sizes="(max-width: 760px) 100vw, 50vw"
           alt="…" title="…" loading="lazy" decoding="async">
      <figcaption><b>Caption</b><span>Who's in it</span></figcaption>
    </figure>
  </div>
  <p class="post-tags"><span>Tag</span><span>Tag</span></p>
  <p class="center"><a class="btn" href="/blog">All posts</a></p>
</article>
```

**Then also update (all ✅ current formats):**
1. `blog/index.html`: add a `<a class="post-card">` at the **top** of `.posts`, and add the post to the
   **Blog** JSON-LD `blogPost` array.
2. `feed.xml`: add an `<item>` at the top (`title`, `link`, `guid` = same URL, `pubDate` in RFC 822 such as
   `Wed, 07 Oct 2026 12:00:00 GMT`, `description`).
3. `sitemap.xml`: add a `<url>` with `<loc>`, `<lastmod>`, and one `<image:image>` per photo; bump `/blog`'s `<lastmod>`.

---

## 7. Photos

- **Three files per photo** ✅, all in `assets/photos/`:
  - `NAME.jpg`: original, used in `src`, social images, structured data and the sitemap
  - `NAME-1200.webp` and `NAME-2000.webp`: the versions browsers actually download (`srcset`).
    If the original is narrower than 2000px, the two webp files can be identical (several already are).
- **File names are SEO keywords** ✅: lowercase, hyphens, include the name and the place, for example
  `rob-roderick-hiking-lobo-lake-tahoe`, `robert-roderick-pilot-cessna-taxi`, `lobo-husky-tahoe-rocks`.
  Mix `rob-roderick` and `robert-roderick`.
- **Alt and title text pattern** ✅ (same text in both):
  `Rob Roderick (Robert Roderick) <doing what> <where>`; for Lobo:
  `Lobo, the Siberian husky of Rob Roderick (Robert Roderick), <where>`.
- Add every new page photo to that page's `<url>` in `sitemap.xml` as an `<image:image>`.
- Home slideshow: the first slide uses `src`/`srcset`; later slides use `data-src`/`data-srcset` so they lazy-load.
  Add the matching `<button>` dot (one per slide) and preload only the first image in `<head>`.
- Unused files on the server: `fly-7.*` and `lobo-3.*` aren't referenced by any page (safe to delete or use).

---

## 8. SEO implementation

### Head tags on every page ✅
`title`, `meta description`, `meta robots = index, follow, max-image-preview:large`, `link canonical`,
`meta author = Rob Roderick`, `google-site-verification = onFeBq0H7dNbDWD7gG1qTM3JiGMdviweZ9R0CYrt30g`,
Open Graph (`og:type`, `og:site_name = Rob Roderick`, `og:title`, `og:description`, `og:url`, `og:image`),
`twitter:card = summary_large_image`, icons, manifest, `theme-color #1a56d6`. The 404 page uses `noindex`.

### Titles and descriptions now live ✅
| Page | Title |
|---|---|
| `/` | Rob Roderick \| Product Leader, Pilot, Founder of Cash Balancer |
| `/work` | Rob Roderick \| Work History, Patents & Education |
| `/life` | Rob Roderick \| Flying, Snowboarding, Lobo & Lake Tahoe |
| `/about` | About Rob Roderick \| Product Leader, Founder & Pilot |
| `/blog` | Rob Roderick's Blog \| Lake Tahoe, Flying & Building |
| `/contact` | Contact Rob Roderick |
| post | `<Post title> \| Rob Roderick` |

### Structured data (JSON-LD) by page ✅
| Page | Blocks |
|---|---|
| `/` | `WebSite` (name, alternateName "Robert Roderick") + full `Person` (`@id: https://robertroderick.com/#rob`) |
| `/about` | `Person` + `ProfilePage` (`dateModified`) + `BreadcrumbList` |
| `/work`, `/contact` | `BreadcrumbList` |
| `/life` | `ItemList` of 10 `VideoObject`s (YouTube) + `BreadcrumbList` |
| `/blog` | `Blog` (with `blogPost` list) + `BreadcrumbList` |
| post | `Person` + `BlogPosting` + `BreadcrumbList` |

The **`Person`** block is the most important SEO asset. It contains: `name`, `alternateName`
["Robert Roderick","Rob Roderick"], `image`, `description` (the one-line bio), `jobTitle`, `hasOccupation`,
`worksFor` [Cleo, Cash Balancer], `alumniOf`, `homeLocation`, `knowsAbout`, `sameAs` [LinkedIn, GitHub, Instagram, YouTube].
**It's copied into the home, about and every post page; keep all copies identical.**

### When Rob's facts change (checklist)
New job, title, company or city? Update **all** of these:
1. `/work`: the role entry
2. `/about`: bio paragraph, meta description, `og:description`
3. `Person` JSON-LD `jobTitle` / `worksFor` / `description` on **home, about and every post**
4. Home meta description, if the headline facts changed
5. `ProfilePage.dateModified` on `/about`, and `<lastmod>` in `sitemap.xml`
6. CONTEXT.md §3 facts table
7. Off-site: LinkedIn headline (keep the same wording, so Google sees one consistent person)

### Sitemap, robots and feed ✅
- `sitemap.xml`: `/`, `/work`, `/life`, `/about`, `/blog`, `/blog/hello-from-lake-tahoe`, with `lastmod` and image entries.
  `/contact` is **not** included.
- `robots.txt`: `User-agent: * / Allow: /` + `Sitemap: https://robertroderick.com/sitemap.xml`
- `feed.xml`: RSS 2.0, title "Rob Roderick's Blog"; linked from `/blog` and each post.

---

## 9. Deploy and rollback

### Deploy (from the local site folder) ⚠️ commands, ✅ method
```bash
node build.js          # regenerate HTML, sitemap, feed, ?v= stamp
python3 serve.py       # optional local preview
vercel --prod          # upload + publish to robertroderick.com
```
Needs the Vercel CLI logged in as `rob-9799` with the folder linked to project `robertroderick`
(`vercel link`, which creates a local `.vercel/` folder; never commit it).

### Rollback ✅
Vercel dashboard → project `robertroderick` → **Deployments** → pick the previous good one → **Promote to Production**
(or `vercel rollback`). Recent production deploys:
| Deploy ID | When (UTC) |
|---|---|
| `dpl_Dcz9P66w6x6C9EDRx2xTq61ndPxL` (current) | Oct 8 2026, 22:33 |
| `dpl_9YbjNff6aJtRjbeiUbAQ92axTNak` | Oct 8 2026, 21:45 |
| `dpl_AW2UwSMJHw3qHAW7wP9Scr6zztwm` | Oct 7 2026, 15:31 |

---

## 10. Recommended next step: put the source in GitHub (like Cash Balancer)

Cash Balancer deploys automatically from GitHub (`RoderickNV/cash-balancer` → Vercel on every push to `main`).
This site should work the same way, so any computer or Claude session can pick it up.

1. On the computer with the site folder, create a GitHub repo (for example `RoderickNV/robertroderick-com`) and push
   the **whole** folder, including `build.js`, `render.js`, `assets/content.js`, `posts/`, `serve.py`, `photos.html`.
   Add a `.gitignore` with `.vercel/` and any `node_modules/`.
2. Copy `CONTEXT.md`, `ENGINEERING.md` and `CLAUDE.md` from this repo into it.
3. In Vercel → project `robertroderick` → **Settings → Git** → connect the repo.
   - Set **Build Command** to `node build.js` (or keep the generated files committed and leave it empty).
   - Set **Output Directory** to the folder root (`.`).
4. Push a small change and confirm it auto-deploys. From then on: edit → commit → push = live.
5. Give Claude's GitHub app access to the new repo so cloud sessions can work on it.

---

## 11. After-deploy checks

- [ ] Open `/`, `/work`, `/life`, `/about`, `/blog` and the newest post: all load, photos show, phone menu works.
- [ ] `https://www.robertroderick.com/about` redirects to `https://robertroderick.com/about`.
- [ ] View source on a changed page: correct `title`, `canonical`, `og:url`, and the `?v=` stamp changed if CSS/JS changed.
- [ ] `/sitemap.xml` and `/feed.xml` include anything new.
- [ ] Paste a changed URL into Google's Rich Results Test (search.google.com/test/rich-results); no errors.
- [ ] Search Console → URL Inspection → **Request indexing** for new or changed pages.

---

## 12. Known issues and small fixes

| Issue | Impact | Fix |
|---|---|---|
| Source not in version control | High: a lost laptop loses the build system | §10 |
| No analytics | Can't see visitors or Google traffic | Vercel → project → Analytics → Enable (and add the snippet if prompted) |
| `/contact` is orphaned (not in nav or sitemap) but indexable | Low | Add to sitemap and nav, or delete it |
| On `/contact`, the LinkedIn nav link gets `class="on"` | Cosmetic | Mark nothing active, or point Contact at `/contact` |
| `/life` JSON-LD lists 10 videos but the page shows 6 | Low (Google prefers structured data to match the page) | Show all 10, or trim the JSON-LD to 6 |
| `/blog` uses `og:type = profile` | Cosmetic | Use `website` |
| `fly-7.*`, `lobo-3.*` photos are unused | None | Delete or use |
| Apex A record is `76.76.21.21` | None (still works) | Optionally switch to Vercel's newer `216.198.79.1` |

---

## 13. Tools and access

- **Vercel:** team `rob-9799s-projects`. Claude can read projects, deployments, deployed files, domains and DNS
  through the Vercel connector, and can fetch preview URLs past SSO with `web_fetch_vercel_url`.
- **GitHub:** account `RoderickNV`. This repo (`roderick.github.io`) holds these docs. The site source isn't in any repo yet.
- **Google Search Console:** sign in as the site owner at search.google.com/search-console.
- **GoDaddy:** DNS for robertroderick.com and cashbalancer.com.
- Never commit secrets, the `.vercel/` folder, or personal contact details to a public repo.
