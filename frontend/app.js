const dealers = [
  {
    id: 1,
    name: 'Volkswagen Tunis Centre',
    address: 'Avenue de la République, Centre Urbain Nord',
    city: 'Tunis',
    postalCode: '1003',
    phone: '+216 70 123 456',
    services: ['sales', 'after-sales', 'parts'],
  },
  {
    id: 2,
    name: 'Volkswagen La Marsa',
    address: 'Rue du Lac Léman, Les Berges du Lac 1',
    city: 'La Marsa',
    postalCode: '2078',
    phone: '+216 71 654 321',
    services: ['sales', 'after-sales'],
  },
  {
    id: 3,
    name: 'Volkswagen Sousse',
    address: 'Route de la Ceinture, Zone Industrielle Sidi Abdelhamid',
    city: 'Sousse',
    postalCode: '4003',
    phone: '+216 73 456 789',
    services: ['sales', 'after-sales', 'parts'],
  },
  {
    id: 4,
    name: 'Volkswagen Sfax',
    address: 'Km 5, Route de Gabès',
    city: 'Sfax',
    postalCode: '3018',
    phone: '+216 74 222 444',
    services: ['after-sales', 'parts'],
  },
  {
    id: 5,
    name: 'Volkswagen Bizerte',
    address: 'Zone Portuaire de Bizerte, Avenue Habib Bourguiba',
    city: 'Bizerte',
    postalCode: '7000',
    phone: '+216 72 505 505',
    services: ['sales'],
  },
  {
    id: 6,
    name: 'Volkswagen Gabès',
    address: 'Route de Médenine, Zone Commerciale El Hamma',
    city: 'Gabès',
    postalCode: '6000',
    phone: '+216 75 333 666',
    services: ['after-sales', 'parts'],
  },
];

const serviceLabels = {
  sales: 'Vente & livraison',
  'after-sales': 'Après-vente & entretien',
  parts: 'Pièces & accessoires',
};

const form = document.querySelector('#locator-form');
const queryInput = document.querySelector('#locator-query');
const serviceSelect = document.querySelector('#locator-service');
const resultsContainer = document.querySelector('#dealer-results');

function normalise(value) {
  return value
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function createDealerCard(dealer) {
  const card = document.createElement('article');
  card.className = 'dealer-card';
  card.innerHTML = `
    <div class="dealer-card__header">
      <h3 class="dealer-card__title">${dealer.name}</h3>
      <p class="dealer-card__address">${dealer.address}<br />${dealer.postalCode} ${dealer.city}</p>
    </div>
    <ul class="dealer-card__services">
      ${dealer.services
        .map((service) => `<li>${serviceLabels[service] ?? service}</li>`)
        .join('')}
    </ul>
    <div class="dealer-card__cta">
      <a class="button button--ghost" href="tel:${dealer.phone.replace(/\s+/g, '')}">Appeler</a>
    </div>
  `;
  return card;
}

function renderDealers(list, options = {}) {
  const { query = '', service = '' } = options;

  resultsContainer.innerHTML = '';

  if (!list.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'locator__placeholder';
    emptyMessage.textContent =
      "Aucune concession ne correspond à votre recherche. Essayez un autre code postal ou élargissez le type de service.";
    resultsContainer.appendChild(emptyMessage);
    return;
  }

  const summary = document.createElement('p');
  summary.className = 'locator__summary';

  if (query) {
    summary.textContent = `${list.length} concession${list.length > 1 ? 's' : ''} trouvée${
      list.length > 1 ? 's' : ''
    } pour "${query}"${service ? ` – ${serviceLabels[service]}` : ''}.`;
  } else if (service) {
    summary.textContent = `${list.length} concession${list.length > 1 ? 's' : ''} proposant ${
      serviceLabels[service] ?? 'ce service'
    }.`;
  } else {
    summary.textContent = 'Concessions recommandées près de chez vous.';
  }

  resultsContainer.appendChild(summary);

  list.forEach((dealer) => {
    resultsContainer.appendChild(createDealerCard(dealer));
  });
}

function filterDealers(query, service) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery && !service) {
    return dealers.slice(0, 3);
  }

  const normalisedQuery = normalise(trimmedQuery);

  return dealers.filter((dealer) => {
    const matchesService = service ? dealer.services.includes(service) : true;

    if (!trimmedQuery) {
      return matchesService;
    }

    const candidate = [dealer.name, dealer.city, dealer.postalCode, dealer.address]
      .map((value) => normalise(value))
      .join(' ');

    return matchesService && candidate.includes(normalisedQuery);
  });
}

function handleSearch(event) {
  event?.preventDefault();

  const query = queryInput.value;
  const service = serviceSelect.value;
  const matchingDealers = filterDealers(query, service);

  renderDealers(matchingDealers, { query, service });
}

form?.addEventListener('submit', handleSearch);
queryInput?.addEventListener('input', () => {
  if (!queryInput.value.trim()) {
    handleSearch();
  }
});
serviceSelect?.addEventListener('change', handleSearch);

if (resultsContainer) {
  renderDealers(dealers.slice(0, 3));
}

const siteHeader = document.querySelector('[data-header]');
let latestScrollY = 0;
let ticking = false;

function updateHeaderState(scrollY) {
  if (!siteHeader) return;
  if (scrollY > 60) {
    siteHeader.classList.add('site-header--compact');
  } else {
    siteHeader.classList.remove('site-header--compact');
  }
}

function onScroll() {
  latestScrollY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateHeaderState(latestScrollY);
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
updateHeaderState(window.scrollY);
