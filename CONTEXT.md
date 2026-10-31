# robertroderick.com — Context Doc

> **Read this first.** This is the "what and why" doc for Rob Roderick's personal site.
> The "how it's built" details are in [`ENGINEERING.md`](./ENGINEERING.md).
> Last verified against the live site: **October 15, 2026**.

---

## 1. What the site is (in one paragraph)

**robertroderick.com** is Rob Roderick's personal site: his career, his life outside work, and a blog.
It has two jobs:

1. **Own the search results for his name.** When someone Googles "Rob Roderick" or "Robert Roderick",
   this site should be the first result, ahead of other people with the same name.
2. **Point people to Cash Balancer** (cashbalancer.com), Rob's free iOS app that helps young adults get out of debt.

It is a small, fast, static site (plain HTML pages, no app or database), hosted on Vercel.

---

## 2. Who it's for

| Audience | What they want | Where they land |
|---|---|---|
| Recruiters and hiring managers | Career history, impact numbers, patents | `/work`, `/about` |
| Founders, investors, product peers | Who Rob is and what he's building | `/about`, `/work`, Cash Balancer links |
| Friends, the flying and Tahoe community | Photos, flying videos, Lobo | `/life`, `/blog`, YouTube |
| Google and other search engines | Clear signals that this site *is* Rob Roderick | Every page (structured data, titles, image names) |

---

## 3. Positioning and voice

- **Tagline (in the logo):** *Friend . Pilot . Product Leader*
- **One-line bio (used everywhere, keep it identical):**
  "Rob Roderick (Robert Roderick) is a fintech and AI product leader, the founder of Cash Balancer, a pilot, and Lobo's human."
- **Voice:** first person, warm, plain English, a little playful ("Average chef. Makes an excellent PB&J").
  Real numbers over buzzwords ($3.7B, 7M+ alerts, $1.5B+ a year).
- **Motto:** "Work hard & be nice!"
- **Contact method:** LinkedIn messages only (no email address or phone number on the site, on purpose).

### Facts the site currently states (keep these in sync everywhere)

| Fact | Current value |
|---|---|
| Current role | Director of Product Management, **Cleo** (Jun 2026 to now), remote: London & Lake Tahoe |
| Side company | Founder, **Cash Balancer AI** (Jan 2026 to now) |
| Location | Lake Tahoe, Nevada, and the San Francisco Bay Area |
| Education | M.B.A. and B.S. Business Entrepreneurship, University of San Francisco |
| Pilot | Certificated pilot since December 2022 (Cessna 172) |
| Dog | Lobo, Siberian husky, adopted September 2025 |
| Patents | 6 US applications filed March 2026, all pending (numbers are on `/work`) |
| Social profiles | LinkedIn `/in/robroderick`, GitHub `RoderickNV`, Instagram `rob_roderick`, YouTube `@robroderick` |

> **If any of these change** (new job, new title, new city), follow the checklist in
> ENGINEERING.md §8 "When Rob's facts change". The job title lives in several places, including hidden
> structured data that Google reads.

---

## 4. Pages on the site

| URL | Purpose | Notes |
|---|---|---|
| `/` (Home) | Full-screen photo slideshow of Rob around Lake Tahoe | 18 photos, auto-advances every 6 seconds. The logo is the page's main heading. |
| `/work` | Career since 2010, impact stats, 6 patents, education | 14 roles, newest first |
| `/life` | Hobbies, photo grid, YouTube videos, "Things I believe in" | 8 hobby cards, 9 photos, 6 videos shown |
| `/about` | Bio, accolades, patents summary, licenses, education | Main "who is Rob" page for Google |
| `/blog` | List of blog posts | Has an RSS feed at `/feed.xml` |
| `/blog/hello-from-lake-tahoe` | First post (Oct 7, 2026) | Only post so far |
| `/contact` | "Message me on LinkedIn" page | Exists but isn't in the menu (the menu's Contact goes straight to LinkedIn) and isn't in the sitemap |
| 404 page | Friendly "page not found" | Hidden from Google (`noindex`) |

---

## 5. Blog

- **Topics:** flying the Sierra Nevada, snowboarding and skiing, hiking Lake Tahoe with Lobo, and building
  products (Cash Balancer, credit and lending).
- **Format:** short posts, lots of photos, the occasional longer product piece.
  Each post has a hero photo, 1 to 3 more photos with captions, tags, and a location ("Lake Tahoe, Nevada").
