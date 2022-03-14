import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';

import { SessionService } from 'src/app/shared/session.service';
import { SharedService } from 'src/app/shared/shared.service';
import { EtiquetasGerencialService } from '../../backend/services/etiquetas-gerencial.service';
import { ListaCarrosService } from '../../backend/services/lista-carros.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  getEventsubscription!: Subscription;
  labelData: String[] = [];
  tipoEmbalagemData: String[] = [];
  quantidadeData: any[] = [];
  loadData: boolean = false;
  clienteEscolhido: String = 'HONDA';
  startDateGrafico: any;
  endDateGrafico: any;
  startDateTabela: any;
  endDateTabela: any;

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

  carrosCadastrados: any[] = [];
  totalEmbalagemCadastrada: number = 0;
  totalEmbalagemFora: number = 0;
  arrayFiltradaCliente: any[] = [];
  arrayFiltradaEmbalagem: any[] = [];
  showTotal: boolean = false;
  showUnico: boolean = false;

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
    private sharedService: SharedService,
  ) {
    this.getEventsubscription = this.sharedService.getFiltroClienteRelatorioEvent().subscribe(valorCliente => {
      console.log(valorCliente);
      this.clienteEscolhido = valorCliente;
      this.clienteSelecionado();
    });
    
    this.getEventsubscription = this.sharedService.getArrayFiltradaClienteEvent().subscribe(array => {
      this.arrayFiltradaCliente = array;
      console.log(this.arrayFiltradaCliente);
    });
    
    this.getEventsubscription = this.sharedService.getArrayFiltradaEmbalagemEvent().subscribe(array => {
      this.arrayFiltradaEmbalagem = array;
      console.log(this.arrayFiltradaEmbalagem);
    });
  }

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
    

    // * QUANTIDADE DE CARROS QUE A EMPRESA POSSUI
    this.listaCarrosService.getListaCarros().subscribe((carros: any) => {
      carros.forEach((element: any) => {
        this.carrosCadastrados.push(element);
      });
    });
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

    if (this.startDateGrafico !== null) {
      this.startDateGrafico = null;
      this.endDateGrafico = null;
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
      startDateFormatada = this.datepipe.transform(this.startDateGrafico, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGrafico, 'yyyy-MM-dd');
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
    this.startDateGrafico = null;
    this.endDateGrafico = null;
    this.clienteSelecionado();    
  }

  dateRangeTable(type: any, event: any) {
    this.startDateGrafico = this.startDateTabela;
    this.endDateGrafico = this.endDateTabela;
    this.dateRange(type, event);
  }

  clearDateTable(event: any) {
    event.stopPropagation();
    this.startDateTabela = null;
    this.endDateTabela = null;
    this.clearDate(event);
  }

  teste() {
    var embalagemNome: string;
    var total = 0;
    this.showTotal = false;
    this.showUnico = false;

    if (this.filterCliente === "" || this.filterEmbalagem === "") {
      this.totalEmbalagemFora = 0;
      this.totalEmbalagemCadastrada = 0;
    }

    // ! se cliente vazio
    if (this.filterCliente === "") {
      var embalagens: any[] = [];
      
      this.carrosCadastrados.forEach(carro => {
        // console.log(carro);
        if (carro.name.toLowerCase().indexOf(this.filterEmbalagem.toLowerCase()) > -1) {
          embalagemNome = carro.name.toLowerCase();
          this.totalEmbalagemCadastrada = carro.carts.length;
        }
      });
      
      setTimeout(() => {
        this.arrayFiltradaEmbalagem.forEach(dados => {
          // contando as embalagens nesse cliente
          if (!embalagens.includes(dados.embalagem)) {
            embalagens.push(dados.embalagem);
          }
          
          // verificandos se existe mais de uma embalagem no cliente
          if (embalagens.length > 1) {
            this.showUnico = false;

          } else {
            this.showUnico = true;
            total = total + dados.total;
          }
        });
        
        this.totalEmbalagemFora = total;
        
        total = 0;
      }, 300);

      
  
    
      // ! se cliente e embalagem preenchidos
    } else if(this.filterCliente !== "" && this.filterEmbalagem !== "") {
      // depois que filtra por cliente, identifico as embalagens que estao nesse cliente e passo para a variavel o que for
      // referente ao que o usuario digito
      this.arrayFiltradaCliente.forEach(item => {
        if (item.embalagem.toLowerCase().indexOf(this.filterEmbalagem.toLowerCase()) > -1) {
          embalagemNome = item.embalagem.toLowerCase();          
        }
      });
     
      // identifico a quantidade produzida dessa embalagem na empresa
      this.carrosCadastrados.forEach(carro => {
        if (carro.name.toLowerCase().indexOf(embalagemNome.toLowerCase()) > -1) {          
          this.totalEmbalagemCadastrada = carro.carts.length;
        }
      });

      // depois identifico a quantidade de embalagens no cliente filtrado
      this.dadosPorData.forEach(dados => {        
        if (dados.embalagem.toLowerCase() === embalagemNome.toLowerCase() && dados.nome.toLowerCase().indexOf(this.filterCliente.toLowerCase()) > -1) {
          total = total + dados.total;
          this.showTotal = true;
        }      
      });

      this.totalEmbalagemFora = total;
      total = 0;
    
    // ! se embalagem vazio
    } else if(this.filterCliente !== "") {
      // setTimeout pois preciso aguardar o filtro de cliente me retornar uma array filtrada
      setTimeout(() => {
        var embalagens: any[] = [];
        
        for (let index = 0; index < this.arrayFiltradaCliente.length; index++) {
          // contando as embalagens nesse cliente
          if (!embalagens.includes(this.arrayFiltradaCliente[index].embalagem)) {
            embalagens.push(this.arrayFiltradaCliente[index].embalagem);
          }
          
          // verificandos se existe mais de uma embalagem no cliente
          if (embalagens.length > 1) {
            this.showTotal = false;

          } else {
            this.showTotal = true;

            // identifico a quantidade produzida dessa embalagem na empresa
            this.carrosCadastrados.forEach(carro => {
              if (carro.name.toLowerCase().indexOf(this.arrayFiltradaCliente[0].embalagem.toLowerCase()) > -1) {          
                this.totalEmbalagemCadastrada = carro.carts.length;
              }
            });
          }

          total = total + this.arrayFiltradaCliente[index].total;
        }

        this.totalEmbalagemFora = total;
        total = 0;
      }, 300);
    }

    
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }
}
