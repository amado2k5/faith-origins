'use strict';
/* origins.faith: memorial and reading room for the books of Dr. Hamdy Abdel Aal.
   Hash-routed single page: #/ · #/read[/<section>|/p/<page>] · #/search?q= · #/books · #/author */

const REPO = 'https://github.com/amado2k5/faith-origins';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

/* ---------- strings ---------- */
const I18N = {
  ar: {
    skip: 'انتقل إلى المحتوى', navHome: 'الرئيسية', navRead: 'اقرأ', navBooks: 'الكتب', navAuthor: 'المؤلف',
    searchPh: 'ابحث في الكتاب', page: 'ص', pages: 'صفحة',
    footDed: 'تكريماً لذكرى الدكتور حمدي عبد العال (١٩٣٤–١٩٩٠)، أعدّه ابنه لحفظ كتبه وإتاحتها للقرّاء.',
    footNote: 'نصوص الكتب مستخرجة آلياً من نسخ ممسوحة ضوئياً وقد تحتوي على أخطاء. نرحّب بالتصحيح.',
    footHelp: 'ساعدنا في العثور على كتبه',
    footContact: 'للتواصل معنا، راسلونا على',
    scanChip: 'نسخة ممسوحة (أرشيف الإنترنت)',
    orderTitle: 'اطلب كتبه', orderP: 'تعرض مكتبة النيل والفرات كتبه الأربعة طبعات ورقية يمكن طلبها. إن أردت نسختك الخاصة فاطلبها من هناك.', orderBtn: 'اطلب من النيل والفرات',
    kickerHome: 'في ذكرى المؤلف',
    heroDed: 'هذه مكتبة صغيرة لحفظ كتب الدكتور حمدي عبد العال، الذي كان أستاذاً بكلية الشريعة في جامعة الكويت، وإتاحتها للقراءة والبحث.',
    heroName: 'Dr. Hamdy Abdel Aal',
    readBook: 'ابدأ القراءة', searchBook: 'ابحث في الكتاب', continueRead: 'تابع القراءة',
    bookTitle: 'الملة والنحلة في اليهودية والمسيحية والإسلام',
    bookSub: 'اليهودية · المسيحية · الإسلام',
    anotherQuote: 'اقتباس آخر', inContext: 'اقرأ في سياقه',
    quotesTitle: 'من الكتاب', quotesKick: 'اقتباسات',
    unofficial: 'ترجمة غير رسمية',
    aboutKick: 'عن الكتاب', aboutTitle: 'الملة والنحلة',
    aboutP1: 'يفرّق المؤلف بين «الملة»: الدين كما أنزله الله، و«النحلة»: ما ادّعاه الناس لأنفسهم من آراء ومذاهب وفهم شخصي للنصوص. ثم يتتبّع ذلك في الأديان الثلاثة بمنهج تاريخي مقارن.',
    ch1: 'اليهودية', ch2: 'المسيحية', ch3: 'الإسلام',
    ch1d: 'النشأة، والكتب المقدسة، والعقائد، والفرق.', ch2d: 'النشأة، والأناجيل، والمجامع الكنسية، وإنجيل برنابا.', ch3d: 'القرآن الكريم، والخلاف التاريخي، والفرق الإسلامية.',
    helpKick: 'نبحث عن كتبه', helpTitle: 'هل لديك نسخة من أحد كتبه؟',
    helpP: 'نعرف له أربعة كتب، ولا يتوفر منها هنا إلا «الملة والنحلة». نبحث عن نسخ الكتب الثلاثة الأخرى لمسحها ضوئياً ونشرها، وعن أي كتب أو مقالات أخرى له. أي خيط يساعدنا: نسخة، أو صورة غلاف، أو رقم في فهرس مكتبة، أو اسم ناشر.',
    helpBtn: 'أبلغنا عن كتاب', helpBooks: 'الكتب المعروفة',
    h1: ['نسخة ورقية أو ممسوحة من أي كتاب له', 'معلومات عن طبعة أو ناشر أو مكتبة تحتفظ بها', 'ذكريات أو صور أو مقالات عنه'],
    booksTitle: 'كتب الدكتور حمدي عبد العال', booksLead: 'الكتب المتاحة هنا، والكتب التي نبحث عنها.',
    available: 'متاح للقراءة', seeking: 'نبحث عن نسخة',
    publisher: 'الناشر', edition: 'الطبعة', pubPlace: 'دار القلم للنشر والتوزيع، الكويت', ed1: 'الأولى، 1409 هـ / 1989 م',
    moreBooks: 'كتب أخرى', moreBooksMeta: 'ما زال البحث جارياً.',
    readNow: 'اقرأ الآن', report: 'أبلغنا',
    reportTitle: 'أبلغنا عن كتاب للدكتور حمدي عبد العال',
    reportBody: 'اسم الكتاب:\nالناشر والسنة (إن عُرفا):\nأين رأيت الكتاب أو نسخته:\nملاحظات:\n',
    authorTitle: 'الدكتور حمدي عبد العال',
    authorKick: 'المؤلف',
    authorP1: 'الدكتور حمدي عبد العال (١٩٣٤–١٩٩٠) كان أستاذاً بكلية الشريعة في جامعة الكويت. كتب في مقارنة الأديان والفِرق وفي العقيدة والأخلاق، وصدرت كتبه الأربعة المعروفة عن دار القلم في الكويت بين 1984 و1989.',
    authorP2: 'تعتمد هذه الصفحة على ما هو مطبوع في كتبه، وعلى سجلات المكتبات، وعلى ما تعرفه أسرته. سنضيف السيرة والصور والذكريات حين تكتمل.',
    works: 'مؤلفاته المعروفة', factsTitle: 'ما نعرفه',
    fAff: 'الصفة', fAffV: 'كان أستاذاً بكلية الشريعة، جامعة الكويت (كما على غلاف كتبه)',
    fMain: 'أشهر ما وصلنا', fMainV: 'الملة والنحلة في اليهودية والمسيحية والإسلام (1989)',
    fLife: 'الحياة',
    fWorks: 'مؤلفاته المعروفة', fWorksV: 'أربعة كتب صدرت عن دار القلم بالكويت بين 1984 و1989',
    tocTitle: 'المحتويات', toc: 'المحتويات', fontSmaller: 'تصغير الخط', fontLarger: 'تكبير الخط', goto: 'اذهب إلى صفحة',
    prev: 'السابق', next: 'التالي', reportTypo: 'أبلغ عن خطأ', copyLink: 'نسخ الرابط', copied: 'تم النسخ',
    ocrNote: 'النص العربي مستخرج آلياً من نسخة ممسوحة؛ قد تقع أخطاء، خاصة في الآيات والحواشي. إن رأيت خطأً فاضغط «أبلغ عن خطأ» في الصفحة.',
    results: n => `${N(n)} صفحة`, noResults: 'لا توجد نتائج. جرّب كلمة أقصر أو بدون تشكيل.',
    searchHint: 'ابحث بكلمة أو أكثر. لا يُشترط التشكيل، ولا التفريق بين الهمزات والألف. يمكنك أيضاً البحث بالإنجليزية في الترجمة.',
    libTitle: 'استعِر الكتب من المكتبات', libP: 'كتبه الثلاثة الأخرى ليست على الإنترنت بعد، لكنها مفهرسة في المكتبات. تذكر فهرسة مكتبات جامعة تورنتو الكتب الأربعة كلها. ويبحث رابط WorldCat عن المكتبات الأخرى.',
    uoft: 'جامعة تورنتو', worldcat: 'WorldCat', neel: 'النيل والفرات', pubPage: 'صفحة الناشر', alsoHeld: 'توجد أيضاً في', topicsFrom: 'من فهرس الناشر', pubListing: 'قائمة الناشر لكتبه', notOnline: 'ليس على الإنترنت بعد', heldBy: 'في مكتبات جامعة تورنتو', ed: 'ط', pp: 'ص', year: 'السنة', allUofT: 'كل كتبه في مكتبات تورنتو',
    modeAr: 'العربية', modeEn: 'English', modeBoth: 'الاثنان', textLang: 'لغة النص',
    trNote: 'الترجمة الإنجليزية أنجزها Claude (نموذج ذكاء اصطناعي من Anthropic) ولم يراجعها مترجم بشري. وترجمة الآيات القرآنية من النموذج نفسه وليست من ترجمة منشورة.',
    authorNote: 'الآراء الواردة في الكتاب آراء المؤلف.',
    tryThese: 'جرّب:', all: 'الكل', more: 'المزيد', resultsFor: q => `نتائج البحث عن «${q}»`,
    themeLight: 'فاتح', themeSepia: 'ورقي', themeDark: 'داكن',
    loadError: 'تعذّر تحميل الكتاب. حدّث الصفحة وحاول مرة أخرى.',
    groups: { front: 'المقدمة', ch1: 'اليهودية', ch2: 'المسيحية', ch3: 'الإسلام', back: 'الخاتمة والمراجع' },
    langBtn: 'EN',
  },
  en: {
    skip: 'Skip to content', navHome: 'Home', navRead: 'Read', navBooks: 'Books', navAuthor: 'Author',
    searchPh: 'Search the book', page: 'p.', pages: 'pages',
    footDed: 'In memory of Dr. Hamdy Abdel Aal (1934–1990). His son built this site to preserve his books and make them readable.',
    footNote: 'Book texts are machine-extracted from scans and may contain errors. Corrections are welcome.',
    footHelp: 'Help find his books',
    footContact: 'To contact us, please email',
    scanChip: 'Scan (Internet Archive)',
    orderTitle: 'Order his books', orderP: 'Neelwafurat lists all four of his books as paperbacks you can order. If you would like your own copy, you can order it there.', orderBtn: 'Order on Neelwafurat',
    kickerHome: 'In memory of the author',
    heroDed: 'A small library preserving the books of Dr. Hamdy Abdel Aal, who was a professor at the Faculty of Sharia, Kuwait University, and making them readable and searchable.',
    heroName: 'حمدي عبد العال',
    readBook: 'Start reading', searchBook: 'Search the book', continueRead: 'Continue reading',
    bookTitle: 'Al-Milla wa al-Nihla: Judaism, Christianity, Islam',
    bookSub: 'الملة والنحلة في اليهودية والمسيحية والإسلام',
    anotherQuote: 'Another quote', inContext: 'Read in context',
    quotesTitle: 'From the book', quotesKick: 'Quotations',
    unofficial: 'Unofficial translation',
    aboutKick: 'About the book', aboutTitle: 'Milla and Nihla',
    aboutP1: 'The author distinguishes the milla, religion as God revealed it, from the nihla, what people claim for themselves: opinions, schools and personal readings of the texts. He then follows that distinction through the three religions using a historical, comparative method.',
    ch1: 'Judaism', ch2: 'Christianity', ch3: 'Islam',
    ch1d: 'Origins, sacred books, beliefs and sects.', ch2d: 'Origins, the Gospels, the church councils, the Gospel of Barnabas.', ch3d: 'The Qur’an, the early disputes, and the Islamic sects.',
    helpKick: 'We are searching', helpTitle: 'Do you have a copy of one of his books?',
    helpP: 'We know of four books, and only Al-Milla wa al-Nihla is readable here. We are looking for copies of the other three to scan and publish, and for anything else he wrote. Any lead helps: a copy, a photo of a cover, a library catalogue number, a publisher’s name.',
    helpBtn: 'Tell us about a book', helpBooks: 'Known books',
    h1: ['A paper or scanned copy of any of his books', 'Details of an edition, publisher or library that holds one', 'Memories, photographs or articles about him'],
    booksTitle: 'The books of Dr. Hamdy Abdel Aal', booksLead: 'What is available here, and what we are still looking for.',
    available: 'Available to read', seeking: 'Seeking a copy',
    publisher: 'Publisher', edition: 'Edition', pubPlace: 'Dar al-Qalam, Kuwait', ed1: 'First, 1409 AH / 1989',
    moreBooks: 'Other books', moreBooksMeta: 'The search continues.',
    readNow: 'Read now', report: 'Tell us',
    reportTitle: 'A book by Dr. Hamdy Abdel Aal',
    reportBody: 'Book title:\nPublisher and year (if known):\nWhere you saw it or a copy:\nNotes:\n',
    authorTitle: 'Dr. Hamdy Abdel Aal',
    authorKick: 'The author',
    authorP1: 'Dr. Hamdy Abdel Aal (1934–1990) was a professor at the Faculty of Sharia, Kuwait University. He wrote on the comparative study of religions and sects, on creed and on ethics. His four known books were published by Dar al-Qalam between 1984 and 1989.',
    authorP2: 'This page relies on what is printed in his books, on library records and on his family. A fuller life story, photographs and memories will be added as they are gathered.',
    works: 'Known works', factsTitle: 'What we know',
    fAff: 'Position', fAffV: 'Professor at the Faculty of Sharia, Kuwait University (as printed on his book covers)',
    fMain: 'Best-known work', fMainV: 'Al-Milla wa al-Nihla fi al-Yahudiyya wa al-Masihiyya wa al-Islam (1989)',
    fLife: 'Life',
    fWorks: 'Known works', fWorksV: 'Four books, all published by Dar al-Qalam, Kuwait, between 1984 and 1989',
    tocTitle: 'Contents', toc: 'Contents', fontSmaller: 'Smaller text', fontLarger: 'Larger text', goto: 'Go to page',
    prev: 'Previous', next: 'Next', reportTypo: 'Report a typo', copyLink: 'Copy link', copied: 'Copied',
    ocrNote: 'The Arabic text was extracted automatically from a scan; errors are possible, especially in Qur’anic verses and footnotes. If you spot one, use “Report a typo” on that page.',
    results: n => `${n} page${n === 1 ? '' : 's'}`, noResults: 'No results. Try a shorter word, or one without vowel marks.',
    searchHint: 'Search in English (the translation) or Arabic (the original). In Arabic, vowel marks are optional and alef or hamza forms are treated alike.',
    libTitle: 'Borrow the books from libraries', libP: 'His other three books are not online yet, but they are catalogued in libraries. The University of Toronto’s catalogue lists all four. The WorldCat link searches for other libraries.',
    uoft: 'U of Toronto', worldcat: 'WorldCat', neel: 'Neelwafurat', pubPage: 'Publisher', alsoHeld: 'Also held by', topicsFrom: 'From the publisher’s contents list', pubListing: 'The publisher’s list of his books', notOnline: 'Not online yet', heldBy: 'University of Toronto Libraries', ed: 'ed.', pp: 'pp.', year: 'Year', allUofT: 'All his books at Toronto',
    modeAr: 'العربية', modeEn: 'English', modeBoth: 'Both', textLang: 'Text',
    trNote: 'The English translation was made by Claude (an AI model from Anthropic) and has not been reviewed by a human translator. Qur’anic verses are translated by the model, not taken from a published translation.',
    authorNote: 'The views expressed in the book are the author’s.',
    tryThese: 'Try:', all: 'All', more: 'Show more', resultsFor: q => `Results for “${q}”`,
    themeLight: 'Light', themeSepia: 'Sepia', themeDark: 'Dark',
    loadError: 'The book could not be loaded. Refresh and try again.',
    groups: { front: 'Front matter', ch1: 'Judaism', ch2: 'Christianity', ch3: 'Islam', back: 'Conclusion & references' },
    langBtn: 'عربي',
  },
};

