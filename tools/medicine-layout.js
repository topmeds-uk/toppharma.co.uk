const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const images={diazepam:'diazepam-5-mg-square.webp',lorazepam:'lorazepam-2-mg-nrx.webp',clonazepam:'clonazepam-2-mg-rivotril.webp',pregabalin:'pregabalin-450-mg-meiamed.webp',zopiclone:'zopiclone-10-mg-rx.webp'};
const pages=JSON.parse(fs.readFileSync(path.join(__dirname,'pages.json'),'utf8'));
for(const {file} of pages){
 const target=path.join(root,file),prefix=file==='index.html'?'./':'../'.repeat(file.split('/').length-1);
 let html=fs.readFileSync(target,'utf8');
 html=html.replace(/<article class="medicinecard"[\s\S]*?<\/article>/g,card=>{
  const slug=card.match(/shop\/medicine\/([^/]+)\//)?.[1];
  if(!images[slug])return card;
  return card.replace(/<div class="medart"[\s\S]*?<\/div>/,`<a class="medicine-photo" href="${prefix}shop/medicine/${slug}/" tabindex="-1" aria-hidden="true"><img src="${prefix}assets/img/medicine/${images[slug]}" alt="" loading="lazy" decoding="async"></a>`);
 });
 const slug=file.match(/^shop\/medicine\/([^/]+)\//)?.[1];
 if(slug&&images[slug]){
  const name=slug.charAt(0).toUpperCase()+slug.slice(1);
  html=html.replace('<article class="reading">',`<article class="reading"><figure class="medicine-feature"><img src="${prefix}assets/img/medicine/${images[slug]}" alt="${name} packaging supplied for this medicine guide" decoding="async"><figcaption>Supplied packaging image. Presentations vary; check the leaflet for your own medicine. This image does not confirm availability or suitability.</figcaption></figure>`);
 }
 if(html.includes('<article class="reading">')){
  const toc=[];
  html=html.replace(/<article class="reading">([\s\S]*?)<\/article>/,(_,body)=>'<article class="reading">'+body.replace(/<h2>([\s\S]*?)<\/h2>/g,(_,heading)=>{
   const id='section-'+(toc.length+1);toc.push(`<a href="#${id}">${heading}</a>`);return `<h2 id="${id}">${heading}</h2>`;
  })+'</article>');
  const navigation=`<nav class="page-contents" aria-label="On this page"><h2>On this page</h2>${toc.join('')}</nav>`;
  if(html.includes('<aside class="sidepanel">'))html=html.replace('<aside class="sidepanel">','<aside class="sidepanel">'+navigation);
  else html=html.replace('<section class="section wrap"><article class="reading">','<section class="section wrap articlelayout"><article class="reading">').replace('</article></section>',`</article><aside class="sidepanel">${navigation}<h2>Questions?</h2><p>Find the right person to ask about your medicine.</p><a href="${prefix}contact-us/">Find support →</a></aside></section>`);
 }
 html=html.replace('</head>',`<link rel="stylesheet" href="${prefix}assets/css/medicine-layout.css"></head>`);
 fs.writeFileSync(target,html);
}
console.log('Applied medicine photography and article navigation layout.');
