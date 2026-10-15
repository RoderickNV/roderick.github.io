# Analytics setup for robertroderick.com

The site uses **Vercel Web Analytics**. `admin.robertroderick.com` is a
shortcut that forwards to the analytics dashboard in Vercel. The dashboard
needs a Vercel login, so it stays private.

## What you get

| Goal | Where to find it | Notes |
| --- | --- | --- |
| Visitors per day, by hour | Analytics → set range to "Last 24 hours" | The chart switches to hourly |
| Visitors per month | Analytics → "Last 30 days" or a custom range | |
| Views per page | Analytics → "Pages" panel | |
| Time spent per page | Not available | Vercel Web Analytics doesn't measure time on page |
| Links clicked | Analytics → "Events" panel | Needs the Vercel **Pro** plan (custom events) |

## Steps

### 1. Turn on Web Analytics (Vercel dashboard)

1. Open https://vercel.com/rob-9799s-projects/robertroderick/analytics
2. Click **Enable**.

### 2. Add the tracking code to the site (your computer)

1. Open the project folder that has `build.js`.
2. Find the shared page template (the part that writes `</body>` for every page).
3. Paste the contents of [`snippet.html`](snippet.html) just before `</body>`.
4. Run your build as usual.

### 3. Add the admin redirect (same project folder)

1. Open `vercel.json`.
2. Inside the `"redirects": [ ... ]` list, add the rule from
   [`admin-redirect.json`](admin-redirect.json). Put a comma between it and the
   existing rules.

### 4. Deploy

Deploy the site the way you normally do (e.g. `vercel --prod`).

### 5. Connect admin.robertroderick.com

**In Vercel:**

1. Open https://vercel.com/rob-9799s-projects/robertroderick/settings/domains
2. Click **Add Domain**, type `admin.robertroderick.com`, and save.

**In GoDaddy** (where the DNS for robertroderick.com lives):

1. Go to My Products → robertroderick.com → **DNS**.
2. Click **Add New Record** and enter:
   - Type: `CNAME`
   - Name: `admin`
   - Value: `cname.vercel-dns.com`
   - TTL: default
3. Save. It can take from a few minutes up to an hour to start working.

### 6. Check it works

1. Visit https://robertroderick.com and click around a few pages.
2. Visit https://admin.robertroderick.com. It should open the Vercel analytics page.
3. Data shows up within a few minutes.