const state = {
  lang: store.get('lang') === 'en' ? 'en' : 'ar', // Arabic unless the visitor has chosen EN
  size: parseFloat(store.get('size')) || 1.3,
  site: null, pages: null, plain: null, pagesEn: null, plainEn: null, sections: null, byPage: null,
  readPref: ['ar', 'en', 'both'].includes(store.get('readMode')) ? store.get('readMode') : null,
};
const t = k => I18N[state.lang][k] ?? k;
const N = n => state.lang === 'ar' ? Number(n).toLocaleString('ar-EG', { useGrouping: false }) : String(n);
const secTitle = s => (state.lang === 'ar' ? s.ar : s.en);

/* ---------- data ---------- */
let sitePromise, pagesPromise;
function loadSite() {
  sitePromise ??= fetch('data/site.json').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => {
    state.site = d;
    state.sections = d.toc.filter(s => s.start != null);
    state.byPage = new Map();
    state.sections.forEach(s => { for (let p = s.start; p <= s.end; p++) state.byPage.set(p, s); });
    return d;
  });
  return sitePromise;
}
function loadPages() {
  pagesPromise ??= Promise.all([loadSite(), fetch('data/pages.json').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })]).then(([, p]) => {
    state.pages = p;
    return p;
  });
  return pagesPromise;
}
let pagesEnPromise;
function loadPagesEn() {
  pagesEnPromise ??= loadSite().then(d => d.hasEnglish ? fetch('data/pages-en.json').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }) : null)
    .then(p => { state.pagesEn = p; return p; });
  return pagesEnPromise;
}
const hasEn = () => !!state.site?.hasEnglish;
function plainOf(pages, key) {
  if (state[key]) return state[key];
  const box = document.createElement('div');
  state[key] = {};
  for (const [n, html] of Object.entries(pages)) { box.innerHTML = html; state[key][n] = box.textContent.replace(/\s+/g, ' ').trim(); }
  return state[key];
}
function plainText() { return plainOf(state.pages, 'plain'); }
function plainTextEn() { return plainOf(state.pagesEn, 'plainEn'); }

