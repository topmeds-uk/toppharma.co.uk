const fs=require('fs');
const path=require('path');
const assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const pages=JSON.parse(fs.readFileSync(path.join(__dirname,'pages.json'),'utf8'));
async function main(){
 const titles=new Set(), descriptions=new Set();
 for(const {file,url} of pages){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file+' H1');
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1,file+' canonical count');
  assert(html.includes(`rel="canonical" href="${url}"`),file+' canonical URL');
  const title=html.match(/<title>(.*?)<\/title>/)[1];
  const description=html.match(/name="description" content="([^"]+)"/)[1];
  assert(!titles.has(title),file+' duplicate title'); titles.add(title);
  assert(!descriptions.has(description),file+' duplicate description'); descriptions.add(description);
  assert(!/topmeds|northwestmeds|googletagmanager|script\.google\.com|GTM-|G-[A-Z0-9]{8,}/i.test(html),file+' old integrations');
  for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
  for(const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(?:https?:|#|data:)/.test(href)) continue;
   let target=path.resolve(path.dirname(path.join(root,file)),href.split(/[?#]/)[0]);
   if(href.endsWith('/')) target=path.join(target,'index.html');
   assert(fs.existsSync(target),file+' broken link '+href);
  }
 }
 console.log('PASS: 26 pages; unique titles/descriptions, single H1/canonical, valid JSON-LD, local links and integration isolation.');
 const base='http://localhost/toppharma.co.uk/';
 for(const {file} of pages){const response=await fetch(base+file.replace(/index\.html$/,'')); assert.equal(response.status,200,file+' HTTP status');}
 for(const route of ['source/homepage-original.html','tools/build.js','README.md']){
  const response=await fetch(base+route); assert.equal(response.status,403,route+' must not be public');
 }
 const missing=await fetch(base+'does-not-exist'); assert.equal(missing.status,404,'404 status');
 const redirect=await fetch(base+'shop/index.html',{redirect:'manual'}); console.log('Index redirect:',redirect.status,redirect.headers.get('location'));
 console.log('PASS: Apache serves all pages, blocks private source files and returns HTTP 404.');
 const candidates=['C:/Users/Hp/node_modules/playwright','C:/xampp/htdocs/node_modules/playwright'];
 const cache='C:/Users/Hp/AppData/Local/npm-cache/_npx';
 if(fs.existsSync(cache))for(const dir of fs.readdirSync(cache))candidates.push(path.join(cache,dir,'node_modules/playwright'));
 let playwright;
 for(const candidate of candidates){try{playwright=require(candidate); console.log('Browser library:',candidate);break;}catch{}}
 if(!playwright){console.log('Browser library unavailable.');return;}
 const browser=await playwright.chromium.launch({headless:true});
 const tab=await browser.newPage(); const errors=[];
 tab.on('pageerror',e=>errors.push(e.message));
 await tab.goto(base);
 await tab.screenshot({path:path.join(root,'tools/home-desktop.png'),fullPage:true});
 await tab.goto(base+'shop/');
 await tab.fill('#medicine-search','diazepam');assert.equal(await tab.locator('[data-search]:visible').count(),1);
 await tab.fill('#medicine-search','no-such-medicine');assert(await tab.locator('#empty-state').isVisible());
 await tab.getByRole('button',{name:'Reset filters'}).click();await tab.waitForTimeout(100);assert.equal(await tab.locator('[data-search]:visible').count(),10);
 await tab.selectOption('#category-filter','sleep');assert.equal(await tab.locator('[data-search]:visible').count(),3);
 await tab.setViewportSize({width:390,height:844});
 for(const {file} of pages){await tab.goto(base+file.replace(/index\.html$/,''));assert(await tab.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' horizontal overflow');}
 await tab.goto(base);await tab.locator('.menu').click();assert.equal(await tab.locator('.menu').getAttribute('aria-expanded'),'true');await tab.keyboard.press('Escape');assert.equal(await tab.locator('.menu').getAttribute('aria-expanded'),'false');
 await tab.locator('summary').first().click();assert(await tab.locator('details').first().getAttribute('open')!==null);
 await tab.screenshot({path:path.join(root,'tools/home-mobile.png'),fullPage:true});
 assert.deepEqual(errors,[]);await browser.close();
 console.log('PASS: desktop/mobile screenshots, search, empty state, reset, category filter, menu, FAQ, and all-page mobile overflow checks.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
