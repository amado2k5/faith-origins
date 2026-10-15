# Search engine submission checklist (origins.faith)

Do these once, after the SEO pass is merged and the `Build and publish origins.faith` workflow has deployed it.
Check first that the files are live: `curl -I https://origins.faith/sitemap.xml` and `curl https://origins.faith/6877cc0a6d974df5ba767efff92ed177.txt` should both answer 200.

## Files to give the consoles

| What | URL |
|---|---|
| Sitemap (all 54 pages, with Arabic/English alternates) | https://origins.faith/sitemap.xml |
| robots.txt (points to the sitemap) | https://origins.faith/robots.txt |
| IndexNow key file | https://origins.faith/6877cc0a6d974df5ba767efff92ed177.txt |
| llms.txt (summary and page map for AI tools) | https://origins.faith/llms.txt |

## Consoles

Each one needs the owner to sign in and prove ownership of origins.faith (a DNS TXT record works for all of them; the
site is on GitHub Pages, so an HTML-file proof means committing the file to `site/`).

- [ ] **Google Search Console** (https://search.google.com/search-console): add a Domain property for origins.faith (DNS TXT),
      Sitemaps > submit `sitemap.xml`. Then URL Inspection > Request indexing for the home pages and a few sections below.
- [ ] **Bing Webmaster Tools** (https://www.bing.com/webmasters): add the site (or import it from Google Search Console),
      Sitemaps > submit the sitemap URL. IndexNow pings from the workflow reach Bing once the key file is live.
- [ ] **Yandex Webmaster** (https://webmaster.yandex.com): add the site, verify, Indexing > Sitemap files > add the sitemap.
      Yandex also accepts IndexNow.
- [ ] **Naver Search Advisor** (https://searchadvisor.naver.com): add the site, verify, Requests > Submit sitemap.
      Naver also accepts IndexNow.
- [ ] **Baidu Ziyuan** (https://ziyuan.baidu.com): add the site (needs a Baidu account; verification by file, meta tag or CNAME),
      then Resources > Sitemap. Pages carry `<meta name="keywords">` in their language for Baidu.

## IndexNow

`tools/indexnow.py` sends the URLs to https://api.indexnow.org/indexnow (shared by Bing, Yandex, Naver, Seznam and others).
The `indexnow` job in `.github/workflows/pages.yml` runs it after every deploy from `main`, sending only the pages whose
sources changed (`--since` the previous commit); it cannot fail a deploy. To send every page by hand after the first deploy:

```bash
python tools/build.py && python tools/indexnow.py            # or --dry-run to see the request
```

## New URLs to request indexing for

Homes and indexes:

- https://origins.faith/
- https://origins.faith/en/
- https://origins.faith/book/
- https://origins.faith/en/book/
- https://origins.faith/author/
- https://origins.faith/en/author/
- https://origins.faith/books/
- https://origins.faith/en/books/

Sections, Arabic original:

- https://origins.faith/book/epigraph-and-preface/
- https://origins.faith/book/introduction/
- https://origins.faith/book/judaism-origins-and-development/
- https://origins.faith/book/israelites-in-egypt/
- https://origins.faith/book/israelites-in-sinai/
- https://origins.faith/book/israelites-in-palestine/
- https://origins.faith/book/jewish-sacred-books/
- https://origins.faith/book/jewish-beliefs/
- https://origins.faith/book/jewish-sects/
- https://origins.faith/book/jewish-ethics/
- https://origins.faith/book/alteration-of-jewish-scriptures/
- https://origins.faith/book/christianity-origins-and-development/
- https://origins.faith/book/what-is-christianity/
- https://origins.faith/book/disciples-and-apostles/
- https://origins.faith/book/christian-books/
- https://origins.faith/book/christian-sects/
- https://origins.faith/book/christianity-as-the-church-formulated-it/
- https://origins.faith/book/gospel-of-barnabas/
- https://origins.faith/book/islam-historical-introduction/
- https://origins.faith/book/the-quran/
- https://origins.faith/book/islamic-sects/
- https://origins.faith/book/conclusion/
- https://origins.faith/book/references/

Sections, English translation:

- https://origins.faith/en/book/epigraph-and-preface/
- https://origins.faith/en/book/introduction/
- https://origins.faith/en/book/judaism-origins-and-development/
- https://origins.faith/en/book/israelites-in-egypt/
- https://origins.faith/en/book/israelites-in-sinai/
- https://origins.faith/en/book/israelites-in-palestine/
- https://origins.faith/en/book/jewish-sacred-books/
- https://origins.faith/en/book/jewish-beliefs/
- https://origins.faith/en/book/jewish-sects/
- https://origins.faith/en/book/jewish-ethics/
- https://origins.faith/en/book/alteration-of-jewish-scriptures/
- https://origins.faith/en/book/christianity-origins-and-development/
- https://origins.faith/en/book/what-is-christianity/
- https://origins.faith/en/book/disciples-and-apostles/
- https://origins.faith/en/book/christian-books/
- https://origins.faith/en/book/christian-sects/
- https://origins.faith/en/book/christianity-as-the-church-formulated-it/
- https://origins.faith/en/book/gospel-of-barnabas/
- https://origins.faith/en/book/islam-historical-introduction/
- https://origins.faith/en/book/the-quran/
- https://origins.faith/en/book/islamic-sects/
- https://origins.faith/en/book/conclusion/
- https://origins.faith/en/book/references/

Google limits manual requests per day; the sitemap covers the rest. The old hash links (`/#/read/...`) keep working and
are not indexed separately.
