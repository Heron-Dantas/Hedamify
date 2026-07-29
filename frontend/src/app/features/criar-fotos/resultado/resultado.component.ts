import { Component, OnInit, Signal, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenerationJob } from '../../../core/models/generation-job.model';
import { MockGenerationService } from '../../../core/services/mock-generation.service';
import { WizardStateService } from '../../../core/services/wizard-state.service';

@Component({
  selector: 'app-resultado',
  template: `
    @if (job(); as j) {
      <div class="space-y-6">
        <div class="text-center">
          <h2 class="text-lg font-semibold text-gray-800">{{ j.produtoNome }}</h2>
          <p class="text-sm text-gray-500">
            @switch (j.status) {
              @case ('Queued') {
                Na fila para processamento...
              }
              @case ('Processing') {
                Processando suas fotos... isso leva cerca de 1 minuto.
              }
              @case ('Completed') {
                Geração concluída! Veja o resultado abaixo.
              }
              @case ('PartiallyFailed') {
                Concluído com algumas falhas.
              }
              @case ('Failed') {
                A geração falhou.
              }
            }
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          @for (item of j.itens; track item.photoTypeCodigo) {
            <div class="overflow-hidden rounded-lg border border-gray-200">
              <div class="flex aspect-square items-center justify-center bg-gray-50">
                @switch (item.status) {
                  @case ('Queued') {
                    <span class="text-sm text-gray-400">Na fila...</span>
                  }
                  @case ('Processing') {
                    <span class="animate-pulse text-sm text-violet-500">Gerando...</span>
                  }
                  @case ('Completed') {
                    <img [src]="item.resultImageUrl" [alt]="item.photoTypeNome" class="h-full w-full object-cover" />
                  }
                  @case ('Failed') {
                    <span class="text-sm text-red-500">Falhou</span>
                  }
                }
              </div>
              <div class="flex items-center justify-between p-3">
                <span class="text-sm font-medium text-gray-700">{{ item.photoTypeNome }}</span>
                @if (item.status === 'Completed') {
                  <a
                    [href]="item.resultImageUrl"
                    [download]="nomeArquivo(item.photoTypeNome)"
                    class="text-sm font-medium text-violet-600 hover:underline"
                  >
                    Baixar
                  </a>
                }
              </div>
            </div>
          }
        </div>

        <div class="flex items-center justify-center gap-3">
          <button
            type="button"
            class="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            [disabled]="j.status !== 'Completed'"
            (click)="baixarTodosZip(j)"
          >
            Baixar tudo (ZIP)
          </button>
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            (click)="novoCarrossel()"
          >
            Gerar outro carrossel
          </button>
        </div>
      </div>
    } @else {
      <p class="text-center text-sm text-gray-500">Job não encontrado.</p>
    }
  `,
})
export class ResultadoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly generationService = inject(MockGenerationService);
  private readonly wizard = inject(WizardStateService);

  protected job!: Signal<GenerationJob | undefined>;

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('jobId') ?? '';
    this.job = this.generationService.obterJob(jobId) ?? signal(undefined);
  }

  nomeArquivo(tipoNome: string): string {
    return `${tipoNome.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  }

  async baixarTodosZip(job: GenerationJob): Promise<void> {
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    for (const item of job.itens) {
      if (item.status !== 'Completed' || !item.resultImageUrl) continue;
      const resposta = await fetch(item.resultImageUrl);
      const blob = await resposta.blob();
      zip.file(this.nomeArquivo(item.photoTypeNome), blob);
    }

    const conteudo = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(conteudo);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${job.produtoNome || 'carrossel'}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  }

  novoCarrossel(): void {
    this.wizard.reset();
    this.router.navigate(['/criar-fotos']);
  }
}
