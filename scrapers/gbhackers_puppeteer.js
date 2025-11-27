const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { getRandomUserAgent } = require('../common/utils');

puppeteer.use(StealthPlugin());

const url = 'https://gbhackers.com/';

let _sharedBrowser = null;

async function initBrowser(launchOptions = { headless: true }) {
  if (_sharedBrowser) return _sharedBrowser;
  _sharedBrowser = await puppeteer.launch({
    headless: launchOptions.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  return _sharedBrowser;
}

async function closeBrowser() {
  if (!_sharedBrowser) return;
  try {
    await _sharedBrowser.close();
  } catch (e) {}
  _sharedBrowser = null;
}

async function scrapeGBHackersPuppeteer(pageNumber = 1, options = {}) {
  const targetUrl = pageNumber === 1 ? url : `${url}page/${pageNumber}/`;
  const browser = options.reuseBrowser ? await initBrowser(options.launchOptions) : await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  try {
    const page = await browser.newPage();

    if (options.timeout) page.setDefaultNavigationTimeout(options.timeout);

    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(options.userAgent || getRandomUserAgent());

    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(options.postLoadWait || 500);

    const html = await page.content();

    await page.close();

    if (!options.reuseBrowser) {
      try { await browser.close(); } catch (e) {}
    }

    return html;
  } catch (err) {
    try { await page?.close(); } catch (e) {}
    if (!options.reuseBrowser) {
      try { await browser.close(); } catch (e) {}
    }
    throw err;
  }
}

module.exports = { scrapeGBHackersPuppeteer, initBrowser, closeBrowser };
