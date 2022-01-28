import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EngemanGerencialComponent } from './pages/engeman-gerencial/engeman-gerencial.component';
import { CadastroEtiquetasComponent } from './pages/etiquetas/cadastro-etiquetas/cadastro-etiquetas.component';
import { EtiquetasGerencialComponent } from './pages/etiquetas/etiquetas-gerencial/etiquetas-gerencial.component';
import { PaginaInicialComponent } from './pages/pagina-inicial/pagina-inicial.component';

const routes: Routes = [
  { 
    path: "",
    component: PaginaInicialComponent,
  },
  { 
    path: "engeman-gerencial",
    component: EngemanGerencialComponent,
  },
  { 
    path: "etiquetas-gerencial",
    component: EtiquetasGerencialComponent,
  },
  { 
    path: "cadastro-etiquetas",
    component: CadastroEtiquetasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }