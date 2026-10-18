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
   if(!knownCisBrowserLanguages.test(primary)) location.replace('/en'+originalPath);
 }
 document.addEventListener('click',event=>{
   const link=event.target.closest('.language-switch');
   if(!link)return;
   try{localStorage.setItem('lastie-language',link.href.includes('/en/')?'en':'ru')}catch{}
 });
})();