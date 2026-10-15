#!/usr/bin/env python3
"""Add Vercel Web Analytics tracking to a built copy of robertroderick.com.

Usage:  python3 add-tracking.py <site folder>

What it does:
  1. Inserts analytics/snippet.html just before </body> in every .html/.htm
     page under the folder (skips pages that already have it, so it is safe
     to run twice).
  2. Adds the admin.robertroderick.com redirect from admin-redirect.json to
     the folder's vercel.json (creates the file if missing; replaces the rule
     if an older version of it is there).
It only changes regular files inside the folder you point it at (symbolic
links are skipped). Exit code 0 when everything was processed, 1 otherwise.
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
MARKER = '<script defer src="/_vercel/insights/script.js"></script>'  # exact line from snippet.html
BODY_END = re.compile(r"</body\s*>", re.IGNORECASE)
DOC_END = re.compile(r"</body\s*>\s*</html\s*>", re.IGNORECASE)
SKIP_DIRS = {"node_modules", ".git"}


def insertion_point(html: str):
    """Offset of the </body> that closes the document, or None.

    Prefer the last </body> directly followed by </html>; otherwise the last </body>.
    """
    last = None
    for last in DOC_END.finditer(html):
        pass
    if last is None:
        for last in BODY_END.finditer(html):
            pass
    return last.start() if last else None


def same_rule(a: dict, b: dict) -> bool:
    return a.get("source") == b.get("source") and a.get("has") == b.get("has")


def load_config(cfg_path: Path):
    """Return (config dict, error message)."""
    if not cfg_path.exists():
        return {}, None
    if cfg_path.is_symlink() or not cfg_path.is_file():
        return None, f"{cfg_path} is not a regular file"
    try:
        cfg = json.loads(cfg_path.read_bytes().decode("utf-8-sig"))
    except (UnicodeDecodeError, json.JSONDecodeError, OSError) as e:
        return None, f"{cfg_path}: {e}"
    if not isinstance(cfg, dict) or not isinstance(cfg.get("redirects", []), list):
        return None, f"{cfg_path}: expected a JSON object with a 'redirects' list"
    return cfg, None


def main(site_dir: str) -> int:
    root = Path(site_dir).resolve()
    if not root.is_dir():
        print(f"error: {root} is not a folder")
        return 1

    snippet = (HERE / "snippet.html").read_text(encoding="utf-8").strip() + "\n"
    rule = json.loads((HERE / "admin-redirect.json").read_text(encoding="utf-8"))
    if MARKER not in snippet:
        print("error: snippet.html no longer contains the expected script tag")
        return 1

    # Check vercel.json first, so a broken config stops the run before any page changes.
    cfg_path = root / "vercel.json"
    cfg, err = load_config(cfg_path)
    if err:
        print(f"error: {err}")
        return 1

    # 1. pages
    added, skipped, no_body, failed = [], [], [], []
    pages = sorted(p for p in root.rglob("*") if p.suffix.lower() in {".html", ".htm"})
    for page in pages:
        if SKIP_DIRS & set(page.relative_to(root).parts) or page.is_symlink() or not page.is_file():
            continue
        try:
            html = page.read_bytes().decode("utf-8")
            if MARKER in html:
                skipped.append(page)
                continue
            idx = insertion_point(html)
            if idx is None:
                no_body.append(page)
                continue
            page.write_bytes((html[:idx] + snippet + html[idx:]).encode("utf-8"))
            added.append(page)
        except (UnicodeDecodeError, OSError) as e:
            failed.append((page, e))

    # 2. vercel.json
    redirects = cfg.setdefault("redirects", [])
    existing = [i for i, r in enumerate(redirects) if isinstance(r, dict) and same_rule(r, rule)]
    if existing and redirects[existing[0]] == rule:
        rule_status = "already present"
    else:
        for i in reversed(existing):
            del redirects[i]
        redirects.insert(0, rule)
        rule_status = "updated" if existing else "added"
        try:
            cfg_path.write_bytes((json.dumps(cfg, indent=2) + "\n").encode("utf-8"))
        except OSError as e:
            failed.append((cfg_path, e))
            rule_status = f"NOT written ({e})"

    rel = lambda p: str(p.relative_to(root))  # noqa: E731
    print(f"Tracking added to {len(added)} page(s): " + ", ".join(map(rel, added)))
    if skipped:
        print(f"Already had tracking, left alone: {len(skipped)}: " + ", ".join(map(rel, skipped)))
    if no_body:
        print("WARNING no </body> tag, not changed: " + ", ".join(map(rel, no_body)))
    for p, e in failed:
        print(f"ERROR could not process {rel(p)}: {e}")
    print(f"vercel.json admin redirect: {rule_status}")
    return 1 if failed else 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    sys.exit(main(sys.argv[1]))
