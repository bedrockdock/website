// Maakt de Nederlandse pagina's in nl/ uit de Engelse HTML en de NL-teksten in het script onderaan.
// Gebruik: node tools/build-nl.js   (vanuit de hoofdmap van de site)
// Pas nooit de bestanden in nl/ zelf aan: die worden bij elke run overschreven.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://bedrockdock.com';

const PAGES = [
  { file: 'index.html', url: '/', nlUrl: '/nl/', alt: '../', dict: (src) => evalDict(src, /var T = (\{[\s\S]*?\n  \});/).nl },
  { file: 'harborlight.html', url: '/harborlight.html', nlUrl: '/nl/harborlight.html', alt: '../harborlight.html', dict: (src) => evalDict(src, /var NL = (\{[\s\S]*?\n  \});/) },
];

function evalDict(src, re) {
  const m = src.match(re);
  if (!m) throw new Error('Woordenlijst niet gevonden');
  return Function('return ' + m[1])();
}

const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');

function build(page) {
  let html = fs.readFileSync(path.join(ROOT, page.file), 'utf8');
  const nl = page.dict(html);
  const missing = new Set();
  const get = (k) => { if (nl[k] === undefined) { missing.add(k); return null; } return nl[k]; };

  // Teksten van elementen met data-i18n (alleen platte tekst, geen geneste tags).
  html = html.replace(/(<(\w+)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g, (all, open, tag, key, text, close) => {
    const v = get(key); return v === null ? all : open + escText(v) + close;
  });
  // alt- en aria-label-attributen.
  html = html.replace(/<[^>]*\sdata-i18n-(alt|aria)="([^"]+)"[^>]*>/g, (el, kind, key) => {
    const v = get(key); if (v === null) return el;
    const attr = kind === 'alt' ? 'alt' : 'aria-label';
    return el.replace(new RegExp('\\s' + attr + '="[^"]*"'), ' ' + attr + '="' + escAttr(v) + '"');
  });

  // Kop van de pagina.
  const title = get('title'), desc = get('desc');
  html = html
    .replace('<html lang="en">', '<html lang="nl">')
    .replace(/<title>[^<]*<\/title>/, '<title>' + escText(title) + '</title>')
    .replace(/(<meta name="description" content=")[^"]*"/, '$1' + escAttr(desc) + '"')
    .replace(/(<meta property="og:title" content=")[^"]*"/, '$1' + escAttr(title) + '"')
    .replace(/(<meta property="og:description" content=")[^"]*"/, '$1' + escAttr(desc) + '"')
    .replace('<meta property="og:locale" content="en_US">', '<meta property="og:locale" content="nl_NL">')
    .replace('<meta property="og:locale:alternate" content="nl_NL">', '<meta property="og:locale:alternate" content="en_US">')
    .replace('<link rel="canonical" href="' + SITE + page.url + '">', '<link rel="canonical" href="' + SITE + page.nlUrl + '">')
    .replace('<meta property="og:url" content="' + SITE + page.url + '">', '<meta property="og:url" content="' + SITE + page.nlUrl + '">')
    .replace(SITE + '/img/og-home.png', SITE + '/img/og-home-nl.png');

  if (nl['og.alt']) html = html.replace(/(<meta property="og:image:alt" content=")[^"]*"/, '$1' + escAttr(nl['og.alt']) + '"');

  // Paden: afbeeldingen staan een map hoger, de taalknop wijst terug naar Engels.
  html = html
    .replace(/(src|href)="img\//g, '$1="../img/')
    .replace(/data-alt="[^"]*"/, 'data-alt="' + page.alt + '"')
    .replace('data-lang="nl" aria-pressed="false"', 'data-lang="nl" aria-pressed="true"')
    .replace('data-lang="en" aria-pressed="true"', 'data-lang="en" aria-pressed="false"');

  html = html.replace(/<!doctype html>\r?\n/, '<!doctype html>\n<!-- Gemaakt door tools/build-nl.js uit ../' + page.file + '. Niet hier aanpassen. -->\n');

  fs.mkdirSync(path.join(ROOT, 'nl'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'nl', page.file), html);
  console.log('nl/' + page.file + (missing.size ? '  (geen vertaling voor: ' + [...missing].join(', ') + ')' : ''));
}

PAGES.forEach(build);
