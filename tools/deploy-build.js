// Build step for a deployment made from this repository (vercel.json runs it).
// The photos and icons are not kept in the repository, so this script
//   1. downloads any listed binary file that is missing from the live site,
//   2. gives the stylesheet and script a fresh version stamp in every page, so
//      browsers drop the cached copy (it is served as immutable), and
//   3. adds the Vercel Web Analytics snippet (tools/analytics-snippet.html) to
//      any page that does not have it yet.
// It then deletes itself from the output (see "buildCommand" in vercel.json).
const fs = require("fs");
const path = require("path");

const SITE = "https://robertroderick.com/";
const STAMP = process.env.ASSET_STAMP || "20261030180000";
const PAGES = [
  "index.html", "life.html", "work.html", "about.html", "contact.html", "404.html",
  "blog/index.html", "blog/hello-from-lake-tahoe.html",
  "blog/2026-fantasy-football-update-for-my-loser-friends.html",
  "blog/2026-fantasy-football-update-week-7.html",
];
const SNIPPET = fs.readFileSync("tools/analytics-snippet.html", "utf8");

// The site folder on Rob's computer can publish newer pages than the copies kept here.
// tools/live-pages.txt lists each page with the SHA-1 Vercel reports for the live file;
// those are downloaded from the live site, checked, and used instead of the copies here.
// A mismatch stops the build, so a deployment can never overwrite a newer live page.
async function mirrorLivePages() {
  const crypto = require("crypto");
  const list = fs.existsSync("tools/live-pages.txt")
    ? fs.readFileSync("tools/live-pages.txt", "utf8").split("\n").filter((l) => l && !l.startsWith("#"))
    : [];
  for (const line of list) {
    const [file, sha] = line.split(/\s+/);
    // Pages are served at clean URLs (/life, /blog); the 404 page answers with status 404.
    const url = SITE + file.replace(/\/?index\.html$/, "").replace(/\.html$/, "");
    const res = await fetch(url);
    if (!res.ok && !(file === "404.html" && res.status === 404)) throw new Error(`${file}: HTTP ${res.status}`);
    const body = Buffer.from(await res.arrayBuffer());
    const got = crypto.createHash("sha1").update(body).digest("hex");
    if (got !== sha) throw new Error(`${file}: live copy changed (sha1 ${got}, expected ${sha}); refresh tools/live-pages.txt`);
    fs.writeFileSync(file, body);
  }
  console.log(`mirrored ${list.length} live pages`);
}

// Small corrections made from this repository, applied after mirroring.
// Each must match exactly once, or the build stops.
const FIXES = [
  {
    // The NYC City Council hearing video shows its YouTube upload date (Oct 30, 2026);
    // show the day of the hearing instead (June 27, 2017, on the video's caption bar).
    file: "life.html",
    from: '<time datetime="2026-10-30">October 30, 2026</time>',
    to: '<time datetime="2017-06-27">June 27, 2017</time>',
  },
  {
    file: "life.html",
    from: '"uploadDate":"2026-10-30","duration":"PT2M27S"',
    to: '"uploadDate":"2026-10-30","dateCreated":"2017-06-27","duration":"PT2M27S"',
  },
];

function applyFixes() {
  for (const fix of FIXES) {
    const html = fs.readFileSync(fix.file, "utf8");
    const count = html.split(fix.from).length - 1;
    if (count !== 1) throw new Error(`${fix.file}: expected 1 match for a fix, found ${count}`);
    fs.writeFileSync(fix.file, html.replace(fix.from, fix.to));
  }
  console.log(`applied ${FIXES.length} fixes`);
}

async function main() {
  await mirrorLivePages();
  applyFixes();
  const list = fs.readFileSync("tools/site-binaries.txt", "utf8").split("\n").filter(Boolean);
  let fetched = 0;
  for (const file of list) {
    if (fs.existsSync(file)) continue;
    const res = await fetch(SITE + file);
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log(`fetched ${file} (${fs.statSync(file).size} bytes)`);
    fetched++;
  }
  let tracked = 0;
  for (const page of PAGES) {
    let html = fs.readFileSync(page, "utf8").replace(/\?v=\d{14}/g, `?v=${STAMP}`);
    if (!html.includes("/_vercel/insights/script.js")) {
      html = html.replace("</body>", SNIPPET + "</body>");
      tracked++;
    }
    fs.writeFileSync(page, html);
  }
  console.log(`done: ${fetched} files fetched, ${PAGES.length} pages stamped with ${STAMP}, analytics added to ${tracked}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
