import { Routes } from '@angular/router';
import { CriarFotosPage } from './features/criar-fotos/criar-fotos.page';
import { ResultadoComponent } from './features/criar-fotos/resultado/resultado.component';

export const routes: Routes = [
  { path: '', redirectTo: 'criar-fotos', pathMatch: 'full' },
  { path: 'criar-fotos', component: CriarFotosPage },
  { path: 'criar-fotos/resultado/:jobId', component: ResultadoComponent },
];
