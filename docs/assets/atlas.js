(() => {
  const explorer = document.querySelector('.atlas-explore');
  const story = document.querySelector('.atlas-story');
  if (!explorer) return;

  const tabs = [...document.querySelectorAll('[data-organ-tab]')];
  const lists = [...document.querySelectorAll('[data-organ-list]')];
  const buttons = [...document.querySelectorAll('[data-condition]')];
  const search = document.getElementById('atlas-search');
  const image = document.getElementById('atlas-current-image');
  const selectedTitle = document.getElementById('atlas-current-title');
  const selectedRegion = document.getElementById('atlas-current-region');
  const selectedNote = document.getElementById('atlas-current-note');
  const selectedLink = document.getElementById('atlas-current-link');
  const organName = document.getElementById('atlas-organ-name');
  const noResults = document.querySelector('.atlas-no-results');
  let currentOrgan = 'nose';

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
    if (!['nose', 'ear', 'throat'].includes(organ)) return;
    currentOrgan = organ;
    tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.organTab === organ)));
    lists.forEach(list => { list.hidden = list.dataset.organList !== organ; });
    organName.textContent = tabs.find(tab => tab.dataset.organTab === organ).textContent;
    if (!keepSearch) search.value = '';
    filterRows();
  }

  function selectCondition(button, updateUrl = true) {
    if (!button) return;
    selectOrgan(button.dataset.organ);
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    selectedTitle.textContent = button.dataset.title;
    selectedRegion.textContent = button.dataset.region;
    selectedNote.textContent = button.dataset.note;
    selectedLink.href = `../topics/${button.dataset.condition}/`;
    image.classList.add('is-changing');
    image.alt = `${button.dataset.title}: схема области`;
    image.onload = () => image.classList.remove('is-changing');
    image.onerror = () => image.classList.remove('is-changing');
    image.src = `../assets/atlas/${button.dataset.condition}.svg`;
    if (image.complete) image.classList.remove('is-changing');
    if (updateUrl) {
      const next = new URL(location.href);
      next.searchParams.set('condition', button.dataset.condition);
      next.searchParams.delete('organ');
      history.replaceState(null, '', next);
    }
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    const organ = tab.dataset.organTab;
    selectOrgan(organ);
    const first = document.querySelector(`[data-organ-list="${organ}"] [data-condition]`);
    selectCondition(first);
  }));
  buttons.forEach(button => button.addEventListener('click', () => selectCondition(button)));
  search.addEventListener('input', filterRows);
  document.querySelectorAll('[data-open-organ]').forEach(link => link.addEventListener('click', () => {
    const organ = link.dataset.openOrgan;
    const first = document.querySelector(`[data-organ-list="${organ}"] [data-condition]`);
    selectCondition(first);
  }));

  const query = new URLSearchParams(location.search);
  const initial = query.get('condition');
  const selected = initial ? buttons.find(button => button.dataset.condition === initial) : null;
  if (selected) selectCondition(selected, false);
  else if (query.has('organ')) {
    const organ = query.get('organ');
    const first = document.querySelector(`[data-organ-list="${organ}"] [data-condition]`);
    if (first) selectCondition(first, false);
  }

  if (story && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(records => {
      const active = records.filter(record => record.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (active) story.dataset.activeOrgan = active.target.dataset.storyStep;
    }, {rootMargin:'-24% 0px -32% 0px', threshold:[0,.2,.45,.7]});
    story.querySelectorAll('[data-story-step]').forEach(step => observer.observe(step));
  }
})();