/* ---------- Arabic-aware matching ---------- */
const DIAC = '[\\u064B-\\u065F\\u0670\\u0640\\u06D6-\\u06ED]*';
const DIAC_STRIP = /[ً-ٰٟـۖ-ۭ]/g;
const CLASS = { 'ا': 'اأإآٱ', 'أ': 'اأإآٱ', 'إ': 'اأإآٱ', 'آ': 'اأإآٱ', 'ٱ': 'اأإآٱ', 'ي': 'يى', 'ى': 'يى', 'ه': 'هة', 'ة': 'هة' };
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const digitVal = ch => { const c = ch.charCodeAt(0); return c >= 0x6F0 ? c - 0x6F0 : c >= 0x660 ? c - 0x660 : c - 48; };
function wordRe(word) {
  let out = '';
  for (const ch of word.replace(DIAC_STRIP, '')) {
    if (CLASS[ch]) out += `[${CLASS[ch]}]${DIAC}`;
    else if (/[0-9\u0660-\u0669\u06F0-\u06F9]/.test(ch)) { const d = digitVal(ch); out += `[${d}${String.fromCharCode(0x660 + d)}${String.fromCharCode(0x6F0 + d)}]`; }
    else if (/[A-Za-z]/.test(ch)) out += ch + "['\u2019\u02BF\u02BE\u2018]?[\\u0300-\\u036f]*";
    else out += escRe(ch) + DIAC;
  }
  return out;
}
const tokens = q => q.replace(DIAC_STRIP, '').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const joinRe = parts => parts.join('[^\\p{L}\\p{N}]*');

