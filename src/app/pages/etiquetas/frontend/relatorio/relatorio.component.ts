import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { SessionService } from 'src/app/shared/session.service';
import { EtiquetasGerencialService } from '../../backend/services/etiquetas-gerencial.service';
import { ListaCarrosService } from '../../backend/services/lista-carros.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  labelData: String[] = [];
  tipoEmbalagemData: String[] = [];
  quantidadeData: any[] = [];
  loadData: boolean = false;
  clienteEscolhido: String = 'HONDA';
  startDate: any;
  endDate: any;

  filterCliente: string = '';
  filterTotal: string = '';
  filterEmbalagem: string = '';
  searchDateSaida: string = '';

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
  itemsPerPage: any = 15;
  currentPage: number = 1;
  totalRecords!: number;

  constructor(
    private etiquetasService: EtiquetasGerencialService,
    private sessionService: SessionService,
    public datepipe: DatePipe,
    private listaCarrosService: ListaCarrosService,
  ) { }

  ngOnInit(): void {
    // valerá somente se existir sessao
    if(this.sessionService.getItemPerPageListaEtiqueta()) {
      this.itemsPerPage = this.sessionService.getItemPerPageListaEtiqueta();
    }

    this.etiquetasService.getEtiquetas().subscribe((etiquetas: any) => {
      etiquetas.forEach((element: any) => {
        if (element.status === 'OUT') {
          this.dadosClientes.push({
            data: element.cartIssues[0].readAt.substring(0, 10), 
            nomeCliente: element.cartIssues[0].client.name, 
            embalagem: element.type.name,
          });          

          this.dadosClientes = this.dadosClientes.sort((a, b) => b.data.localeCompare(a.data));          
          
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
     
          if (this.dadosClientes[b].data === this.datas[a]) {
            // buscando nome igual
            for (let c = 0; c < this.nomeClientes.length; c++) {
     
              if (this.dadosClientes[b].nomeCliente === this.nomeClientes[c]) {
                if (this.clienteAtual !== this.dadosClientes[b].nomeCliente) {
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
                  if (this.embalagemAtual !== this.dadosClientes[b].embalagem) {
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

                  if (this.dadosClientes[b].embalagem === this.embalagens[d]) {
                    this.total++;
                    this.clienteAtual = this.dadosClientes[b].nomeCliente;
                    this.embalagemAtual = this.dadosClientes[b].embalagem;
                    this.dataAtual = this.datas[a];
     
                    this.quantidade.push({
                      data: this.dadosClientes[b].data, 
                      nome: this.dadosClientes[b].nomeCliente, 
                      embalagem: this.dadosClientes[b].embalagem,
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

        this.dadosPorData = this.dadosPorData;
        this.totalRecords = this.dadosPorData.length;

        // * populando os dados para o grafico
        this.dadosPorData.forEach(element => {
          if (element.nome === 'HONDA') {
            this.labelData.push(element.data);
            this.quantidadeData.push(element.total);
          }
          
          this.loadData = true;
        });
      }
      this.quantidade = [];
      
    },
    err => console.log(err)
    );
    

    // * LISTANDO QUANTIDADE DE CARROS QUE A EMPRESA POSSUI
    var totalEmpresa;
    setTimeout(() => {
      
      this.listaCarrosService.getListaCarros().subscribe((carros: any) => {
        totalEmpresa = 0;

        for (let c = 0; c < carros.length; c++) {
          // console.log(carros[c].name);

          for (let e = 0; e < this.dadosPorData.length; e++) {
            if (carros[c].name === this.dadosPorData[e].embalagem) {
              totalEmpresa = carros[c].carts.length;
              this.dadosPorData[e].totalEmpresa = totalEmpresa;
            }            
          }
        }
      });
    }, 2000);
    
    
  }

  // salvando valor setado pelo usuario de numero de itens por pagina
  saveNumberOfItemsPerPage(num: number): void {
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
      // backgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],
      // hoverBackgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],
    }]
  };

  clienteSelecionado() {
    // resetando os valores do grafico
    this.labelData = [];
    this.quantidadeData = [];
    this.barChartData.datasets[0].data = [];
    this.barChartData.labels = [];
    
    // populando com os dados do cliente escolhido
    this.dadosPorData.forEach(element => {
      if (element.nome === this.clienteEscolhido) {
        this.labelData.push(element.data);
        this.quantidadeData.push(element.total);
      }  
    });

    // passando os valores atualizados
    this.barChartData.labels = this.labelData;
    this.barChartData.datasets[0].data = this.quantidadeData;

    this.chart?.update();

    if (this.startDate !== null) {
      this.startDate = null;
      this.endDate = null;
    }

  }

  dateRange(type: any, event: any) {
      // resetando os valores do grafico
    this.labelData = [];
    this.quantidadeData = [];
    this.barChartData.datasets[0].data = [];
    this.barChartData.labels = [];

    var startDateFormatada: any;
    var endDateFormatada: any;
    
    if (event.value) {
      startDateFormatada = this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(event.value, 'yyyy-MM-dd');
    }

    // populando com os dados do cliente escolhido
    this.dadosPorData.forEach(element => {
      if (element.nome === this.clienteEscolhido) {
        if (element.data >= startDateFormatada && element.data <= endDateFormatada) {
          this.labelData.push(element.data);
          this.quantidadeData.push(element.total);
        }
      }  
    });

    // passando os valores atualizados
    this.barChartData.labels = this.labelData;
    this.barChartData.datasets[0].data = this.quantidadeData;

    this.chart?.update();
  }

  clearDate(event: any) {
    event.stopPropagation();
    this.startDate = null;
    this.endDate = null;
    this.clienteSelecionado();    
  }
  
  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }
}
