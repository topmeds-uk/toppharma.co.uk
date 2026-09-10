const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const pages = [...JSON.parse(fs.readFileSync(path.join(__dirname, 'pages.json'))), {file:'404/index.html'}];
for (const {file} of pages) {
  const target = path.join(root, file);
  let html = fs.readFileSync(target, 'utf8');
  const prefix = file === 'index.html' ? './' : '../'.repeat(file.split('/').length - 1);
  html = html.replace(/<a class="logo"([^>]*)>[\s\S]*?<\/a>/g, `<a class="logo"$1><img src="${prefix}assets/img/header-footer-logo.svg" alt="Top Pharma" class="brand-logo"></a>`);
  html = html.replace(/<link rel="icon"[^>]*>/g, `<link rel="icon" href="${prefix}assets/img/favicon-32x32.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="${prefix}assets/img/apple-touch-icon.png">`);
  html = html.replace('<meta name="twitter:card" content="summary">', '<meta name="twitter:card" content="summary_large_image">');
  html = html.replace('</head>', '<meta property="og:image" content="https://toppharma.co.uk/assets/img/og-image.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Top Pharma"><meta name="twitter:image" content="https://toppharma.co.uk/assets/img/og-image.png"></head>');
  html = html.replace('</head>', `<link rel="stylesheet" href="${prefix}assets/css/brand.css"></head>`);
  fs.writeFileSync(target, html);
}
