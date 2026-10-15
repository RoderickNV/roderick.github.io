#!/usr/bin/env python3
"""Add Vercel Web Analytics tracking to a built copy of robertroderick.com.

Usage:  python3 add-tracking.py <site folder>

What it does:
  1. Inserts analytics/snippet.html just before </body> in every .html page
     under the folder (skips pages that already have it, so it is safe to
     run twice).
  2. Adds the admin.robertroderick.com redirect from admin-redirect.json to
     the folder's vercel.json (creates the file if missing; skips the rule
     if it is already there).
It only changes files inside the folder you point it at.
"""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
MARKER = "/_vercel/insights/script.js"  # present in snippet.html; used to detect pages already done


def main(site_dir: str) -> int:
    root = Path(site_dir).resolve()
    if not root.is_dir():
        print(f"error: {root} is not a folder")
        return 1

    snippet = (HERE / "snippet.html").read_text(encoding="utf-8").strip() + "\n"
    rule = json.loads((HERE / "admin-redirect.json").read_text(encoding="utf-8"))

    # 1. pages
    added, skipped, no_body = [], [], []
    for page in sorted(root.rglob("*.html")):
        if "node_modules" in page.parts or ".git" in page.parts:
            continue
        html = page.read_text(encoding="utf-8")
        if MARKER in html:
            skipped.append(page)
            continue
        idx = html.lower().rfind("</body>")
        if idx == -1:
            no_body.append(page)
            continue
        page.write_text(html[:idx] + snippet + html[idx:], encoding="utf-8")
        added.append(page)

    # 2. vercel.json
    cfg_path = root / "vercel.json"
    cfg = json.loads(cfg_path.read_text(encoding="utf-8")) if cfg_path.exists() else {}
    redirects = cfg.setdefault("redirects", [])
    if rule in redirects:
        rule_status = "already present"
    else:
        redirects.insert(0, rule)
        cfg_path.write_text(json.dumps(cfg, indent=2) + "\n", encoding="utf-8")
        rule_status = "added"

    rel = lambda p: p.relative_to(root)  # noqa: E731
    print(f"Tracking added to {len(added)} page(s): " + ", ".join(str(rel(p)) for p in added))
    if skipped:
        print(f"Already had tracking, left alone: {len(skipped)}: " + ", ".join(str(rel(p)) for p in skipped))
    if no_body:
        print(f"WARNING no </body> tag, not changed: " + ", ".join(str(rel(p)) for p in no_body))
    print(f"vercel.json admin redirect: {rule_status}")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    sys.exit(main(sys.argv[1]))
