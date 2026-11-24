const assert = require('node:assert/strict');
const { chromium, firefox, webkit } = require('playwright-core');

const baseURL = new URL(process.env.SEARCH_LAB_BASE_URL || process.argv[2] || 'https://mw-searchstax.github.io/searchstax-search-lab/').href;
module.exports = { chromium, firefox, webkit, assert, baseURL };
