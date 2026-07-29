import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CATALOGO_TIPOS_FOTO } from '../../../../core/models/photo-type.model';
import { WizardStateService } from '../../../../core/services/wizard-state.service';

const TRANSCRICOES_FICTICIAS = [
  'ao lado de uma TV com PS5 ligado, tema GTA 6',
  'fundo cinza claro, sombra suave embaixo do produto',
  'em cima de uma mesa de madeira, luz natural de janela',
];

@Component({
  selector: 'app-step-personalizacao',
  imports: [FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-700">Personalizar Fotos</h3>
          <p class="text-sm text-gray-500">Descreva como quer cada tipo de foto. Pode digitar ou gravar áudio (opcional).</p>
        </div>
        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-violet-600" (change)="aplicarATodos($event)" />
          Aplicar correção a todos
        </label>
      </div>

      <div class="space-y-3">
        @for (tipo of tiposSelecionados(); track tipo.codigo) {
          <div class="rounded-lg border border-gray-200 p-4">
            <div class="mb-2 flex items-center gap-2">
              <span>{{ tipo.icone }}</span>
              <span class="text-sm font-medium text-gray-800">{{ tipo.nome }}</span>
            </div>

            <div class="flex items-start gap-2">
              <textarea
                rows="2"
                placeholder="Ex: ao lado de uma TV com PS5 ligado, tema GTA 6"
                class="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                [ngModel]="instrucaoDe(tipo.codigo)"
                (ngModelChange)="wizard.setInstrucao(tipo.codigo, $event)"
              ></textarea>
              <button
                type="button"
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border"
                [class.border-red-400]="gravando().has(tipo.codigo)"
                [class.bg-red-50]="gravando().has(tipo.codigo)"
                [class.border-gray-300]="!gravando().has(tipo.codigo)"
                [disabled]="gravando().has(tipo.codigo)"
                (click)="simularGravacaoAudio(tipo.codigo)"
                [attr.aria-label]="gravando().has(tipo.codigo) ? 'Transcrevendo áudio...' : 'Gravar instrução por áudio'"
                title="Gravar instrução por áudio (simulado)"
              >
                {{ gravando().has(tipo.codigo) ? '⏳' : '🎙️' }}
              </button>
            </div>

            <label class="mt-2 flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-violet-600"
                [checked]="correcaoDe(tipo.codigo)"
                (change)="wizard.toggleCorrecaoDetalhes(tipo.codigo)"
              />
              Aplicar correção de detalhes (corrige pequenas imperfeições de fabricação, sem alterar o design)
            </label>
          </div>
        }
      </div>
    </div>
  `,
})
export class StepPersonalizacaoComponent {
  protected readonly wizard = inject(WizardStateService);
  protected readonly gravando = signal<Set<string>>(new Set());

  tiposSelecionados() {
    return CATALOGO_TIPOS_FOTO.filter((t) => this.wizard.tiposSelecionados().has(t.codigo));
  }

  instrucaoDe(codigo: string): string {
    return this.wizard.personalizacao()[codigo]?.instrucaoPersonalizada ?? '';
  }

  correcaoDe(codigo: string): boolean {
    return this.wizard.personalizacao()[codigo]?.aplicarCorrecaoDetalhes ?? false;
  }

  aplicarATodos(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.wizard.aplicarCorrecaoATodos(checked);
  }

  simularGravacaoAudio(codigo: string): void {
    this.gravando.update((atual) => new Set(atual).add(codigo));
    const textoFicticio = TRANSCRICOES_FICTICIAS[Math.floor(Math.random() * TRANSCRICOES_FICTICIAS.length)];

    setTimeout(() => {
      this.wizard.setInstrucao(codigo, textoFicticio);
      this.gravando.update((atual) => {
        const novo = new Set(atual);
        novo.delete(codigo);
        return novo;
      });
    }, 1500);
  }
}
