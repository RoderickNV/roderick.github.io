# robertroderick.com

The public files of [robertroderick.com](https://robertroderick.com), as served by the
Vercel project `robertroderick` (copied from the deployment of October 15, 2026 and
checked file by file against Vercel's hashes).

What is here: every page (`index.html`, `life.html`, `work.html`, `about.html`,
`contact.html`, `404.html`, `blog/`), the stylesheet and script (`assets/styles.css`,
`assets/main.js`), `vercel.json`, `feed.xml`, `sitemap.xml`, `robots.txt`, the manifest
and the SVG favicon.

What is not here: the photos (`assets/photos/`, `assets/posts/`), `assets/og.jpg` and the
PNG icons. Those are binary files that live in the site folder on Rob's computer and in
Vercel. The pages are generated there by `build.js` from `assets/content.js` and published
with `vercel --prod`.

Deploying from this repository: `vercel.json` here runs `tools/deploy-build.js` as the
build step. It downloads every file listed in `tools/site-binaries.txt` that is missing
from the live site, stamps the stylesheet and script URLs in each page with a new version,
and removes itself from the output. So a deployment made from these files is complete.
A change made here still has to be copied into the site folder on Rob's computer, or the
next `vercel --prod` from there will publish the older version again.

`Roderick site.html`, `Roderick.github.io.html` and `roderick.github.io.html` are an older
test page and are not part of the live site.
