export type StatusObra = 
  | 'Lançamento'
  | 'Em obras'
  | 'Pronto'
  | 'Entrega próxima'
  | 'Esgotado';

export type ZonaSP = 'Norte' | 'Sul' | 'Leste' | 'Oeste' | 'Centro' | 'Grande SP';

export interface Empreendimento {
  id: number;
  nome: string;
  cidade: string;
  bairro: string;
  zona: ZonaSP;
  endereco: string;
  latitude: number;
  longitude: number;
  precoInicial: number;
  status: StatusObra;
  entrega: string;
  unidadesTotais: number;
  unidadesDisponiveis: number;
  metragem?: string;
  dormitorios?: string;
  vagas?: string;
  imagem: string;
  descricao: string;
  diferenciais?: string[];
  bookUrl: string;
  espelhoUrl: string;
}

export type FaixaPreco = 
  | 'todos'
  | 'ate-500k'
  | '500k-750k'
  | '750k-1m'
  | '1m-2m'
  | 'acima-2m';

export interface FiltrosState {
  busca: string;
  cidade: string;
  bairro: string;
  zona: string;
  status: string;
  faixaPreco: FaixaPreco;
}
