(() => {
  const maps = [...document.querySelectorAll('[data-ent-map]')];
  const organs = ['nose','ear','throat'];
  const explorer = document.querySelector('.atlas-explore');
  const tabs = [...document.querySelectorAll('[data-organ-tab]')];
  const lists = [...document.querySelectorAll('[data-organ-list]')];
  const topicLinks = [...document.querySelectorAll('[data-condition]')];
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
    map.querySelectorAll('[data-map-disease]').forEach(bubble => { bubble.dataset.active = 'false'; });
    map.querySelector('[data-map-detail]').hidden = true;
  }

  function showMapCondition(map, source) {
    const organ = source.dataset.organ;
    setMapOrgan(map, organ);
    map.querySelectorAll('[data-map-disease]').forEach(bubble => { bubble.dataset.active = String(bubble.dataset.mapDisease === (source.dataset.mapDisease || source.dataset.condition)); });
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
        if (explorer) selectCondition(document.querySelector(`[data-organ-list="${button.dataset.mapOrgan}"] [data-condition]`), true, false);
      });
    });
    map.querySelectorAll('[data-map-tab]').forEach(button => button.addEventListener('click', () => {
      setMapOrgan(map, button.dataset.mapTab);
      if (explorer) selectCondition(document.querySelector(`[data-organ-list="${button.dataset.mapTab}"] [data-condition]`), true, false);
    }));
    map.querySelectorAll('[data-map-disease]').forEach(bubble => {
      const preview = () => {
        showMapCondition(map, bubble);
        const corresponding = topicLinks.find(link => link.dataset.condition === bubble.dataset.mapDisease);
        if (corresponding) selectCondition(corresponding, false, false, true);
      };
      bubble.addEventListener('mouseenter', preview);
      bubble.addEventListener('focus', preview);
    });
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

  function selectCondition(link, updateUrl = true, updateMap = true, keepSearch = false) {
    if (!link) return;
    selectOrgan(link.dataset.organ, keepSearch);
    topicLinks.forEach(item => { item.dataset.selected = String(item === link); });
    document.getElementById('atlas-current-title').textContent = link.dataset.title;
    document.getElementById('atlas-current-region').textContent = link.dataset.region;
    document.getElementById('atlas-current-note').textContent = link.dataset.note;
    document.getElementById('atlas-current-link').href = link.href;
    focus.dataset.focusOrgan = link.dataset.organ;
    focus.dataset.mode = link.dataset.mode;
    focus.style.setProperty('--x', `${link.dataset.x}%`);
    focus.style.setProperty('--y', `${link.dataset.y}%`);
    image.alt = `${tabs.find(tab => tab.dataset.organTab === link.dataset.organ).textContent}: изображение спереди, проекция области ${link.dataset.region}`;
    const nextImage = `../assets/organs/${link.dataset.organ}.png`;
    if (image.getAttribute('src') !== nextImage) {
      image.classList.add('is-changing');
      image.onload = () => image.classList.remove('is-changing');
      image.onerror = () => image.classList.remove('is-changing');
      image.src = nextImage;
    }
    if (updateMap) maps.forEach(map => showMapCondition(map, link));
    if (updateUrl) {
      const next = new URL(location.href);
      next.searchParams.set('condition', link.dataset.condition);
      next.searchParams.delete('organ');
      history.replaceState(null, '', next);
    }
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    const first = document.querySelector(`[data-organ-list="${tab.dataset.organTab}"] [data-condition]`);
    selectCondition(first);
  }));
  topicLinks.forEach(link => {
    link.addEventListener('mouseenter', () => selectCondition(link, false, false, true));
    link.addEventListener('focus', () => selectCondition(link, false, false, true));
  });
  search.addEventListener('input', filterRows);

  const query = new URLSearchParams(location.search);
  const condition = query.get('condition');
  const initial = condition ? topicLinks.find(link => link.dataset.condition === condition) : null;
  if (initial) selectCondition(initial, false);
  else if (query.has('organ')) {
    const first = document.querySelector(`[data-organ-list="${query.get('organ')}"] [data-condition]`);
    if (first) selectCondition(first, false);
  }
})();
