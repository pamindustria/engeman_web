import { Component, OnInit } from '@angular/core';
import { EtiquetasGerencialService } from './etiquetas-gerencial.service';

@Component({
  selector: 'app-etiquetas-gerencial',
  templateUrl: './etiquetas-gerencial.component.html',
  styleUrls: ['./etiquetas-gerencial.component.css']
})
export class EtiquetasGerencialComponent implements OnInit {
  filterEtiqueta: string = '';
  filterCliente: string = '';
  filterStatus: string = '';
  searchDate: string = '';
  dadosClientes: any[] = [];

  constructor(
    private etiquetasService: EtiquetasGerencialService
  ) { }

  ngOnInit(): void {
    this.etiquetasService.getEtiquetas().subscribe((etiquetas: any) => {
      // cartIssues pode vir vazio, aqui preencho somente quanto tiver objeto em cartIssues
      etiquetas.forEach((element: any) => {
        if (element.cartIssues.length === 1) {
          this.dadosClientes.push(element);
        }        
      });
    },
    err => console.log(err)
    );
  } 
}
