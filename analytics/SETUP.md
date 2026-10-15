# Analytics for robertroderick.com

Goal: `admin.robertroderick.com` opens your site's analytics (visitors by hour,
by month, views per page, links clicked). Built on **Vercel Web Analytics**,
which is free on your current Vercel plan.

## Why a few steps are yours

Claude tried every route from the cloud session and hit three walls that are
permissions, not work:

| Wall | Why Claude can't get past it |
| --- | --- |
| Vercel | The Vercel connection Claude has is **view-only** (every change returns "no permission"). |
| GoDaddy | Your domain's DNS lives at GoDaddy. Claude has no access there. |
| Site code | The live site's code is only on your computer. Vercel's file download tool cuts every file off at 2,000 characters, and the session's network can't reach robertroderick.com. |

Everything else is prepared and tested in this folder.

## Your part (about 10 minutes, once)

### 1. Put the site's code on GitHub (Terminal, 2 min)

Open Terminal in the folder you run `vercel --prod` from (the one that has
`build.js`), then paste these lines one at a time:

```
printf 'node_modules\n.vercel\n' >> .gitignore
git init
git add .
git commit -m "Live site"
git branch -M main
git remote add origin https://github.com/RoderickNV/roderick.github.io.git
git push -u --force origin main
```

- `--force` replaces the old test page in that GitHub repository with your
  real site. Nothing on your live website changes.
- If `git remote add` says "origin already exists", run
  `git remote set-url origin https://github.com/RoderickNV/roderick.github.io.git`
  and then the push line again.
- If git asks you to sign in to GitHub, follow its prompts.

### 2. Three clicks in the Vercel dashboard (3 min)

1. **Turn on analytics:**
   https://vercel.com/rob-9799s-projects/robertroderick/analytics → **Enable**.
2. **Add the admin address:**
   https://vercel.com/rob-9799s-projects/robertroderick/settings/domains →
   **Add** → type `admin.robertroderick.com` → save.
   It will say "Invalid Configuration" until step 3 is done. That's expected.
3. **Connect GitHub so pushes deploy automatically:**
   https://vercel.com/rob-9799s-projects/robertroderick/settings/git →
   **Connect Git Repository** → choose `RoderickNV/roderick.github.io`.
   Production branch: `main`.

### 3. One DNS record in GoDaddy (2 min)

1. GoDaddy → **My Products** → `robertroderick.com` → **DNS**.
2. **Add New Record:**
   - Type: `CNAME`
   - Name: `admin`
   - Value: `cname.vercel-dns.com`
   - TTL: leave the default
3. Save. It can take a few minutes to an hour to go live.

### 4. Tell Claude to finish

Start a new Claude Code session on this repository and say
**"finish the analytics setup"**.

## Claude's part (after your steps)

1. Tidy the repository: remove the old test page and the Jekyll workflow,
   keep `build.js`, `render.js`, `serve.py`, `photos.html`, `assets/content.js`
   and `/posts/` out of the public site (same as your `.vercelignore`).
2. Add the tracking code ([`snippet.html`](snippet.html)) to the page template
   inside `build.js`, so every page, including future posts, is tracked.
3. Add the `admin.robertroderick.com` forwarding rule to `vercel.json`
   (prepared in [`vercel.live.json`](vercel.live.json)).
4. Push. Vercel deploys automatically. Confirm the live site carries the
   tracking and that `admin.robertroderick.com` opens the analytics page.
5. If you want, redo the blog header, post separation and section spacing
   on the real site (the earlier changes were made to the old test page).

From then on, Claude can change the site in any session and it goes live on
push. If you also edit on your computer, run `git pull` first, and push
instead of running `vercel --prod`.

## What you'll be able to see

| Ask | Where | Notes |
| --- | --- | --- |
| Visitors per day, by hour | Analytics → range "Last 24 hours" | Chart switches to hourly |
| Visitors per month | Analytics → "Last 30 days" or a custom range | |
| Views per page | Analytics → "Pages" panel | |
| Time spent per page | Not available | Vercel Web Analytics doesn't measure it |
| Links clicked | Analytics → "Events" panel | Needs the Vercel **Pro** plan (custom events) |

If time-per-page or free link tracking matters, say so: Claude can build a
custom tracker with its own dashboard instead. It needs the same three steps
from you.

## Files in this folder

| File | Purpose |
| --- | --- |
| `snippet.html` | The tracking code (page views + link clicks). |
| `admin-redirect.json` | The `vercel.json` rule that forwards `admin.robertroderick.com` to the analytics page. |
| `vercel.live.json` | Your live site's `vercel.json` with that rule already merged in. |
| `add-tracking.py` | `python3 add-tracking.py <site folder>` adds the snippet to every built page and the rule to `vercel.json`. Safe to run twice. Fallback for when the template can't be edited. |