- **Cadence:** none set yet. One post so far. (Cash Balancer publishes 2 SEO posts a day automatically;
  this site does **not**, and shouldn't copy that. A personal site is better served by fewer, genuine posts.)
- **Posts published:**

| Date | Title | URL |
|---|---|---|
| 2026-10-07 | Hello from Lake Tahoe | `/blog/hello-from-lake-tahoe` |

> When you publish a post, add a row here. How to publish is in ENGINEERING.md §6.

---

## 6. SEO strategy and status

### The goal
Rank #1 for **"Rob Roderick"** and **"Robert Roderick"**, and show up for Rob plus a topic
(for example "Rob Roderick Cash Balancer", "Rob Roderick pilot", "Rob Roderick Cash App").

### The competition (other people with the same name)
Search results for the name currently include: a finance executive at Kirchner Group, an operations leader
in Las Vegas, a Muzi Chevrolet sales consultant, several obituaries, and an old Crunchbase profile and X account
(@RoboRoderick) that appear to be *this* Rob from earlier in his career.

### What's already done on the site
- Every page has a unique title, description, canonical URL and social-sharing (Open Graph) tags.
- **Structured data** (hidden labels Google reads) tells Google that "Rob Roderick" and "Robert Roderick" are the
  same person, his job, school, and that the LinkedIn, GitHub, Instagram and YouTube profiles are his (`sameAs`).
- Photo file names and descriptions all include "Rob Roderick (Robert Roderick)" plus the place (Lake Tahoe, Sierra Nevada).
- Sitemap with image entries, `robots.txt`, RSS feed, Google Search Console verification tag.
- `www.robertroderick.com` redirects to `robertroderick.com` so Google sees one site, not two.

### Ranking status (snapshot, not Google's official numbers)

| Date | "Robert Roderick" | "Rob Roderick" | "robertroderick.com" | Notes |
|---|---|---|---|---|
| 2026-10-09 | Not in top results | Not in top results (LinkedIn profile is) | Not in top results | Site was ~5 days old; new sites usually take 2 to 8 weeks to appear |

> Official numbers come from **Google Search Console → Performance** (average position per search term).
> Add a new row each time you check.

### Open SEO to-dos
- [ ] **Confirm Google Search Console is set up** for robertroderick.com (the verification tag is on the site; confirm the property exists and is verified).
- [ ] Submit `https://robertroderick.com/sitemap.xml` in Search Console.
- [ ] Use "URL Inspection → Request indexing" for `/`, `/about`, `/work`.
- [ ] Turn on **Vercel Web Analytics** (currently off) to see visitors and which ones came from Google.
- [ ] Make sure LinkedIn, GitHub, Instagram and YouTube all link *back* to robertroderick.com (helps Google connect them).
- [ ] Ask cashbalancer.com to link to robertroderick.com (for example, "Built by Rob Roderick" in its footer or about page).
- [ ] Publish a few more real posts (one or two a month is plenty).
- [ ] Decide whether `/contact` should be in the menu and sitemap, or removed.

---

## 7. Related properties

| Property | What it is | Relationship |
|---|---|---|
| cashbalancer.com | Cash Balancer marketing site (Next.js, Vercel project `cashbalancer-website`, GitHub repo `RoderickNV/cash-balancer`) | Rob's company; linked from `/work` and `/life` |
| Cash Balancer AI (iOS) | App Store ID 6760627227, listed as "Cash Balancer USA" | Rob is the developer |
| YouTube @robroderick | Flying and Tahoe videos, plus a Cash Balancer walkthrough | Embedded as thumbnails on `/life` |
| This GitHub repo (`RoderickNV/roderick.github.io`) | An **old** one-page version of the personal site ("Pilot & Professional") from Feb 2026 | **Not** what's live. It now holds these docs. |

---

## 8. Decisions log

| Date | Decision | Why |
|---|---|---|
| Oct 2026 | Plain static HTML on Vercel, no framework | Fast, cheap, nothing to break, great for SEO |
| Oct 2026 | Use "Rob Roderick (Robert Roderick)" in alt text and bio | Rank for both name forms |
| Oct 2026 | Canonical domain is `robertroderick.com` (no www) | One version of each page for Google |
| Oct 2026 | Contact = LinkedIn only | No spam; no personal email or phone on a public site |
| Oct 2026 | Personal blog stays human-paced (not automated like Cash Balancer) | Authenticity matters more than volume for a personal brand |

---

## 9. Where we left off (update this every session)

**October 30, 2026 (cloud session, from Rob's phone)**
- `/life`: the NYC City Council testimony video (TurboTax Benefit Assist, YouTube `A0NGvuHRIMs`) showed its
  YouTube upload date, **October 30, 2026**. It now shows the day of the hearing, **June 27, 2017** (on the
  video's caption bar: NYC Council Committee on General Welfare, 06/27/2017). Structured data keeps
  `uploadDate` 2026-10-30 and adds `dateCreated` 2017-06-27.
- Deployed from this repo (branch `claude/seo-ranking-cash-balancer-rgbp1v`) through the Vercel API. The build
  now copies the live pages from robertroderick.com first (`tools/live-pages.txt`, each checked against the
  SHA-1 Vercel reports, so a repo deploy can't overwrite newer pages) and then applies the fix (`FIXES` in
  `tools/deploy-build.js`).
- **Done Oct 30 on Rob's computer:** the site folder now has `recorded: "2017-06-27"` on this video in
  `assets/content.js`; `render.js` shows `recorded` when set and `build.js` adds it as `dateCreated`, so the next
  `vercel --prod` from the folder keeps the hearing date.

**Last session: October 15, 2026**
- Wrote this context doc and the engineering doc.
- Found that the site's **source files are not in GitHub**. The build script, blog post sources and content
  file exist only on the computer that ran the last deploy (see ENGINEERING.md §2). **This is the biggest risk
  to fix next:** put the full site folder in a GitHub repo and connect it to Vercel, like Cash Balancer.
- Last production deploy: **October 8, 2026** (Vercel CLI).

**Next up**
1. Move the site source into GitHub (see ENGINEERING.md §10).
2. Finish the SEO to-dos in §6 above (Search Console, analytics).
3. Write blog post #2.