/* ---------- reading prefs ---------- */
function applySize() { document.documentElement.style.setProperty('--fs', state.size + 'rem'); }
const THEMES = ['light', 'sepia', 'dark'];
function cycleTheme() {
  const cur = document.documentElement.dataset.theme;
  const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
  document.documentElement.dataset.theme = next; store.set('theme', next); applyI18n();
}

/* ---------- chrome ---------- */
function applyI18n() {
  const d = document.documentElement;
  d.lang = state.lang; d.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $('#langBtn').textContent = t('langBtn');
  const th = d.dataset.theme;
  $('#themeBtn').title = $('#themeBtn').ariaLabel = `${t('theme' + th[0].toUpperCase() + th.slice(1))}`;
  document.title = state.lang === 'ar' ? 'حمدي عبد العال · Hamdy Abdel Aal' : 'Hamdy Abdel Aal · حمدي عبد العال';
}

/* ---------- router ---------- */
function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  return { seg: path.split('/').filter(Boolean), params: new URLSearchParams(qs) };
}
async function route() {
  const r = parseHash();
  const app = $('#app');
  document.querySelectorAll('[data-nav]').forEach(a => a.removeAttribute('aria-current'));
  const nav = { '': 'home', read: 'read', search: 'read', books: 'books', author: 'author' }[r.seg[0] || ''];
  $(`[data-nav="${nav}"]`)?.setAttribute('aria-current', 'page');
  $('#searchInput').value = r.seg[0] === 'search' ? (r.params.get('q') || '') : $('#searchInput').value;
  try {
    await loadSite();
    if (!r.seg.length) viewHome(app);
    else if (r.seg[0] === 'read') await viewRead(app, r);
    else if (r.seg[0] === 'search') await viewSearch(app, r);
    else if (r.seg[0] === 'books') viewBooks(app);
    else if (r.seg[0] === 'author') viewAuthor(app);
    else viewHome(app);
  } catch (e) {
    console.error(e);
    app.innerHTML = `<p class="loading">${esc(t('loadError'))}</p>`;
  }
  if (r.seg[0] !== 'read') window.scrollTo(0, 0);
}

/* ---------- views ---------- */
const lastRead = () => parseInt(store.get('lastPage'), 10) || null;
const readHref = (page, extra = '') => `#/read/p/${page}${extra}`;
const quoteHref = i => readHref(state.site.quotes[i].page, `?hl=${i}`);
const quoteHTML = (q, i, cls = '') => `
  <figure class="q ${cls}">
    <blockquote lang="ar" dir="rtl">${q.partial ? '… ' : ''}${esc(q.text)}</blockquote>
    ${state.lang === 'en' && q.en ? `<p class="en">${esc(q.en)}</p>` : ''}
    <figcaption class="src"><span>${esc(t('bookTitle'))} · ${t('page')} ${N(q.page)}</span><a href="${quoteHref(i)}">${t('inContext')}</a></figcaption>
  </figure>`;

function viewHome(app) {
  const qs = state.site.quotes;
  let cur = Math.floor(Math.random() * qs.length);
  const resume = lastRead();
  app.innerHTML = `
  <section class="hero"><div class="wrap hero-grid">
    <div>
      <div class="kicker">${t('kickerHome')}</div>
      <h1 ${state.lang === 'ar' ? 'lang="ar"' : ''}>${state.lang === 'ar' ? 'الدكتور حمدي عبد العال' : 'Dr. Hamdy Abdel Aal'}</h1>
      <div class="en-name">${state.lang === 'ar' ? 'Dr. Hamdy Abdel Aal' : '<bdi lang="ar">الدكتور حمدي عبد العال</bdi>'} · ${lifespan()}</div>
      <p class="ded">${t('heroDed')}</p>
      <div class="row">
        <a class="btn" href="${resume ? readHref(resume) : '#/read'}">${resume ? t('continueRead') : t('readBook')}</a>
        <a class="btn ghost" href="#/search">${t('searchBook')}</a>
      </div>
    </div>
    <a class="cover" href="#/read" aria-label="${esc(t('bookTitle'))}"><img src="assets/cover.jpg" width="473" height="717" alt="${state.lang === 'ar' ? 'غلاف كتاب الملة والنحلة' : 'Cover of Al-Milla wa al-Nihla'}"></a>
  </div></section>

  <section class="band"><div class="wrap"><figure class="feature" id="feature" aria-live="polite"></figure></div></section>

  <section class="section"><div class="wrap">
    <div class="kicker">${t('quotesKick')}</div><h2>${t('quotesTitle')}</h2>
    ${state.lang === 'en' ? `<p class="sans" style="font-size:.8rem;color:var(--muted)">${t('unofficial')}</p>` : ''}
    <div class="quotes">${qs.map((q, i) => quoteHTML(q, i)).join('')}</div>
  </div></section>

  <section class="section" style="padding-top:0"><div class="wrap">
    <div class="orn" aria-hidden="true"><svg><use href="#star"/></svg></div>
    <div style="margin-top:2.5rem"><div class="kicker">${t('aboutKick')}</div><h2 ${state.lang === 'ar' ? 'lang="ar"' : ''}>${esc(t('bookTitle'))}</h2>
    ${state.lang === 'en' ? `<p class="sans" style="margin:-.4rem 0 1rem;color:var(--muted)"><bdi lang="ar">${I18N.ar.bookTitle}</bdi></p>` : ''}
    <p class="lede">${t('aboutP1')}</p></div>
    <div class="tiles">
      ${[['ch1', 'j1', 17, 72], ['ch2', 'c1', 73, 144], ['ch3', 'i1', 145, 209]].map(([k, id, a, b]) => `
        <a class="tile" href="#/read/${id}"><small>${t('page')} ${N(a)}–${N(b)}</small><h3>${t(k)}</h3><p>${t(k + 'd')}</p></a>`).join('')}
    </div>
  </div></section>

  <section class="section help"><div class="wrap help-grid">
    <div><div class="kicker">${t('helpKick')}</div><h2>${t('helpTitle')}</h2><p class="lede">${t('helpP')}</p>
      <ul class="checks">${t('h1').map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <p style="margin-top:1.5rem" class="row"><a class="btn" href="${issueUrl()}" rel="noopener">${t('helpBtn')}</a><a class="btn ghost" href="#/books">${t('helpBooks')}</a></p></div>
    <a class="cover" href="#/books" style="max-width:12rem" aria-hidden="true" tabindex="-1"><img src="assets/cover.jpg" alt="" loading="lazy"></a>
  </div></section>`;

  const feat = $('#feature');
  const show = () => {
    const q = qs[cur];
    feat.innerHTML = `<blockquote lang="ar" dir="rtl">${q.partial ? '… ' : ''}${esc(q.text)}</blockquote>
      ${state.lang === 'en' && q.en ? `<div class="en">${esc(q.en)}</div>` : ''}
      <figcaption>${esc(t('bookTitle'))} · ${t('page')} ${N(q.page)} <a href="${quoteHref(cur)}">${t('inContext')}</a><button type="button" id="nextQ">${t('anotherQuote')}</button></figcaption>`;
    $('#nextQ').onclick = () => { cur = (cur + 1) % qs.length; show(); };
  };
  show();
}

