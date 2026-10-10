# origins.faith

A memorial site for **Dr. Hamdy Abdel Aal** (حمدي عبد العال) and a reader for his books, starting with
*الملة والنحلة في اليهودية والمسيحية والإسلام* (Dar al-Qalam, Kuwait, 1989). Live at https://origins.faith.

Read it by chapter, search the whole text (vowel marks and alef/hamza/ta-marbuta spellings are ignored), and jump to
quotations in context. Arabic and English interface; the books are in Arabic.

## How it works

Plain static site, no framework, no tracking. GitHub Actions builds `site/data/*.json` from `book/` and publishes `site/`
to GitHub Pages on every push to `main` (`.github/workflows/pages.yml`).

| Path | What it is |
|---|---|
| `book/al-milla-wal-nihla.md` | The book text, one `{n}-----` marker per printed page (page numbers match the printed book) |
| `book/corrections.json` | Hand corrections to the OCR text, applied at build time |
| `book/toc.json` | Chapters and sections, with page ranges |
| `book/quotes.json` | Quotations shown on the home page. The build fails if one is not found verbatim on its page |
| `tools/build.py` | Turns the above into `site/data/site.json` and `site/data/pages.json` |
| `site/` | The website (`index.html`, `assets/app.js`, `assets/style.css`, fonts, cover) |

```bash
pip install markdown
python tools/build.py
python -m http.server 8765 --directory site     # then open http://localhost:8765
```

## Fixing a typo in the text

The text was extracted by OCR from a scan, so errors remain, especially in Qur'anic verses and footnotes. Either edit
`book/al-milla-wal-nihla.md` directly, or add an entry to `book/corrections.json`. Every page of the reader has a
"Report a typo" link that opens a prefilled GitHub issue.

## Adding another book

Add its Markdown (with `{n}-----` page markers), sections and quotes under `book/`, and extend `tools/build.py` and the
reader to take a book id. The site currently holds one book.
