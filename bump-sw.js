/**
 * bump-sw.js
 * Automatically increments the service worker cache version in sw.js.
 * Run via: npm run deploy
 */

const fs = require('fs');
const path = require('path');

// sw.js lives in the project root (one level up from /scripts)
const swPath = path.join(__dirname, '..', 'sw.js');

if (!fs.existsSync(swPath)) {
    console.error('❌ Could not find sw.js at:', swPath);
    process.exit(1);
}

let content = fs.readFileSync(swPath, 'utf8');

// Match pattern like: const CACHE_NAME = 'flt-v13';
const match = content.match(/const CACHE_NAME = 'flt-v(\d+)'/);

if (!match) {
    console.error('❌ Could not find CACHE_NAME pattern in sw.js');
    console.error('   Expected format: const CACHE_NAME = \'flt-vN\'');
    process.exit(1);
}

const currentVersion = parseInt(match[1], 10);
const newVersion     = currentVersion + 1;

content = content.replace(
    `const CACHE_NAME = 'flt-v${currentVersion}'`,
    `const CACHE_NAME = 'flt-v${newVersion}'`
);

fs.writeFileSync(swPath, content, 'utf8');

console.log('');
console.log('✅ Service worker cache bumped:');
console.log(`   flt-v${currentVersion}  →  flt-v${newVersion}`);
console.log('');
console.log('📦 Ready to deploy! Upload your files now.');
console.log('');
