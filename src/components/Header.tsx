import React from 'react';
import { Building2, RotateCcw, Download, SlidersHorizontal, CheckCircle2, Hammer, Home, Layers } from 'lucide-react';
import { Empreendimento } from '../types/empreendimento';

interface HeaderProps {
  filteredItems: Empreendimento[];
  totalOriginalCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onOpenMobileFilters: () => void;
  onExportSingleFile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  filteredItems,
  totalOriginalCount,
  hasActiveFilters,
  onResetFilters,
  onOpenMobileFilters,
  onExportSingleFile,
}) => {
  // Calculate dynamic dashboard indicators based on filtered list
  const totalCount = filteredItems.length;
  const totalDisponiveis = filteredItems.reduce((acc, curr) => acc + (curr.unidadesDisponiveis || 0), 0);
  const emObrasCount = filteredItems.filter(item => item.status === 'Em obras').length;
  const prontosCount = filteredItems.filter(item => item.status === 'Pronto').length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white shrink-0 shadow-md relative z-30">
      {/* Top Banner for Demo Disclaimer */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-4 py-1 border-b border-blue-800/40 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold tracking-wider text-blue-200 uppercase text-[11px]">
            PROTÓTIPO • DADOS DEMONSTRATIVOS
          </span>
          <span className="hidden md:inline text-blue-300/70">
            — Substituir pelos dados oficiais do cliente
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <span>São Paulo & Grande SP</span>
          <span>•</span>
          <span>Versão Comercial 1.0</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white leading-none">
                MAPA IMOBILIÁRIO
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Central de Empreendimentos
            </p>
          </div>
        </div>

        {/* Dynamic Metric Indicators (Dashboard) */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded border border-slate-700/40">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-slate-400 leading-tight">TOTAL</span>
              <span className="text-xs font-bold text-white tabular-nums leading-tight">
                {totalCount} <span className="text-[10px] font-normal text-slate-400">({totalOriginalCount})</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded border border-slate-700/40">
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-slate-400 leading-tight">DISPONÍVEIS</span>
              <span className="text-xs font-bold text-emerald-400 tabular-nums leading-tight">
                {totalDisponiveis} <span className="text-[10px] font-normal text-slate-400">unid.</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded border border-slate-700/40">
            <Hammer className="w-3.5 h-3.5 text-orange-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-slate-400 leading-tight">EM OBRAS</span>
              <span className="text-xs font-bold text-orange-300 tabular-nums leading-tight">
                {emObrasCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded border border-slate-700/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-slate-400 leading-tight">PRONTOS</span>
              <span className="text-xs font-bold text-green-400 tabular-nums leading-tight">
                {prontosCount}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Limpar todos os filtros aplicados"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/50 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}

          {/* Export Single-File Button */}
          <button
            onClick={onExportSingleFile}
            title="Baixar versão autossuficiente (mapa-imobiliario.html) em arquivo único"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Exportar HTML Único</span>
            <span className="sm:hidden">Exportar</span>
          </button>

          {/* Mobile Filter Button */}
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros ({filteredItems.length})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
