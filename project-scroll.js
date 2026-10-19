(() => {
  const section = document.querySelector('#web-lab');
  const tabs = section?.querySelector('.lab-tabs');
  const shell = section?.querySelector('.lab-shell');
  const main = section?.querySelector('.lab-main');
  if (!section || !tabs || !shell || !main) return;

  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
  const projects = [
    { id: 'levelseed', repo: 'levelseed', en: 'Build a world, one layer at a time.', ru: 'Собирайте игровой мир слой за слоем.' },
    { id: 'pathfinding-visualizer', repo: 'pathfinding-visualizer', en: 'Watch search strategies find their way through a maze.', ru: 'Сравните, как алгоритмы прокладывают путь через лабиринт.' },
    { id: 'branchbook', repo: 'branchbook', en: 'A story whose next chapter is yours to choose.', ru: 'История, в которой следующую главу выбираете вы.' },
    { id: 'photo-terrain', repo: 'photo-terrain', en: 'Turn a photograph into a landscape you can explore.', ru: 'Превратите фотографию в ландшафт для исследования.' },
    { id: 'tonal', repo: 'tonal', en: 'Find the colors that make an image feel like itself.', ru: 'Найдите оттенки, которые создают настроение снимка.' },
    { id: 'exposure-lab', repo: 'Exposure-Lab', en: 'Shape a photograph with the camera settings that matter.', ru: 'Управляйте снимком через настройки настоящей камеры.' },
    { id: 'pixel-animation-studio', repo: 'pixel-animation-studio', en: 'Draw, animate, and export a tiny world, frame by frame.', ru: 'Создавайте пиксельную анимацию и экспортируйте её.' },
    { id: 'plant-growth', repo: 'plant-growth', en: 'Explore how light, time, and branching shape a plant.', ru: 'Посмотрите, как свет, время и ветвление меняют растение.' }
  ];
  const projectIcons = {
    'levelseed': 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%277%27 fill=%27%23171b20%27/%3E%3Cpath d=%27M16 5v22M5 16h22M8 8l16 16M24 8 8 24%27 stroke=%27%23d6f36a%27 stroke-width=%273%27/%3E%3C/svg%3E',
    'pathfinding-visualizer': 'https://thelastie.github.io/pathfinding-visualizer/favicon.svg',
    'branchbook': 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Cpath fill=%27%23cf745a%27 d=%27M16 4c-5 0-8 4-8 9v7l-3 4h22l-3-4v-7c0-5-3-9-8-9zm-3 23h6%27/%3E%3C/svg%3E',
    'photo-terrain': 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Cpath d=%27M2 25 10 13l5 7 6-11 9 16z%27 fill=%27none%27 stroke=%27%23e5b85c%27 stroke-width=%272%27/%3E%3C/svg%3E',
    'tonal': 'https://thelastie.github.io/tonal/favicon.svg',
    'exposure-lab': 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 40 40%27%3E%3Crect width=%2740%27 height=%2740%27 rx=%2712%27 fill=%27%23d4f36a%27/%3E%3Cpath d=%27M20 7 32 29H8z%27 fill=%27none%27 stroke=%27%23111411%27 stroke-width=%272%27/%3E%3Ccircle cx=%2720%27 cy=%2722%27 r=%274%27 fill=%27%23111411%27/%3E%3C/svg%3E',
    'pixel-animation-studio': 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Cpath fill=%27%23ff6a4f%27 d=%27M5 5h8v8H5zm14 0h8v8h-8zM5 19h8v8H5zm14 0h8v8h-8z%27/%3E%3C/svg%3E',
    'plant-growth': 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 40 40%27%3E%3Cpath d=%27M20 35V19M20 25C11 24 7 19 8 10c8-1 13 3 12 12m0 3c1-9 6-13 14-12 0 8-4 13-14 14%27 fill=%27none%27 stroke=%27%232c5942%27 stroke-width=%273%27 stroke-linecap=%27round%27/%3E%3C/svg%3E'
  };
  const copy = isEnglish
    ? { rail: 'PROJECTS', project: 'PROJECT', open: 'Open project', source: 'Source code', hint: 'Scroll to explore' }
    : { rail: 'ПРОЕКТЫ', project: 'ПРОЕКТ', open: 'Открыть проект', source: 'Исходный код', hint: 'Листайте, чтобы исследовать' };

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('project-scroll.css', document.currentScript.src).href;
  document.head.append(stylesheet);

  const pageHeader = document.querySelector('.header');
  const syncStickyOffset = () => {
    const headerHeight = pageHeader?.getBoundingClientRect().height || 74;
    section.style.setProperty('--lab-sticky-offset', `${Math.ceil(headerHeight + 8)}px`);
  };
  syncStickyOffset();
  window.addEventListener('resize', syncStickyOffset, { passive: true });

  const railLabel = section.querySelector('.lab-rail-label');
  if (railLabel) railLabel.textContent = copy.rail;
  const projectList = document.createElement('div');
  projectList.className = 'lab-project-list';
  projectList.setAttribute('aria-label', isEnglish ? 'Projects' : 'Проекты');
  shell.append(projectList);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let syncingFromScroll = false;
  let activeId = '';

  const articles = projects.map((project, index) => {
    const tab = tabs.querySelector(`#lab-tab-${project.id}`);
    if (!tab) return null;
    const name = tab.querySelector('.lab-tab-name')?.textContent?.trim() || project.id;
    const domain = tab.querySelector('.lab-tab-domain')?.textContent?.trim() || '';
    tab.title = name;
    const icon = document.createElement('span');
    icon.className = 'lab-tab-icon';
    icon.setAttribute('aria-hidden', 'true');
    const brandImage = document.createElement('img');
    brandImage.src = projectIcons[project.id] || '';
    brandImage.alt = '';
    icon.append(brandImage);
    tab.querySelector('.lab-tab-no')?.after(icon);
    const article = document.createElement('article');
    article.className = 'lab-project-step';
    article.id = `lab-project-${project.id}`;
    article.dataset.projectId = project.id;
    article.setAttribute('role', 'tabpanel');
    article.setAttribute('aria-labelledby', tab.id);
    article.tabIndex = -1;

    const header = document.createElement('header');
    header.className = 'lab-project-heading';
    const descriptor = document.createElement('div');
    descriptor.className = 'lab-project-descriptor';
    const category = document.createElement('span');
    category.className = 'lab-project-category';
    category.textContent = domain;
    const heading = document.createElement('h3');
    heading.textContent = name;
    const description = document.createElement('p');
    description.textContent = isEnglish ? project.en : project.ru;
    descriptor.append(category, heading, description);
    const actions = document.createElement('div');
    actions.className = 'lab-project-actions';
    const open = document.createElement('a');
    open.className = 'lab-project-open';
    open.href = `https://thelastie.github.io/${project.repo}/`;
    open.target = '_blank';
    open.rel = 'noopener';
    open.innerHTML = `${copy.open}<span aria-hidden="true">↗</span>`;
    const source = document.createElement('a');
    source.className = 'lab-project-source';
    source.href = `https://github.com/TheLastie/${project.repo}`;
    source.target = '_blank';
    source.rel = 'noopener';
    source.innerHTML = `${copy.source}<span aria-hidden="true">↗</span>`;
    actions.append(open, source);
    header.append(descriptor, actions);

    const slot = document.createElement('div');
    slot.className = 'lab-project-preview-slot';
    slot.dataset.previewSlot = project.id;
    const marker = document.createElement('div');
    marker.className = 'lab-project-marker';
    marker.setAttribute('aria-hidden', 'true');
    marker.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><i></i><i></i><i></i>`;
    marker.dataset.marker = 'true';
    slot.append(marker);
    article.append(header, slot);
    projectList.append(article);
    tab.setAttribute('aria-controls', article.id);
    tab.dataset.projectId = project.id;
    tab.addEventListener('click', () => {
      if (!syncingFromScroll) article.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    });
    tab.addEventListener('keydown', () => requestAnimationFrame(() => {
      const selected = tabs.querySelector('[aria-selected="true"]');
      if (selected?.dataset.projectId) document.querySelector(`#lab-project-${selected.dataset.projectId}`)?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    }));
    return { project, tab, article, slot };
  }).filter(Boolean);

  if (!articles.length) return;
  const originalMeta = main.querySelector('.lab-meta');
  if (originalMeta) originalMeta.hidden = true;
  const preview = main.querySelector('#lab-preview');
  if (preview) {
    const previewScreen = preview.closest('.lab-screen');
    let sizeObserver;
    let resizeFrame = 0;
    window.addEventListener('message', event => {
      if (event.source !== preview.contentWindow || event.data?.type !== 'lastie:preview-size') return;
      const reportedHeight = Math.ceil(Number(event.data.height));
      if (!Number.isFinite(reportedHeight) || reportedHeight < 1 || reportedHeight > 16000) return;
      const height = Math.max(560, reportedHeight);
      previewScreen?.classList.remove('lab-screen--opaque-origin');
      previewScreen?.classList.add('lab-screen--fit-content');
      preview.style.height = `${height}px`;
      if (previewScreen) previewScreen.style.height = `${height}px`;
      const slot = preview.closest('.lab-project-preview-slot');
      const toolbarHeight = main.querySelector('.lab-toolbar')?.getBoundingClientRect().height || 0;
      if (slot) slot.style.minHeight = `${height + toolbarHeight}px`;
    });
    const hidePreviewScrollbar = () => {
      try {
        const doc = preview.contentDocument;
        if (!doc?.head) throw new Error('Preview document is unavailable');
        const style = doc.getElementById('portfolio-preview-scrollbar') || doc.createElement('style');
        style.id = 'portfolio-preview-scrollbar';
        style.textContent = 'html,body{scrollbar-width:none!important;scrollbar-color:transparent transparent!important}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}@media(max-width:600px){html,body{max-width:100%!important;overflow-x:clip!important}}';
        if (!style.isConnected) doc.head.append(style);
        previewScreen?.classList.remove('lab-screen--opaque-origin');
        previewScreen?.classList.add('lab-screen--fit-content');

        sizeObserver?.disconnect();
        preview.style.height = '1px';
        if (previewScreen) previewScreen.style.height = '1px';
        const resizeToDocument = () => {
          cancelAnimationFrame(resizeFrame);
          resizeFrame = requestAnimationFrame(() => {
            const body = doc.body;
            const root = doc.documentElement;
            if (!body || !root || !preview.isConnected) return;
            const height = Math.ceil(Math.max(
              root.scrollHeight, root.offsetHeight,
              body.scrollHeight, body.offsetHeight,
              body.getBoundingClientRect().height
            ));
            if (height > 0) {
              preview.style.height = `${height}px`;
              if (previewScreen) previewScreen.style.height = `${height}px`;
            }
          });
        };
        sizeObserver = new ResizeObserver(resizeToDocument);
        sizeObserver.observe(doc.documentElement);
        if (doc.body) sizeObserver.observe(doc.body);
        resizeToDocument();
        doc.fonts?.ready.then(resizeToDocument);
      } catch {
        sizeObserver?.disconnect();
        previewScreen?.classList.remove('lab-screen--fit-content');
        const fallbackHeight = Math.max(560, Math.min(760, Math.ceil(window.innerHeight)));
        preview.style.height = `${fallbackHeight}px`;
        if (previewScreen) previewScreen.style.height = `${fallbackHeight}px`;
        previewScreen?.classList.add('lab-screen--opaque-origin');
      }
    };
    preview.removeAttribute('scrolling');
    preview.addEventListener('load', hidePreviewScrollbar);
    hidePreviewScrollbar();
  }
  const status = main.querySelector('.lab-status');
  if (status) status.hidden = true;
  const tabsHint = document.createElement('span');
  tabsHint.className = 'lab-rail-hint';
  tabsHint.textContent = copy.hint;
  tabs.parentElement.append(tabsHint);

  const mount = item => {
    if (activeId === item.project.id && main.parentElement === item.slot) return;
    const previousSlot = main.parentElement;
    if (previousSlot && previousSlot !== item.slot) previousSlot.style.minHeight = '';
    activeId = item.project.id;
    syncingFromScroll = true;
    item.tab.click();
    syncingFromScroll = false;
    item.slot.querySelector('[data-marker]')?.remove();
    item.slot.append(main);
    articles.forEach(entry => entry.article.classList.toggle('is-current', entry === item));
  };

  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    const id = visible[0]?.target.dataset.projectId;
    const item = articles.find(entry => entry.project.id === id);
    if (item) mount(item);
  }, { rootMargin: '-38% 0px -38% 0px', threshold: [0, 0.15, 0.35, 0.6, 1] });
  articles.forEach(item => observer.observe(item.article));
  const stored = (() => { try { return localStorage.getItem('lastie-web-lab-project'); } catch { return ''; } })();
  mount(articles.find(item => item.project.id === stored) || articles[0]);
})();
