#!/usr/bin/env python3
"""Tell IndexNow search engines (Bing, Yandex, Naver, Seznam and others) which origins.faith URLs changed.

    python tools/indexnow.py                     # every URL in site/sitemap.xml
    python tools/indexnow.py --since HEAD~1      # only pages whose sources changed since that commit
    python tools/indexnow.py --dry-run           # print what would be sent

The key is the 32-character hex file site/<key>.txt, published at https://origins.faith/<key>.txt. Run it after a deploy,
never before: the engines fetch the key file and the pages. Sends only URLs; no personal data.
"""
import argparse, json, re, subprocess, sys, urllib.error, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
HOST = "origins.faith"
ENDPOINT = "https://api.indexnow.org/indexnow"


def key():
    keys = [p for p in SITE.glob("*.txt") if re.fullmatch(r"[0-9a-f]{32}", p.stem) and p.read_text().strip() == p.stem]
    if len(keys) != 1:
        sys.exit(f"indexnow: expected one key file site/<32 hex>.txt, found {len(keys)}")
    return keys[0].stem


def sitemap_urls():
    path = SITE / "sitemap.xml"
    if not path.exists():
        sys.exit("indexnow: site/sitemap.xml is missing; run tools/build.py first")
    return re.findall(r"<loc>([^<]+)</loc>", path.read_text(encoding="utf-8"))


def changed_urls(since, urls):
    """Book text changes touch the section pages; anything else (data, templates, script) touches every page."""
    out = subprocess.run(["git", "diff", "--name-only", since, "HEAD"], cwd=ROOT, capture_output=True, text=True)
    if out.returncode:
        sys.exit(f"indexnow: git diff failed: {out.stderr.strip()}")
    files = [f for f in out.stdout.split() if f.startswith(("book/", "site/", "tools/"))]
    if not files:
        return []
    text_only = {"book/al-milla-wal-nihla.md": "ar", "book/al-milla-wal-nihla.en.md": "en", "book/corrections.json": "ar"}
    if not all(f in text_only for f in files):
        return urls
    langs = {text_only[f] for f in files}
    pick = []
    for u in urls:
        lang = "en" if "/en/" in u else "ar"
        if "/book/" in u and not u.endswith("/book/") and lang in langs:
            pick.append(u)
    return pick


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--since", help="only URLs affected by commits after this revision")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    k, urls = key(), sitemap_urls()
    if a.since:
        urls = changed_urls(a.since, urls)
    if not urls:
        print("indexnow: nothing changed")
        return
    body = {"host": HOST, "key": k, "keyLocation": f"https://{HOST}/{k}.txt", "urlList": urls[:10000]}
    if a.dry_run:
        print(json.dumps(body, indent=2))
        return
    req = urllib.request.Request(ENDPOINT, data=json.dumps(body).encode(), headers={"Content-Type": "application/json; charset=utf-8"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"indexnow: {r.status} for {len(body['urlList'])} URLs")
    except urllib.error.HTTPError as e:
        # 200 and 202 are success; 403 key not valid yet, 422 URLs not on this host, 429 too many requests.
        sys.exit(f"indexnow: HTTP {e.code} {e.reason}")


if __name__ == "__main__":
    main()
