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
const STAMP = process.env.ASSET_STAMP || "20261015152133";
const PAGES = [
  "index.html", "life.html", "work.html", "about.html", "contact.html", "404.html",
  "blog/index.html", "blog/hello-from-lake-tahoe.html",
  "blog/2026-fantasy-football-update-for-my-loser-friends.html",
];
const SNIPPET = fs.readFileSync("tools/analytics-snippet.html", "utf8");

async function main() {
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
