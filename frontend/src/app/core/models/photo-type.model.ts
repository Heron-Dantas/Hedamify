export interface PhotoType {
  codigo: string;
  nome: string;
  descricao: string;
  preservaIdentidadeProduto: boolean;
  icone: string;
}

export const CATALOGO_TIPOS_FOTO: PhotoType[] = [
  {
    codigo: 'FundoBrancoFrontal',
    nome: 'Fundo Branco Frontal',
    descricao: 'Produto de frente, fundo branco',
    preservaIdentidadeProduto: true,
    icone: '🖼️',
  },
  {
    codigo: 'FundoBranco45',
    nome: 'Fundo Branco 45°',
    descricao: 'Produto em ângulo lateral, fundo branco',
    preservaIdentidadeProduto: true,
    icone: '📐',
  },
  {
    codigo: 'FundoBrancoZoom',
    nome: 'Fundo Branco Zoom',
    descricao: 'Zoom no detalhe principal, fundo branco',
    preservaIdentidadeProduto: true,
    icone: '🔍',
  },
  {
    codigo: 'Ambientada',
    nome: 'Ambientada',
    descricao: 'Produto em cenário de uso real',
    preservaIdentidadeProduto: true,
    icone: '🛋️',
  },
  {
    codigo: 'AmbientadaZoom',
    nome: 'Ambientada com Zoom',
    descricao: 'Close do produto no cenário de uso',
    preservaIdentidadeProduto: true,
    icone: '✨',
  },
];
