const products = [
  {
    id: 1,
    name: 'Atlas Dual Monitor Arm',
    description:
      "Bras double en aluminium anodisé avec ajustement à une main et gestion magnétique des câbles.",
    price: '329 DT',
    category: 'ergonomie',
    highlights: ['Rotation 360°', 'Jusqu\'à 2 x 9 kg', 'Finition noir mat'],
  },
  {
    id: 2,
    name: 'Halo Balance Lamp',
    description:
      'Lampe connectée spectre complet avec capteur de luminosité et recharge sans fil intégrée.',
    price: '249 DT',
    category: 'luminaire',
    highlights: ['Mode focus', 'USB-C 30W', 'Température ajustable'],
  },
  {
    id: 3,
    name: 'Studio Acoustic Panel Set',
    description:
      'Panneaux modulaires en feutre recyclé pour absorber le bruit et structurer les espaces ouverts.',
    price: '189 DT',
    category: 'organisation',
    highlights: ['Installation magnétique', 'Feutre recyclé', '3 formats inclus'],
  },
  {
    id: 4,
    name: 'Flow Wireless Hub',
    description:
      'Station USB-C 9 ports avec alimentation 100W, HDMI 4K et charge rapide multi-appareils.',
    price: '279 DT',
    category: 'tech',
    highlights: ['HDMI 4K 60Hz', 'Power Delivery 100W', 'Ethernet Gigabit'],
  },
  {
    id: 5,
    name: 'Slate Desk Mat XL',
    description:
      'Tapis de bureau en cuir vegan microtexturé, base antidérapante et découpe pour chargeur sans fil.',
    price: '119 DT',
    category: 'organisation',
    highlights: ['Imperméable', 'Bords cousus main', 'Coloris graphite'],
  },
  {
    id: 6,
    name: 'Pulse Audio Kit',
    description:
      'Pack micro à réduction de bruit et enceinte conférence 360° pour réunions hybrides.',
    price: '459 DT',
    category: 'tech',
    highlights: ['Beamforming', 'Autonomie 12 h', 'Compatibilité Teams/Zoom'],
  },
  {
    id: 7,
    name: 'ErgoWave Foot Rest',
    description:
      'Repose-pieds ergonomique à mémoire de forme avec inclinaison ajustable en trois positions.',
    price: '89 DT',
    category: 'ergonomie',
    highlights: ['Mousse haute densité', 'Housse lavable', 'Surface antidérapante'],
  },
  {
    id: 8,
    name: 'Arc Planner Dock',
    description:
      'Organisateur magnétique pour carnets, stylos et accessoires connectés avec charge rapide 15W.',
    price: '159 DT',
    category: 'organisation',
    highlights: ['Modules repositionnables', 'Charge sans fil', 'Bois certifié FSC'],
  },
];

const categoryLabels = {
  ergonomie: 'Ergonomie & confort',
  organisation: 'Organisation & rangement',
  luminaire: 'Éclairage & ambiance',
  tech: 'Tech & connectivité',
};

const form = document.querySelector('#catalog-form');
const queryInput = document.querySelector('#catalog-query');
const categorySelect = document.querySelector('#catalog-category');
const resultsContainer = document.querySelector('#product-results');

function normalise(value) {
  return value
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card__header">
      <h3 class="product-card__title">${product.name}</h3>
      <p class="product-card__price">${product.price}</p>
    </div>
    <p class="product-card__description">${product.description}</p>
    <ul class="product-card__highlights">
      ${product.highlights.map((highlight) => `<li>${highlight}</li>`).join('')}
    </ul>
    <div class="product-card__cta">
      <button class="button button--ghost" type="button">Ajouter au panier</button>
    </div>
  `;
  return card;
}

function renderProducts(list, options = {}) {
  const { query = '', category = '' } = options;

  resultsContainer.innerHTML = '';

  if (!list.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'locator__placeholder';
    emptyMessage.textContent =
      "Aucun produit ne correspond à votre recherche. Tentez un autre mot-clé ou explorez une catégorie voisine.";
    resultsContainer.appendChild(emptyMessage);
    return;
  }

  const summary = document.createElement('p');
  summary.className = 'locator__summary';

  if (query) {
    summary.textContent = `${list.length} produit${list.length > 1 ? 's' : ''} correspondant à "${query}"${
      category ? ` – ${categoryLabels[category]}` : ''
    }.`;
  } else if (category) {
    summary.textContent = `${list.length} produit${list.length > 1 ? 's' : ''} dans ${
      categoryLabels[category] ?? 'cette catégorie'
    }.`;
  } else {
    summary.textContent = 'Produits mis en avant pour votre bureau.';
  }

  resultsContainer.appendChild(summary);

  list.forEach((product) => {
    resultsContainer.appendChild(createProductCard(product));
  });
}

function filterProducts(query, category) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery && !category) {
    return products.slice(0, 6);
  }

  const normalisedQuery = normalise(trimmedQuery);

  return products.filter((product) => {
    const matchesCategory = category ? product.category === category : true;

    if (!trimmedQuery) {
      return matchesCategory;
    }

    const candidate = [product.name, product.description, ...(product.highlights ?? []), categoryLabels[product.category]]
      .map((value) => normalise(value))
      .join(' ');

    return matchesCategory && candidate.includes(normalisedQuery);
  });
}

function handleSearch(event) {
  event?.preventDefault();

  const query = queryInput.value;
  const category = categorySelect.value;
  const matchingProducts = filterProducts(query, category);

  renderProducts(matchingProducts, { query, category });
}

form?.addEventListener('submit', handleSearch);
queryInput?.addEventListener('input', () => {
  if (!queryInput.value.trim()) {
    handleSearch();
  }
});
categorySelect?.addEventListener('change', handleSearch);

if (resultsContainer) {
  renderProducts(products.slice(0, 6));
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