function issueUrl() {
  return `${REPO}/issues/new?title=${encodeURIComponent(I18N[state.lang].reportTitle)}&body=${encodeURIComponent(I18N[state.lang].reportBody)}`;
}

const UOFT_AUTHOR = 'https://librarysearch.library.utoronto.ca/nde/search?vid=01UTORONTO_INST:UTORONTO_NDE&search_scope=UTL_AND_CI&mode=advanced&tab=Everything&query=creator,exact,%CA%BBAbd%20al-%CA%BB%C4%80l%E2%94%80%20%E1%B8%A4amd%C4%AB.&offset=0&lang=en';
const NEEL_AUTHOR = 'https://www.neelwafurat.com/locate.aspx?mode=1&search=author1&entry=%D8%AD%D9%85%D8%AF%D9%8A%20%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D8%B9%D8%A7%D9%84';
const PUBLISHER_AUTHOR = 'https://darelkalam.com/ViewAuthorBooks.php?id=75';
const worldcatUrl = w => `https://search.worldcat.org/search?q=${encodeURIComponent(w.ar.split(':')[0].split(' في ')[0])}`;
const lifespan = () => { const a = state.site.author; return `${N(a.born)} – ${N(a.died)}`; };
const workTitle = w => state.lang === 'ar' ? w.ar : w.en;
const edLine = (w, e) => [`${w.publisher}, ${e.place}`, `${e.year}`, e.edition ? `${t('ed')} ${N(e.edition)}` : '', e.pages ? `${N(e.pages)} ${t('pp')}` : ''].filter(Boolean).join(' · ');
const workLines = w => (w.editions || [{ place: w.place, year: w.year, edition: w.edition, pages: w.pages }]).map(e => edLine(w, e));

function viewBooks(app) {
  const works = state.site.works;
  app.innerHTML = `
  <div class="wrap"><div class="page-head"><div class="kicker">${t('navBooks')}</div><h1>${t('booksTitle')}</h1><p class="lede">${t('booksLead')}</p></div>
  <div class="shelf">
    ${works.map(w => `
    <article class="book">
      ${w.online ? '<img src="assets/cover.jpg" width="104" height="158" alt="">' : '<div class="ph" aria-hidden="true"><svg><use href="#star"/></svg></div>'}
      <div><span class="tag ${w.online ? 'ok' : 'seek'}">${w.online ? t('available') : t('notOnline')}</span>
      <h3 lang="ar" dir="rtl">${esc(w.ar)}</h3>
      <p class="meta" style="margin:-.2rem 0 .3rem" dir="ltr" lang="en">${esc(w.en)}<br><em>${esc(w.gloss)}</em></p>
      <p class="meta">${workLines(w).map(esc).join('<br>')}<br>${t('heldBy')}${w.uoft ? ` (${esc(w.uoft)})` : ''}${w.libraries?.length ? `<br>${t('alsoHeld')}: ${w.libraries.map(l => `<a href="${l.url}" rel="noopener">${esc(l.name)}${l.note ? ` (${esc(l.note)})` : ''}</a>`).join(', ')}` : ''}</p>
      ${w.topics ? `<p class="meta topics" lang="${state.lang}" dir="${state.lang === 'ar' ? 'rtl' : 'ltr'}">${esc(w.topics[state.lang])} <em>(${t('topicsFrom')})</em></p>` : ''}
      <p class="row" style="gap:.4rem">${w.online ? `<a class="btn" href="#/read">${t('readNow')}</a>` : ''}
        <a class="chip" href="${UOFT_AUTHOR}" rel="noopener">${t('uoft')}</a>
        ${w.scan ? `<a class="chip" href="${w.scan.url}" rel="noopener">${t('scanChip')}</a>` : ''}
        ${w.publisherUrl ? `<a class="chip" href="${w.publisherUrl}" rel="noopener">${t('pubPage')}</a>` : ''}
        <a class="chip" href="${worldcatUrl(w)}" rel="noopener">${t('worldcat')}</a>
        <a class="chip" href="${w.neelwafurat}" rel="noopener">${t('neel')}</a></p></div></article>`).join('')}
    <article class="book"><div class="ph" aria-hidden="true"><svg><use href="#star"/></svg></div>
      <div><span class="tag seek">${t('seeking')}</span><h3>${t('moreBooks')}</h3>
      <p class="meta">${t('moreBooksMeta')}</p><a class="btn ghost" href="${issueUrl()}" rel="noopener">${t('report')}</a></div></article>
  </div>
  <section class="card" style="max-width:42rem;margin-bottom:1.5rem"><h2 style="font-size:1.5rem">${t('orderTitle')}</h2><p>${t('orderP')}</p>
    <p class="row"><a class="btn" href="${NEEL_AUTHOR}" rel="noopener">${t('orderBtn')}</a></p></section>
  <section class="card" style="max-width:42rem;margin-bottom:1.5rem"><h2 style="font-size:1.5rem">${t('libTitle')}</h2><p>${t('libP')}</p>
    <p class="row"><a class="btn" href="${UOFT_AUTHOR}" rel="noopener">${t('allUofT')}</a><a class="btn ghost" href="${PUBLISHER_AUTHOR}" rel="noopener">${t('pubListing')}</a></p></section>
  <section class="card" style="max-width:42rem;margin-bottom:3rem"><h2 style="font-size:1.5rem">${t('helpTitle')}</h2><p>${t('helpP')}</p>
    <ul class="checks">${t('h1').map(x => `<li>${esc(x)}</li>`).join('')}</ul></section></div>`;
}

