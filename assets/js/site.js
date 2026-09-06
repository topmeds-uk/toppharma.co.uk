const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
    menu.focus();
  }
});
const search = document.querySelector('#medicine-search');
const category = document.querySelector('#category-filter');
const cards = [...document.querySelectorAll('[data-search]')];
function filter() {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  for (const card of cards) {
    card.hidden = !card.dataset.search.includes(query) || !!(category.value && !card.dataset.categories.split(' ').includes(category.value));
    if (!card.hidden) count++;
  }
  document.querySelector('#result-count').textContent = `${count} medicine guide${count === 1 ? '' : 's'}`;
  document.querySelector('#empty-state').hidden = count !== 0;
}
if (search) {
  search.addEventListener('input', filter);
  category.addEventListener('change', filter);
  search.form.addEventListener('submit', event => event.preventDefault());
  search.form.addEventListener('reset', () => setTimeout(filter, 0));
}
