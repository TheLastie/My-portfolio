(() => {
  const scriptUrl = document.currentScript?.src;
  const root = new URL('.', scriptUrl || location.href);
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('web-lab.css?v=9', root).href;
  document.head.append(stylesheet);
  const section = document.querySelector('#web-lab');
  if (!section) return;
  document.querySelector('#work')?.before(section);
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
  const projects = [
    { id: 'levelseed', name: 'LevelSeed', url: 'https://thelastie.github.io/levelseed/', repo: 'levelseed', type: ['LEVEL DESIGN', 'PLAYABLE WORLDS'], typeRu: ['ДИЗАЙН УРОВНЕЙ', 'ИГРОВОЙ МИР'], about: 'Build repeatable dungeon levels, then enter the same world and fight through to its boss.', aboutRu: 'Соберите повторяемое подземелье, войдите в тот же мир и доберитесь до босса.' },
    { id: 'pathfinding-visualizer', name: 'Pathfinding Visualizer', url: 'https://thelastie.github.io/pathfinding-visualizer/', repo: 'pathfinding-visualizer', type: ['GAME NAVIGATION', 'JSON EXPORT'], typeRu: ['НАВИГАЦИЯ УРОВНЯ', 'ЭКСПОРТ JSON'], about: 'Test whether a game level is traversable; export the tested grid and route as JSON.', aboutRu: 'Проверьте, достижим ли выход на игровом уровне, и скачайте карту с маршрутом в JSON.' },
    { id: 'branchbook', name: 'Branchbook', url: 'https://thelastie.github.io/branchbook/', repo: 'branchbook', type: ['BRANCHING FICTION', '8 ENDINGS'], typeRu: ['ИСТОРИЯ С ВЫБОРОМ', '8 ИСХОДОВ'], about: 'Guide a lighthouse crew through three days before a storm, using field notes and choices that lead to eight endings.', aboutRu: 'Помогите команде маяка пережить три дня до шторма: сопоставляйте записи и доведите решения до одного из восьми исходов.' },
    { id: 'photo-terrain', name: 'Photo Terrain', url: 'https://thelastie.github.io/photo-terrain/', repo: 'photo-terrain', type: ['3D BLOCKOUT', 'OBJ / PNG'], typeRu: ['ЧЕРНОВОЙ 3D-УРОВЕНЬ', 'OBJ / PNG'], about: "Turn a photograph's brightness into a relative heightfield. Export a mesh or height map for a 3D blockout.", aboutRu: 'Создайте условный рельеф по яркости фотографии, сохраните сетку или карту высот для чернового 3D-уровня.' },
    { id: 'tonal', name: 'Tonal', url: 'https://thelastie.github.io/tonal/', repo: 'tonal', type: ['DESIGN PALETTE', 'CSS / JSON'], typeRu: ['ЦВЕТА ДЛЯ ДИЗАЙНА', 'CSS / JSON'], about: 'Pull a usable colour set from a photo and take it into a design as CSS variables or JSON.', aboutRu: 'Извлеките рабочую палитру из фотографии и перенесите её в проект через CSS-переменные или JSON.' },
    { id: 'exposure-lab', name: 'Exposure Lab', url: 'https://thelastie.github.io/Exposure-Lab/', repo: 'Exposure-Lab', type: ['CAMERA', 'FIELD NOTES'], typeRu: ['КАМЕРА', 'ЗАМЕТКИ СЪЁМКИ'], about: 'Rehearse a camera setup across scenes, see focus and white-balance changes, and save settings as a field note.', aboutRu: 'Подберите настройки для разных условий, оцените фокус и баланс белого, сохраните параметры кадра заметкой.' },
    { id: 'pixel-animation-studio', name: 'Pixel Animation Studio', url: 'https://thelastie.github.io/pixel-animation-studio/', repo: 'pixel-animation-studio', type: ['SPRITE WORKFLOW', 'GIF EXPORT'], typeRu: ['АНИМАЦИЯ СПРАЙТОВ', 'ЭКСПОРТ GIF'], about: 'Create a looping sprite, then export a GIF or sprite sheet for a game or small web animation.', aboutRu: 'Создайте зацикленный спрайт и экспортируйте GIF или лист кадров для игры и веб-анимации.' },
    { id: 'plant-growth', name: 'Silva · Plant Growth', url: 'https://thelastie.github.io/plant-growth/', repo: 'plant-growth', type: ['BOTANICAL REFERENCES', 'GROWTH STUDIES'], typeRu: ['БОТАНИЧЕСКИЕ РЕФЕРЕНСЫ', 'РОСТ И ФОРМА'], about: 'Explore how age, light, water, and wind change a plant’s branching form; save the generated reference.', aboutRu: 'Посмотрите, как возраст, свет, влага и ветер меняют ветвление растения; сохраните получившийся референс.' },
    { id: 'waymark', name: 'Waymark', url: 'https://thelastie.github.io/Waymark/', repo: 'Waymark', type: ['ACCESSIBLE ROUTES', 'FIELD REPORTS'], typeRu: ['ДОСТУПНЫЕ МАРШРУТЫ', 'ПОЛЕВЫЕ ОТЧЁТЫ'], about: 'Compare routes by steps, slopes, surfaces, and crossings; record confirmed barriers or unknowns and export field notes.', aboutRu: 'Сопоставьте маршруты по ступеням, уклонам и покрытию, отметьте препятствия и места без данных, выгрузите полевой отчёт.' },
    { id: 'waterline', name: 'Waterline', url: 'https://thelastie.github.io/Waterline/', repo: 'Waterline', type: ['COASTAL SCENARIOS', 'RISK COMPARISON'], typeRu: ['ПРИБРЕЖНЫЕ СЦЕНАРИИ', 'СРАВНЕНИЕ РИСКА'], about: 'Compare how rain, tide, terrain, and local measures affect a fictional coastal district. This scenario model is not a flood forecast.', aboutRu: 'Сравните влияние ливня, прилива, рельефа и защитных мер на условный прибрежный район. Это учебная модель, не прогноз наводнения.' },
    { id: 'mendbook', name: 'Mendbook', url: 'https://thelastie.github.io/Mendbook/', repo: 'Mendbook', type: ['REPAIR HISTORY', 'LOCAL RECORDS'], typeRu: ['ИСТОРИЯ РЕМОНТА', 'ЛОКАЛЬНЫЙ АРХИВ'], about: 'Keep purchase details, warranties, maintenance costs, and reminders together; export a backup of browser-stored records.', aboutRu: 'Храните сведения о покупке, гарантии, ремонтах и напоминаниях в одном месте; данные остаются в браузере и экспортируются в резервную копию.' },
    { id: 'slatehouse', name: 'Slatehouse', url: 'https://thelastie.github.io/Slatehouse/', repo: 'Slatehouse', type: ['FILM PRODUCTION', 'SHOOTING SCHEDULES'], typeRu: ['КИНОПРОИЗВОДСТВО', 'СЪЁМОЧНЫЕ ПЛАНЫ'], about: 'Turn a script breakdown into a shoot-day schedule with locations, daylight windows, company moves, actor calls, and a printable call sheet.', aboutRu: 'Соберите съёмочный день из сцен: локации, световые окна, переезды, время актёров и готовый к печати call sheet.' }
  ];
  const copy = isEnglish ? { number: 'DEMO', status: 'Interactive preview. Use the project tabs to switch between experiments.', showPhone: 'Preview at phone width', showWide: 'Return to full-width preview' } : { number: 'ДЕМО', status: 'Интерактивный предпросмотр. Переключайтесь между проектами во вкладках.', showPhone: 'Предпросмотр в ширине телефона', showWide: 'Вернуть широкое окно предпросмотра' };
  const tabs = section.querySelector('[role="tablist"]');
  const frame = section.querySelector('iframe');
  const title = section.querySelector('h3[data-lab-title]');
  const windowTitle = section.querySelector('[data-lab-window]');
  const about = section.querySelector('[data-lab-about]');
  const tags = section.querySelector('[data-lab-tags]');
  const counter = section.querySelector('[data-lab-counter]');
  const open = section.querySelector('[data-lab-open]');
  const source = section.querySelector('[data-lab-source]');
  const status = section.querySelector('[data-lab-status]');
  const screen = section.querySelector('.lab-screen');
  const viewToggle = section.querySelector('[data-lab-view-toggle]');
  const queryId = new URL(location.href).searchParams.get('demo');
  let activeIndex = Math.max(0, projects.findIndex(p => p.id === queryId));
  let phoneMode = false;
  try { phoneMode = localStorage.getItem('lastie-web-lab-device') === 'phone'; } catch { /* storage is optional */ }

  function updateViewToggle() {
    screen.dataset.device = phoneMode ? 'phone' : 'wide';
    viewToggle.setAttribute('aria-pressed', String(phoneMode));
    viewToggle.setAttribute('aria-label', phoneMode ? copy.showWide : copy.showPhone);
    viewToggle.title = phoneMode ? copy.showWide : copy.showPhone;
  }

  function render() {
    const project = projects[activeIndex];
    section.dataset.project = project.id;
    tabs.querySelectorAll('[role="tab"]').forEach((tab, index) => {
      tab.setAttribute('aria-selected', String(index === activeIndex));
      tab.tabIndex = index === activeIndex ? 0 : -1;
    });
    screen.setAttribute('aria-labelledby', `lab-tab-${project.id}`);
    title.textContent = project.name;
    windowTitle.textContent = project.name;
    about.textContent = isEnglish ? project.about : project.aboutRu;
    tags.replaceChildren(...(isEnglish ? project.type : project.typeRu).map(label => {
      const tag = document.createElement('span'); tag.textContent = label; return tag;
    }));
    counter.textContent = `${copy.number} ${String(activeIndex + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
    frame.title = `${project.name} — ${isEnglish ? 'interactive preview' : 'интерактивный предпросмотр'}`;
    const localFolders = { 'levelseed': 'levelseed', 'pathfinding-visualizer': 'pathfinding-visualizer', 'branchbook': 'branchbook', 'photo-terrain': 'photo-terrain', 'tonal': 'photo-palette', 'exposure-lab': 'exposure-calculator', 'pixel-animation-studio': 'pixel-animation-studio', 'plant-growth': 'plant-growth', 'waymark': 'Waymark', 'waterline': 'waterline-lab', 'mendbook': 'mendbook', 'slatehouse': 'slatehouse' };
    const localPreview = ['localhost', '127.0.0.1'].includes(location.hostname) && localFolders[project.id]
      ? new URL(`../${localFolders[project.id]}/`, location.href).href
      : project.url;
    if (frame.src !== localPreview) {
      frame.style.height = '';
      screen.style.height = '';
      const previewSlot = frame.closest('.lab-project-preview-slot');
      if (previewSlot) previewSlot.style.minHeight = '';
      frame.src = localPreview;
    }
    open.href = project.url;
    source.href = `https://github.com/TheLastie/${project.repo}`;
    status.textContent = copy.status;
    try { localStorage.setItem('lastie-web-lab-project', project.id); } catch { /* storage is optional */ }
  }

  projects.forEach((project, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.id = `lab-tab-${project.id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', 'lab-preview-panel');
    tab.setAttribute('aria-label', `${String(index + 1).padStart(2, '0')} · ${project.name}`);
    tab.innerHTML = `<span class="lab-tab-no">${String(index + 1).padStart(2, '0')}</span><span class="lab-tab-copy"><span class="lab-tab-name"></span><span class="lab-tab-domain"></span></span><span class="lab-tab-arrow" aria-hidden="true">↗</span>`;
    tab.querySelector('.lab-tab-name').textContent = project.name;
    tab.querySelector('.lab-tab-domain').textContent = isEnglish ? project.type[0] : project.typeRu[0];
    tab.addEventListener('click', () => { activeIndex = index; render(); });
    tab.addEventListener('keydown', event => {
      if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      activeIndex = event.key === 'Home' ? 0 : event.key === 'End' ? projects.length - 1 : (activeIndex + (event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1) + projects.length) % projects.length;
      render(); tabs.querySelectorAll('[role="tab"]')[activeIndex].focus();
    });
    tabs.append(tab);
  });
  section.querySelector('.lab-fallback')?.setAttribute('hidden', '');
  section.querySelector('[data-lab-reload]').addEventListener('click', () => { frame.src = 'about:blank'; requestAnimationFrame(() => { frame.src = projects[activeIndex].url; }); });
  viewToggle.addEventListener('click', () => {
    phoneMode = !phoneMode;
    updateViewToggle();
    try { localStorage.setItem('lastie-web-lab-device', phoneMode ? 'phone' : 'wide'); } catch { /* storage is optional */ }
  });
  section.querySelector('[data-lab-fullscreen]').addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await screen.requestFullscreen(); } catch { /* fullscreen may be unavailable */ }
  });
  updateViewToggle();
  render();
})();
