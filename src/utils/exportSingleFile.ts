import { Empreendimento } from '../types/empreendimento';

export const generateSingleFileHtml = (items: Empreendimento[]): string => {
  const jsonString = JSON.stringify(items, null, 2);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mapa Imobiliário - Central de Empreendimentos (Versão Autossuficiente)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    body { background-color: #0f172a; color: #1e293b; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
    
    /* Top Bar */
    header { background-color: #0f172a; color: white; border-bottom: 1px solid #1e293b; z-index: 1000; flex-shrink: 0; }
    .demo-bar { background: linear-gradient(90deg, #1e3a8a, #312e81, #0f172a); padding: 5px 16px; font-size: 11px; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(59, 130, 246, 0.2); }
    .main-header { padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-icon { width: 38px; height: 38px; background-color: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    .brand-title { font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; }
    .brand-subtitle { font-size: 12px; color: #94a3b8; font-weight: 500; }
    
    .stats-row { display: flex; gap: 10px; }
    .stat-pill { background: #1e293b; padding: 6px 12px; border-radius: 6px; font-size: 11px; display: flex; flex-direction: column; border: 1px solid #334155; }
    .stat-pill span:first-child { color: #94a3b8; font-weight: 600; text-transform: uppercase; font-size: 9px; }
    .stat-pill span:last-child { font-weight: 700; color: #f8fafc; font-size: 13px; }

    /* Main Container */
    .app-body { display: flex; flex: 1; height: calc(100vh - 85px); overflow: hidden; position: relative; }
    
    /* Sidebar */
    .sidebar { width: 400px; background-color: #ffffff; border-right: 1px solid #cbd5e1; display: flex; flex-direction: column; z-index: 500; flex-shrink: 0; }
    .sidebar-header { padding: 14px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    .search-box { position: relative; margin-bottom: 10px; }
    .search-box input { width: 100%; padding: 8px 12px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; }
    .search-box input:focus { border-color: #2563eb; ring: 2px solid #93c5fd; }
    
    .filter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
    .filter-group label { display: block; font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 3px; }
    .filter-group select { width: 100%; padding: 6px 8px; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 6px; background-color: #fff; outline: none; }
    
    .btn-reset { background: none; border: none; color: #2563eb; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; }
    .btn-reset:hover { text-decoration: underline; }
    
    .results-count { padding: 8px 14px; background-color: #f1f5f9; font-size: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; }
    .cards-list { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px; background-color: #f8fafc; }
    
    /* Property Card */
    .prop-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; cursor: pointer; transition: all 0.2s ease; display: flex; gap: 12px; }
    .prop-card:hover { border-color: #94a3b8; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06); }
    .prop-card.active { border-color: #2563eb; background-color: #eff6ff; box-shadow: 0 0 0 1px #2563eb; }
    .prop-thumb { width: 85px; height: 85px; border-radius: 6px; object-fit: cover; background: #e2e8f0; flex-shrink: 0; }
    .prop-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; }
    .prop-name { font-size: 14px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .prop-loc { font-size: 12px; color: #64748b; margin-top: 2px; }
    .prop-status { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; color: #fff; width: fit-content; margin-top: 4px; }
    .prop-price { font-size: 12px; font-weight: 700; color: #1e293b; margin-top: 6px; }

    /* Map */
    #map { flex: 1; height: 100%; background: #e2e8f0; }

    /* Legend */
    .map-legend { position: absolute; bottom: 20px; left: 420px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(4px); padding: 12px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 800; font-size: 11px; max-width: 200px; border: 1px solid #cbd5e1; }
    .legend-title { font-weight: 700; color: #0f172a; text-transform: uppercase; margin-bottom: 6px; }
    .legend-item { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }

    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(2px); z-index: 2000; display: none; align-items: center; justify-content: center; padding: 16px; }
    .modal-overlay.active { display: flex; }
    .modal-box { background: #ffffff; border-radius: 14px; max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); border: 1px solid #cbd5e1; }
    .modal-hero { height: 220px; position: relative; background: #0f172a; }
    .modal-hero img { width: 100%; height: 100%; object-fit: cover; }
    .modal-hero-content { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.95), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; color: #fff; }
    .modal-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .modal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; }
    .info-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; }
    .info-card span:first-child { display: block; font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; }
    .info-card span:last-child { font-size: 13px; font-weight: 700; color: #0f172a; }
    .btn-action { display: inline-flex; align-items: center; justify-content: center; padding: 10px 16px; border-radius: 8px; font-weight: 600; font-size: 12px; cursor: pointer; border: none; text-decoration: none; color: #fff; gap: 6px; }
    .btn-blue { background-color: #2563eb; } .btn-blue:hover { background-color: #1d4ed8; }
    .btn-indigo { background-color: #4f46e5; } .btn-indigo:hover { background-color: #4338ca; }
    .btn-close { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.5); color: #fff; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }

    @media (max-width: 900px) {
      .app-body { flex-direction: column-reverse; }
      .sidebar { width: 100%; height: 50vh; }
      #map { height: 50vh; }
      .map-legend { left: 16px; bottom: calc(50vh + 10px); }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <div class="demo-bar">
      <span>🟢 PROTÓTIPO • DADOS DEMONSTRATIVOS (Substituir pelos dados do cliente)</span>
      <span>São Paulo & Grande SP • Versão Autossuficiente</span>
    </div>
    <div class="main-header">
      <div class="brand">
        <div class="brand-icon">🏢</div>
        <div>
          <div class="brand-title">MAPA IMOBILIÁRIO</div>
          <div class="brand-subtitle">Central de Empreendimentos</div>
        </div>
      </div>
      <div class="stats-row">
        <div class="stat-pill">
          <span>TOTAL</span>
          <span id="stat-total">0</span>
        </div>
        <div class="stat-pill">
          <span>DISPONÍVEIS</span>
          <span id="stat-disp" style="color: #34d399;">0</span>
        </div>
        <div class="stat-pill">
          <span>EM OBRAS</span>
          <span id="stat-obras" style="color: #fb923c;">0</span>
        </div>
        <div class="stat-pill">
          <span>PRONTOS</span>
          <span id="stat-prontos" style="color: #4ade80;">0</span>
        </div>
      </div>
    </div>
  </header>

  <!-- App Body -->
  <div class="app-body">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="font-size: 13px; color: #1e293b; text-transform: uppercase;">Filtros de Busca</strong>
          <button class="btn-reset" id="btn-reset-filters">↺ Limpar filtros</button>
        </div>
        <div class="search-box">
          <input type="text" id="input-search" placeholder="Buscar por nome, bairro, endereço...">
        </div>
        <div class="filter-grid">
          <div class="filter-group">
            <label>Cidade</label>
            <select id="select-cidade">
              <option value="">Todas as Cidades</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Zona</label>
            <select id="select-zona">
              <option value="">Todas as Zonas</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Bairro</label>
            <select id="select-bairro">
              <option value="">Todos os Bairros</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Status</label>
            <select id="select-status">
              <option value="">Todos os Status</option>
            </select>
          </div>
        </div>
        <div class="filter-group">
          <label>Faixa de Preço</label>
          <select id="select-preco">
            <option value="todos">Todos os Preços</option>
            <option value="ate-500k">Até R$ 500 mil</option>
            <option value="500k-750k">R$ 500 mil – R$ 750 mil</option>
            <option value="750k-1m">R$ 750 mil – R$ 1 milhão</option>
            <option value="1m-2m">R$ 1 milhão – R$ 2 milhões</option>
            <option value="acima-2m">Acima de R$ 2 milhões</option>
          </select>
        </div>
      </div>

      <div class="results-count">
        <span id="results-text">Carregando empreendimentos...</span>
      </div>

      <div class="cards-list" id="cards-container">
        <!-- Rendered dynamically -->
      </div>
    </aside>

    <!-- Map -->
    <div id="map"></div>

    <!-- Map Legend -->
    <div class="map-legend">
      <div class="legend-title">Legenda de Status</div>
      <div class="legend-item"><span class="legend-dot" style="background:#2563eb;"></span> Lançamento</div>
      <div class="legend-item"><span class="legend-dot" style="background:#ea580c;"></span> Em obras</div>
      <div class="legend-item"><span class="legend-dot" style="background:#16a34a;"></span> Pronto</div>
      <div class="legend-item"><span class="legend-dot" style="background:#9333ea;"></span> Entrega próxima</div>
      <div class="legend-item"><span class="legend-dot" style="background:#6b7280;"></span> Esgotado</div>
    </div>
  </div>

  <!-- Detail Modal -->
  <div class="modal-overlay" id="modal-detail">
    <div class="modal-box">
      <div class="modal-hero">
        <button class="btn-close" id="btn-close-modal">✕</button>
        <img id="modal-img" src="" alt="Foto">
        <div class="modal-hero-content">
          <span id="modal-status-badge" class="prop-status">STATUS</span>
          <h2 id="modal-title" style="font-size: 22px; margin-top: 4px;">Nome</h2>
          <p id="modal-subtitle" style="font-size: 13px; color: #cbd5e1;">Localização</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="modal-grid">
          <div class="info-card">
            <span>Preço Inicial</span>
            <span id="modal-price" style="color: #2563eb;">R$ 0</span>
          </div>
          <div class="info-card">
            <span>Previsão de Entrega</span>
            <span id="modal-delivery">-</span>
          </div>
          <div class="info-card">
            <span>Metragem</span>
            <span id="modal-size">-</span>
          </div>
          <div class="info-card">
            <span>Disponíveis</span>
            <span id="modal-avail" style="color: #059669;">-</span>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 12px; border-radius: 8px;">
          <strong style="font-size: 12px; display: block; margin-bottom: 4px; color: #334155;">📍 Endereço Completo:</strong>
          <p id="modal-address" style="font-size: 13px; color: #1e293b;"></p>
        </div>

        <div>
          <strong style="font-size: 12px; display: block; margin-bottom: 6px; color: #334155;">Descrição:</strong>
          <p id="modal-desc" style="font-size: 13px; color: #475569; line-height: 1.5;"></p>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 8px;">
          <button class="btn-action btn-blue" id="btn-open-book" style="flex:1;">
            📖 Abrir Book do Empreendimento
          </button>
          <button class="btn-action btn-indigo" id="btn-open-espelho" style="flex:1;">
            📊 Espelho de Vendas
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- EMBEDDED DEMONSTRATIVE DATA -->
  <script>
    const DADOS_EMPREENDIMENTOS = ${jsonString};

    // Status colors
    const STATUS_COLORS = {
      'Lançamento': '#2563eb',
      'Em obras': '#ea580c',
      'Pronto': '#16a34a',
      'Entrega próxima': '#9333ea',
      'Esgotado': '#6b7280'
    };

    const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    // App State
    let currentFiltered = [...DADOS_EMPREENDIMENTOS];
    let selectedId = null;
    let markersMap = new Map();

    // Init Leaflet Map
    const map = L.map('map', { zoomControl: false }).setView([-23.5505, -46.6333], 11);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap colaboradores'
    }).addTo(map);

    // Create Pin Icon
    function createPin(status, isSelected) {
      const color = STATUS_COLORS[status] || '#2563eb';
      const size = isSelected ? 40 : 32;
      return L.divIcon({
        className: 'custom-pin',
        html: \`<div style="width:\${size}px; height:\${size+8}px; display:flex; align-items:center; justify-content:center; filter:drop-shadow(0 3px 5px rgba(0,0,0,0.35));">
          <svg width="\${size}" height="\${size+8}" viewBox="0 0 32 40" fill="none">
            <path d="M16 0C7.163 0 0 7.163 0 16C0 26.5 16 40 16 40C16 40 32 26.5 32 16C32 7.163 24.837 0 16 0Z" fill="\${color}"/>
            <circle cx="16" cy="15" r="9" fill="#FFFFFF"/>
            <path d="M12 19V11H20V19H12ZM13 12H15V13H13V12ZM17 12H19V13H17V12ZM13 14H15V15H13V14ZM17 14H19V15H17V14Z" fill="\${color}"/>
          </svg>
        </div>\`,
        iconSize: [size, size + 8],
        iconAnchor: [size / 2, size + 6],
        popupAnchor: [0, -(size + 4)]
      });
    }

    // Populate Filter Selects
    function initFilters() {
      const cidades = [...new Set(DADOS_EMPREENDIMENTOS.map(d => d.cidade))].sort();
      const zonas = [...new Set(DADOS_EMPREENDIMENTOS.map(d => d.zona))].sort();
      const bairros = [...new Set(DADOS_EMPREENDIMENTOS.map(d => d.bairro))].sort();
      const statuses = Object.keys(STATUS_COLORS);

      const selCidade = document.getElementById('select-cidade');
      cidades.forEach(c => selCidade.innerHTML += \`<option value="\${c}">\${c}</option>\`);

      const selZona = document.getElementById('select-zona');
      zonas.forEach(z => selZona.innerHTML += \`<option value="\${z}">\${z}</option>\`);

      const selBairro = document.getElementById('select-bairro');
      bairros.forEach(b => selBairro.innerHTML += \`<option value="\${b}">\${b}</option>\`);

      const selStatus = document.getElementById('select-status');
      statuses.forEach(s => selStatus.innerHTML += \`<option value="\${s}">\${s}</option>\`);
    }

    // Render Markers & Cards
    function render() {
      // Clear markers
      markersMap.forEach(m => m.remove());
      markersMap.clear();

      // Update counters
      document.getElementById('stat-total').innerText = currentFiltered.length;
      document.getElementById('stat-disp').innerText = currentFiltered.reduce((acc, c) => acc + (c.unidadesDisponiveis || 0), 0);
      document.getElementById('stat-obras').innerText = currentFiltered.filter(c => c.status === 'Em obras').length;
      document.getElementById('stat-prontos').innerText = currentFiltered.filter(c => c.status === 'Pronto').length;
      document.getElementById('results-text').innerText = \`\${currentFiltered.length} empreendimentos encontrados\`;

      const cardsContainer = document.getElementById('cards-container');
      cardsContainer.innerHTML = '';

      if (currentFiltered.length === 0) {
        cardsContainer.innerHTML = \`<div style="text-align:center; padding: 40px 10px; color:#64748b;">
          <p style="font-weight:700; margin-bottom: 6px;">Não encontramos empreendimentos com esses filtros.</p>
          <button class="btn-reset" onclick="resetFilters()" style="margin: 0 auto;">↺ Limpar filtros</button>
        </div>\`;
        return;
      }

      currentFiltered.forEach(item => {
        const isSelected = item.id === selectedId;
        const color = STATUS_COLORS[item.status] || '#2563eb';

        // Marker
        const marker = L.marker([item.latitude, item.longitude], { icon: createPin(item.status, isSelected) }).addTo(map);
        marker.bindPopup(\`
          <div style="font-size:12px; min-width: 180px;">
            <strong style="font-size:14px; display:block; color:#0f172a;">\${item.nome}</strong>
            <span style="color:#64748b;">\${item.bairro}, \${item.cidade}</span>
            <div style="margin: 6px 0; font-weight:700; color:\${color};">\${item.status} · Entrega: \${item.entrega}</div>
            <div style="font-weight:700; margin-bottom:8px;">\${formatBRL(item.precoInicial)}</div>
            <button onclick="openModalById(\${item.id})" style="background:#2563eb; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-weight:600; width:100%;">Ver detalhes</button>
          </div>
        \`);
        marker.on('click', () => selectItem(item.id, false));
        markersMap.set(item.id, marker);

        // Card
        const card = document.createElement('div');
        card.className = \`prop-card \${isSelected ? 'active' : ''}\`;
        card.onclick = () => selectItem(item.id, true);
        card.innerHTML = \`
          <img class="prop-thumb" src="\${item.imagem}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' fill=\\'%23cbd5e1\\'><rect width=\\'100%\\' height=\\'100%\\'/></svg>'" alt="\${item.nome}">
          <div class="prop-info">
            <div>
              <div class="prop-name">\${item.nome}</div>
              <div class="prop-loc">\${item.bairro} · \${item.cidade}</div>
              <span class="prop-status" style="background-color: \${color};">\${item.status}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
              <div class="prop-price">\${formatBRL(item.precoInicial)}</div>
              <button onclick="event.stopPropagation(); openModalById(\${item.id})" style="font-size:11px; color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe; padding:2px 6px; border-radius:4px; cursor:pointer; font-weight:600;">Detalhes</button>
            </div>
          </div>
        \`;
        cardsContainer.appendChild(card);
      });

      // Fit bounds
      if (currentFiltered.length > 0 && !selectedId) {
        const bounds = L.latLngBounds(currentFiltered.map(i => [i.latitude, i.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
    }

    function selectItem(id, panMap) {
      selectedId = id;
      const item = DADOS_EMPREENDIMENTOS.find(i => i.id === id);
      if (!item) return;

      render();

      if (panMap) {
        map.flyTo([item.latitude, item.longitude], 14, { duration: 1 });
        const m = markersMap.get(id);
        if (m) m.openPopup();
      }
    }

    function applyFilters() {
      const q = document.getElementById('input-search').value.toLowerCase().trim();
      const cidade = document.getElementById('select-cidade').value;
      const zona = document.getElementById('select-zona').value;
      const bairro = document.getElementById('select-bairro').value;
      const status = document.getElementById('select-status').value;
      const preco = document.getElementById('select-preco').value;

      currentFiltered = DADOS_EMPREENDIMENTOS.filter(item => {
        if (q && !(
          item.nome.toLowerCase().includes(q) ||
          item.bairro.toLowerCase().includes(q) ||
          item.cidade.toLowerCase().includes(q) ||
          item.endereco.toLowerCase().includes(q)
        )) return false;

        if (cidade && item.cidade !== cidade) return false;
        if (zona && item.zona !== zona) return false;
        if (bairro && item.bairro !== bairro) return false;
        if (status && item.status !== status) return false;

        if (preco === 'ate-500k' && item.precoInicial > 500000) return false;
        if (preco === '500k-750k' && (item.precoInicial <= 500000 || item.precoInicial > 750000)) return false;
        if (preco === '750k-1m' && (item.precoInicial <= 750000 || item.precoInicial > 1000000)) return false;
        if (preco === '1m-2m' && (item.precoInicial <= 1000000 || item.precoInicial > 2000000)) return false;
        if (preco === 'acima-2m' && item.precoInicial <= 2000000) return false;

        return true;
      });

      render();
    }

    function resetFilters() {
      document.getElementById('input-search').value = '';
      document.getElementById('select-cidade').value = '';
      document.getElementById('select-zona').value = '';
      document.getElementById('select-bairro').value = '';
      document.getElementById('select-status').value = '';
      document.getElementById('select-preco').value = 'todos';
      currentFiltered = [...DADOS_EMPREENDIMENTOS];
      selectedId = null;
      render();
    }

    // Modal
    function openModalById(id) {
      const item = DADOS_EMPREENDIMENTOS.find(i => i.id === id);
      if (!item) return;

      document.getElementById('modal-img').src = item.imagem;
      document.getElementById('modal-title').innerText = item.nome;
      document.getElementById('modal-subtitle').innerText = \`\${item.bairro} · \${item.cidade} — \${item.zona}\`;
      const badge = document.getElementById('modal-status-badge');
      badge.innerText = item.status;
      badge.style.backgroundColor = STATUS_COLORS[item.status] || '#2563eb';

      document.getElementById('modal-price').innerText = formatBRL(item.precoInicial);
      document.getElementById('modal-delivery').innerText = item.entrega;
      document.getElementById('modal-size').innerText = item.metragem || 'Sob consulta';
      document.getElementById('modal-avail').innerText = \`\${item.unidadesDisponiveis} de \${item.unidadesTotais}\`;
      document.getElementById('modal-address').innerText = item.endereco;
      document.getElementById('modal-desc').innerText = item.descricao;

      document.getElementById('btn-open-book').onclick = () => alert(\`Book de \${item.nome} aberto para apresentação comercial.\`);
      document.getElementById('btn-open-espelho').onclick = () => alert(\`Espelho de Vendas de \${item.nome}: \${item.unidadesDisponiveis} unidades disponíveis no momento.\`);

      document.getElementById('modal-detail').classList.add('active');
    }

    document.getElementById('btn-close-modal').onclick = () => {
      document.getElementById('modal-detail').classList.remove('active');
    };
    document.getElementById('modal-detail').onclick = (e) => {
      if (e.target.id === 'modal-detail') document.getElementById('modal-detail').classList.remove('active');
    };

    // Bind Filter Events
    document.getElementById('input-search').addEventListener('input', applyFilters);
    document.getElementById('select-cidade').addEventListener('change', applyFilters);
    document.getElementById('select-zona').addEventListener('change', applyFilters);
    document.getElementById('select-bairro').addEventListener('change', applyFilters);
    document.getElementById('select-status').addEventListener('change', applyFilters);
    document.getElementById('select-preco').addEventListener('change', applyFilters);
    document.getElementById('btn-reset-filters').addEventListener('click', resetFilters);

    // Initial Execution
    initFilters();
    render();
  </script>
</body>
</html>`;
};
