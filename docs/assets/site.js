const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
    mobileNav.hidden = open;
  });
  mobileNav.addEventListener('click', event => {
    if (event.target.closest('a')) {
      mobileNav.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Открыть меню');
    }
  });
}

const search = document.getElementById('topic-search');
if (search) {
  const items = [...document.querySelectorAll('.directory-item')];
  const sections = [...document.querySelectorAll('.directory-group')];
  const counter = document.getElementById('search-count');
  const empty = document.querySelector('.empty-search');
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase('ru');
    let count = 0;
    for (const item of items) {
      const visible = !query || item.dataset.search.includes(query);
      item.hidden = !visible;
      if (visible) count++;
    }
    for (const section of sections) section.hidden = ![...section.querySelectorAll('.directory-item')].some(item => !item.hidden);
    if (counter) counter.textContent = `Найдено: ${count}`;
    if (empty) empty.hidden = count !== 0;
  });
}
