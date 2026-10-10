#!/usr/bin/env python3
"""Build site/data/{site,pages}.json from book/*. Fails (exit 1) if the quotes, table of contents or pages do not line up.

    pip install markdown && python tools/build.py
"""
import json, re, sys
from pathlib import Path
import markdown

ROOT = Path(__file__).resolve().parent.parent
BOOK = ROOT / "book"
OUT = ROOT / "site" / "data"
DIACRITICS = re.compile(r"[ً-ٰٟـۖ-ۭ]")


def split_pages(text):
    parts = re.split(r"^\{(\d+)\}-+[ \t]*$", text, flags=re.M)
    return {int(parts[i]): parts[i + 1].strip("\n") for i in range(1, len(parts), 2)}


def tidy(s):
    """The 1989 typesetting puts a space before punctuation; modern Arabic does not."""
    s = re.sub(r"[ \t]+([،؛؟.:!])", r"\1", s)
    return re.sub(r"[ \t]{2,}", " ", s)


def flat(s):
    return re.sub(r"\s+", " ", s).strip()


def fail(msg):
    sys.exit(f"build error: {msg}")


def render(md, arabic=True):
    html = markdown.markdown(tidy(md) if arabic else md, extensions=["tables", "sane_lists"])
    html = re.sub(r"<(p|li)>(.*?)</\1>", lambda m: f'<{m[1]} class="ayah">{m[2]}</{m[1]}>' if "﴿" in m[2] else m[0], html, flags=re.S)
    html = re.sub(r"<p>(\(\s*[٠-٩0-9]+\s*\))", r'<p class="fn">\1', html)
    return html


def main():
    pages = split_pages((BOOK / "al-milla-wal-nihla.md").read_text(encoding="utf-8"))
    corr = json.loads((BOOK / "corrections.json").read_text(encoding="utf-8"))
    for key, c in corr.items():
        if key.startswith("_"):
            continue
        n = int(key)
        if "replace" in c:
            pages[n] = c["replace"]
        for line in c.get("remove", []):
            if line not in pages[n]:
                fail(f"correction for page {n}: line not found: {line!r}")
            pages[n] = pages[n].replace(line, "")

    toc = json.loads((BOOK / "toc.json").read_text(encoding="utf-8"))
    covered, prev_end = [], None
    for s in toc:
        if "start" not in s:
            continue
        if prev_end is not None and s["start"] != prev_end + 1:
            fail(f"section {s['id']} starts at {s['start']}, expected {prev_end + 1}")
        prev_end = s["end"]
        covered += range(s["start"], s["end"] + 1)
    missing = [n for n in covered if n not in pages]
    if missing:
        fail(f"pages missing from the book text: {missing}")

    quotes = []
    for q in json.loads((BOOK / "quotes.json").read_text(encoding="utf-8")):
        if flat(q["text"]) not in flat(pages[q["page"]]):
            fail(f"quote not found on page {q['page']}: {q['text'][:40]}…")
        quotes.append({**q, "text": tidy(q["text"])})

    out_pages = {str(n): render(pages[n]) for n in covered if flat(re.sub(r"<[^>]+>", "", render(pages[n])))}
    OUT.mkdir(parents=True, exist_ok=True)
    en_file = BOOK / "al-milla-wal-nihla.en.md"
    (OUT / "pages.json").write_text(json.dumps(out_pages, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (OUT / "site.json").write_text(json.dumps({"toc": toc, "quotes": quotes, "firstPage": covered[0], "lastPage": covered[-1], "hasEnglish": en_file.exists()},
                                              ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    en_note = "no English translation yet"
    if en_file.exists():
        en = split_pages(en_file.read_text(encoding="utf-8"))
        lacking = [n for n in out_pages if int(n) not in en or not flat(en[int(n)])]
        if lacking:
            fail(f"English translation is missing text for pages: {lacking}")
        extra = [n for n in en if str(n) not in out_pages and flat(en[n])]
        if extra:
            fail(f"English translation has text on pages that have no Arabic: {extra}")
        (OUT / "pages-en.json").write_text(json.dumps({n: render(en[int(n)], arabic=False) for n in out_pages},
                                                      ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        en_note = f"{len(out_pages)} English pages"
    elif (OUT / "pages-en.json").exists():
        (OUT / "pages-en.json").unlink()
    print(f"built {len(out_pages)} pages, {len(toc)} toc entries, {len(quotes)} quotes, {en_note}")


if __name__ == "__main__":
    main()