function viewAuthor(app) {
  const works = state.site.works;
  app.innerHTML = `
  <div class="wrap"><div class="page-head"><div class="kicker">${t('authorKick')}</div><h1 ${state.lang === 'ar' ? 'lang="ar"' : ''}>${state.lang === 'ar' ? I18N.ar.authorTitle : 'Dr. Hamdy Abdel Aal'}</h1>
    <div class="sans" style="color:var(--muted)">${state.lang === 'ar' ? '<bdi dir="ltr">Dr. Hamdy Abdel Aal</bdi>' : `<bdi lang="ar">${I18N.ar.authorTitle}</bdi>`} · ${lifespan()}</div></div>
  <div class="prose"><p>${t('authorP1')}</p><p>${t('authorP2')}</p></div>
  <h2 style="margin-top:2rem;font-size:1.5rem">${t('works')}</h2>
  <ol class="works">${works.map(w => `<li><span class="yr">${w.year}</span><div><b lang="ar" dir="rtl">${esc(w.ar)}</b>
      <div class="sans" style="font-size:.85rem;color:var(--muted)" dir="ltr" lang="en">${esc(w.en)} (${esc(w.gloss)})</div>
      <div class="sans" style="font-size:.8rem;color:var(--muted)">${workLines(w).map(esc).join('<br>')}</div></div></li>`).join('')}</ol>
  <h2 style="margin-top:2rem;font-size:1.5rem">${t('factsTitle')}</h2>
  <dl class="facts"><dt>${t('fLife')}</dt><dd>${lifespan()}</dd><dt>${t('fAff')}</dt><dd>${t('fAffV')}</dd><dt>${t('fWorks')}</dt><dd>${t('fWorksV')}</dd></dl>
  <p class="row" style="margin-bottom:3rem"><a class="btn" href="#/read">${t('readBook')}</a><a class="btn ghost" href="#/books">${t('navBooks')}</a><a class="btn ghost" href="${NEEL_AUTHOR}" rel="noopener">${t('orderBtn')}</a><a class="btn ghost" href="${PUBLISHER_AUTHOR}" rel="noopener">${t('pubListing')}</a></p></div>`;
}

/* ---------- reader ---------- */
function highlightIn(root, re) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  let first = null;
  for (const node of nodes) {
    const text = node.nodeValue; re.lastIndex = 0;
    if (!re.test(text)) continue;
    re.lastIndex = 0;
    const frag = document.createDocumentFragment(); let last = 0, m;
    while ((m = re.exec(text))) {
      if (!m[0]) { re.lastIndex++; continue; }
      frag.append(text.slice(last, m.index));
      const mk = document.createElement('mark'); mk.textContent = m[0]; frag.append(mk); first ||= mk;
      last = m.index + m[0].length;
    }
    frag.append(text.slice(last)); node.replaceWith(frag);
  }
  return first;
}

function readMode(r) {
  if (!hasEn()) return 'ar';
  let mode = state.readPref || (state.lang === 'en' ? 'en' : 'ar');
  const q = r.params.get('q') || '';
  if (r.params.get('hl') != null) return mode === 'en' ? 'both' : mode;      // quote highlights live in the Arabic text
  const arQ = /[\u0600-\u06FF]/.test(q), laQ = /[A-Za-z]/.test(q);
  if (laQ && !arQ && mode === 'ar') mode = 'en';
  if (arQ && mode === 'en') mode = 'both';
  return mode;
}

