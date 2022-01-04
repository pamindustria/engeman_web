import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-etiquetas-gerencial',
  templateUrl: './etiquetas-gerencial.component.html',
  styleUrls: ['./etiquetas-gerencial.component.css']
})
export class EtiquetasGerencialComponent implements OnInit {
  filter: string = '';
  dadosClientes = [
    {cliente: 'Honda', totalCarro: '100', carrosCliente:'80', retornoCarro: '20', dataUltimaSaida: '2021-12-20', dataUltimoRetorno: '2021-12-20' },
    {cliente: 'Samsung', totalCarro: '80', carrosCliente:'50', retornoCarro: '30', dataUltimaSaida: '2021-12-17', dataUltimoRetorno: '2021-12-17' },
    {cliente: 'Cliente1', totalCarro: '50', carrosCliente:'25', retornoCarro: '25', dataUltimaSaida: '2021-12-17', dataUltimoRetorno: '2021-12-17' },
    {cliente: 'Cliente2', totalCarro: '50', carrosCliente:'30', retornoCarro: '20', dataUltimaSaida: '2021-12-17', dataUltimoRetorno: '2021-12-17' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
