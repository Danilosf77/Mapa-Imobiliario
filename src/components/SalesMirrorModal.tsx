import React, { useState } from 'react';
import { X, Table, CheckCircle2, Clock, AlertCircle, RefreshCw, Download } from 'lucide-react';
import { Empreendimento } from '../types/empreendimento';
import { formatCurrency } from '../utils/formatters';

interface SalesMirrorModalProps {
  item: Empreendimento | null;
  isOpen: boolean;
  onClose: () => void;
}

interface UnitMock {
  numero: string;
  andar: number;
  tipologia: string;
  area: number;
  vagas: number;
  status: 'Disponível' | 'Reservada' | 'Vendida';
  valor: number;
}

export const SalesMirrorModal: React.FC<SalesMirrorModalProps> = ({ item, isOpen, onClose }) => {
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  if (!isOpen || !item) return null;

  // Generate deterministic realistic units grid for this building
  const totalUnits = item.unidadesTotais || 60;
  const availableCount = item.unidadesDisponiveis || 10;
  const floors = Math.max(8, Math.min(25, Math.ceil(totalUnits / 4)));

  const mockUnits: UnitMock[] = [];
  let availableAssigned = 0;

  for (let f = floors; f >= 1; f--) {
    for (let u = 1; u <= 4; u++) {
      const unitNum = `${f}0${u}`;
      const baseArea = 45 + (u * 18);
      const isDisponivel = availableAssigned < availableCount && ((f + u) % 3 === 0 || f >= floors - 3);
      const isReservada = !isDisponivel && (f * u) % 7 === 0;
      
      let st: 'Disponível' | 'Reservada' | 'Vendida' = 'Vendida';
      if (isDisponivel) {
        st = 'Disponível';
        availableAssigned++;
      } else if (isReservada) {
        st = 'Reservada';
      }

      const unitPrice = item.precoInicial * (1 + (f * 0.015) + (u * 0.03));

      mockUnits.push({
        numero: unitNum,
        andar: f,
        tipologia: u % 2 === 0 ? 'Planta Garden / Suíte' : 'Planta Tradicional',
        area: baseArea,
        vagas: u > 2 ? 2 : 1,
        status: st,
        valor: Math.round(unitPrice / 1000) * 1000,
      });
    }
  }

  const displayedUnits = filterStatus === 'todos' 
    ? mockUnits 
    : mockUnits.filter(u => u.status === filterStatus);

  const statusBadge = (st: UnitMock['status']) => {
    switch (st) {
      case 'Disponível':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Disponível
        </span>;
      case 'Reservada':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
          <Clock className="w-3 h-3 text-amber-600" /> Reservada
        </span>;
      case 'Vendida':
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-700">
          <AlertCircle className="w-3 h-3 text-slate-500" /> Vendida
        </span>;
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider block">
                Espelho de Vendas em Tempo Real (Demonstrativo)
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">
                {item.nome} — Mapa de Disponibilidade
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

        {/* Status Bar & Filters */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Filtrar status:</span>
            <div className="inline-flex rounded-lg bg-slate-200/80 p-0.5 text-xs">
              {['todos', 'Disponível', 'Reservada', 'Vendida'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    filterStatus === s
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s === 'todos' ? 'Todas as Unidades' : s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              Total listado: <strong className="text-slate-800 tabular-nums">{displayedUnits.length}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-semibold">
              Disponíveis: <strong className="tabular-nums">{item.unidadesDisponiveis}</strong>
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-bold">Unidade</th>
                <th className="py-2.5 px-4 font-bold">Andar</th>
                <th className="py-2.5 px-4 font-bold">Tipologia</th>
                <th className="py-2.5 px-4 font-bold">Área Priv.</th>
                <th className="py-2.5 px-4 font-bold">Vagas</th>
                <th className="py-2.5 px-4 font-bold">Situação</th>
                <th className="py-2.5 px-4 font-bold text-right">Valor da Tabela</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedUnits.map((u) => (
                <tr
                  key={u.numero}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    u.status === 'Disponível' ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-bold text-slate-900">{u.numero}</td>
                  <td className="py-2.5 px-4 text-slate-600">{u.andar}º Andar</td>
                  <td className="py-2.5 px-4 text-slate-700">{u.tipologia}</td>
                  <td className="py-2.5 px-4 text-slate-600 tabular-nums">{u.area} m²</td>
                  <td className="py-2.5 px-4 text-slate-600">{u.vagas} vaga(s)</td>
                  <td className="py-2.5 px-4">{statusBadge(u.status)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {formatCurrency(u.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500">
            Valores sujeitos a alteração sem aviso prévio. Consulte tabela vigente com a coordenação de vendas.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`Exportação da planilha de espelho de ${item.nome} em formato Excel (.xlsx) gerada.`);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Espelho (Excel)</span>
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
