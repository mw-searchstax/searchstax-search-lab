const assert = require('node:assert/strict');
const { chromium, firefox, webkit } = require('playwright-core');

const baseURL = new URL(process.env.SEARCH_LAB_BASE_URL || process.argv[2] || 'https://mw-searchstax.github.io/searchstax-search-lab/').href;
const localQA = ['localhost', '127.0.0.1', '[::1]'].includes(new URL(baseURL).hostname);
module.exports = { chromium, firefox, webkit, assert, baseURL, localQA };
