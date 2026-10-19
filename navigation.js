import {initApp} from './app.js';
import {initGallery} from './gallery.js';

const routes=new Set(['/index.html','/photo.html','/programming.html','/en/index.html','/en/photo.html','/en/programming.html']);
const cache=new Map();
const positions=new Map();
const themeKeys=['--paper','--ink','--muted','--line','--orange','--theme-panel'];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const status=document.querySelector('.navigation-status');
let cleanups=[];
let currentRoute=routeOf(location.href);
let moving=false;
let queued=null;

function routeOf(value){
 const url=new URL(value,location.href);
 if(url.origin!==location.origin)return null;
 let path=url.pathname;
 if(path==='/')path='/index.html';
 if(path==='/en/')path='/en/index.html';
 if(path.length>1&&path.endsWith('/'))path=path.slice(0,-1);
 return routes.has(path)?path:null;
}
function readPositions(){try{const saved=JSON.parse(sessionStorage.getItem('lastie-scroll')||'{}');for(const [route,y]of Object.entries(saved))if(routes.has(route)&&Number.isFinite(y))positions.set(route,Math.max(0,y));}catch{}}
function savePosition(){if(!currentRoute)return;positions.set(currentRoute,window.scrollY);try{sessionStorage.setItem('lastie-scroll',JSON.stringify(Object.fromEntries(positions)));}catch{}}
function mountPage(){cleanups=[initApp(),initGallery()];mountProjectGallery();}
function mountProjectGallery(){
 const section=document.querySelector('#web-lab');
 const tabs=section?.querySelector('.lab-tabs');
 if(!section||!tabs||tabs.querySelector('[role="tab"]')||section.dataset.galleryBoot==='loading'||section.dataset.galleryBoot==='loaded')return;
 section.dataset.galleryBoot='loading';
 const loadScript=src=>new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  script.src=new URL(src,import.meta.url).href;
  script.onload=resolve;
  script.onerror=()=>reject(new Error('Project gallery script failed to load'));
  document.head.append(script);
 });
 loadScript('./web-lab.js?v=4').then(()=>{
  if(!tabs.querySelector('[role="tab"]'))throw new Error('Project tabs were not initialized');
  return loadScript('./project-scroll.js?v=4');
 }).then(()=>{section.dataset.galleryBoot='loaded';}).catch(()=>{
  section.dataset.galleryBoot='failed';
  const status=section.querySelector('[data-lab-status]');
  if(status)status.textContent=document.documentElement.lang==='en'?'Could not load project previews. Please refresh the page.':'Не удалось загрузить предпросмотр проектов. Обновите страницу.';
 });
}
function loadPage(route){
 if(cache.has(route))return cache.get(route);
 const promise=fetch(new URL(route,location.origin),{credentials:'same-origin',headers:{Accept:'text/html'}}).then(async response=>{
  if(!response.ok)throw new Error('Page unavailable');
  const page=new DOMParser().parseFromString(await response.text(),'text/html');
  if(!page.getElementById('page-view'))throw new Error('Full navigation required');
  const cover=page.querySelector('[fetchpriority="high"],.hero-visual img,.direction-photo-cover');
  if(cover){const image=new Image();image.src=new URL(cover.getAttribute('src'),new URL(route,location.origin)).href;}
  return page;
 }).catch(error=>{cache.delete(route);throw error;});
 cache.set(route,promise);return promise;
}
function scrollToDestination(url,y){
 const anchor=url.hash?document.getElementById(decodeURIComponent(url.hash.slice(1))):null;
 if(anchor){const top=anchor.getBoundingClientRect().top+window.scrollY-25;window.scrollTo({top,behavior:'instant'});}
 else window.scrollTo({top:Math.max(0,y),behavior:'instant'});
}
function replaceShell(selector,page){
 const current=document.querySelector(selector),next=page.querySelector(selector);
 if(current&&next)current.replaceWith(document.importNode(next,true));
}
function syncMetadata(page){
 document.documentElement.lang=page.documentElement.lang||'ru';
 document.title=page.title;
 for(const source of page.querySelectorAll('meta[name],meta[property]')){
  const key=source.hasAttribute('name')?'meta[name="'+source.getAttribute('name')+'"]':'meta[property="'+source.getAttribute('property')+'"]';
  let target=document.querySelector(key);
  if(!target){target=document.createElement('meta');if(source.name)target.name=source.name;else target.setAttribute('property',source.getAttribute('property'));document.head.append(target);}
  target.content=source.content;
 }
 for(const source of page.querySelectorAll('link[rel="canonical"],link[rel="alternate"]')){
  const selector=source.rel==='canonical'?'link[rel="canonical"]':'link[rel="alternate"][hreflang="'+source.hreflang+'"]';
  let target=document.querySelector(selector);
  if(!target){target=document.createElement('link');target.rel=source.rel;if(source.hreflang)target.hreflang=source.hreflang;document.head.append(target);}
  target.href=source.href;
 }
}
function replacePage(page,url,y,mode){
 for(const cleanup of cleanups)cleanup?.();cleanups=[];
 replaceShell('.skip',page);
 replaceShell('.header',page);
 const next=document.importNode(page.getElementById('page-view'),true);
 document.getElementById('page-view').replaceWith(next);
 replaceShell('footer',page);
 document.body.className=page.body.className;
 for(const key of Object.keys(document.body.dataset))delete document.body.dataset[key];
 for(const [key,value]of Object.entries(page.body.dataset))document.body.dataset[key]=value;
 for(const key of themeKeys)document.documentElement.style.removeProperty(key);
 syncMetadata(page);
 currentRoute=routeOf(url.href);
 if(mode==='push')history.pushState({route:currentRoute,scrollY:y},'',url.href);
 scrollToDestination(url,y);
 mountPage();
 const main=document.querySelector('#main');main.setAttribute('tabindex','-1');main.focus({preventScroll:true});
 status.textContent=document.documentElement.lang==='en'?'Section opened: '+document.title:'Открыт раздел: '+document.title;
}
async function navigate(value,{mode='push',scrollY}={}){
 const url=new URL(value,location.href),route=routeOf(url.href);
 if(!route)return;
 if(moving){queued={value:url.href,options:{mode,scrollY}};return;}
 if(route===currentRoute){if(url.hash)scrollToDestination(url,0);return;}
 moving=true;savePosition();
 if(mode==='push')history.replaceState({...history.state,route:currentRoute,scrollY:window.scrollY},'',location.href);
 const y=Number.isFinite(scrollY)?scrollY:(positions.get(route)||0);
 try{
  status.textContent=document.documentElement.lang==='en'?'Opening section…':'Открываю раздел…';
  const page=await loadPage(route);
  const direction=route.endsWith('/photo.html')?'photo':route.endsWith('/programming.html')?'code':'home';
  document.documentElement.dataset.transitionDirection=direction;
  document.documentElement.classList.add('route-changing');
  if(document.startViewTransition&&!reducedMotion.matches){
   const transition=document.startViewTransition(()=>replacePage(page,url,y,mode));
   await transition.finished.catch(()=>{});
  }else if(!reducedMotion.matches&&document.getElementById('page-view').animate){
   const side=direction==='photo'?1:-1;
   await document.getElementById('page-view').animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX('+(-side*45)+'px)'}],{duration:170,easing:'ease-in',fill:'forwards'}).finished;
   replacePage(page,url,y,mode);
   await document.getElementById('page-view').animate([{opacity:0,transform:'translateX('+(side*55)+'px)'},{opacity:1,transform:'translateX(0)'}],{duration:360,easing:'cubic-bezier(.22,.61,.36,1)'}).finished;
  }else replacePage(page,url,y,mode);
 }catch{
  if(mode==='pop')location.replace(url.href);else location.assign(url.href);
 }finally{
  document.documentElement.classList.remove('route-changing');moving=false;
  if(queued){const next=queued;queued=null;void navigate(next.value,next.options);}
 }
}
document.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const link=event.target.closest('a[href]');if(!link||link.target||link.hasAttribute('download'))return;
 const url=new URL(link.href,location.href),route=routeOf(url.href);if(!route)return;
 if(route===currentRoute&&url.hash)return;
 event.preventDefault();void navigate(url.href);
});
function prefetch(event){const link=event.target.closest('a[href]');const route=link&&routeOf(link.href);if(route&&route!==currentRoute)void loadPage(route).catch(()=>{});}
document.addEventListener('pointerover',prefetch,{passive:true});document.addEventListener('focusin',prefetch);
window.addEventListener('popstate',event=>{const route=routeOf(location.href);if(route===currentRoute){scrollToDestination(new URL(location.href),event.state?.scrollY||0);return;}void navigate(location.href,{mode:'pop',scrollY:event.state?.scrollY});});
window.addEventListener('pagehide',savePosition);
readPositions();
history.scrollRestoration='manual';
history.replaceState({...history.state,route:currentRoute,scrollY:window.scrollY},'',location.href);
cache.set(currentRoute,Promise.resolve(document.cloneNode(true)));
mountPage();
const warmup=()=>{for(const route of routes)if(route!==currentRoute)void loadPage(route).catch(()=>{});};
if('requestIdleCallback'in window)window.requestIdleCallback(warmup,{timeout:1500});else setTimeout(warmup,500);

