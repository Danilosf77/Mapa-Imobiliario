import React, { useState } from 'react';
import { MapPin, Calendar, Check, ExternalLink } from 'lucide-react';
import { Empreendimento } from '../types/empreendimento';
import { formatCurrency, STATUS_CONFIG, FALLBACK_IMAGE_SVG } from '../utils/formatters';

interface PropertyCardProps {
  item: Empreendimento;
  isSelected: boolean;
  onSelect: (item: Empreendimento) => void;
  onOpenDetails: (item: Empreendimento) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  item,
  isSelected,
  onSelect,
  onOpenDetails,
}) => {
  const [imgSrc, setImgSrc] = useState(item.imagem);
  const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['Lançamento'];

  const handleImageError = () => {
    setImgSrc(FALLBACK_IMAGE_SVG);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative rounded-xl border p-3.5 transition-all duration-200 cursor-pointer text-left ${
        isSelected
          ? 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500/20'
          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex gap-3">
        {/* Thumbnail Image */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60">
          <img
            src={imgSrc}
            alt={item.nome}
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Status Color Dot Tag */}
          <div
            className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-sm flex items-center gap-1"
            style={{ backgroundColor: statusCfg.color }}
          >
            <span>{statusCfg.label}</span>
          </div>
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h3 className="text-sm font-bold text-slate-900 truncate leading-snug group-hover:text-blue-600 transition-colors">
                {item.nome}
              </h3>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{item.bairro} · {item.cidade}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
              <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span className="text-[11px] text-slate-600 truncate">{item.entrega}</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block leading-tight">A partir de</span>
              <span className="text-xs font-bold text-slate-900 tabular-nums">
                {formatCurrency(item.precoInicial)}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(item);
              }}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors flex items-center gap-1"
            >
              <span>Detalhes</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Units Availability Bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">
          Unidades disponíveis:
        </span>
        <span className="font-semibold text-slate-700 tabular-nums">
          {item.unidadesDisponiveis} / {item.unidadesTotais}
        </span>
      </div>
    </div>
  );
};
