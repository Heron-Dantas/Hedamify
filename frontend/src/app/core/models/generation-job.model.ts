export type StatusItemJob = 'Queued' | 'Processing' | 'Completed' | 'Failed';

export type StatusGenerationJob = 'Queued' | 'Processing' | 'Completed' | 'Failed' | 'PartiallyFailed';

export interface GenerationJobPhotoTypeItem {
  photoTypeCodigo: string;
  photoTypeNome: string;
  instrucaoPersonalizada: string;
  aplicarCorrecaoDetalhes: boolean;
  status: StatusItemJob;
  resultImageUrl?: string;
  errorMessage?: string;
}

export interface GenerationJob {
  id: string;
  produtoNome: string;
  status: StatusGenerationJob;
  createdAt: Date;
  completedAt?: Date;
  itens: GenerationJobPhotoTypeItem[];
}