async function viewRead(app, r) {
  await loadPages();
  await loadPagesEn();
  const mode = readMode(r);
  const secs = state.sections;
  let page = null, sec;
  if (r.seg[1] === 'p') { page = parseInt(r.seg[2], 10); sec = state.byPage.get(page); }
  else if (r.seg[1]) sec = secs.find(s => s.id === r.seg[1]);
  if (!sec) {
    const lp = lastRead();
    if (!r.seg[1] && lp && state.byPage.get(lp)) { location.replace(readHref(lp)); return; }
    sec = secs[0]; page = null;
  }
  // Re-render only when the section changes (scroll tracking rewrites the hash within a section).
  if (app.dataset.sec === sec.id && app.dataset.mode === mode && $('.doc', app)) { scrollToPage(page, r); return; }
  app.dataset.sec = sec.id; app.dataset.mode = mode;

  const idx = secs.indexOf(sec), prev = secs[idx - 1], next = secs[idx + 1];
  let tocHTML = '', group = null;
  for (const s of state.site.toc) {
    if (s.group !== group) { group = s.group; if (!s.heading && (group === 'front' || group === 'back')) tocHTML += `<div class="ch">${esc(t('groups')[group])}</div>`; }
    if (s.heading) tocHTML += `<div class="ch">${esc(secTitle(s))}</div>`;
    else tocHTML += `<a href="#/read/${s.id}" ${s.id === sec.id ? 'aria-current="true"' : ''}><span ${state.lang === 'en' ? '' : 'lang="ar"'}>${esc(secTitle(s))}</span><span class="pg">${N(s.start)}</span></a>`;
  }
  let body = '';
  for (let p = sec.start; p <= sec.end; p++) {
    const ar = state.pages[p], en = mode === 'ar' ? null : state.pagesEn?.[p];
    if (!ar && !en) continue;
    const typo = `${REPO}/issues/new?title=${encodeURIComponent((state.lang === 'ar' ? 'خطأ في الصفحة ' : 'Typo on page ') + p)}&body=${encodeURIComponent(`${location.origin}${location.pathname}#/read/p/${p}\n\n`)}`;
    const arBox = `<div class="ar-text" lang="ar" dir="rtl">${ar || ''}</div>`, enBox = `<div class="en-text" lang="en" dir="ltr">${en || ''}</div>`;
    body += `<section class="page ${mode}" id="p${p}" data-p="${p}">
      <div class="page-tools" dir="${state.lang === 'ar' ? 'rtl' : 'ltr'}"><a class="pn" href="${readHref(p)}" title="${esc(t('copyLink'))}" data-copy>${N(p)}</a><a class="rep" href="${typo}" rel="noopener">${esc(t('reportTypo'))}</a></div>${mode === 'en' ? enBox : mode === 'ar' ? arBox : arBox + enBox}</section>`;
  }
  app.innerHTML = `
  <div class="reader">
    <aside class="toc" id="toc" aria-label="${esc(t('tocTitle'))}"><h2>${t('tocTitle')}</h2>${tocHTML}</aside>
    <article class="doc">
      <div class="bar" role="toolbar">
        <button type="button" class="toc-btn" id="tocBtn" aria-expanded="false" aria-controls="toc">☰ ${t('toc')}</button>
        <span class="grow" id="where"></span>
        ${hasEn() ? `<span class="seg" role="group" aria-label="${esc(t('textLang'))}">${['ar', 'en', 'both'].map(m => `<button type="button" data-mode="${m}" aria-pressed="${m === mode}">${t('mode' + m[0].toUpperCase() + m.slice(1))}</button>`).join('')}</span>` : ''}
        <button type="button" id="fs-" aria-label="${esc(t('fontSmaller'))}">A−</button>
        <button type="button" id="fs+" aria-label="${esc(t('fontLarger'))}">A+</button>
        <label>${t('goto')} <input id="gotoIn" inputmode="numeric" type="text" aria-label="${esc(t('goto'))}" placeholder="${N(sec.start)}"></label>
        <div class="progress" aria-hidden="true"><i id="prog"></i></div>
      </div>
      <div class="notice">${mode === 'en' ? '' : esc(t('ocrNote')) + ' '}${mode === 'ar' ? '' : esc(t('trNote')) + ' '}${esc(t('authorNote'))}</div>
      <div class="sheet" id="sheet">
        <header class="sec-title">${mode === 'en'
          ? `<h1 lang="en" dir="ltr">${esc(sec.en)}</h1><div class="en" lang="ar" dir="rtl">${esc(sec.ar)}</div>`
          : `<h1 lang="ar">${esc(sec.ar)}</h1>${state.lang === 'en' ? `<div class="en">${esc(sec.en)}</div>` : ''}`}</header>
        ${body}
      </div>
      <nav class="sec-nav" aria-label="Sections">
        ${prev ? `<a href="#/read/${prev.id}"><small>${t('prev')}</small>${esc(secTitle(prev))}</a>` : '<span></span>'}
        ${next ? `<a href="#/read/${next.id}"><small>${t('next')}</small>${esc(secTitle(next))}</a>` : '<span></span>'}
      </nav>
    </article>
  </div>`;
  wireReader(sec, page, r);
}

function wireReader(sec, page, r) {
  const toc = $('#toc'), tocBtn = $('#tocBtn');
  tocBtn.onclick = () => { const o = toc.classList.toggle('open'); tocBtn.setAttribute('aria-expanded', o); };
  toc.onclick = e => { if (e.target.closest('a')) toc.classList.remove('open'); };
  $$('.seg [data-mode]').forEach(b => b.onclick = () => { state.readPref = b.dataset.mode; store.set('readMode', state.readPref); $('#app').dataset.mode = ''; route(); });
  $('#fs-').onclick = () => { state.size = Math.max(1, +(state.size - .1).toFixed(2)); store.set('size', state.size); applySize(); };
  $('#fs\\+').onclick = () => { state.size = Math.min(2.2, +(state.size + .1).toFixed(2)); store.set('size', state.size); applySize(); };
  $('#gotoIn').onkeydown = e => {
    if (e.key !== 'Enter') return;
    const raw = e.target.value.replace(/[٠-٩]/g, d => d.charCodeAt(0) - 0x660);
    const n = parseInt(raw, 10);
    if (state.byPage.has(n)) location.hash = readHref(n); else e.target.select();
  };
  $$('[data-copy]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); history.replaceState(null, '', a.getAttribute('href'));
    navigator.clipboard?.writeText(location.href).then(() => { a.textContent = '✓'; setTimeout(() => { a.textContent = N(a.closest('.page').dataset.p); }, 1200); }, () => {});
  }));

  // highlight: a whole quote (?hl=) or the search words (?q=)
  let re = null;
  const hl = r.params.get('hl'), q = r.params.get('q');
  if (hl != null && state.site.quotes[hl]) re = new RegExp(joinRe(tokens(state.site.quotes[hl].text).map(wordRe)), 'giu');
  else if (q) { const w = tokens(q).map(wordRe); if (w.length) re = new RegExp(w.join('|'), 'giu'); }
  if (re) highlightIn($('#sheet'), re);

  // current page tracking
  const where = $('#where'), prog = $('#prog');
  const set = p => {
    where.textContent = `${secTitle(sec)} · ${t('page')} ${N(p)}`;
    prog.style.width = ((p - state.site.firstPage) / (state.site.lastPage - state.site.firstPage) * 100) + '%';
    store.set('lastPage', p);
  };
  set(page || sec.start);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) {
        const p = +e.target.dataset.p; set(p);
        history.replaceState(null, '', readHref(p) + (location.hash.includes('?') ? '?' + location.hash.split('?')[1] : ''));
      }
    }, { rootMargin: '-25% 0px -65% 0px' });
    $$('.page').forEach(el => io.observe(el));
  }
  applySize();
  scrollToPage(page, r);
}

