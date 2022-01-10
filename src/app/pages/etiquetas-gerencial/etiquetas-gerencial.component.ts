import { Component, OnInit } from '@angular/core';
import { EtiquetasGerencialService } from './etiquetas-gerencial.service';

@Component({
  selector: 'app-etiquetas-gerencial',
  templateUrl: './etiquetas-gerencial.component.html',
  styleUrls: ['./etiquetas-gerencial.component.css']
})
export class EtiquetasGerencialComponent implements OnInit {
  filter: string = '';
  searchDate: string = '';
  dadosClientes: any[] = [];

  constructor(
    private etiquetasService: EtiquetasGerencialService
  ) { }

  ngOnInit(): void {
    this.etiquetasService.getEtiquetas().subscribe((etiquetas: any) => {
      console.log(etiquetas);
      this.dadosClientes.push(etiquetas);      
    },
    err => console.log(err)
    );
  } 
}
