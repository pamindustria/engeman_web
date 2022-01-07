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

  // dadosClientes = [
  //   {etiqueta: '1542', cliente: 'Honda', totalAtivo: '100', dataUltimaSaida: '2022-01-01', dataUltimoRetorno: '2022-01-20', status: 'Ativo' },
  //   {etiqueta: '0023', cliente: 'Samsung', totalAtivo: '80', dataUltimaSaida: '2022-01-08', dataUltimoRetorno: '2022-01-17', status: 'Manutenção' },
  //   {etiqueta: '7896', cliente: 'PAM', totalAtivo: '50', dataUltimaSaida: '2022-01-17', dataUltimoRetorno: '2022-01-31', status: 'Desativado' },
  //   {etiqueta: '5698', cliente: 'PAM', totalAtivo: '50', dataUltimaSaida: '2022-01-17', dataUltimoRetorno: '2022-01-17', status: 'PAM' },
  // ];
  dadosClientes: any[] = [];

  constructor(
    private etiquetasService: EtiquetasGerencialService
  ) { }

  ngOnInit(): void {
    this.etiquetasService.getEtiquetas().subscribe(etiquetas => {
      console.log(etiquetas);
      this.dadosClientes.push(etiquetas);
      console.log(this.dadosClientes);
    });
  }

}
