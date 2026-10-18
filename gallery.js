export function initGallery(){
const viewer=document.querySelector('#photo-viewer');
if(!viewer)return ()=>{};
const lifetime=new AbortController();
let themeFrame=0;
const triggers=[...document.querySelectorAll('[data-photo]')];
const items=[...document.querySelectorAll('.photo-item')];
const assetPrefix=document.documentElement.lang==='en'?'../':'';
const originals=['photos/original/hedgehog.png','photos/original/tower.jpg','photos/original/forest.jpg','photos/original/lantern.jpg','photos/original/dog.jpg','photos/original/tree.jpg'];
const galleryImages=[...document.querySelectorAll('.photo-item img, .satellite-cover>img')];
function markPhotoState(image,failed){
 const card=image.closest('.photo-item>button, .photo-item button');
 const cover=image.closest('.satellite-cover');
 if(card)card.classList.toggle('is-photo-missing',failed);
 if(cover)cover.classList.toggle('is-photo-missing',failed);
}
galleryImages.forEach(image=>{
 image.addEventListener('error',()=>markPhotoState(image,true),{signal:lifetime.signal});
 image.addEventListener('load',()=>markPhotoState(image,false),{signal:lifetime.signal});
 if(image.complete&&!image.naturalWidth)markPhotoState(image,true);
});
const viewerImage=document.querySelector('#viewer-image');
viewerImage.addEventListener('error',()=>viewer.classList.add('image-missing'),{signal:lifetime.signal});
viewerImage.addEventListener('load',()=>viewer.classList.remove('image-missing'),{signal:lifetime.signal});
let current=0;
function showPhoto(index){
 current=(index+items.length)%items.length;
 const source=items[current].querySelector('img');const image=viewerImage;viewer.classList.toggle('image-missing',source.complete&&!source.naturalWidth);image.src=source.currentSrc||source.src;image.alt=source.alt;
 document.querySelector('#viewer-counter').textContent=`${String(current+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
 document.querySelector('#viewer-title').textContent=items[current].querySelector('figcaption>span').textContent;
 document.querySelector('#viewer-original').href=assetPrefix+originals[current];
}
triggers.forEach(button=>button.addEventListener('click',()=>{showPhoto(Number(button.dataset.photo));viewer.showModal();}));
document.querySelector('#viewer-prev').addEventListener('click',()=>showPhoto(current-1));
document.querySelector('#viewer-next').addEventListener('click',()=>showPhoto(current+1));
document.querySelector('#viewer-close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(current-1)}else if(event.key==='ArrowRight'){event.preventDefault();showPhoto(current+1)}});
viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
let startX=null;let startY=null;
viewer.addEventListener('touchstart',event=>{startX=event.changedTouches[0].clientX;startY=event.changedTouches[0].clientY;},{passive:true});
viewer.addEventListener('touchend',event=>{if(startX===null)return;const dx=event.changedTouches[0].clientX-startX,dy=event.changedTouches[0].clientY-startY;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)showPhoto(current+(dx<0?1:-1));startX=null;startY=null;},{passive:true});

// Each palette follows the photograph, with readable foreground colors.
const palettes=[
 {paper:'#e9dfc4',ink:'#302b1e',muted:'#71664c',line:'#c7bda2',accent:'#a94320',panel:'#dcd0ad'},
 {paper:'#dce0eb',ink:'#222b3c',muted:'#626b7e',line:'#b8c2d3',accent:'#9b5a16',panel:'#cbd2e0'},
 {paper:'#e0e5d6',ink:'#273225',muted:'#65705c',line:'#b8c2ac',accent:'#6b782b',panel:'#d0d9c2'},
 {paper:'#eee3d3',ink:'#3d3030',muted:'#7c6b6b',line:'#d4c3bd',accent:'#856285',panel:'#e4d4c4'},
 {paper:'#e4e1de',ink:'#302b2a',muted:'#766c69',line:'#c4bcb7',accent:'#915d3b',panel:'#d7d1cb'},
 {paper:'#222a20',ink:'#e7e2cc',muted:'#afb39b',line:'#48513b',accent:'#e2a16c',panel:'#303b2b'}
];
const scenes=[...document.querySelectorAll('[data-photo-scene]')];
let activePalette=-1;let themeQueued=false;
function updateScrollTheme(){
 themeQueued=false;if(viewer.open)return;
 const target=window.innerHeight*.5;
 let closest=scenes[0],distance=Infinity;
 for(const scene of scenes){const box=scene.getBoundingClientRect();const d=target<box.top?box.top-target:target>box.bottom?target-box.bottom:0;if(d<distance){closest=scene;distance=d;}}
 const index=Number(closest.dataset.photoScene);if(index===activePalette)return;activePalette=index;
 const palette=palettes[index];const root=document.documentElement;
 for(const [name,color] of Object.entries(palette))root.style.setProperty(name==='accent'?'--orange':name==='panel'?'--theme-panel':'--'+name,color);
 document.querySelector('meta[name="theme-color"]').content=palette.paper;
 document.body.dataset.palette=String(index);
}
function queueTheme(){if(themeQueued)return;themeQueued=true;themeFrame=requestAnimationFrame(updateScrollTheme);}
window.addEventListener('scroll',queueTheme,{passive:true,signal:lifetime.signal});window.addEventListener('resize',queueTheme,{signal:lifetime.signal});window.addEventListener('load',queueTheme,{signal:lifetime.signal});
viewer.addEventListener('close',queueTheme);
updateScrollTheme();

return ()=>{lifetime.abort();cancelAnimationFrame(themeFrame);if(viewer.open)viewer.close();};
}
