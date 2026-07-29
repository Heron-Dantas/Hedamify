import { Component, inject } from '@angular/core';
import { CATALOGO_TIPOS_FOTO } from '../../../../core/models/photo-type.model';
import { WizardStateService } from '../../../../core/services/wizard-state.service';

@Component({
  selector: 'app-step-tipos-foto',
  template: `
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-700">Tipos de Foto</h3>
          <p class="text-sm text-gray-500">Selecione os tipos de foto que deseja gerar (mínimo 1)</p>
        </div>
        <button type="button" class="text-sm font-medium text-violet-600 hover:underline" (click)="alternarSelecionarTodos()">
          {{ todosSelecionados() ? 'Limpar seleção' : 'Selecionar todos' }}
        </button>
      </div>

      <div class="space-y-2">
        @for (tipo of tipos; track tipo.codigo) {
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors"
            [class.border-violet-400]="estaSelecionado(tipo.codigo)"
            [class.bg-violet-50]="estaSelecionado(tipo.codigo)"
            [class.border-gray-200]="!estaSelecionado(tipo.codigo)"
            (click)="wizard.toggleTipoFoto(tipo.codigo)"
          >
            <span class="flex items-center gap-3">
              <span class="text-xl">{{ tipo.icone }}</span>
              <span>
                <span class="block text-sm font-medium" [class.text-violet-700]="estaSelecionado(tipo.codigo)" [class.text-gray-800]="!estaSelecionado(tipo.codigo)">
                  {{ tipo.nome }}
                </span>
                <span class="block text-xs text-gray-500">{{ tipo.descricao }}</span>
              </span>
            </span>
            <span
              class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2"
              [class.border-violet-600]="estaSelecionado(tipo.codigo)"
              [class.bg-violet-600]="estaSelecionado(tipo.codigo)"
              [class.border-gray-300]="!estaSelecionado(tipo.codigo)"
            >
              @if (estaSelecionado(tipo.codigo)) {
                <span class="text-xs text-white">✓</span>
              }
            </span>
          </button>
        }
      </div>

      <p class="text-sm text-gray-500">{{ wizard.tiposSelecionados().size }} de {{ tipos.length }} selecionado(s)</p>
    </div>
  `,
})
export class StepTiposFotoComponent {
  protected readonly wizard = inject(WizardStateService);
  protected readonly tipos = CATALOGO_TIPOS_FOTO;

  estaSelecionado(codigo: string): boolean {
    return this.wizard.tiposSelecionados().has(codigo);
  }

  todosSelecionados(): boolean {
    return this.wizard.tiposSelecionados().size === this.tipos.length;
  }

  alternarSelecionarTodos(): void {
    if (this.todosSelecionados()) {
      this.wizard.limparSelecaoTipos();
    } else {
      this.wizard.selecionarTodosTipos();
    }
  }
}
