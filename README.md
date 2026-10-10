# origins.faith

A memorial site for **Dr. Hamdy Abdel Aal** (حمدي عبد العال, 1934–1990), a professor at the Faculty of Sharia, Kuwait University, and a reader for his books, starting with
*الملة والنحلة في اليهودية والمسيحية والإسلام* (Dar al-Qalam, Kuwait, 1989). Live at https://origins.faith.

Read it by chapter, search the whole text (vowel marks and alef/hamza/ta-marbuta spellings are ignored), and jump to
quotations in context. The site opens in Arabic; the **EN** button switches the interface to English, and the reader can show the
Arabic original, the English translation, or both side by side.

## How it works

Plain static site, no framework, no tracking. GitHub Actions builds `site/data/*.json` from `book/` and publishes `site/`
to GitHub Pages on every push to `main` (`.github/workflows/pages.yml`).

| Path | What it is |
|---|---|
| `book/al-milla-wal-nihla.md` | The book text, one `{n}-----` marker per printed page (page numbers match the printed book) |
| `book/al-milla-wal-nihla.en.md` | The English translation, same page markers. Made by Claude (Opus) following `book/translation-guide.md`; not reviewed by a human translator |
| `book/translation-guide.md` | Style rules and glossary the translation follows |
| `book/corrections.json` | Hand corrections to the OCR text, applied at build time |
| `book/toc.json` | Chapters and sections, with page ranges |
| `book/author.json` | The author's dates (provided by his family), shown on the home and author pages |
| `book/works.json` | His known books (title, year, edition, publisher, library and catalogue links) shown on the Books and Author pages |
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

## Improving the English

Edit `book/al-milla-wal-nihla.en.md` (keep the `{n}-----` page markers) and open a pull request. The build checks that every Arabic page has
English text. Qur'anic verses in the translation are the model's own rendering, not a published translation, and are worth a
human pass first. Reader pages have a "Report a typo" link for errors in either language.

## Adding another book

Add its Markdown (with `{n}-----` page markers), sections and quotes under `book/`, and extend `tools/build.py` and the
reader to take a book id. The site currently holds one book.
