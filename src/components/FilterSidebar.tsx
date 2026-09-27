import React from 'react';
import { Search, X, RotateCcw, Filter, MapPin, Building, Tag, DollarSign, Compass } from 'lucide-react';
import { Empreendimento, FiltrosState, FaixaPreco } from '../types/empreendimento';
import { PropertyCard } from './PropertyCard';
import { FAIXAS_PRECO_OPTS } from '../utils/formatters';

interface FilterSidebarProps {
  filtros: FiltrosState;
  onFiltroChange: <K extends keyof FiltrosState>(key: K, value: FiltrosState[K]) => void;
  onResetFilters: () => void;
  filteredItems: Empreendimento[];
  selectedItem: Empreendimento | null;
  onSelectItem: (item: Empreendimento) => void;
  onOpenDetails: (item: Empreendimento) => void;
  availableCities: string[];
  availableBairros: string[];
  availableZonas: string[];
  availableStatuses: string[];
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filtros,
  onFiltroChange,
  onResetFilters,
  filteredItems,
  selectedItem,
  onSelectItem,
  onOpenDetails,
  availableCities,
  availableBairros,
  availableZonas,
  availableStatuses,
  isMobileOpen,
  onCloseMobile,
}) => {
  const isFiltered = Boolean(
    filtros.busca.trim() !== '' ||
    filtros.cidade !== '' ||
    filtros.bairro !== '' ||
    filtros.zona !== '' ||
    filtros.status !== '' ||
    filtros.faixaPreco !== 'todos'
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-full sm:w-[420px] lg:w-[400px] xl:w-[430px] bg-white border-r border-slate-200 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Filtros de Pesquisa
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {isFiltered && (
                <button
                  onClick={onResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpar</span>
                </button>
              )}
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 1. Real-time Search Input */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filtros.busca}
              onChange={(e) => onFiltroChange('busca', e.target.value)}
              placeholder="Buscar por nome, bairro, cidade..."
              className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
            />
            {filtros.busca && (
              <button
                onClick={() => onFiltroChange('busca', '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Cidade */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                Cidade
              </label>
              <select
                value={filtros.cidade}
                onChange={(e) => {
                  onFiltroChange('cidade', e.target.value);
                  onFiltroChange('bairro', ''); // Reset bairro when city changes
                }}
                className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todas as cidades</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Zona */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Compass className="w-3 h-3 text-slate-400" />
                Zona
              </label>
              <select
                value={filtros.zona}
                onChange={(e) => onFiltroChange('zona', e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todas as zonas</option>
                {availableZonas.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            {/* Bairro */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-400" />
                Bairro
              </label>
              <select
                value={filtros.bairro}
                onChange={(e) => onFiltroChange('bairro', e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todos os bairros</option>
                {availableBairros.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Status da obra */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" />
                Status
              </label>
              <select
                value={filtros.status}
                onChange={(e) => onFiltroChange('status', e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todos os status</option>
                {availableStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Faixa de Preço */}
          <div className="mt-2 text-xs">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-slate-400" />
              Faixa de Preço
            </label>
            <select
              value={filtros.faixaPreco}
              onChange={(e) => onFiltroChange('faixaPreco', e.target.value as FaixaPreco)}
              className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {FAIXAS_PRECO_OPTS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter Sub-header */}
        <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <span className="font-semibold text-slate-700">
            {filteredItems.length} {filteredItems.length === 1 ? 'resultado' : 'resultados'}
          </span>
          <span className="text-[11px] text-slate-500">
            Clique no card para localizar no mapa
          </span>
        </div>

        {/* List of Properties */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y-0">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <PropertyCard
                key={item.id}
                item={item}
                isSelected={selectedItem?.id === item.id}
                onSelect={onSelectItem}
                onOpenDetails={onOpenDetails}
              />
            ))
          ) : (
            /* Empty State */
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Não encontramos empreendimentos
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Tente ajustar os filtros selecionados ou digite um termo de busca diferente.
              </p>
              <button
                onClick={onResetFilters}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar filtros</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
