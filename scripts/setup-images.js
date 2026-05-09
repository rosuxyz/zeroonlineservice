const fs = require('fs');
const path = require('path');

const images = [
  // Logos
  { src: 'C:\\Users\\Roshan Thapa\\.gemini\\antigravity\\brain\\b210382a-b79f-4b81-81d5-3399eded3942\\pubg_mobile_logo_1778307041294.png', dest: 'pubg-logo.png' },
  { src: 'C:\\Users\\Roshan Thapa\\.gemini\\antigravity\\brain\\b210382a-b79f-4b81-81d5-3399eded3942\\free_fire_logo_1778307061031.png', dest: 'free-fire-logo.png' },
  { src: 'C:\\Users\\Roshan Thapa\\.gemini\\antigravity\\brain\\b210382a-b79f-4b81-81d5-3399eded3942\\mobile_legends_logo_1778307083084.png', dest: 'mlbb-logo.png' },
  { src: 'C:\\Users\\Roshan Thapa\\.gemini\\antigravity\\brain\\b210382a-b79f-4b81-81d5-3399eded3942\\valorant_logo_custom_1778307104978.png', dest: 'valorant-logo.png' },
  
  // Banners
  { src: 'C:\\Users\\Roshan Thapa\\.gemini\\antigravity\\brain\\b210382a-b79f-4b81-81d5-3399eded3942\\free_fire_banner_premium_1778308370516.png', dest: 'free-fire-banner.png' },
  { src: 'C:\\Users\\Roshan Thapa\\.gemini\\antigravity\\brain\\b210382a-b79f-4b81-81d5-3399eded3942\\pubg_mobile_banner_premium_1778308389405.png', dest: 'pubg-banner.png' },
  { src: 'C:\\Users\\Roshan Thapa\\.gemini\\antigravity\\brain\\b210382a-b79f-4b81-81d5-3399eded3942\\mobile_legends_banner_premium_1778308408014.png', dest: 'mlbb-banner.png' },
  { src: 'C:\\Users\\Roshan Thapa\\.gemini\\antigravity\\brain\\b210382a-b79f-4b81-81d5-3399eded3942\\valorant_banner_premium_1778308425661.png', dest: 'valorant-banner.png' },
  { src: 'C:\\Users\\Roshan Thapa\\.gemini\\antigravity\\brain\\b210382a-b79f-4b81-81d5-3399eded3942\\gaming_banner_generic_1778307129202.png', dest: 'banner-generic.png' },
];

const publicDir = path.join(__dirname, '..', 'public', 'games');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

images.forEach(img => {
  if (fs.existsSync(img.src)) {
    const destPath = path.join(publicDir, img.dest);
    fs.copyFileSync(img.src, destPath);
    console.log(`Copied ${img.dest}`);
  } else {
    console.warn(`Source not found: ${img.src}`);
  }
});
