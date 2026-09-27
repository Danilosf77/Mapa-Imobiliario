import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Empreendimento } from '../types/empreendimento';
import { STATUS_CONFIG, formatCurrency } from '../utils/formatters';
import { Crosshair, Layers } from 'lucide-react';

interface MapViewProps {
  items: Empreendimento[];
  selectedItem: Empreendimento | null;
  onSelectItem: (item: Empreendimento) => void;
  onOpenDetails: (item: Empreendimento) => void;
}

// Function to generate high-res SVG HTML string for custom Leaflet marker
const createMarkerIcon = (status: Empreendimento['status'], isSelected: boolean) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Lançamento'];
  const color = cfg.color;
  const size = isSelected ? 42 : 34;

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transition-transform ${isSelected ? 'scale-110 z-50' : 'hover:scale-110 z-10'}" style="width: ${size}px; height: ${size + 8}px;">
      ${
        isSelected
          ? `<span class="absolute -top-1 w-10 h-10 rounded-full animate-ping opacity-75" style="background-color: ${color}"></span>`
          : ''
      }
      <svg width="${size}" height="${size + 8}" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 5px rgba(0,0,0,0.35));">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 26.5 16 40 16 40C16 40 32 26.5 32 16C32 7.163 24.837 0 16 0Z" fill="${color}"/>
        <path d="M16 1.5C7.992 1.5 1.5 7.992 1.5 16C1.5 25.5 16 38 16 38C16 38 30.5 25.5 30.5 16C30.5 7.992 24.008 1.5 16 1.5Z" stroke="#FFFFFF" stroke-width="1.8" fill="none"/>
        <circle cx="16" cy="15" r="9" fill="#FFFFFF"/>
        <!-- Building glyph inside pin -->
        <path d="M12 19V11H20V19H12ZM13 12H15V13H13V12ZM17 12H19V13H17V12ZM13 14H15V15H13V14ZM17 14H19V15H17V14ZM13 16H15V17H13V16ZM17 16H19V17H17V16Z" fill="${color}"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 6],
    popupAnchor: [0, -(size + 4)],
  });
};

export const MapView: React.FC<MapViewProps> = ({
  items,
  selectedItem,
  onSelectItem,
  onOpenDetails,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  // Default initial coordinates: São Paulo center
  const DEFAULT_CENTER: [number, number] = [-23.5505, -46.6333];
  const DEFAULT_ZOOM = 11;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> colaboradores',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when items or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Add new markers
    items.forEach((item) => {
      const isSelected = selectedItem?.id === item.id;
      const icon = createMarkerIcon(item.status, isSelected);
      const marker = L.marker([item.latitude, item.longitude], { icon }).addTo(map);

      // Create Custom Popup HTML
      const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['Lançamento'];
      const popupHtml = document.createElement('div');
      popupHtml.className = 'p-1 min-w-[210px] max-w-[260px] text-slate-800 font-sans';
      popupHtml.innerHTML = `
        <div class="flex items-center gap-1.5 mb-1.5">
          <span class="inline-block w-2.5 h-2.5 rounded-full" style="background-color: ${statusCfg.color};"></span>
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-700">${statusCfg.label}</span>
        </div>
        <h4 class="font-bold text-sm text-slate-900 leading-snug mb-1">${item.nome}</h4>
        <p class="text-xs text-slate-600 mb-1 flex items-center gap-1">
          <span>📍</span> ${item.bairro}, ${item.cidade}
        </p>
        <p class="text-xs text-slate-600 mb-2">
          <span class="font-medium text-slate-500">Entrega:</span> ${item.entrega}
        </p>
        <div class="pt-2 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-slate-500 block">Preço inicial</span>
            <span class="text-xs font-bold text-slate-900">${formatCurrency(item.precoInicial)}</span>
          </div>
          <button id="btn-details-${item.id}" class="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-xs">
            Ver detalhes
          </button>
        </div>
      `;

      // Attach button event listener
      const detailsBtn = popupHtml.querySelector(`#btn-details-${item.id}`);
      if (detailsBtn) {
        detailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onOpenDetails(item);
        });
      }

      marker.bindPopup(popupHtml, {
        closeButton: true,
        className: 'custom-popup-styled',
      });

      marker.on('click', () => {
        onSelectItem(item);
      });

      markersRef.current.set(item.id, marker);
    });

    // Auto-fit bounds if we have filtered items
    if (items.length > 0 && !selectedItem) {
      const bounds = L.latLngBounds(items.map((i) => [i.latitude, i.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [items]);

  // Handle selected item changes (pan to marker and open popup)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedItem) return;

    const marker = markersRef.current.get(selectedItem.id);
    if (marker) {
      map.flyTo([selectedItem.latitude, selectedItem.longitude], 14, {
        duration: 1,
      });
      marker.openPopup();
    }
  }, [selectedItem]);

  // Reset View to São Paulo
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, {
      duration: 1,
    });
  };

  return (
    <div className="relative flex-1 h-full w-full bg-slate-100 overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Recenter Map Button */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          title="Recentralizar Mapa em São Paulo"
          className="bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 p-2.5 rounded-lg shadow-md border border-slate-200 transition-all flex items-center gap-1.5 text-xs font-semibold backdrop-blur-xs"
        >
          <Crosshair className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Recentralizar SP</span>
        </button>
      </div>

      {/* Visual Status Legend */}
      <div className="absolute bottom-6 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-lg border border-slate-200/90 text-xs max-w-[260px]">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>Legenda de Status</span>
        </div>
        <div className="space-y-1.5">
          {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => (
            <div key={statusKey} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-slate-700 font-medium text-[11px]">
                {config.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
          Clique no marcador para informações rápidas.
        </div>
      </div>
    </div>
  );
};
