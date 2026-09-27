import React from 'react';
import { X, BookOpen, Download, Share2, ChevronRight, Check } from 'lucide-react';
import { Empreendimento } from '../types/empreendimento';
import { formatCurrency } from '../utils/formatters';

interface BookModalProps {
  item: Empreendimento | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookModal: React.FC<BookModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider block">
                Book Digital do Empreendimento • Material Comercial
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">
                {item.nome} — Apresentação Técnica
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Content / Mock Presentation Pages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {/* Cover & Hero Slide */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="relative h-64 rounded-lg overflow-hidden mb-6 bg-slate-900">
              <img
                src={item.imagem}
                alt={item.nome}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                  Exclusividade Comercial
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {item.nome}
                </h1>
                <p className="text-sm text-slate-200">
                  {item.bairro} · {item.cidade} — {item.zona}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">Tipologia</span>
                <span className="text-sm font-bold text-slate-800">{item.metragem || '68m² a 112m²'}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">Configuração</span>
                <span className="text-sm font-bold text-slate-800">{item.dormitorios || '2 a 4 Dormitórios'}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">Preço Sugerido</span>
                <span className="text-sm font-bold text-blue-700">{formatCurrency(item.precoInicial)}</span>
              </div>
            </div>
          </div>

          {/* Architectural Concept */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
              Conceito Arquitetônico & Paisagístico
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {item.descricao}
            </p>

            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Itens de Lazer & Convivência Inclusos no Projeto:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(item.diferenciais || [
                'Piscina com raia aquecida',
                'Salão de festas privativo',
                'Espaço fitness Life Fitness',
                'Coworking equipado',
                'Pet place e spa dog',
                'Vaga de recarga elétrica'
              ]).map((dif, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 p-2 rounded bg-slate-50 border border-slate-100">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{dif}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plantas Tipo (Floorplans Showcase) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Plantas & Distribuição Interna (Demonstrativo)
              </h4>
              <span className="text-xs text-blue-600 font-medium">Plantas 100% Moduláveis</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-center">
                <div className="h-32 bg-white rounded border border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-slate-400 mb-3">
                  <span className="text-xs font-semibold text-slate-600">Planta Tipo A</span>
                  <span className="text-[11px] text-slate-500">Varanda gourmet ampliada + living integrado</span>
                </div>
                <span className="text-xs font-bold text-slate-800 block">Opção com Cozinha Aberta</span>
                <span className="text-[11px] text-slate-500">Fluxo otimizado e ventilação natural</span>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-center">
                <div className="h-32 bg-white rounded border border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-slate-400 mb-3">
                  <span className="text-xs font-semibold text-slate-600">Planta Tipo B</span>
                  <span className="text-[11px] text-slate-500">Suíte Master com closet + home office</span>
                </div>
                <span className="text-xs font-bold text-slate-800 block">Opção com Sala Ampliada</span>
                <span className="text-[11px] text-slate-500">Ponto de ar-condicionado em todos os ambientes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500">
            Material exclusivo para uso interno da equipe comercial credenciada.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`Download do Book em PDF de ${item.nome} iniciado.`);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Book em PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
