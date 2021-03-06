import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpClientModule } from "@angular/common/http";
import { MatRadioModule } from '@angular/material/radio';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgChartsModule } from 'ng2-charts';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SearchComponent } from '../components/search/search.component';
import { FilterEtiquetaPipe, FilterClientePipe, FilterStatusPipe, FilterDataSaidaPipe, FilterDataRetornoPipe, FilterTipoEmbalagemPipe, FilterManutencaoPipe, RelatorioClientePipe, RelatorioEmabalagemPipe, RelatorioFiltroTotalPipe, RelatorioFilterByDataSaidaPipe } from '../components/pipes/filterEtiqueta.pipe';
import { SortDirective } from '../util/sort.directive';
import { FilterOSPipe, FilterDataIniPipe, FilterDataFimPipe, FilterFuncionarioPipe, FilterMatriculaPipe, FilterDescricaoPipe, FilterEquipamentoDescricaoPipe } from '../components/pipes/filterEngeman.pipe';
import { DateFilterComponent } from '../components/dateFilter/dateFilter.component';
import { FilterEmbalagemPipe } from '../components/pipes/filterEmbalagem.pipe';
import { CadastroEtiquetasComponent } from './etiquetas/frontend/cadastro-etiquetas/cadastro-etiquetas.component';
import { SharedModule } from '../shared/shared.module';
import { EngemanGerencialComponent } from './engeman-gerencial/frontend/engeman-gerencial/engeman-gerencial.component';
import { EtiquetasGerencialComponent } from './etiquetas/frontend/etiquetas-gerencial/etiquetas-gerencial.component';
import { ListaCarrosComponent } from './etiquetas/frontend/lista-carros/lista-carros.component';
import { PaginaInicialComponent } from './pagina-inicial/frontend/pagina-inicial.component';
import { GraficoOsComponent } from './engeman-gerencial/frontend/grafico_os/grafico-os.component';
import { RelatorioComponent } from './etiquetas/frontend/relatorio/relatorio.component';
import { GraficoFuncionarioComponent } from './engeman-gerencial/frontend/grafico-funcionario/grafico-funcionario.component';
import { DocaComponent } from './faturamento/frontend/doca/doca.component';
import { DocaListagemComponent } from './faturamento/frontend/doca-listagem/doca-listagem.component';
import { FilterNotaFiscalPipe } from '../components/pipes/filterNotaFiscal.pipe';
import { RelatorioCincoSComponent } from './cinco-s/frontend/relatorio_cinco_s/relatorio_cinco_s.component';
import { CadastroEtiquetasCincoSComponent } from './cinco-s/frontend/cadastro-etiquetas_cinco_s/cadastro-etiquetas_cinco_s.component';
import { EtiquetasGerencialCincoSComponent } from './cinco-s/frontend/etiquetas-gerencial_cinco_s/etiquetas-gerencial_cinco_s.component';
import { ListaCarrosCincoSComponent } from './cinco-s/frontend/lista-carros_cinco_s/lista-carros_cinco_s.component';

@NgModule({
  declarations: [
    EngemanGerencialComponent,
    PaginaInicialComponent,
    EtiquetasGerencialComponent,
    FilterEtiquetaPipe,
    FilterClientePipe,
    FilterTipoEmbalagemPipe,
    FilterStatusPipe,
    FilterDataSaidaPipe,
    FilterDataRetornoPipe,
    FilterManutencaoPipe,
    SearchComponent,
    SortDirective,
    DateFilterComponent,
    ListaCarrosComponent,
    FilterEmbalagemPipe,
    CadastroEtiquetasComponent,
    FilterOSPipe,
    FilterDataIniPipe,
    FilterDataFimPipe,
    FilterFuncionarioPipe,
    FilterMatriculaPipe,
    FilterDescricaoPipe,
    FilterEquipamentoDescricaoPipe,
    GraficoOsComponent,
    RelatorioComponent,
    RelatorioClientePipe,
    RelatorioEmabalagemPipe,
    RelatorioFiltroTotalPipe,
    RelatorioFilterByDataSaidaPipe,
    GraficoFuncionarioComponent,
    DocaComponent,
    DocaListagemComponent,
    FilterNotaFiscalPipe,
    RelatorioCincoSComponent,
    ListaCarrosCincoSComponent,
    EtiquetasGerencialCincoSComponent,
    CadastroEtiquetasCincoSComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    HttpClientModule,
    SharedModule,
    MatRadioModule,
    NgxPaginationModule,
    NgChartsModule,
    MatAutocompleteModule
  ],
  exports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatRadioModule,
    NgxPaginationModule,
    NgChartsModule,
    MatAutocompleteModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-br' }, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
