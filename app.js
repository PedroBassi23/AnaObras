// app.js - Evolved client-side logic
const imoveisUrl = 'data/imoveis.json';
let allData = [];

// --- Main execution ---
document.addEventListener('DOMContentLoaded', () => {
  // Initial setup
  initializeYear();
  setupEventListeners();

  // Fetch and render data
  fetchAndRenderData();
});


// --- Setup Functions ---
function initializeYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function setupEventListeners() {
  // Filters
  document.getElementById('searchInput')?.addEventListener('input', applyFilters);
  document.getElementById('bedroomsFilter')?.addEventListener('change', applyFilters);
  document.getElementById('sortSelect')?.addEventListener('change', applyFilters);

  // Modal interactions
  const modal = document.getElementById('detailModal');
  modal?.addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') closeModal();
  });
  document.querySelector('.modal-close')?.addEventListener('click', closeModal);
}


// --- Data Handling ---
async function fetchAndRenderData() {
  const projetosGrid = document.getElementById('projetosGrid');
  const imoveisGrid = document.getElementById('imoveisGrid');

  try {
    const response = await fetch(imoveisUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    allData = await response.json();
    
    // Render initial content
    renderProjetos(allData.filter(item => item.type === 'projeto'));
    renderImoveis(allData.filter(item => item.type === 'imovel'));

  } catch (error) {
    console.error("Failed to fetch or render data:", error);
    if (projetosGrid) projetosGrid.innerHTML = '<p class="error-message">Não foi possível carregar os projetos.</p>';
    if (imoveisGrid) imoveisGrid.innerHTML = '<p class="error-message">Não foi possível carregar os imóveis.</p>';
  } finally {
    projetosGrid?.classList.remove('loading');
    imoveisGrid?.classList.remove('loading');
  }
}


// --- Rendering Functions ---
function renderProjetos(projetos) {
  const grid = document.getElementById('projetosGrid');
  if (!grid) return;
  
  if (projetos.length === 0) {
    grid.innerHTML = '<p class="muted">Nenhum projeto encontrado.</p>';
    return;
  }
  
  grid.innerHTML = projetos.map(p => projectCardHtml(p)).join('');
  attachClickListeners(grid, 'proj-');
}

function renderImoveis(imoveis) {
  const grid = document.getElementById('imoveisGrid');
  if (!grid) return;

  if (imoveis.length === 0) {
    grid.innerHTML = '<p class="muted">Nenhum imóvel encontrado com os filtros aplicados.</p>';
    return;
  }
  
  grid.innerHTML = imoveis.map(i => imovelCardHtml(i)).join('');
  attachClickListeners(grid, 'imv-');
}


// --- HTML Templates ---
const escapeHtml = (str) => String(str || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const formatPrice = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const placeholderImage = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1400&auto=format&fit=crop';

function projectCardHtml(p) {
  const img = p.images?.[0] || placeholderImage;
  return `
    <article class="card">
      <img src="${img}" alt="${escapeHtml(p.title)}" class="card-image" loading="lazy" />
      <div class="card-content">
        <h3 class="card-title">${escapeHtml(p.title)}</h3>
        <p class="card-details">${escapeHtml(p.summary)}</p>
        <div class="card-actions">
            <button class="btn btn-secondary" data-id="proj-${p.id}">Ver Projeto</button>
        </div>
      </div>
    </article>
  `;
}

function imovelCardHtml(i) {
  const img = i.images?.[0] || placeholderImage;
  return `
    <article class="card">
      <img src="${img}" alt="${escapeHtml(i.title)}" class="card-image" loading="lazy" />
      <div class="card-content">
        <h3 class="card-title">${escapeHtml(i.title)}</h3>
        <p class="card-details">${i.bairro} • ${i.area} m² • ${i.bedrooms} dormitório(s)</p>
        <p class="card-price">${formatPrice(i.price)}</p>
        <div class="card-actions">
          <button class="btn btn-primary" data-id="imv-${i.id}">Detalhes</button>
          <a class="btn btn-secondary" target="_blank" href="https://wa.me/5516999999999?text=Tenho%20interesse%20no%20im%C3%B3vel:%20${encodeURIComponent(i.title)}">WhatsApp</a>
        </div>
      </div>
    </article>
  `;
}


// --- Event Handling & Logic ---
function attachClickListeners(grid, prefix) {
  grid.addEventListener('click', (e) => {
    const button = e.target.closest(`[data-id^="${prefix}"]`);
    if (button) {
      const id = button.dataset.id.replace(prefix, '');
      openDetail(id);
    }
  });
}

function applyFilters() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const bedrooms = parseInt(document.getElementById('bedroomsFilter').value, 10) || 0;
  const sort = document.getElementById('sortSelect').value;

  let results = allData.filter(i => i.type === 'imovel');

  if (query) {
    results = results.filter(i => 
      (i.title + ' ' + i.bairro + ' ' + (i.description || '')).toLowerCase().includes(query)
    );
  }
  if (bedrooms > 0) {
    results = results.filter(i => i.bedrooms >= bedrooms);
  }

  // Sorting logic
  const sortFunctions = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'area-desc': (a, b) => b.area - a.area,
  };
  if (sortFunctions[sort]) {
    results.sort(sortFunctions[sort]);
  }

  renderImoveis(results);
}


// --- Modal Functions ---
function openDetail(id) {
  const item = allData.find(x => x.id === id);
  if (!item) return;

  const modal = document.getElementById('detailModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;
  
  // TODO: Build a professional detail view template
  content.innerHTML = `
    <h2>${escapeHtml(item.title)}</h2>
    <p>${escapeHtml(item.description)}</p>
    `;

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
  const modal = document.getElementById('detailModal');
  if (!modal) return;
  
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
