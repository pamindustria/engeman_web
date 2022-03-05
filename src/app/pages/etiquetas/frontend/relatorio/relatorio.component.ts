import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/shared/session.service';
import { EtiquetasGerencialService } from '../../backend/services/etiquetas-gerencial.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {
  filterEtiqueta: string = '';
  filterCliente: string = '';
  filterStatus: string = '';
  filterEmbalagem: string = '';
  searchDateSaida: string = '';
  searchDateRetorno: string = '';

  dadosClientes: any[] = [];
  nomeClientes: any[] = [];
  embalagens: any[] = [];
  datas: any[] = [];
  total: number = 0;
  quantidade: any[] = [];

  clienteAtual: String = "";
  embalagemAtual: String = "";
  teste: any[] = [];

  // ngx-pagination
  itemsPerPage: any = 14;
  currentPage: number = 1;
  totalRecords!: number;

  constructor(
    private etiquetasService: EtiquetasGerencialService,
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    // valerá somente se existir sessao
    if(this.sessionService.getItemPerPageListaEtiqueta()) {
      this.itemsPerPage = this.sessionService.getItemPerPageListaEtiqueta();
    }

    this.etiquetasService.getEtiquetas().subscribe((etiquetas: any) => {
      etiquetas.forEach((element: any) => {
        if (element.status === 'OUT') {          
          if (!this.nomeClientes.includes(element.cartIssues[0].client.name)) {
            this.nomeClientes.push(element.cartIssues[0].client.name);
          }
          
          if (!this.embalagens.includes(element.type.name)) {
            this.embalagens.push(element.type.name);
          }
          
          if (!this.datas.includes(element.cartIssues[0].readAt.substring(0, 10))) {
            this.datas.push(element.cartIssues[0].readAt.substring(0, 10));
          }

          this.dadosClientes.push(element);
          this.dadosClientes = this.dadosClientes.sort((a, b) => b.cartIssues[0].readAt.localeCompare(a.cartIssues[0].readAt));          
          this.totalRecords = this.dadosClientes.length;
        }        
      });
      
      // console.log(this.nomeClientes);
      // console.log(this.embalagens);
      // console.log(this.datas);
      // console.log(this.dadosClientes);      
    },
    err => console.log(err)
    );
    
    
  }

  // salvando valor setado pelo usuario de numero de itens por pagina
  saveNumberOfItemssPerPage(num: number): void {
    this.sessionService.setItemPerPageListaEtiqueta(num);
  }

  calculateDiff(sentOn: any) {
    let todayDate = new Date();
    let sentOnDate = new Date(sentOn);
    sentOnDate.setDate(sentOnDate.getDate());
    let differenceInTime = todayDate.getTime() - sentOnDate.getTime();
    // To calculate the no. of days between two dates
    let differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  }
}
