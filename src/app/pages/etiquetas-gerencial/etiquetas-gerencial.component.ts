import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-etiquetas-gerencial',
  templateUrl: './etiquetas-gerencial.component.html',
  styleUrls: ['./etiquetas-gerencial.component.css']
})
export class EtiquetasGerencialComponent implements OnInit {
  filter: string = '';
  dadosClientes = [
    {etiqueta: '1542', cliente: 'Honda', totalAtivo: '100', dataUltimaSaida: '2021-12-20', dataUltimoRetorno: '2021-12-20', status: 'Ativo' },
    {etiqueta: '0023', cliente: 'Samsung', totalAtivo: '80', dataUltimaSaida: '2021-12-17', dataUltimoRetorno: '2021-12-17', status: 'Manutenção' },
    {etiqueta: '7896', cliente: 'PAM', totalAtivo: '50', dataUltimaSaida: '2021-12-17', dataUltimoRetorno: '2021-12-17', status: 'Desativado' },
    {etiqueta: '5698', cliente: 'PAM', totalAtivo: '50', dataUltimaSaida: '2021-12-17', dataUltimoRetorno: '2021-12-17', status: 'PAM' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
