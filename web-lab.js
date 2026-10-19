export function initWebLab() {
  const section = document.querySelector('#web-lab');
  if (!section || section.dataset.webLabInitialized === 'true') return;
  section.dataset.webLabInitialized = 'true';
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('web-lab.css?v=3', import.meta.url).href;
  document.head.append(stylesheet);

  document.querySelector('#work')?.before(section);
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
  const projects = [
    { id: 'levelseed', name: 'LevelSeed', url: 'https://thelastie.github.io/levelseed/', repo: 'levelseed', type: ['MAP GENERATION', 'ALGORITHMS'], typeRu: ['ГЕНЕРАЦИЯ КАРТ', 'АЛГОРИТМЫ'], about: 'Build expansive worlds and watch procedural terrain take shape.', aboutRu: 'Собирайте большие миры и наблюдайте, как алгоритмы создают рельеф.' },
    { id: 'pathfinding-visualizer', name: 'Pathfinding Visualizer', url: 'https://thelastie.github.io/pathfinding-visualizer/', repo: 'pathfinding-visualizer', type: ['SEARCH', 'VISUALIZATION'], typeRu: ['ПОИСК ПУТИ', 'ВИЗУАЛИЗАЦИЯ'], about: 'Compare how pathfinding algorithms search through a maze.', aboutRu: 'Сравнивайте, как алгоритмы ищут путь через лабиринт.' },
    { id: 'branchbook', name: 'Branchbook', url: 'https://thelastie.github.io/branchbook/', repo: 'branchbook', type: ['INTERACTIVE STORY', 'SOUND'], typeRu: ['ИНТЕРАКТИВНАЯ ИСТОРИЯ', 'ЗВУК'], about: 'A branching story where each choice changes the journey.', aboutRu: 'История с развилками, где каждый выбор меняет путь.' },
    { id: 'photo-terrain', name: 'Photo Terrain', url: 'https://thelastie.github.io/photo-terrain/', repo: 'photo-terrain', type: ['PHOTOGRAPHY', '3D'], typeRu: ['ФОТОГРАФИЯ', '3D'], about: 'Turn a photograph into a landscape you can explore.', aboutRu: 'Превратите фотографию в ландшафт для исследования.' },
    { id: 'tonal', name: 'Tonal', url: 'https://thelastie.github.io/tonal/', repo: 'tonal', type: ['IMAGE ANALYSIS', 'COLOUR'], typeRu: ['АНАЛИЗ ИЗОБРАЖЕНИЙ', 'ЦВЕТ'], about: 'Extract a considered colour palette from an image.', aboutRu: 'Извлекайте цельную цветовую палитру из изображения.' },
    { id: 'exposure-lab', name: 'Exposure Lab', url: 'https://thelastie.github.io/Exposure-Lab/', repo: 'Exposure-Lab', type: ['CAMERA', 'SIMULATION'], typeRu: ['КАМЕРА', 'СИМУЛЯЦИЯ'], about: 'Explore how exposure, focus and colour shape a frame.', aboutRu: 'Исследуйте, как экспозиция, фокус и цвет меняют кадр.' },
    { id: 'pixel-animation-studio', name: 'Pixel Animation Studio', url: 'https://thelastie.github.io/pixel-animation-studio/', repo: 'pixel-animation-studio', type: ['PIXEL ART', 'GIF'], typeRu: ['ПИКСЕЛЬ-АРТ', 'GIF'], about: 'Draw frame by frame and export a finished GIF.', aboutRu: 'Рисуйте покадрово и экспортируйте готовую GIF-анимацию.' },
    { id: 'plant-growth', name: 'Silva · Plant Growth', url: 'https://thelastie.github.io/plant-growth/', repo: 'plant-growth', type: ['BOTANY', 'GENERATION'], typeRu: ['БОТАНИКА', 'ГЕНЕРАЦИЯ'], about: 'Grow branching plants and study their changing forms.', aboutRu: 'Выращивайте ветвящиеся растения и изучайте их форму.' }
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
  screen.dataset.loadingLabel = isEnglish ? 'Loading project preview…' : 'Загружается проект…';
  frame.addEventListener('load', () => screen.classList.remove('is-loading'));
  const viewToggle = section.querySelector('[data-lab-view-toggle]');
  let storedId = null;
  try { storedId = localStorage.getItem('lastie-web-lab-project'); } catch { /* storage is optional */ }
  const queryId = new URL(location.href).searchParams.get('demo');
  let activeIndex = Math.max(0, projects.findIndex(p => p.id === (queryId || storedId)));
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
    const localFolders = { 'levelseed': 'levelseed', 'pathfinding-visualizer': 'pathfinding-visualizer', 'branchbook': 'branchbook', 'photo-terrain': 'photo-terrain', 'tonal': 'photo-palette', 'exposure-lab': 'exposure-calculator', 'pixel-animation-studio': 'pixel-animation-studio', 'plant-growth': 'plant-growth' };
    const localPreview = ['localhost', '127.0.0.1'].includes(location.hostname) && localFolders[project.id]
      ? new URL(`../${localFolders[project.id]}/`, location.href).href
      : project.url;
    if (frame.src !== localPreview) {
      screen.classList.add('is-loading');
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
}
