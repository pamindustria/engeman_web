import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EngemanGerencialComponent } from './pages/engeman-gerencial/frontend/engeman-gerencial/engeman-gerencial.component';
import { GraficoFuncionarioComponent } from './pages/engeman-gerencial/frontend/grafico-funcionario/grafico-funcionario.component';
import { GraficoOsComponent } from './pages/engeman-gerencial/frontend/grafico_os/grafico-os.component';
import { CadastroEtiquetasComponent } from './pages/etiquetas/frontend/cadastro-etiquetas/cadastro-etiquetas.component';
import { EtiquetasGerencialComponent } from './pages/etiquetas/frontend/etiquetas-gerencial/etiquetas-gerencial.component';
import { RelatorioComponent } from './pages/etiquetas/frontend/relatorio/relatorio.component';
import { DocaListagemComponent } from './pages/faturamento/frontend/doca-listagem/doca-listagem.component';
import { DocaComponent } from './pages/faturamento/frontend/doca/doca.component';
import { PaginaInicialComponent } from './pages/pagina-inicial/frontend/pagina-inicial.component';

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
    path: "grafico-de-os",
    component: GraficoOsComponent,
  },
  { 
    path: "grafico-por-funcionario",
    component: GraficoFuncionarioComponent,
  },
  { 
    path: "etiquetas-gerencial",
    component: EtiquetasGerencialComponent,
  },
  { 
    path: "cadastro-etiquetas",
    component: CadastroEtiquetasComponent,
  },
  { 
    path: "relatorio-etiquetas",
    component: RelatorioComponent,
  },
  { 
    path: "doca",
    component: DocaComponent,
  },
  { 
    path: "doca-listagem",
    component: DocaListagemComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
