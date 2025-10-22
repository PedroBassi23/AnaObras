// app.js - client-side logic for the static MVP
const imoveisUrl = 'data/imoveis.json';
let imoveis = [];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  setupWhatsApp();
  fetch(imoveisUrl).then(r => r.json()).then(data => {
    imoveis = data;
    renderProjetos();
    renderImoveis(imoveis);
  });

  // filters
  document.getElementById('searchInput').addEventListener('input', (e) => {
    applyFilters();
  });
  document.getElementById('bedroomsFilter').addEventListener('change', applyFilters);
  document.getElementById('sortSelect').addEventListener('change', applyFilters);

  // modal close
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.getElementById('detailModal').addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') closeModal();
  });
});

function setupWhatsApp(){
  const phone = '5516999999999'; // substitua pelo número real com DDI+DDD+numero
  const msg = encodeURIComponent('Olá! Tenho interesse em um imóvel / orçamento.');
  const link = `https://wa.me/${phone}?text=${msg}`;
  document.getElementById('whatsappBtn').href = link;
  document.getElementById('whatsappLink').href = link;
}

function renderProjetos(){
  const grid = document.getElementById('projetosGrid');
  const projetos = imoveis.filter(i => i.type === 'projeto');
  grid.innerHTML = projetos.map(p => projectCardHtml(p)).join('');
  // attach click
  projetos.forEach(p => {
    const btn = document.querySelector(`[data-id="proj-${p.id}"]`);
    if(btn) btn.addEventListener('click', ()=> openDetail(p.id));
  });
}

function renderImoveis(list){
  const grid = document.getElementById('imoveisGrid');
  if(list.length === 0){
    grid.innerHTML = '<p class="muted">Nenhum imóvel encontrado com os filtros aplicados.</p>';
    return;
  }
  grid.innerHTML = list.map(i => imovelCardHtml(i)).join('');
  // attach listeners
  list.forEach(i => {
    const btn = document.querySelector(`[data-id="imv-${i.id}"]`);
    if(btn) btn.addEventListener('click', ()=> openDetail(i.id));
  });
}

function projectCardHtml(p){
  const img = p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder';
  return `
    <article class="card">
      <img src="${img}" alt="${escapeHtml(p.title)}" />
      <h4>${escapeHtml(p.title)}</h4>
      <p class="muted">${escapeHtml(p.summary || '')}</p>
      <div style="margin-top:0.75rem">
        <button class="btn" data-id="proj-${p.id}">Ver projeto</button>
      </div>
    </article>
  `;
}

function imovelCardHtml(i){
  const img = i.images && i.images[0] ? i.images[0] : 'https://images.unsplash.com/photo-1598899134739-0e8efc3f6a8c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder';
  return `
    <article class="card">
      <img src="${img}" alt="${escapeHtml(i.title)}" />
      <h4>${escapeHtml(i.title)}</h4>
      <p class="muted">${i.bairro} • ${i.area} m² • ${i.bedrooms} dorm</p>
      <p style="margin-top:0.5rem; font-weight:700">R$ ${formatPrice(i.price)}</p>
      <div style="margin-top:0.75rem; display:flex; gap:0.5rem">
        <button class="btn" data-id="imv-${i.id}">Ver detalhes</button>
        <a class="btn btn-ghost" target="_blank" href="https://wa.me/5516999999999?text=Tenho%20interesse%20no%20im%C3%B3vel%20${encodeURIComponent(i.title)}">WhatsApp</a>
      </div>
    </article>
  `;
}

function openDetail(id){
  const item = imoveis.find(x => x.id === id);
  if(!item) return;
  const modal = document.getElementById('detailModal');
  const container = document.getElementById('modalContent');
  container.innerHTML = detailHtml(item);
  modal.setAttribute('aria-hidden', 'false');
  // attach gallery click (simple)
  const imgs = container.querySelectorAll('.detail-img');
  imgs.forEach(img => {
    img.addEventListener('click', (e) => {
      openImageLightbox(e.target.src);
    });
  });
}

function closeModal(){
  const modal = document.getElementById('detailModal');
  modal.setAttribute('aria-hidden', 'true');
  document.getElementById('modalContent').innerHTML = '';
}

function detailHtml(item){
  const imgs = (item.images || []).map(src => `<img class="detail-img" src="${src}" alt="${escapeHtml(item.title)}" style="width:100%; margin-bottom:0.5rem; border-radius:8px; cursor:pointer;"/>`).join('');
  return `
    <div>
      <h2>${escapeHtml(item.title)}</h2>
      <p class="muted">${escapeHtml(item.bairro)} • ${item.area} m² • ${item.bedrooms} dorm</p>
      <p style="font-weight:700; margin-top:0.5rem">R$ ${formatPrice(item.price)}</p>
      <div style="margin-top:1rem">${imgs}</div>
      <h4>Descrição</h4>
      <p class="muted">${escapeHtml(item.description || '')}</p>
      <div style="margin-top:1rem; display:flex; gap:0.5rem">
        <a class="btn" target="_blank" href="https://wa.me/5516999999999?text=Tenho%20interesse%20no%20im%C3%B3vel%20${encodeURIComponent(item.title)}">Agendar via WhatsApp</a>
        <button class="btn btn-ghost" onclick="closeModal()">Fechar</button>
      </div>
    </div>
  `;
}

function openImageLightbox(src){
  const light = document.createElement('div');
  light.style.position='fixed'; light.style.inset=0; light.style.background='rgba(0,0,0,0.9)'; light.style.display='flex';
  light.style.alignItems='center'; light.style.justifyContent='center'; light.style.zIndex=9999;
  const img = document.createElement('img'); img.src=src; img.style.maxWidth='95%'; img.style.maxHeight='95%'; img.style.boxShadow='0 12px 40px rgba(0,0,0,0.6)';
  light.appendChild(img);
  light.addEventListener('click', ()=> document.body.removeChild(light));
  document.body.appendChild(light);
}

function applyFilters(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const beds = document.getElementById('bedroomsFilter').value;
  const sort = document.getElementById('sortSelect').value;

  let results = imoveis.filter(i => i.type === 'imovel');

  if(q){
    results = results.filter(i => {
      return (i.title + ' ' + i.bairro + ' ' + (i.description||'')).toLowerCase().includes(q);
    });
  }
  if(beds){
    const b = parseInt(beds,10);
    results = results.filter(i => i.bedrooms >= b);
  }

  if(sort === 'price-asc') results.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') results.sort((a,b)=>b.price-a.price);
  if(sort === 'area-desc') results.sort((a,b)=>b.area-b.area);

  renderImoveis(results);
}

function formatPrice(v){
  return Number(v).toLocaleString('pt-BR');
}

function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});
}
