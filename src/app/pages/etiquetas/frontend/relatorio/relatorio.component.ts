import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { SessionService } from 'src/app/shared/session.service';
import { EtiquetasGerencialService } from '../../backend/services/etiquetas-gerencial.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  labelData: String[] = [];
  tipoEmbalagemData: String[] = [];
  quantidadeData: number[] = [];
  loadData: boolean = false;
  dataset: any[] = [];

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
  dadosPorData: any[] = [];

  clienteAtual: String = "";
  embalagemAtual: String = "";
  dataAtual: String = "";

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
          this.dadosClientes.push(element);
          this.dadosClientes = this.dadosClientes.sort((a, b) => b.cartIssues[0].readAt.localeCompare(a.cartIssues[0].readAt));          
          this.totalRecords = this.dadosClientes.length;
          
          // ! código para pegar a quantidade de embalagens no cliente por dia
          if (!this.nomeClientes.includes(element.cartIssues[0].client.name)) {
            this.nomeClientes.push(element.cartIssues[0].client.name);
          }
          
          if (!this.embalagens.includes(element.type.name)) {
            this.embalagens.push(element.type.name);
          }
          
          if (!this.datas.includes(element.cartIssues[0].readAt.substring(0, 10))) {
            this.datas.push(element.cartIssues[0].readAt.substring(0, 10));
          }

        }        
      });
      
      // ! código para pegar a quantidade de embalagens no cliente por dia

      for (let a = 0; a < this.datas.length; a++) {
        // se a data mudar, a contagem zera
        this.total = 0;

        // é preciso verificar se quantidade já não foi zerada antes
        if (this.quantidade.length !== 0) {
          this.dadosPorData.push({
            data: this.dataAtual, 
            nome: this.clienteAtual, 
            embalagem: this.embalagemAtual,
            total: this.quantidade.length
          });
        }
        this.quantidade = [];
        
        // buscando datas iguais
        for (let b = 0; b < this.dadosClientes.length; b++) {
     
          if (this.dadosClientes[b].cartIssues[0].readAt.substring(0, 10) === this.datas[a]) {
            // buscando nome igual
            for (let c = 0; c < this.nomeClientes.length; c++) {
     
              if (this.dadosClientes[b].cartIssues[0].client.name === this.nomeClientes[c]) {
                if (this.clienteAtual !== this.dadosClientes[b].cartIssues[0].client.name) {
                  // se o nome mudar, a contagem zera
                  this.total = 0;

                  // é preciso verificar se quantidade já não foi zerada antes
                  if (this.quantidade.length !== 0) {
                    this.dadosPorData.push({
                      data: this.dataAtual, 
                      nome: this.clienteAtual, 
                      embalagem: this.embalagemAtual,
                      total: this.quantidade.length
                    });
                  }
                  this.quantidade = [];

                }
     
                // buscando embalagem
                for (let d = 0; d < this.embalagens.length; d++) {
                  if (this.embalagemAtual !== this.dadosClientes[b].type.name) {
                    // se a embalagem mudar, a contagem zera
                    this.total = 0;

                    // é preciso verificar se quantidade já não foi zerada antes
                    if (this.quantidade.length !== 0) {
                      this.dadosPorData.push({
                        data: this.dataAtual, 
                        nome: this.clienteAtual, 
                        embalagem: this.embalagemAtual,
                        total: this.quantidade.length
                      });
                    }
                    this.quantidade = [];

                  }

                  if (this.dadosClientes[b].type.name === this.embalagens[d]) {
                    this.total++;
                    this.clienteAtual = this.dadosClientes[b].cartIssues[0].client.name;
                    this.embalagemAtual = this.dadosClientes[b].type.name;
                    this.dataAtual = `${this.datas[a]} - ${this.dadosClientes[b].cartIssues[0].readAt.substring(11, 16)}`;
     
                    this.quantidade.push({
                      data: this.dadosClientes[b].cartIssues[0].readAt.substring(0, 10), 
                      nome: this.dadosClientes[b].cartIssues[0].client.name, 
                      embalagem: this.dadosClientes[b].type.name,
                      total: this.total
                    });
                    
                  }           
                }
              } 
            }
          }
        }
      }

      // é preciso verificar se quantidade já não foi zerada antes
      if (this.quantidade.length !== 0) {
        this.dadosPorData.push({
          data: this.dataAtual, 
          nome: this.clienteAtual, 
          embalagem: this.embalagemAtual,
          total: this.quantidade.length
        });

        this.dadosPorData = this.dadosPorData.sort((a, b) => b.data.localeCompare(a.data));

        this.dadosPorData.forEach(element => {
          this.labelData.push(element.data.substring(0, 10));
          this.quantidadeData.push(element.total);
          
          this.dataset.push({label: element.embalagem, data: element.total});
          this.loadData = true;
        });
      }
      this.quantidade = [];
      
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

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        // display: false
      }
    },
    plugins: {
      legend: {
        display: false,
      },
    }
  };

  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: this.labelData,
    datasets: [{
      data: this.quantidadeData,
      // label: 'Adria Gostosa',
      // backgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],
      // hoverBackgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],

    }]
  };

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }
}
