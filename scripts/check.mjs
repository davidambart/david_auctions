// Run with Node.js: node scripts/check.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const base = new URL('../', import.meta.url);
const source = readFileSync(new URL('assets/embed.js', base), 'utf8');
let Archive;
const images = [];
const context = vm.createContext({
  customElements: { get() {}, define(name, element) { Archive = element; } },
  HTMLElement: class {},
  document: { currentScript: { src: 'https://example.com/assets/embed.js' }, querySelector: () => true, body: {style: {overflow: 'clip'}} },
  URL,
  Image: class {
    constructor() { images.push(this); }
    decode() { return Promise.resolve(); }
  }
});
vm.runInContext(source.replace('  class StarMurmurationLoader {', '  globalThis.audit = {parseCSV, escapeHTML, resultInEuro};\n  class StarMurmurationLoader {'), context);
const { parseCSV, escapeHTML, resultInEuro } = context.audit;
const works = parseCSV(readFileSync(new URL('data/auctions.csv', base), 'utf8'));
assert.ok(works.length > 0);
assert.equal(new Set(works.map(work => work.id)).size, works.length);
let imageCount = 0;
for (const work of works) {
  assert.ok(work.title && work.year && /^\d{4}-\d{2}-\d{2}$/.test(work.auctionEndISO));
  assert.ok(Number.isFinite(resultInEuro(work)) && resultInEuro(work) > 0);
  for (const path of work.images.split('|').map(path => path.trim()).filter(Boolean)) {
    assert.ok(existsSync(fileURLToPath(new URL(path, base))), `Missing image: ${path}`);
    imageCount++;
  }
}
assert.equal(parseCSV('\uFEFFtitle,note\r\n"A, B","line 1\n""quoted"""\r\n')[0].note, 'line 1\n"quoted"');
assert.equal(escapeHTML('<a title="x">&\''), '&lt;a title=&quot;x&quot;&gt;&amp;&#39;');
assert.equal(resultInEuro({winningBid: '$1300 USD', auctionEndISO: '2020-06-05'}), 1147.4);

// An unsuccessful request must be retried; successful/concurrent requests are reused.
const archive = Object.create(Archive.prototype);
archive.galleryImageCache = new Map();
const failed = archive.preloadGalleryImage('test.jpg');
assert.equal(archive.preloadGalleryImage('test.jpg'), failed);
images[0].onerror();
assert.equal(await failed, false);
const retry = archive.preloadGalleryImage('test.jpg');
assert.notEqual(retry, failed);
images[1].onload();
assert.equal(await retry, true);
assert.equal(archive.preloadGalleryImage('test.jpg'), retry);

// Removing an inactive archive must not overwrite a host page's scroll lock.
const viewer = {open: false, close() { this.open = false; }};
const image = {removeAttribute() {}};
const frame = {classList: {remove() {}}, querySelector: () => image};
archive.shadowRoot = {querySelector: selector => selector === '.viewer' ? viewer : frame};
archive.starLoader = {remove() {}};
archive.galleryRequest = 0;
archive.previousBodyOverflow = 'auto';
archive.closeGallery();
assert.equal(context.document.body.style.overflow, 'clip');
viewer.open = true;
archive.closeGallery();
assert.equal(context.document.body.style.overflow, 'auto');
assert.equal(viewer.open, false);

// A duplicate embed exits before touching the document or creating fonts.
vm.runInNewContext(source, {customElements: {get: () => Archive}});
console.log(`Passed: ${works.length} works, ${imageCount} image paths, CSV escaping, currency sorting, image retry/cache and duplicate embedding.`);
