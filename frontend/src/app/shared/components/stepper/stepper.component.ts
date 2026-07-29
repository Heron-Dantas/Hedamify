import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  template: `
    <div class="flex items-center justify-center gap-2">
      @for (step of stepsArray(); track step) {
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
          [class.bg-violet-600]="step === stepAtual()"
          [class.text-white]="step === stepAtual()"
          [class.bg-emerald-500]="step < stepAtual()"
          [class.text-white]="step <= stepAtual()"
          [class.bg-gray-200]="step > stepAtual()"
          [class.text-gray-500]="step > stepAtual()"
        >
          {{ step }}
        </div>
        @if (step < total()) {
          <div class="h-0.5 w-10" [class.bg-emerald-500]="step < stepAtual()" [class.bg-gray-200]="step >= stepAtual()"></div>
        }
      }
    </div>
  `,
})
export class StepperComponent {
  readonly stepAtual = input.required<number>();
  readonly total = input.required<number>();

  stepsArray(): number[] {
    return Array.from({ length: this.total() }, (_, i) => i + 1);
  }
}
