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

import { DataTablesModule } from 'angular-datatables';

import { PaginaInicialComponent } from './pagina-inicial/pagina-inicial.component';
import { EngemanGerencialComponent } from './engeman-gerencial/engeman-gerencial.component';
import { EtiquetasGerencialComponent } from './etiquetas-gerencial/etiquetas-gerencial.component';
import { SearchComponent } from '../components/search/search.component';
import { FilterPipe } from '../components/pipes/filter.pipe';
import { SortDirective } from '../util/sort.directive';
import { FilterEngemanPipe } from '../components/pipes/filterEngeman.pipe';
import { DateFilterComponent } from '../components/dateFilter/dateFilter.component';
import { ListaCarrosComponent } from './lista-carros/lista-carros.component';

@NgModule({
  declarations: [
    EngemanGerencialComponent,
    PaginaInicialComponent,
    EtiquetasGerencialComponent,
    FilterPipe,
    FilterEngemanPipe,
    SearchComponent,
    SortDirective,
    DateFilterComponent,
    ListaCarrosComponent,
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
    DataTablesModule,
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
    DataTablesModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-br' }],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PagesModule { }
