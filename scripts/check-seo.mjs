import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const origin = 'https://andrzejfirek.me';
const decode = (text) => text.replace(/&#(x[\da-f]+|\d+);|&(amp|quot|apos|lt|gt);/gi, (_, numeric, named) =>
  numeric ? String.fromCodePoint(numeric[0].toLowerCase() === 'x' ? parseInt(numeric.slice(1), 16) : Number(numeric))
    : ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' })[named.toLowerCase()]);
const read = (path) => readFileSync(join('dist', path), 'utf8');
const locations = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) =>
  Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), decode(value)])));
const meta = (html, name) => tags(html, 'meta').find((tag) => tag.name === name || tag.property === name)?.content;
const localFile = (url) => {
  const parsed = new URL(url, origin);
  assert.equal(parsed.origin, origin, `Unexpected origin: ${url}`);
  const path = decodeURIComponent(parsed.pathname);
  return join('dist', path, path.endsWith('/') ? 'index.html' : '');
};

const indexes = locations(read('sitemap-index.xml'));
assert.ok(indexes.length > 0, 'Sitemap index is empty');
const pages = indexes.flatMap((url) => locations(readFileSync(localFile(url), 'utf8')));
const projectPaths = readdirSync('dist/projects', { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join('dist/projects', entry.name, 'index.html')))
  .map((entry) => `${origin}/projects/${entry.name}/`);
assert.deepEqual(new Set(pages), new Set([`${origin}/`, `${origin}/projects/`, `${origin}/blog/`, ...projectPaths]));
assert.equal(pages.length, new Set(pages).size, 'Duplicate sitemap entries');

const titles = new Set();
const descriptions = new Set();
for (const url of pages) {
  assert.ok(url.endsWith('/'), `HTML URL needs a trailing slash: ${url}`);
  const html = readFileSync(localFile(url), 'utf8');
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '');
  assert.ok(title?.includes('Andrzej Firek'), `Missing owner in title: ${url}`);
  assert.ok(!titles.has(title), `Duplicate title: ${url}`);
  titles.add(title);
  const description = meta(html, 'description');
  assert.ok(description?.trim(), `Missing description: ${url}`);
  assert.ok(!descriptions.has(description), `Duplicate description: ${url}`);
  descriptions.add(description);
  assert.equal(tags(html, 'link').find((tag) => tag.rel === 'canonical')?.href, url);
  assert.equal(meta(html, 'og:url'), url);
  assert.equal(meta(html, 'og:title'), title);
  assert.equal(meta(html, 'og:description'), description);
  assert.equal(meta(html, 'twitter:card'), 'summary_large_image');
  assert.equal(meta(html, 'twitter:image'), meta(html, 'og:image'));
  assert.ok(existsSync(localFile(meta(html, 'og:image'))), `Missing social image: ${url}`);
  assert.ok(!meta(html, 'robots')?.includes('noindex'), `Indexable page marked noindex: ${url}`);
  for (const link of tags(html, 'a')) {
    if (!link.href?.startsWith('/') || link.href.startsWith('//')) continue;
    const path = new URL(link.href, origin).pathname;
    if (path === '/' || path.startsWith('/projects') || path === '/blog/' || path === '/feeling-lucky/') {
      assert.ok(path.endsWith('/'), `Internal HTML link needs a trailing slash: ${link.href}`);
      assert.ok(existsSync(localFile(link.href)), `Broken internal link: ${link.href}`);
    }
  }
  for (const [, json] of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) JSON.parse(json);
}

for (const path of ['feeling-lucky/index.html', 'ghost-pm-pitch.html']) {
  assert.ok(meta(read(path), 'robots')?.includes('noindex'), `Auxiliary page must be noindex: ${path}`);
}
const robots = read('robots.txt');
assert.match(robots, /User-agent: \*\s+Allow: \//);
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap-index.xml`));
assert.ok(!robots.includes('Disallow:'), 'Public crawl access should stay open');
const images = tags(read('index.html'), 'img');
assert.ok(images.length > 0);
for (const image of images) {
  assert.ok(Number(image.width) > 0 && Number(image.height) > 0, 'Gallery dimensions missing');
  assert.equal(image.loading, 'lazy');
  assert.ok(existsSync(localFile(image.src)), `Missing gallery image: ${image.src}`);
  if (image['aria-hidden'] !== 'true') assert.ok(image.srcset && image.sizes, 'Responsive gallery sources missing');
  for (const source of (image.srcset ?? '').split(',').filter(Boolean)) {
    assert.ok(existsSync(localFile(source.trim().split(/\s+/)[0])), `Missing responsive image: ${source}`);
  }
}
console.log(`SEO checks passed: ${pages.length} indexable pages, sitemap, crawl rules, social previews, and ${images.length} gallery images.`);
