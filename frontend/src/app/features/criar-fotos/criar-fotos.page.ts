import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StepperComponent } from '../../shared/components/stepper/stepper.component';
import { StepNomeProdutoComponent } from './steps/step-nome-produto/step-nome-produto.component';
import { StepUploadFotosComponent } from './steps/step-upload-fotos/step-upload-fotos.component';
import { StepTiposFotoComponent } from './steps/step-tipos-foto/step-tipos-foto.component';
import { StepPersonalizacaoComponent } from './steps/step-personalizacao/step-personalizacao.component';
import { WizardStateService } from '../../core/services/wizard-state.service';
import { MockGenerationService } from '../../core/services/mock-generation.service';

const TITULOS_STEP = ['Nome do produto', 'Envie as fotos do seu produto', 'Selecione os tipos de foto que deseja gerar', 'Personalize cada tipo de foto (opcional)'];

@Component({
  selector: 'app-criar-fotos-page',
  imports: [StepperComponent, StepNomeProdutoComponent, StepUploadFotosComponent, StepTiposFotoComponent, StepPersonalizacaoComponent],
  template: `
    <div class="mx-auto max-w-2xl px-4 py-10">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-semibold text-gray-900">Novo Carrossel</h1>
        <p class="mt-1 text-sm text-gray-500">{{ titulos[wizard.stepAtual() - 1] }}</p>
      </div>

      <app-stepper class="mb-8 block" [stepAtual]="wizard.stepAtual()" [total]="wizard.totalSteps" />

      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        @switch (wizard.stepAtual()) {
          @case (1) {
            <app-step-nome-produto />
          }
          @case (2) {
            <app-step-upload-fotos />
          }
          @case (3) {
            <app-step-tipos-foto />
          }
          @case (4) {
            <app-step-personalizacao />
          }
        }

        <div class="mt-6 flex items-center justify-between">
          @if (wizard.stepAtual() > 1) {
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              (click)="wizard.voltar()"
            >
              ← Voltar
            </button>
          } @else {
            <span></span>
          }

          @if (wizard.stepAtual() < wizard.totalSteps) {
            <button
              type="button"
              class="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              [disabled]="!wizard.podeAvancar()"
              (click)="wizard.avancar()"
            >
              Continuar →
            </button>
          } @else {
            <button
              type="button"
              class="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
              (click)="gerarCarrossel()"
            >
              ✨ Gerar Carrossel
            </button>
          }
        </div>
      </div>
    </div>
  `,
})
export class CriarFotosPage {
  protected readonly wizard = inject(WizardStateService);
  protected readonly titulos = TITULOS_STEP;
  private readonly generationService = inject(MockGenerationService);
  private readonly router = inject(Router);

  gerarCarrossel(): void {
    const jobId = this.generationService.criarJob(
      this.wizard.nomeProduto(),
      this.wizard.fotos(),
      this.wizard.tiposSelecionados(),
      this.wizard.personalizacao(),
    );
    this.router.navigate(['/criar-fotos/resultado', jobId]);
  }
}