function scrollToPage(page, r) {
  if (page == null) { window.scrollTo(0, 0); return; }
  let el = document.getElementById('p' + page);
  if (!el) return;
  const mark = $('mark', el);
  requestAnimationFrame(() => {
    (mark || el).scrollIntoView({ block: mark ? 'center' : 'start' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  });
}

/* ---------- search ---------- */
async function viewSearch(app, r) {
  const q = (r.params.get('q') || '').trim();
  const chap = r.params.get('c') || '';
  app.dataset.sec = '';
  const examplesAr = ['الملة', 'النحلة', 'الوحي', 'التثليث', 'القرآن', 'إنجيل برنابا'];
  const examplesEn = ['milla', 'nihla', 'revelation', 'Trinity', 'Barnabas', 'Nicaea'];
  const head = `<div class="wrap results"><div class="page-head"><div class="kicker">${t('searchBook')}</div><h1>${q ? esc(t('resultsFor')(q)) : t('searchBook')}</h1></div>`;
  if (!q) {
    app.innerHTML = `${head}<p class="lede">${t('searchHint')}</p><div class="examples"><span class="sans">${t('tryThese')}</span>${[...examplesAr.map(x => ['ar', x]), ...(hasEn() ? examplesEn.map(x => ['en', x]) : [])].sort(a => (a[0] === state.lang ? -1 : 1)).map(([l, x]) => `<a class="chip" lang="${l}" href="#/search?q=${encodeURIComponent(x)}">${x}</a>`).join('')}</div></div>`;
    $('#searchInput').focus();
    return;
  }
  app.innerHTML = `${head}<p class="loading">…</p></div>`;
  await loadPages(); await loadPagesEn();
  const useEn = hasEn() && /[A-Za-z]/.test(q) && !/[\u0600-\u06FF]/.test(q);
  const plain = useEn ? plainTextEn() : plainText();
  const words = tokens(q);
  if (!words.length) { app.innerHTML = `${head}<p class="empty">${t('noResults')}</p></div>`; return; }
  const regs = words.map(w => new RegExp(wordRe(w), 'iu'));
  const regsG = words.map(w => new RegExp(wordRe(w), 'giu'));
  const phrase = words.length > 1 ? new RegExp(joinRe(words.map(wordRe)), 'iu') : null;
  const all = new RegExp(words.map(wordRe).join('|'), 'giu');
  const hits = [];
  for (const [n, text] of Object.entries(plain)) {
    if (!regs.every(re => re.test(text))) continue;
    const score = (phrase && phrase.test(text) ? 1000 : 0) + regsG.reduce((a, re) => a + (text.match(re) || []).length, 0);
    hits.push({ page: +n, score, text });
  }
  hits.sort((a, b) => b.score - a.score || a.page - b.page);

  const group = h => state.byPage.get(h.page).group;
  const counts = {}; hits.forEach(h => { counts[group(h)] = (counts[group(h)] || 0) + 1; });
  const shown = chap ? hits.filter(h => group(h) === chap) : hits;
  const order = ['front', 'ch1', 'ch2', 'ch3', 'back'].filter(g => counts[g]);
  const chip = (g, label, n) => `<a class="chip" aria-pressed="${(chap || '') === g}" href="#/search?q=${encodeURIComponent(q)}${g ? '&c=' + g : ''}">${esc(label)} · ${N(n)}</a>`;
  const snippet = h => {
    const m = (phrase && phrase.exec(h.text)) || regs[0].exec(h.text);
    const at = m ? m.index : 0;
    let s = h.text.slice(Math.max(0, at - 90), at + 190);
    if (at > 90) s = '… ' + s.slice(s.indexOf(' ') + 1);
    if (h.text.length > at + 190) s = s.slice(0, s.lastIndexOf(' ')) + ' …';
    all.lastIndex = 0;
    return esc(s.replace(all, x => `\u0001${x}\u0002`)).replace(/\u0001/g, '<mark>').replace(/\u0002/g, '</mark>');
  };
  const card = h => { const s = state.byPage.get(h.page); return `<a class="hit" href="${readHref(h.page, '?q=' + encodeURIComponent(q))}">
      <div class="where"><b>${t('page')} ${N(h.page)}</b><span ${state.lang === 'en' ? '' : 'lang="ar"'}>${esc(secTitle(s))}</span></div>
      <p lang="${useEn ? 'en' : 'ar'}" dir="${useEn ? 'ltr' : 'rtl'}">${snippet(h)}</p></a>`; };
  let limit = 20;
  const paint = () => {
    app.innerHTML = `${head}
      ${hits.length ? `<div class="facets" role="group">${chip('', t('all'), hits.length)}${order.map(g => chip(g, t('groups')[g], counts[g])).join('')}</div>` : ''}
      ${shown.length ? `<p class="sans" style="color:var(--muted);font-size:.85rem">${t('results')(shown.length)}</p>${shown.slice(0, limit).map(card).join('')}
        ${shown.length > limit ? `<p style="text-align:center"><button class="chip" id="more" type="button">${t('more')}</button></p>` : ''}` : `<p class="empty">${t('noResults')}</p>`}</div>`;
    $('#more')?.addEventListener('click', () => { limit += 20; paint(); });
  };
  paint();
}

/* ---------- boot ---------- */
$('#searchForm').addEventListener('submit', e => {
  e.preventDefault();
  const q = $('#searchInput').value.trim();
  location.hash = q ? `#/search?q=${encodeURIComponent(q)}` : '#/search';
});
$('#themeBtn').addEventListener('click', cycleTheme);
$('#langBtn').addEventListener('click', () => {
  state.lang = state.lang === 'ar' ? 'en' : 'ar'; store.set('lang', state.lang);
  applyI18n(); $('#app').dataset.sec = ''; route();
});
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) { e.preventDefault(); $('#searchInput').focus(); }
});
window.addEventListener('hashchange', route);
applyI18n(); applySize(); route();
