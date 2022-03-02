import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule,  } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpClientModule } from "@angular/common/http";
import { MatRadioModule } from '@angular/material/radio';
import { NgxPaginationModule } from 'ngx-pagination';

import { SearchComponent } from '../components/search/search.component';
import { FilterEtiquetaPipe, FilterClientePipe, FilterStatusPipe, FilterDataSaidaPipe, FilterDataRetornoPipe, FilterTipoEmbalagemPipe, FilterManutencaoPipe } from '../components/pipes/filterEtiqueta.pipe';
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
    GraficoOsComponent
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
    MatNativeDateModule,
    HttpClientModule,
    SharedModule,
    MatRadioModule,
    NgxPaginationModule
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
    NgxPaginationModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-br' }],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PagesModule { }
