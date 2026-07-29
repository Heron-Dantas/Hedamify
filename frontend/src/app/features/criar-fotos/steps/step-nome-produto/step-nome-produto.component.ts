import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../../../core/services/wizard-state.service';

@Component({
  selector: 'app-step-nome-produto',
  imports: [FormsModule],
  template: `
    <div class="space-y-2">
      <label for="nomeProduto" class="block text-sm font-medium text-gray-700">Nome do Produto</label>
      <input
        id="nomeProduto"
        type="text"
        placeholder="Ex: Suporte controle video game GTA 6"
        class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        [ngModel]="wizard.nomeProduto()"
        (ngModelChange)="wizard.setNomeProduto($event)"
      />
      <p class="text-sm text-gray-500">Ajuda a IA a entender o que está fotografando.</p>
    </div>
  `,
})
export class StepNomeProdutoComponent {
  protected readonly wizard = inject(WizardStateService);
}
