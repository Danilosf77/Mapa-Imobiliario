import React, { useEffect, useState } from 'react';
import { 
  X, MapPin, Calendar, DollarSign, Building, 
  Layers, ExternalLink, Check, BookOpen, Table, 
  Car, Bed, Maximize2, ShieldCheck, Compass
} from 'lucide-react';
import { Empreendimento } from '../types/empreendimento';
import { formatCurrency, STATUS_CONFIG, FALLBACK_IMAGE_SVG } from '../utils/formatters';

interface PropertyDetailModalProps {
  item: Empreendimento | null;
  isOpen: boolean;
  onClose: () => void;
  onCenterOnMap: (item: Empreendimento) => void;
  onOpenBook: (item: Empreendimento) => void;
  onOpenEspelho: (item: Empreendimento) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onCenterOnMap,
  onOpenBook,
  onOpenEspelho,
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    if (item) {
      setImgSrc(item.imagem);
    }
  }, [item]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['Lançamento'];
  const percentVendido = Math.round(
    ((item.unidadesTotais - item.unidadesDisponiveis) / item.unidadesTotais) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close Button */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: statusCfg.color }}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {statusCfg.label}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Hero Banner with Property Name */}
          <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
            <div className="h-60 sm:h-72 w-full relative">
              <img
                src={imgSrc}
                alt={item.nome}
                referrerPolicy="no-referrer"
                onError={() => setImgSrc(FALLBACK_IMAGE_SVG)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: statusCfg.color }}
                  >
                    {statusCfg.label}
                  </span>
                  <span className="text-xs text-slate-300">
                    {item.bairro} · {item.cidade}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {item.nome}
                </h2>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">Preço Inicial</span>
              <span className="text-sm font-bold text-blue-700 tabular-nums">
                {formatCurrency(item.precoInicial)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">Previsão Entrega</span>
              <span className="text-xs font-bold text-slate-800">
                {item.entrega}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">Metragem</span>
              <span className="text-xs font-bold text-slate-800">
                {item.metragem || '55m² a 110m²'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">Disponibilidade</span>
              <span className="text-xs font-bold text-emerald-700 tabular-nums">
                {item.unidadesDisponiveis} / {item.unidadesTotais} unid.
              </span>
            </div>
          </div>

          {/* Sales Progress Bar */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span>Status Comercial</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {percentVendido}% comercializado ({item.unidadesTotais - item.unidadesDisponiveis} de {item.unidadesTotais} unidades)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentVendido}%` }}
              />
            </div>
          </div>

          {/* Section: LOCALIZAÇÃO */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Localização Privilegiada
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  onCenterOnMap(item);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                <span>📍 Ver no mapa</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Endereço Completo:</span>
                <p className="font-semibold text-slate-800">{item.endereco}</p>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Bairro / Cidade:</span>
                <p className="font-semibold text-slate-800">{item.bairro} — {item.cidade}</p>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Região / Zona:</span>
                <p className="font-semibold text-slate-800">{item.zona}</p>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Coordenadas GPS:</span>
                <p className="font-mono text-slate-600 tabular-nums">
                  {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {/* Section: INFORMAÇÕES TÉCNICAS */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Building className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Informações do Empreendimento
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Maximize2 className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Metragens</span>
                  <span className="font-bold text-slate-800">{item.metragem || 'Sob consulta'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Bed className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Dormitórios</span>
                  <span className="font-bold text-slate-800">{item.dormitorios || '2 a 4 Quartos'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Car className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Vagas de Garagem</span>
                  <span className="font-bold text-slate-800">{item.vagas || '1 a 2 Vagas'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: DESCRIÇÃO */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              Descrição do Projeto
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {item.descricao}
            </p>
          </div>

          {/* Section: DIFERENCIAIS E LAZER */}
          {item.diferenciais && item.diferenciais.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Diferenciais & Lazer Completo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {item.diferenciais.map((dif, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-100"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{dif}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: DOCUMENTOS E ESPELHO DE VENDAS */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Documentos & Consulta Comercial
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Botão Abrir Book */}
              <button
                type="button"
                onClick={() => onOpenBook(item)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>📖 Abrir Book do Empreendimento</span>
              </button>

              {/* Botão Espelho de Vendas */}
              <button
                type="button"
                onClick={() => onOpenEspelho(item)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Table className="w-4 h-4" />
                <span>📊 Espelho de Vendas</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Acesso restrito para corretores e gerentes de atendimento credenciados.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Dados demonstrativos do protótipo
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
