import { StatusObra, FaixaPreco } from '../types/empreendimento';

export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(val);
};

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  markerColor: string;
}

export const STATUS_CONFIG: Record<StatusObra, StatusConfig> = {
  'Lançamento': {
    label: 'Lançamento',
    color: '#2563EB', // Blue
    bgColor: '#EFF6FF',
    borderColor: '#93C5FD',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700 border-blue-200',
    markerColor: '#2563EB'
  },
  'Em obras': {
    label: 'Em obras',
    color: '#EA580C', // Orange
    bgColor: '#FFF7ED',
    borderColor: '#FDBA74',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700 border-orange-200',
    markerColor: '#EA580C'
  },
  'Pronto': {
    label: 'Pronto',
    color: '#16A34A', // Green
    bgColor: '#F0FDF4',
    borderColor: '#86EFAC',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700 border-emerald-200',
    markerColor: '#16A34A'
  },
  'Entrega próxima': {
    label: 'Entrega próxima',
    color: '#9333EA', // Purple
    bgColor: '#FAF5FF',
    borderColor: '#D8B4FE',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700 border-purple-200',
    markerColor: '#9333EA'
  },
  'Esgotado': {
    label: 'Esgotado',
    color: '#6B7280', // Slate Gray
    bgColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-600 border-slate-300',
    markerColor: '#6B7280'
  }
};

export const checkPrecoMatch = (preco: number, faixa: FaixaPreco): boolean => {
  switch (faixa) {
    case 'ate-500k':
      return preco <= 500000;
    case '500k-750k':
      return preco > 500000 && preco <= 750000;
    case '750k-1m':
      return preco > 750000 && preco <= 1000000;
    case '1m-2m':
      return preco > 1000000 && preco <= 2000000;
    case 'acima-2m':
      return preco > 2000000;
    case 'todos':
    default:
      return true;
  }
};

export const FAIXAS_PRECO_OPTS = [
  { value: 'todos', label: 'Todos os preços' },
  { value: 'ate-500k', label: 'Até R$ 500 mil' },
  { value: '500k-750k', label: 'R$ 500 mil – R$ 750 mil' },
  { value: '750k-1m', label: 'R$ 750 mil – R$ 1 milhão' },
  { value: '1m-2m', label: 'R$ 1 milhão – R$ 2 milhões' },
  { value: 'acima-2m', label: 'Acima de R$ 2 milhões' },
];

export const FALLBACK_IMAGE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%231E293B"/><rect x="40" y="80" width="160" height="260" rx="4" fill="%23334155"/><rect x="220" y="40" width="200" height="300" rx="4" fill="%23475569"/><rect x="440" y="110" width="120" height="230" rx="4" fill="%23334155"/><g fill="%2394A3B8"><rect x="240" y="70" width="30" height="20" rx="2"/><rect x="290" y="70" width="30" height="20" rx="2"/><rect x="340" y="70" width="30" height="20" rx="2"/><rect x="240" y="110" width="30" height="20" rx="2"/><rect x="290" y="110" width="30" height="20" rx="2"/><rect x="340" y="110" width="30" height="20" rx="2"/><rect x="240" y="150" width="30" height="20" rx="2"/><rect x="290" y="150" width="30" height="20" rx="2"/><rect x="340" y="150" width="30" height="20" rx="2"/><rect x="240" y="190" width="30" height="20" rx="2"/><rect x="290" y="190" width="30" height="20" rx="2"/><rect x="340" y="190" width="30" height="20" rx="2"/><rect x="240" y="230" width="30" height="20" rx="2"/><rect x="290" y="230" width="30" height="20" rx="2"/><rect x="340" y="230" width="30" height="20" rx="2"/></g><text x="50%" y="375" fill="%23E2E8F0" font-family="sans-serif" font-size="14" font-weight="600" text-anchor="middle">EMPREENDIMENTO IMOBILIÁRIO</text></svg>`;
