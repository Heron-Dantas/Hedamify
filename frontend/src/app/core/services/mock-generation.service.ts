import { Injectable, signal } from '@angular/core';
import { GenerationJob, GenerationJobPhotoTypeItem } from '../models/generation-job.model';
import { PersonalizacaoTipo } from './wizard-state.service';
import { CATALOGO_TIPOS_FOTO } from '../models/photo-type.model';
import { UploadedPhoto } from '../models/uploaded-photo.model';

/**
 * Simula o worker assíncrono descrito na seção 7 da especificação técnica.
 * Não chama nenhuma IA real: reaproveita a primeira foto enviada como
 * "resultado" de cada tipo, só para validar o fluxo/UX ponta a ponta.
 */
@Injectable({ providedIn: 'root' })
export class MockGenerationService {
  private readonly jobs = new Map<string, ReturnType<typeof signal<GenerationJob>>>();

  criarJob(
    produtoNome: string,
    fotos: UploadedPhoto[],
    tiposSelecionados: Set<string>,
    personalizacao: Record<string, PersonalizacaoTipo>,
  ): string {
    const id = crypto.randomUUID();
    const imagemBase = fotos[0]?.previewUrl ?? '';

    const itens: GenerationJobPhotoTypeItem[] = CATALOGO_TIPOS_FOTO.filter((tipo) =>
      tiposSelecionados.has(tipo.codigo),
    ).map((tipo) => ({
      photoTypeCodigo: tipo.codigo,
      photoTypeNome: tipo.nome,
      instrucaoPersonalizada: personalizacao[tipo.codigo]?.instrucaoPersonalizada ?? '',
      aplicarCorrecaoDetalhes: personalizacao[tipo.codigo]?.aplicarCorrecaoDetalhes ?? false,
      status: 'Queued',
      resultImageUrl: imagemBase,
    }));

    const job: GenerationJob = {
      id,
      produtoNome,
      status: 'Queued',
      createdAt: new Date(),
      itens,
    };

    const jobSignal = signal(job);
    this.jobs.set(id, jobSignal);
    this.processar(id);
    return id;
  }

  obterJob(id: string) {
    return this.jobs.get(id)?.asReadonly();
  }

  private async processar(id: string): Promise<void> {
    const jobSignal = this.jobs.get(id);
    if (!jobSignal) return;

    jobSignal.update((j) => ({ ...j, status: 'Processing' }));

    const itens = jobSignal().itens;
    for (let i = 0; i < itens.length; i++) {
      await this.delay(900 + Math.random() * 900);
      jobSignal.update((j) => ({
        ...j,
        itens: j.itens.map((item, idx) => (idx === i ? { ...item, status: 'Processing' } : item)),
      }));

      await this.delay(700 + Math.random() * 700);
      jobSignal.update((j) => ({
        ...j,
        itens: j.itens.map((item, idx) => (idx === i ? { ...item, status: 'Completed' } : item)),
      }));
    }

    jobSignal.update((j) => ({ ...j, status: 'Completed', completedAt: new Date() }));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
