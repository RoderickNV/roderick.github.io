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
with `vercel --prod`, so a change made in this repository has to be copied into that site
folder before it goes live.

`Roderick site.html`, `Roderick.github.io.html` and `roderick.github.io.html` are an older
test page and are not part of the live site.
