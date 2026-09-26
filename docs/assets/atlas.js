(() => {
  const maps = [...document.querySelectorAll('[data-ent-map]')];
  const organs = ['nose','ear','throat'];
  const explorer = document.querySelector('.atlas-explore');
  const tabs = [...document.querySelectorAll('[data-organ-tab]')];
  const lists = [...document.querySelectorAll('[data-organ-list]')];
  const buttons = [...document.querySelectorAll('[data-condition]')];
  const search = document.getElementById('atlas-search');
  const noResults = document.querySelector('.atlas-no-results');
  const image = document.getElementById('atlas-current-image');
  const focus = document.querySelector('.atlas-focus-image');
  let currentOrgan = 'nose';

  function setMapOrgan(map, organ) {
    if (!organs.includes(organ)) return;
    map.dataset.currentOrgan = organ;
    map.querySelectorAll('[data-map-bubbles]').forEach(group => { group.hidden = group.dataset.mapBubbles !== organ; });
    map.querySelectorAll('[data-map-tab]').forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.mapTab === organ)));
    map.querySelectorAll('[data-map-disease]').forEach(bubble => bubble.setAttribute('aria-pressed','false'));
    map.querySelector('[data-map-detail]').hidden = true;
  }

  function showMapCondition(map, source) {
    const organ = source.dataset.organ;
    setMapOrgan(map, organ);
    map.querySelectorAll('[data-map-disease]').forEach(bubble => bubble.setAttribute('aria-pressed', String(bubble.dataset.mapDisease === (source.dataset.mapDisease || source.dataset.condition))));
    const detail = map.querySelector('[data-map-detail]');
    detail.querySelector('[data-map-detail-title]').textContent = source.dataset.title;
    detail.querySelector('[data-map-detail-region]').textContent = source.dataset.region;
    detail.querySelector('[data-map-detail-note]').textContent = source.dataset.note;
    const slug = source.dataset.mapDisease || source.dataset.condition;
    detail.querySelector('[data-map-detail-link]').href = `${'../'.repeat(Number(map.dataset.depth))}topics/${slug}/`;
    detail.querySelector('[data-map-zoom]').href = map.dataset.depth === '0' ? `atlas/?condition=${slug}#explore` : '#explore';
    detail.hidden = false;
  }

  maps.forEach(map => {
    map.querySelectorAll('[data-map-organ]').forEach(button => {
      button.addEventListener('mouseenter', () => setMapOrgan(map, button.dataset.mapOrgan));
      button.addEventListener('focus', () => setMapOrgan(map, button.dataset.mapOrgan));
      button.addEventListener('click', () => {
        setMapOrgan(map, button.dataset.mapOrgan);
        if (explorer) selectOrgan(button.dataset.mapOrgan);
      });
    });
    map.querySelectorAll('[data-map-tab]').forEach(button => button.addEventListener('click', () => {
      setMapOrgan(map, button.dataset.mapTab);
      if (explorer) selectOrgan(button.dataset.mapTab);
    }));
    map.querySelectorAll('[data-map-disease]').forEach(bubble => bubble.addEventListener('click', () => {
      showMapCondition(map, bubble);
      const corresponding = buttons.find(button => button.dataset.condition === bubble.dataset.mapDisease);
      if (corresponding) selectCondition(corresponding, true, false);
    }));
  });

  if (!explorer) return;

  function filterRows() {
    const query = search.value.trim().toLocaleLowerCase('ru');
    let visible = 0;
    document.querySelectorAll(`[data-organ-list="${currentOrgan}"] .atlas-disease-row`).forEach(row => {
      const matches = !query || row.dataset.filter.includes(query);
      row.hidden = !matches;
      if (matches) visible++;
    });
    noResults.hidden = visible > 0;
  }

  function selectOrgan(organ, keepSearch = false) {
    if (!organs.includes(organ)) return;
    currentOrgan = organ;
    tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.organTab === organ)));
    lists.forEach(list => { list.hidden = list.dataset.organList !== organ; });
    document.getElementById('atlas-organ-name').textContent = tabs.find(tab => tab.dataset.organTab === organ).textContent;
    if (!keepSearch) search.value = '';
    filterRows();
  }

  function selectCondition(button, updateUrl = true, updateMap = true) {
    if (!button) return;
    selectOrgan(button.dataset.organ);
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('atlas-current-title').textContent = button.dataset.title;
    document.getElementById('atlas-current-region').textContent = button.dataset.region;
    document.getElementById('atlas-current-note').textContent = button.dataset.note;
    document.getElementById('atlas-current-link').href = `../topics/${button.dataset.condition}/`;
    focus.dataset.focusOrgan = button.dataset.organ;
    focus.dataset.mode = button.dataset.mode;
    focus.style.setProperty('--x', `${button.dataset.x}%`);
    focus.style.setProperty('--y', `${button.dataset.y}%`);
    image.classList.add('is-changing');
    image.alt = `${tabs.find(tab => tab.dataset.organTab === button.dataset.organ).textContent}: изображение спереди, проекция области ${button.dataset.region}`;
    image.onload = () => image.classList.remove('is-changing');
    image.onerror = () => image.classList.remove('is-changing');
    image.src = `../assets/organs/${button.dataset.organ}.png`;
    if (image.complete) image.classList.remove('is-changing');
    if (updateMap) maps.forEach(map => showMapCondition(map, button));
    if (updateUrl) {
      const next = new URL(location.href);
      next.searchParams.set('condition', button.dataset.condition);
      next.searchParams.delete('organ');
      history.replaceState(null, '', next);
    }
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    const first = document.querySelector(`[data-organ-list="${tab.dataset.organTab}"] [data-condition]`);
    selectCondition(first);
  }));
  buttons.forEach(button => button.addEventListener('click', () => selectCondition(button)));
  search.addEventListener('input', filterRows);

  const query = new URLSearchParams(location.search);
  const condition = query.get('condition');
  const initial = condition ? buttons.find(button => button.dataset.condition === condition) : null;
  if (initial) selectCondition(initial, false);
  else if (query.has('organ')) {
    const first = document.querySelector(`[data-organ-list="${query.get('organ')}"] [data-condition]`);
    if (first) selectCondition(first, false);
  }
})();
