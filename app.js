export function initApp(){
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const english=document.documentElement.lang==='en';
const descriptions=english?{
  voxel:{label:'01 / EXPERIMENTAL MECHANICS',title:'Voxel Physics Lab',summary:'A Rust research prototype representing matter with voxel volumes and directional bonds.',points:['Wood anisotropy: grain orientation affects bond stiffness and fracture.','Contact and external forces use a shared mechanical solver.','The repository includes mechanical checks, experiment captures and a limitations log.'],limit:'The prototype does not yet demonstrate validated full cutting and has not reached its target performance in large scenes.',tags:['Rust','wgpu / winit','Mechanical experiments'],url:'https://github.com/TheLastie/Voxel-sim'},
  offline:{label:'02 / ON-DEVICE AI',title:'OfflineRef',summary:'An Android reference app with its own knowledge base, document search, an on-device language model and source links.',points:['Import TXT, Markdown and PDF; OCR scans on the device.','Qwen2.5-3B and llama.cpp run locally after the initial model download.','A verbatim mode returns retrieved text without generation; chat history can be saved.'],limit:'Capabilities are summarized from the project README.',tags:['Kotlin','llama.cpp','SQLite','tesseract / PdfBox'],url:'https://github.com/TheLastie/Droid-llm-helper'},
  motion:{label:'03 / MACHINE LEARNING',title:'JA Inspector Trainer',summary:'A system for training and comparing models on human movement sequences.',points:['Prepare skeletal data and sequences with 11 joint angles or 44 features.','RAE, Transformer, LSTM VAE and joint-error classifier.','Manage experiments, tune parameters and produce summary reports.'],limit:'Based on the project documentation. Trained models are available in the repository; this site does not assess exercise technique.',tags:['Python','PyTorch','LSTM / Transformer','Experiments'],url:'https://github.com/TheLastie/JA_inspector_model_trainer'}
}:{
  voxel:{label:'01 / ЭКСПЕРИМЕНТАЛЬНАЯ МЕХАНИКА',title:'Voxel Physics Lab',summary:'Исследовательский прототип на Rust: материю описывают воксельные объёмы и направленные связи между ними.',points:['Анизотропия древесины: ориентация волокон влияет на жёсткость и разрушение связей.','Контакт и внешние силы проходят через общий механический решатель.','В репозитории есть механические проверки, записи экспериментов и журнал ограничений.'],limit:'Прототип ещё не демонстрирует проверенное полное разрезание и не достигает целевой производительности в больших сценах.',tags:['Rust','wgpu / winit','Механические эксперименты'],url:'https://github.com/TheLastie/Voxel-sim'},
  offline:{label:'02 / ЛОКАЛЬНЫЙ ИИ',title:'OfflineRef',summary:'Android-справочник со своей базой знаний: поиск, локальная языковая модель и ссылки на найденные фрагменты.',points:['Импорт TXT, Markdown и PDF; OCR сканов на устройстве.','Qwen2.5-3B и llama.cpp работают локально после первоначальной загрузки.','Дословный режим выводит найденный текст без генерации; предусмотрено сохранение чата.'],limit:'Возможности описаны по README проекта.',tags:['Kotlin','llama.cpp','SQLite','tesseract / PdfBox'],url:'https://github.com/TheLastie/Droid-llm-helper'},
  motion:{label:'03 / МАШИННОЕ ОБУЧЕНИЕ',title:'JA Inspector Trainer',summary:'Система для обучения и сравнения моделей на последовательностях движений человека.',points:['Подготовка скелетных данных и последовательностей из 11 углов или 44 признаков.','RAE, Transformer, LSTM VAE и классификатор ошибок по суставам.','Управление экспериментами, подбор параметров и сводные отчёты.'],limit:'Описание подготовлено по документации проекта. Обученные модели доступны в исходном репозитории; сайт не выполняет оценку техники упражнений.',tags:['Python','PyTorch','LSTM / Transformer','Эксперименты'],url:'https://github.com/TheLastie/JA_inspector_model_trainer'}
};
const dialog=$('#project-dialog');
function openProject(id,capture=false){
  const p=descriptions[id];
  const content=$('#dialog-content');content.replaceChildren();
  const kicker=document.createElement('div');kicker.className='section-kicker';kicker.textContent=p.label;content.append(kicker);
  const h=document.createElement('h2');h.textContent=p.title;content.append(h);
  const summary=document.createElement('p');summary.textContent=p.summary;content.append(summary);
  const heading=document.createElement('h3');heading.textContent='Что внутри';content.append(heading);
  const list=document.createElement('ul');for(const point of p.points){const li=document.createElement('li');li.textContent=point;list.append(li)}content.append(list);
  const tags=document.createElement('div');tags.className='tags';for(const tag of p.tags){const span=document.createElement('span');span.textContent=tag;tags.append(span)}content.append(tags);
  if(capture){const image=document.createElement('img');image.src=(document.documentElement.lang==='en'?'../':'')+'voxel-capture.gif';image.alt='Оригинальная запись раннего эксперимента контакта лезвия и дерева из репозитория Voxel-sim';content.append(image);const note=document.createElement('p');note.textContent='Оригинальная запись раннего прототипа контакта. Полное отделение образца здесь не демонстрируется.';content.append(note);}
  const warning=document.createElement('p');warning.className='dialog-warning';warning.textContent=p.limit;content.append(warning);
  const link=document.createElement('a');link.href=p.url;link.target='_blank';link.rel='noopener';link.className='button dark';link.textContent='Исходники и документация ↗';content.append(link);
  dialog.showModal();dialog.scrollTop=0;
}
$$('[data-open]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.open)));
$('.dialog-close')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
$('#show-capture')?.addEventListener('click',()=>openProject('voxel',true));
$('#load-x')?.addEventListener('click',()=>{const feed=$('#x-feed');feed.replaceChildren();const status=document.createElement('p');status.className='feed-status';status.textContent='Лента загружается с X. Если она недоступна, фотографии можно открыть по ссылке ниже.';feed.append(status);const link=document.createElement('a');link.className='twitter-timeline';link.href='https://twitter.com/Satelituss';link.dataset.height='520';link.dataset.chrome='noheader nofooter noborders transparent';link.textContent='Публикации @Satelituss в X ↗';feed.append(link);if(window.twttr?.widgets)window.twttr.widgets.load(feed);else{const script=document.createElement('script');script.src='https://platform.twitter.com/widgets.js';script.async=true;script.onerror=()=>{status.textContent='X не загрузил встроенную ленту. Откройте профиль по ссылке ниже.';};document.body.append(script);}});

return ()=>{if(dialog?.open)dialog.close();};
}
