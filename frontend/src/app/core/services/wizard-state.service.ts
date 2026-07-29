import { Injectable, computed, signal } from '@angular/core';
import { CATALOGO_TIPOS_FOTO } from '../models/photo-type.model';
import { MINIMO_FOTOS, UploadedPhoto } from '../models/uploaded-photo.model';

export interface PersonalizacaoTipo {
  instrucaoPersonalizada: string;
  aplicarCorrecaoDetalhes: boolean;
}

@Injectable({ providedIn: 'root' })
export class WizardStateService {
  readonly totalSteps = 4;

  readonly stepAtual = signal(1);
  readonly nomeProduto = signal('');
  readonly fotos = signal<UploadedPhoto[]>([]);
  readonly tiposSelecionados = signal<Set<string>>(new Set());
  readonly personalizacao = signal<Record<string, PersonalizacaoTipo>>({});

  readonly nomeProdutoValido = computed(() => this.nomeProduto().trim().length > 0);
  readonly fotosValidas = computed(() => this.fotos().length >= MINIMO_FOTOS);
  readonly tiposValidos = computed(() => this.tiposSelecionados().size > 0);

  readonly podeAvancar = computed(() => {
    switch (this.stepAtual()) {
      case 1:
        return this.nomeProdutoValido();
      case 2:
        return this.fotosValidas();
      case 3:
        return this.tiposValidos();
      default:
        return true;
    }
  });

  irParaStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.stepAtual.set(step);
    }
  }

  avancar(): void {
    if (this.podeAvancar() && this.stepAtual() < this.totalSteps) {
      this.stepAtual.update((s) => s + 1);
    }
  }

  voltar(): void {
    if (this.stepAtual() > 1) {
      this.stepAtual.update((s) => s - 1);
    }
  }

  setNomeProduto(nome: string): void {
    this.nomeProduto.set(nome);
  }

  adicionarFotos(novas: UploadedPhoto[]): void {
    this.fotos.update((atual) => [...atual, ...novas]);
  }

  removerFoto(id: string): void {
    this.fotos.update((atual) => {
      const foto = atual.find((f) => f.id === id);
      if (foto) {
        URL.revokeObjectURL(foto.previewUrl);
      }
      return atual.filter((f) => f.id !== id);
    });
  }

  toggleTipoFoto(codigo: string): void {
    this.tiposSelecionados.update((atual) => {
      const novo = new Set(atual);
      if (novo.has(codigo)) {
        novo.delete(codigo);
      } else {
        novo.add(codigo);
      }
      return novo;
    });
    this.sincronizarPersonalizacaoComSelecao();
  }

  selecionarTodosTipos(): void {
    this.tiposSelecionados.set(new Set(CATALOGO_TIPOS_FOTO.map((t) => t.codigo)));
    this.sincronizarPersonalizacaoComSelecao();
  }

  limparSelecaoTipos(): void {
    this.tiposSelecionados.set(new Set());
    this.sincronizarPersonalizacaoComSelecao();
  }

  private sincronizarPersonalizacaoComSelecao(): void {
    this.personalizacao.update((atual) => {
      const novo: Record<string, PersonalizacaoTipo> = {};
      for (const codigo of this.tiposSelecionados()) {
        novo[codigo] = atual[codigo] ?? { instrucaoPersonalizada: '', aplicarCorrecaoDetalhes: false };
      }
      return novo;
    });
  }

  setInstrucao(codigo: string, instrucao: string): void {
    this.personalizacao.update((atual) => ({
      ...atual,
      [codigo]: { ...atual[codigo], instrucaoPersonalizada: instrucao },
    }));
  }

  toggleCorrecaoDetalhes(codigo: string): void {
    this.personalizacao.update((atual) => ({
      ...atual,
      [codigo]: { ...atual[codigo], aplicarCorrecaoDetalhes: !atual[codigo]?.aplicarCorrecaoDetalhes },
    }));
  }

  aplicarCorrecaoATodos(valor: boolean): void {
    this.personalizacao.update((atual) => {
      const novo: Record<string, PersonalizacaoTipo> = {};
      for (const codigo of Object.keys(atual)) {
        novo[codigo] = { ...atual[codigo], aplicarCorrecaoDetalhes: valor };
      }
      return novo;
    });
  }

  reset(): void {
    for (const foto of this.fotos()) {
      URL.revokeObjectURL(foto.previewUrl);
    }
    this.stepAtual.set(1);
    this.nomeProduto.set('');
    this.fotos.set([]);
    this.tiposSelecionados.set(new Set());
    this.personalizacao.set({});
  }
}
