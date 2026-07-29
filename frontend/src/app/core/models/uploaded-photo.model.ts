export interface UploadedPhoto {
  id: string;
  file: File;
  previewUrl: string;
}

export const FORMATOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
export const TAMANHO_MAXIMO_BYTES = 10 * 1024 * 1024;
export const MINIMO_FOTOS = 3;
