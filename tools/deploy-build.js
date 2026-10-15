// Build step for a deployment made from this repository (vercel.json runs it).
// The photos and icons are not kept in the repository, so this script
//   1. downloads any listed binary file that is missing from the live site, and
//   2. gives the stylesheet and script a fresh version stamp in every page, so
//      browsers drop the cached copy (it is served as immutable).
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
  for (const page of PAGES) {
    const html = fs.readFileSync(page, "utf8");
    fs.writeFileSync(page, html.replace(/\?v=\d{14}/g, `?v=${STAMP}`));
  }
  console.log(`done: ${fetched} files fetched, ${PAGES.length} pages stamped with ${STAMP}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
