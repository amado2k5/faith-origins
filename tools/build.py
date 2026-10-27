#!/usr/bin/env python3
"""Build site/data/{site,pages}.json from book/*, and the pre-rendered pages, sitemap.xml and llms.txt (tools/static_pages.py).
Fails (exit 1) if the quotes, table of contents or pages do not line up.

    pip install markdown && python tools/build.py
"""
import json, re, sys
from pathlib import Path
import markdown

sys.path.insert(0, str(Path(__file__).resolve().parent))
from static_pages import Site  # noqa: E402

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


def build_book(prefix, md, en_md, toc_file, corr_file, quotes_file, out, works_id, full, extra_urls=(), other_books=()):
    """One book: its text, contents and quotes, written to site/<out>/data and its pre-rendered pages under /<prefix>/."""
    pages = split_pages(md.read_text(encoding="utf-8"))
    corr = json.loads(corr_file.read_text(encoding="utf-8")) if corr_file.exists() else {}
    for key, c in corr.items():
        if key.startswith("_"):
            continue
        n = int(key)
        if "replace" in c:
            pages[n] = c["replace"]
        for old, new in c.get("sub", []):
            if old not in pages[n]:
                fail(f"correction for page {n}: text not found: {old!r}")
            pages[n] = pages[n].replace(old, new)
        for line in c.get("remove", []):
            if line not in pages[n]:
                fail(f"correction for page {n}: line not found: {line!r}")
            pages[n] = pages[n].replace(line, "")

    toc = json.loads(toc_file.read_text(encoding="utf-8"))
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
    for q in (json.loads(quotes_file.read_text(encoding="utf-8")) if quotes_file.exists() else []):
        if flat(q["text"]) not in flat(pages[q["page"]]):
            fail(f"quote not found on page {q['page']}: {q['text'][:40]}…")
        quotes.append({**q, "text": tidy(q["text"])})

    works = json.loads((BOOK / "works.json").read_text(encoding="utf-8"))
    author = json.loads((BOOK / "author.json").read_text(encoding="utf-8"))
    for w in works:
        for k in ("id", "ar", "en", "gloss", "year", "publisher", "place", "neelwafurat"):
            if k not in w:
                fail(f"works.json: {w.get('id', '?')} lacks {k}")
    book_work = next(w for w in works if w["id"] == works_id) if works_id else None

    out_pages = {str(n): render(pages[n]) for n in covered if flat(re.sub(r"<[^>]+>", "", render(pages[n])))}
    OUT = out
    OUT.mkdir(parents=True, exist_ok=True)
    en_file = en_md
    (OUT / "pages.json").write_text(json.dumps(out_pages, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (OUT / "site.json").write_text(json.dumps({"toc": toc, "quotes": quotes, "firstPage": covered[0], "lastPage": covered[-1], "hasEnglish": en_file.exists(), "works": works, "author": author},
                                              ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    en_note, out_en = "no English translation yet", None
    if en_file.exists():
        en = split_pages(en_file.read_text(encoding="utf-8"))
        lacking = [n for n in out_pages if int(n) not in en or not flat(en[int(n)])]
        if lacking:
            fail(f"English translation is missing text for pages: {lacking}")
        extra = [n for n in en if str(n) not in out_pages and flat(en[n])]
        if extra:
            fail(f"English translation has text on pages that have no Arabic: {extra}")
        out_en = {n: render(en[int(n)], arabic=False) for n in out_pages}
        (OUT / "pages-en.json").write_text(json.dumps(out_en, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        en_note = f"{len(out_pages)} English pages"
    elif (OUT / "pages-en.json").exists():
        (OUT / "pages-en.json").unlink()
    if out_en is None:
        fail("the pre-rendered pages need the English translation")
    for s in toc:
        if "start" in s and not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", s.get("slug", "")):
            fail(f"toc.json: section {s['id']} needs a lowercase slug for its URL")
    site = Site(ROOT, toc, out_pages, out_en, quotes, works, author, book=book_work, prefix=prefix, full=full,
                src={"ar": md, "en": en_md}, toc_file=toc_file, extra_urls=extra_urls, other_books=other_books)
    n_html = site.build()
    print(f"built /{prefix}/: {len(out_pages)} pages, {len(toc)} toc entries, {len(quotes)} quotes, {en_note}, {n_html} HTML pages" + (" + sitemap.xml + llms.txt" if full else ""))
    return site.urls, {"prefix": prefix, "toc": toc, "work": book_work}


# Books after the first, each in /<folder>/: (folder, text file, works.json id, toc file).
EXTRA_BOOKS = [
    ("book-2", "manhaj-al-salaf", "manhaj"),
    ("book-3", "akhlaq", "akhlaq"),
    ("book-4", "sabaiyyun", "sabaiyyun"),
]


def main():
    extra_urls, other_books = [], []
    for folder, name, works_id in EXTRA_BOOKS:
        urls, info = build_book(folder, BOOK / f"{name}.md", BOOK / f"{name}.en.md", BOOK / f"{name}.toc.json",
                                BOOK / f"{name}.corrections.json", BOOK / f"{name}.quotes.json",
                                ROOT / "site" / folder / "data", works_id, False)
        extra_urls += urls
        other_books.append(info)
    # The first book, al-milla-wal-nihla, at /book/. It also writes the sitemap and llms.txt, which list every book.
    build_book("book", BOOK / "al-milla-wal-nihla.md", BOOK / "al-milla-wal-nihla.en.md", BOOK / "toc.json",
               BOOK / "corrections.json", BOOK / "quotes.json", OUT, "milla", True, extra_urls=extra_urls, other_books=other_books)


if __name__ == "__main__":
    main()
