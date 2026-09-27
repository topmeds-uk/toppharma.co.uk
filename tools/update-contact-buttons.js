const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const label='Contact Our Pharmacy Team';
const buildPath=path.join(__dirname,'build.js');
let build=fs.readFileSync(buildPath,'utf8');
build=build.replace('<a class="navcta" href="/shop/">Explore medicines ',`<a class="navcta" href="/contact-us/">${label} `);
const marker="${link(url,label+' ↗','button')}";
const addition="${link('/contact-us/','Contact Our Pharmacy Team','button secondary')}";
if(!build.includes(marker+addition)){assert(build.includes(marker));build=build.replace(marker,marker+addition);}
fs.writeFileSync(buildPath,build);
let headers=0,medicines=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 if(['.git','tools','source'].includes(entry.name))continue;
 const target=path.join(dir,entry.name);
 if(entry.isDirectory()){walk(target);continue;}
 if(!entry.name.endsWith('.html'))continue;
 const original=fs.readFileSync(target,'utf8');let html=original;
 html=html.replace(/<a class="navcta" href="([^"]*)">Explore medicines ([\s\S]*?)<\/a>/g,(_,href,icon)=>{headers++;return `<a class="navcta" href="${href.replace(/shop\/$/,'contact-us/')}">${label} ${icon}</a>`;});
 if(path.relative(root,target).replaceAll('\\','/').startsWith('shop/medicine/')){
  const prefix=path.relative(path.dirname(target),root).replaceAll('\\','/')+'/';
  const button=`<a href="${prefix}contact-us/" class="button secondary">${label}</a>`;
  if(!html.includes(button)){
   let found=false;
   html=html.replace(/(<a href="https:\/\/(?:www\.nhs\.uk|www\.medicines\.org\.uk)[^"]*" class="button">[\s\S]*?<\/a>)/,match=>{found=true;return match+button;});
   assert(found,'Missing information button: '+target);medicines++;
  }
 }
 if(html!==original)fs.writeFileSync(target,html);
}}
walk(root);
console.log(`Updated ${headers} header buttons and ${medicines} medicine-page buttons. Only targeted anchor changes applied; other content preserved.`);
