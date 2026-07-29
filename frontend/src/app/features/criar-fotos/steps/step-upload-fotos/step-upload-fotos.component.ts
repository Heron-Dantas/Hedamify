import { Component, inject, signal } from '@angular/core';
import { WizardStateService } from '../../../../core/services/wizard-state.service';
import { MINIMO_FOTOS, TAMANHO_MAXIMO_BYTES, UploadedPhoto } from '../../../../core/models/uploaded-photo.model';

const EXTENSOES_ACEITAS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];

@Component({
  selector: 'app-step-upload-fotos',
  template: `
    <div class="space-y-3">
      <p class="text-sm text-gray-600">
        Envie pelo menos {{ minimoFotos }} fotos: frente, outro ângulo e uma foto de contexto/ambiente.
      </p>

      <label
        class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors"
        [class.border-violet-400]="arrastando()"
        [class.bg-violet-50]="arrastando()"
        [class.border-gray-300]="!arrastando()"
        (dragover)="onDragOver($event)"
        (dragleave)="arrastando.set(false)"
        (drop)="onDrop($event)"
      >
        <span class="text-3xl">📤</span>
        <span class="text-sm text-gray-700">
          Arraste suas fotos aqui ou <span class="font-medium text-violet-600">clique para selecionar</span>
        </span>
        <span class="text-xs text-gray-400">JPG, PNG, WEBP ou HEIC · Máximo 10MB por imagem</span>
        <input type="file" class="hidden" multiple accept="image/*,.heic,.heif" (change)="onFileInput($event)" />
      </label>

      @if (erros().length > 0) {
        <ul class="space-y-1 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          @for (erro of erros(); track erro) {
            <li>{{ erro }}</li>
          }
        </ul>
      }

      @if (wizard.fotos().length > 0) {
        <p class="text-sm font-medium" [class.text-emerald-600]="wizard.fotosValidas()" [class.text-gray-500]="!wizard.fotosValidas()">
          {{ wizard.fotos().length }} imagem(ns) selecionada(s)
        </p>

        <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          @for (foto of wizard.fotos(); track foto.id) {
            <div class="group relative aspect-square overflow-hidden rounded-lg border border-gray-200">
              @if (isHeic(foto.file)) {
                <div class="flex h-full w-full flex-col items-center justify-center gap-1 bg-gray-50 text-gray-400">
                  <span class="text-2xl">🖼️</span>
                  <span class="px-1 text-center text-[10px] leading-tight">{{ foto.file.name }}</span>
                </div>
              } @else {
                <img [src]="foto.previewUrl" [alt]="foto.file.name" class="h-full w-full object-cover" />
              }
              <button
                type="button"
                class="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                (click)="wizard.removerFoto(foto.id)"
                aria-label="Remover foto"
              >
                ✕
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class StepUploadFotosComponent {
  protected readonly wizard = inject(WizardStateService);
  protected readonly minimoFotos = MINIMO_FOTOS;
  protected readonly arrastando = signal(false);
  protected readonly erros = signal<string[]>([]);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.arrastando.set(true);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.arrastando.set(false);
    if (event.dataTransfer?.files) {
      this.processarArquivos(event.dataTransfer.files);
    }
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processarArquivos(input.files);
      input.value = '';
    }
  }

  protected isHeic(file: File): boolean {
    const extensao = file.name.split('.').pop()?.toLowerCase() ?? '';
    return extensao === 'heic' || extensao === 'heif';
  }

  private processarArquivos(fileList: FileList): void {
    const erros: string[] = [];
    const validos: UploadedPhoto[] = [];

    for (const file of Array.from(fileList)) {
      const extensao = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!EXTENSOES_ACEITAS.includes(extensao)) {
        erros.push(`${file.name}: formato não aceito (use JPG, PNG, WEBP ou HEIC).`);
        continue;
      }
      if (file.size > TAMANHO_MAXIMO_BYTES) {
        erros.push(`${file.name}: excede o limite de 10MB.`);
        continue;
      }
      validos.push({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) });
    }

    this.erros.set(erros);
    if (validos.length > 0) {
      this.wizard.adicionarFotos(validos);
    }
  }
}
