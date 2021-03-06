import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroEtiquetasCincoSComponent } from './pages/cinco-s/frontend/cadastro-etiquetas_cinco_s/cadastro-etiquetas_cinco_s.component';
import { EtiquetasGerencialCincoSComponent } from './pages/cinco-s/frontend/etiquetas-gerencial_cinco_s/etiquetas-gerencial_cinco_s.component';
import { RelatorioCincoSComponent } from './pages/cinco-s/frontend/relatorio_cinco_s/relatorio_cinco_s.component';

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
  { 
    path: "etiquetas-gerencial-cinco-s",
    component: EtiquetasGerencialCincoSComponent,
  },
  { 
    path: "cadastro-etiquetas-cinco-s",
    component: CadastroEtiquetasCincoSComponent,
  },
  { 
    path: "relatorio-etiquetas-cinco-s",
    component: RelatorioCincoSComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
