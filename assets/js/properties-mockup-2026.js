(() => {
  const tabs = [...document.querySelectorAll('.category-tab')];
  const cards = [...document.querySelectorAll('.premium-card')];
  const search = document.querySelector('#propertySearch');
  const location = document.querySelector('#locationFilter');
  const price = document.querySelector('#priceFilter');
  const type = document.querySelector('#typeFilter');
  const beds = document.querySelector('#bedFilter');
  const sort = document.querySelector('#sortFilter');
  const reset = document.querySelector('.reset-filters');

  const priceMatch = (v, p) => p === 'all' || (p === 'under2' ? v < 2 : p === '2to5' ? v >= 2 && v <= 5 : v > 5);
  const apply = () => {
    const active = document.querySelector('.category-tab.active')?.dataset.filter || 'all';
    const q = (search?.value || '').trim().toLowerCase();
    const loc = location?.value || 'all';
    const pr = price?.value || 'all';
    const tp = type?.value || 'all';
    const bd = beds?.value || 'all';
    let visible = cards.filter(c => {
      const text = `${c.dataset.title} ${c.dataset.location} ${c.dataset.type}`.toLowerCase();
      return (active === 'all' || c.dataset.type === active) &&
        (tp === 'all' || c.dataset.type === tp) &&
        (loc === 'all' || c.dataset.location === loc) &&
        priceMatch(Number(c.dataset.price), pr) &&
        (bd === 'all' || Number(c.dataset.bedrooms) >= Number(bd)) &&
        (!q || text.includes(q));
    });
    const mode = sort?.value || 'newest';
    visible.sort((a,b) => mode === 'priceLow' ? Number(a.dataset.price)-Number(b.dataset.price) : mode === 'priceHigh' ? Number(b.dataset.price)-Number(a.dataset.price) : cards.indexOf(a)-cards.indexOf(b));
    const set = new Set(visible);
    cards.forEach(c => c.classList.toggle('is-hidden', !set.has(c)));
    visible.forEach(c => document.querySelector('#propertyGrid')?.appendChild(c));
  };
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed','false'); });
    tab.classList.add('active'); tab.setAttribute('aria-pressed','true');
    apply();
  }));
  [search,location,price,type,beds,sort].forEach(el => el?.addEventListener('input', apply));
  reset?.addEventListener('click', () => {
    tabs.forEach(t => {t.classList.toggle('active', t.dataset.filter === 'all'); t.setAttribute('aria-pressed', String(t.dataset.filter === 'all'));});
    if(search) search.value=''; if(location) location.value='all'; if(price) price.value='all'; if(type) type.value='all'; if(beds) beds.value='all'; if(sort) sort.value='newest'; apply();
  });
  document.querySelectorAll('.heart').forEach(btn => btn.addEventListener('click', () => { btn.classList.toggle('is-favorite'); btn.textContent = btn.classList.contains('is-favorite') ? '♥' : '♡'; btn.setAttribute('aria-pressed', String(btn.classList.contains('is-favorite'))); }));
  apply();
})();
