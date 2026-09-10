const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const cache='C:/Users/Hp/AppData/Local/npm-cache/_npx';
let pw;
for(const dir of fs.readdirSync(cache)){try{pw=require(path.join(cache,dir,'node_modules/playwright'));break;}catch{}}
if(!pw)throw new Error('Playwright unavailable');
(async()=>{const browser=await pw.chromium.launch({headless:true});const page=await browser.newPage({deviceScaleFactor:1});
for(const [input,output,width,height] of [['og-image.svg','og-image.png',1200,630],['favicon-180x180.svg','apple-touch-icon.png',180,180]]){
await page.setViewportSize({width,height});
const svg=fs.readFileSync(path.join(root,'assets/img',input),'utf8').replace(/<\?xml[^>]*>/,'');
await page.setContent(`<style>html,body{margin:0;width:100%;height:100%;overflow:hidden}svg{display:block;width:100%;height:100%}</style>${svg}`);
await page.screenshot({path:path.join(root,'assets/img',output),omitBackground:true});
}
await browser.close();console.log('Exported OG image and Apple touch icon.');})().catch(e=>{console.error(e);process.exitCode=1});
