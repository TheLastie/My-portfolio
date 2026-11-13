(()=>{
 const knownCisBrowserLanguages=/^(ru|be|kk|ky|uz|tg|hy|az)(-|$)/i;
 const cleanPath=path=>path==='/'?'/index.html':path;
 const path=cleanPath(location.pathname);
 const isEnglish=path.startsWith('/en/');
 const originalPath=isEnglish?path.slice(3):path;
 const supported=['/index.html','/photo.html','/programming.html'];
 const chosen=(()=>{try{return localStorage.getItem('lastie-language')}catch{return null}})();
 if(!chosen&&!isEnglish&&supported.includes(originalPath)){
   const primary=(navigator.languages&&navigator.languages[0])||navigator.language||'en';
   if(!knownCisBrowserLanguages.test(primary)){const show=()=>{if(document.getElementById('lang-suggest'))return;const bar=document.createElement('div');bar.id='lang-suggest';bar.setAttribute('role','region');bar.setAttribute('aria-label','Language');bar.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:50;display:flex;gap:12px;align-items:center;justify-content:space-between;padding:12px 14px;background:#24251f;color:#efeee8;border-radius:10px;font:14px/1.3 system-ui,sans-serif';const link=document.createElement('a');link.href='/en'+originalPath;link.lang='en';link.textContent='View this page in English';link.style.cssText='color:#d7ff79;font-weight:600';const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Close');close.style.cssText='min-width:44px;min-height:44px;background:none;border:0;color:inherit;font-size:22px';close.addEventListener('click',()=>{bar.remove();try{localStorage.setItem('lastie-language','ru')}catch{}});link.addEventListener('click',()=>{try{localStorage.setItem('lastie-language','en')}catch{}});bar.append(link,close);document.body.append(bar)};if(document.body)show();else document.addEventListener('DOMContentLoaded',show);}
 }
 document.addEventListener('click',event=>{
   const link=event.target.closest('.language-switch');
   if(!link)return;
   try{localStorage.setItem('lastie-language',link.href.includes('/en/')?'en':'ru')}catch{}
 });
})();