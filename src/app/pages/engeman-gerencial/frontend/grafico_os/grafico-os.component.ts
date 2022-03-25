import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { map, Observable, startWith } from 'rxjs';
import { EngemanGerencialService } from '../../backend/services/engeman-gerencial.service';

@Component({
  selector: 'app-grafico-os',
  templateUrl: './grafico-os.component.html',
  styleUrls: ['./grafico-os.component.css']
})
export class GraficoOsComponent implements OnInit, AfterViewInit {
  @ViewChild('chartPrimeiroTurno') chartPrimeiroTurno!: ElementRef;
  @ViewChild('chartSegundoTurno') chartSegundoTurno!: ElementRef;
  @ViewChild('chartTerceiroTurno') chartTerceiroTurno!: ElementRef;
  engemanArray: any[] = [];

  chartPrimeiro: Chart | undefined;
  chartSegundo: Chart | undefined;
  chartTerceiro: Chart | undefined;
  datas: any[] = [];

  datasPrimeiroTurno: any[] = [];
  quantidadeOsPorDiaPrimeiroTurno: any[] = [];
  primeiroTrintaDiasPrimeiroTurno: any[] = [];
  dataLabelPrimeiroTurno: String[] = [];
  quantidadesOSPrimeiroTurno: number[] = [];
  labelPorHoraPrimeiroTurno: String[] = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
  dadosOSPrimeiroTurno: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  maquinasPrimeiroTurno: string[] = [];
  maquinaSelecionadaPrimeiroTurno: string = "";
  geralPrimeiroTurno: any[] = [];
  datasEosPrimeiro: any[] = [];

  datasSegundoTurno: any[] = [];
  quantidadeOsPorDiaSegundoTurno: any[] = [];
  primeiroTrintaDiasSegundoTurno: any[] = [];
  dataLabelSegundoTurno: String[] = [];
  quantidadesOSSegundoTurno: number[] = [];
  labelPorHoraSegundoTurno: String[] = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  dadosOSSegundoTurno: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  maquinasSegundoTurno: string[] = [];
  maquinaSelecionadaSegundoTurno: string = "";
  geralSegundoTurno: any[] = [];
  datasEosSegundo: any[] = [];

  datasTerceiroTurno: any[] = [];
  quantidadeOsPorDiaTerceiroTurno: any[] = [];
  primeiroTrintaDiasTerceiroTurno: any[] = [];
  dataLabelTerceiroTurno: String[] = [];
  quantidadesOSTerceiroTurno: number[] = [];
  labelPorHoraTerceiroTurno: String[] = ['23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'];
  dadosOSTerceiroTurno: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  
  loadData: boolean = false;
  voltarPrim: boolean = false;
  voltarSeg: boolean = false;
  voltarTer: boolean = false;

  startDateGraficoPrimeiroTurno: any = null;
  endDateGraficoPrimeiroTurno: any = null;
  startDateGraficoSegundoTurno: any = null;
  endDateGraficoSegundoTurno: any = null;
  startDateGraficoTerceiroTurno: any = null;
  endDateGraficoTerceiroTurno: any = null;
  today = new Date();
  date = this.today.getDate();
  month = this.today.getMonth();
  year = this.today.getFullYear();
  maxDate = new Date(this.year, this.month, this.date);

  constructor(
    private engemanService: EngemanGerencialService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit() {
    this.engemanService.getEngemanList().subscribe((engeman: any) => {      
      engeman.forEach((element: any) => {
        // * adiciona somente a data, sem a hora a array Datas
        this.datas.push(element.DataIni.substring(0, 10));        

        // * passando os valores de cada turno
        if (element.DataIni.substring(11, 19) >= "07:00:00" && element.DataIni.substring(11, 19) < "15:00:00") {
          this.datasPrimeiroTurno.push(element.DataIni.substring(0, 10));

          this.geralPrimeiroTurno.push({maquina: element.APLICDescr, data: element.DataIni.substring(0, 10)});
          if (!this.maquinasPrimeiroTurno.includes(element.APLICDescr)) {
            this.maquinasPrimeiroTurno.push(element.APLICDescr);
          }
          
        } else if(element.DataIni.substring(11, 19) >= "15:00:00" && element.DataIni.substring(11, 19) < "23:00:00") {
          this.datasSegundoTurno.push(element.DataIni.substring(0, 10));

          this.geralSegundoTurno.push({maquina: element.APLICDescr, data: element.DataIni.substring(0, 10)});
          if (!this.maquinasSegundoTurno.includes(element.APLICDescr)) {
            this.maquinasSegundoTurno.push(element.APLICDescr);
          }

        } else if(element.DataIni.substring(11, 19) >= "23:00:00" || element.DataIni.substring(11, 19) < "07:00:00") {
          this.datasTerceiroTurno.push(element.DataIni.substring(0, 10));          
        }        

        // armazenando o valor recebido da rest
        this.engemanArray.push(element);
      });
      
      this.quantidadeOsPorDiaPrimeiroTurno = this.getQuantidadeOSFunction(this.datasPrimeiroTurno);    
      this.quantidadeOsPorDiaSegundoTurno = this.getQuantidadeOSFunction(this.datasSegundoTurno);    
      this.quantidadeOsPorDiaTerceiroTurno = this.getQuantidadeOSFunction(this.datasTerceiroTurno);    
      
      // console.log(this.quantidadeOsPorDiaPrimeiroTurno);
      // console.log(this.quantidadeOsPorDiaSegundoTurno);
      // console.log(this.quantidadeOsPorDiaTerceiroTurno);

      // * exibo somente os primeiros dias 7
      this.quantidadeOsPorDiaPrimeiroTurno.slice(0, 7).map((item: any, i: any) => {
        this.primeiroTrintaDiasPrimeiroTurno.push(item);
      });
      
      this.quantidadeOsPorDiaSegundoTurno.slice(0, 7).map((item: any, i: any) => {
        this.primeiroTrintaDiasSegundoTurno.push(item);
      });
      
      this.quantidadeOsPorDiaTerceiroTurno.slice(0, 7).map((item: any, i: any) => {
        this.primeiroTrintaDiasTerceiroTurno.push(item);        
      });

      // * populando os dados para o grafico com os ultimos 7 dias
      setTimeout(() => {
        this.preencherDadosGrafico(this.primeiroTrintaDiasPrimeiroTurno, this.dataLabelPrimeiroTurno, this.quantidadesOSPrimeiroTurno);
        this.preencherDadosGrafico(this.primeiroTrintaDiasSegundoTurno, this.dataLabelSegundoTurno, this.quantidadesOSSegundoTurno);
        this.preencherDadosGrafico(this.primeiroTrintaDiasTerceiroTurno, this.dataLabelTerceiroTurno, this.quantidadesOSTerceiroTurno);
        
        this.loadData = true;
      }, 1000);
      
    });    
  }

  ngAfterViewInit() {
    this.chartPrimeiro = new Chart(this.chartPrimeiroTurno.nativeElement, {
      type: 'bar',
      data: {
        labels: this.dataLabelPrimeiroTurno,
        datasets: [{
          label: 'Primeiro Turno',
          data: this.quantidadesOSPrimeiroTurno,
          borderWidth: 1
        }]
      },
      options: {
        onClick: (e, i) => {
          // pegando o valor da barra clicada
          var valor = this.chartPrimeiro!.data.datasets[0].data[i[0].index];
          var data = this.chartPrimeiro!.data.labels![i[0].index];
          this.dadosOSPrimeiroTurno = [0, 0, 0, 0, 0, 0, 0, 0];

          if (this.maquinaSelecionadaPrimeiroTurno === "") {
            // passando todos os elementos para a função e contando somente aqueles com a data da barra selecionada
            this.engemanArray.forEach(element => {
              this.dadosPorHoraPrimeiroTurnoFunction(element, data);
            });

          } else {
            // procuro no engemanArray a maquina selecionada pelo usuario e passo para a função
            this.engemanArray.forEach(element => {
              if (element.APLICDescr === this.maquinaSelecionadaPrimeiroTurno) {
                this.dadosPorHoraPrimeiroTurnoFunction(element, data);
              }
            });
          }
          
          this.chartPrimeiro!.data.datasets[0].data = [];
          this.chartPrimeiro!.data.labels = [];

          setTimeout(() => {
            this.chartPrimeiro!.data.datasets[0].data = this.dadosOSPrimeiroTurno;
            this.chartPrimeiro!.data.labels = this.labelPorHoraPrimeiroTurno;
            this.chartPrimeiro!.data.datasets[0].label = `Primeiro Turno - ${data}`;            

            this.voltarPrim = true;

            this.chartPrimeiro?.update();
          }, 500);
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });

    this.chartSegundo = new Chart(this.chartSegundoTurno.nativeElement, {
      type: 'bar',
      data: {
        labels: this.dataLabelSegundoTurno,
        datasets: [{
          label: 'Segundo Turno',
          data: this.quantidadesOSSegundoTurno,
          borderWidth: 1
        }]
      },
      options: {
        onClick: (e, i) => {
          // pegando o valor da barra clicada
          var valor = this.chartSegundo!.data.datasets[0].data[i[0].index];
          var data = this.chartSegundo!.data.labels![i[0].index]; 
          this.dadosOSSegundoTurno = [0, 0, 0, 0, 0, 0, 0, 0];   

          if (this.maquinaSelecionadaSegundoTurno === "") {
            // passando todos os elementos para a função e contando somente aqueles com a data da barra selecionada
            this.engemanArray.forEach(element => {
              this.dadosPorHoraSegundoTurnoFunction(element, data);
            });

          } else {
            // procuro no engemanArray a maquina selecionada pelo usuario e passo para a função
            this.engemanArray.forEach(element => {
              if (element.APLICDescr === this.maquinaSelecionadaSegundoTurno) {
                this.dadosPorHoraSegundoTurnoFunction(element, data);
              }
            });
          }

          this.chartSegundo!.data.datasets[0].data = [];
          this.chartSegundo!.data.labels = [];

          setTimeout(() => {
            this.chartSegundo!.data.datasets[0].data = this.dadosOSSegundoTurno;
            this.chartSegundo!.data.labels = this.labelPorHoraSegundoTurno;
            this.chartSegundo!.data.datasets[0].label = `Segundo Turno - ${data}`;

            this.voltarSeg = true;

            this.chartSegundo?.update();
          }, 500);
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
    
    this.chartTerceiro = new Chart(this.chartTerceiroTurno.nativeElement, {
      type: 'bar',
      data: {
        labels: this.dataLabelTerceiroTurno,
        datasets: [{
          label: 'Terceiro Turno',
          data: this.quantidadesOSTerceiroTurno,
          borderWidth: 1
        }]
      },
      options: {
        onClick: (e, i) => {
          // pegando o valor da barra clicada
          var valor = this.chartTerceiro!.data.datasets[0].data[i[0].index];
          var data = this.chartTerceiro!.data.labels![i[0].index];
          this.dadosOSTerceiroTurno = [0, 0, 0, 0, 0, 0, 0, 0];   

          // passando todos os elementos para a função e contando somente aqueles com a data da barra selecionada
          this.engemanArray.forEach(element => {
            this.dadosPorHoraTerceiroTurnoFunction(element, data);
          });

          this.chartTerceiro!.data.datasets[0].data = [];
          this.chartTerceiro!.data.labels = [];

          setTimeout(() => {
            this.chartTerceiro!.data.datasets[0].data = this.dadosOSTerceiroTurno;
            this.chartTerceiro!.data.labels = this.labelPorHoraTerceiroTurno;
            this.chartTerceiro!.data.datasets[0].label = `Terceiro Turno - ${data}`;

            this.voltarTer = true;

            this.chartTerceiro?.update();
          }, 500);
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

  // * nessa função, verifico a quantidade de vezes em que o mesmo dia se repete,
  // * significa que mais de uma OS foi aberta no dia e armazeno os dias e a quantidade de OS na array
  getQuantidadeOSFunction(array: any) {
    return Object.values(array.reduce((c: any, v: any) => {
      c[v] = c[v] || [v, 0];
      c[v][1]++;
      return c;
    },{})).map((o: any)=>(`${[o[0]]}: ${o[1]}`));   
  }

  preencherDadosGrafico(arrayDias: any, dataLabel: any, quantidadesOS: any) {
    // ordem crescente
    arrayDias = arrayDias.sort((a: any, b: any) => a.localeCompare(b));

    arrayDias.forEach((element: any) => {
      dataLabel.push(element.substring(0, 10));
      quantidadesOS.push(parseInt(element.substring(12, element.length)));

    });
  }

  // ? PRIMEIRO TURNO
  dateRangePrimeiroTurno() {
    // resetando os valores do grafico
    this.dataLabelPrimeiroTurno = [];
    this.quantidadesOSPrimeiroTurno = [];
    this.chartPrimeiro!.data.datasets[0].data = [];
    this.chartPrimeiro!.data.labels = [];

    var startDateFormatada: any;
    var endDateFormatada: any;
    
    startDateFormatada = this.datepipe.transform(this.startDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
    endDateFormatada = this.datepipe.transform(this.endDateGraficoPrimeiroTurno, 'yyyy-MM-dd');      

    // !se maquina vazia
    if (this.maquinaSelecionadaPrimeiroTurno === "") {
      this.quantidadeOsPorDiaPrimeiroTurno = this.quantidadeOsPorDiaPrimeiroTurno.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.quantidadeOsPorDiaPrimeiroTurno.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
          this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });

    } else {
      this.datasEosPrimeiro = this.datasEosPrimeiro.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosPrimeiro.forEach(element => {
        
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
          this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });  
    } 

    // passando os valores atualizados
    this.chartPrimeiro!.data.datasets[0].data = this.quantidadesOSPrimeiroTurno;
    this.chartPrimeiro!.data.labels = this.dataLabelPrimeiroTurno;

    this.chartPrimeiro?.update();
  }

  clearDatePrimeiroTurno(event: any) {
    event.stopPropagation();
    this.startDateGraficoPrimeiroTurno = null;
    this.endDateGraficoPrimeiroTurno = null;
    this.voltarPrim = false;

    this.dataLabelPrimeiroTurno = [];
    this.quantidadesOSPrimeiroTurno = [];
    this.chartPrimeiro!.data.datasets[0].data = [];
    this.chartPrimeiro!.data.labels = [];
    this.chartPrimeiro!.data.datasets[0].label = `Primeiro Turno`;
    var trintaDias:  any[] = [];

    // !se maquina vazia
    if (this.maquinaSelecionadaPrimeiroTurno === "") {
      this.primeiroTrintaDiasPrimeiroTurno = this.primeiroTrintaDiasPrimeiroTurno.sort((a, b) => a.localeCompare(b));
      
      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasPrimeiroTurno.forEach((element: any) => {
        this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
        this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
      });

    } else {
      this.datasEosPrimeiro = this.datasEosPrimeiro.sort((a, b) => b.localeCompare(a));
      
      // pego os ultimos 7 dias
      this.datasEosPrimeiro.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      trintaDias = trintaDias.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      trintaDias.forEach((element: any) => {
        this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
        this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
      });
    }

    // passando os valores atualizados
    this.chartPrimeiro!.data.datasets[0].data = this.quantidadesOSPrimeiroTurno;
    this.chartPrimeiro!.data.labels = this.dataLabelPrimeiroTurno;

    this.chartPrimeiro?.update();
  }

  // ? SEGUNDO TURNO
  dateRangeSegundoTurno() {    
    // resetando os valores do grafico
    this.dataLabelSegundoTurno = [];
    this.quantidadesOSSegundoTurno = [];
    this.chartSegundo!.data.datasets[0].data = [];
    this.chartSegundo!.data.labels = [];

    var startDateFormatada: any;
    var endDateFormatada: any;
    
    startDateFormatada = this.datepipe.transform(this.startDateGraficoSegundoTurno, 'yyyy-MM-dd');
    endDateFormatada = this.datepipe.transform(this.endDateGraficoSegundoTurno, 'yyyy-MM-dd');      

    // !se maquina vazia
    if (this.maquinaSelecionadaSegundoTurno === "") {
      this.quantidadeOsPorDiaSegundoTurno = this.quantidadeOsPorDiaSegundoTurno.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.quantidadeOsPorDiaSegundoTurno.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelSegundoTurno.push(element.substring(0, 10));
          this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
        }
      });

    } else {
      this.datasEosSegundo = this.datasEosSegundo.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosSegundo.forEach(element => {
        
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelSegundoTurno.push(element.substring(0, 10));
          this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
        }
      });  
    } 

    // passando os valores atualizados
    this.chartSegundo!.data.datasets[0].data = this.quantidadesOSSegundoTurno;
    this.chartSegundo!.data.labels = this.dataLabelSegundoTurno;

    this.chartSegundo?.update();
  }

  clearDateSegundoTurno(event: any) {
    event.stopPropagation();
    this.startDateGraficoSegundoTurno = null;
    this.endDateGraficoSegundoTurno = null;
    this.voltarSeg = false;

    this.dataLabelSegundoTurno = [];
    this.quantidadesOSSegundoTurno = [];
    this.chartSegundo!.data.datasets[0].data = [];
    this.chartSegundo!.data.labels = [];
    this.chartSegundo!.data.datasets[0].label = `Segundo Turno`;
    var trintaDias:  any[] = [];

    // !se maquina vazia
    if (this.maquinaSelecionadaSegundoTurno === "") {
      this.primeiroTrintaDiasSegundoTurno = this.primeiroTrintaDiasSegundoTurno.sort((a, b) => a.localeCompare(b));
      
      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasSegundoTurno.forEach((element: any) => {
        this.dataLabelSegundoTurno.push(element.substring(0, 10));
        this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
      });

    } else {
      this.datasEosSegundo = this.datasEosSegundo.sort((a, b) => b.localeCompare(a));
      
      // pego os ultimos 7 dias
      this.datasEosSegundo.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      trintaDias = trintaDias.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      trintaDias.forEach((element: any) => {
        this.dataLabelSegundoTurno.push(element.substring(0, 10));
        this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
      });
    }

    // passando os valores atualizados
    this.chartSegundo!.data.datasets[0].data = this.quantidadesOSSegundoTurno;
    this.chartSegundo!.data.labels = this.dataLabelSegundoTurno;

    this.chartSegundo?.update();
  }

  // ? TERCEIRO TURNO
  dateRangeTerceiroTurno() {    
    // resetando os valores do grafico
    this.dataLabelTerceiroTurno = [];
    this.quantidadesOSTerceiroTurno = [];
    this.chartTerceiro!.data.datasets[0].data = [];
    this.chartTerceiro!.data.labels = [];

    var startDateFormatada: any;
    var endDateFormatada: any;
    
    startDateFormatada = this.datepipe.transform(this.startDateGraficoTerceiroTurno, 'yyyy-MM-dd');
    endDateFormatada = this.datepipe.transform(this.endDateGraficoTerceiroTurno, 'yyyy-MM-dd');      

    this.quantidadeOsPorDiaTerceiroTurno = this.quantidadeOsPorDiaTerceiroTurno.sort((a, b) => a.localeCompare(b));
  
    // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
    this.quantidadeOsPorDiaTerceiroTurno.forEach(element => {
      if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
        this.dataLabelTerceiroTurno.push(element.substring(0, 10));
        this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
      }
    });

    // passando os valores atualizados
    this.chartTerceiro!.data.datasets[0].data = this.quantidadesOSTerceiroTurno;
    this.chartTerceiro!.data.labels = this.dataLabelTerceiroTurno;

    this.chartTerceiro?.update();
  }

  clearDateTerceiroTurno(event: any) {
    event.stopPropagation();
    this.startDateGraficoTerceiroTurno = null;
    this.endDateGraficoTerceiroTurno = null;
    this.voltarTer = false;

    this.dataLabelTerceiroTurno = [];
    this.quantidadesOSTerceiroTurno = [];
    this.chartTerceiro!.data.datasets[0].data = [];
    this.chartTerceiro!.data.labels = [];
    this.chartTerceiro!.data.datasets[0].label = `Terceiro Turno`;

    this.primeiroTrintaDiasTerceiroTurno = this.primeiroTrintaDiasTerceiroTurno.sort((a, b) => a.localeCompare(b));

    // populando os dados com os ultimos 7 dias
    this.primeiroTrintaDiasTerceiroTurno.forEach((element: any) => {
      this.dataLabelTerceiroTurno.push(element.substring(0, 10));
      this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
    });

    // passando os valores atualizados
    this.chartTerceiro!.data.datasets[0].data = this.quantidadesOSTerceiroTurno;
    this.chartTerceiro!.data.labels = this.dataLabelTerceiroTurno;

    this.chartTerceiro?.update();
  }

  dadosPorHoraPrimeiroTurnoFunction(element: any, data: any) {
    if (element.DataIni.substring(0, 10) === data) {
      if (element.DataIni.substring(11, 19) >= "07:00:00" && element.DataIni.substring(11, 19) < "08:00:00") {
        this.dadosOSPrimeiroTurno[0] += 1;            
      }
      if (element.DataIni.substring(11, 19) >= "08:00:00" && element.DataIni.substring(11, 19) < "09:00:00") {
        this.dadosOSPrimeiroTurno[1] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "09:00:00" && element.DataIni.substring(11, 19) < "10:00:00") {
        this.dadosOSPrimeiroTurno[2] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "10:00:00" && element.DataIni.substring(11, 19) < "11:00:00") {
        this.dadosOSPrimeiroTurno[3] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "11:00:00" && element.DataIni.substring(11, 19) < "12:00:00") {
        this.dadosOSPrimeiroTurno[4] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "12:00:00" && element.DataIni.substring(11, 19) < "13:00:00") {
        this.dadosOSPrimeiroTurno[5] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "13:00:00" && element.DataIni.substring(11, 19) < "14:00:00") {
        this.dadosOSPrimeiroTurno[6] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "14:00:00" && element.DataIni.substring(11, 19) < "15:00:00") {
        this.dadosOSPrimeiroTurno[7] += 1;
      }
    }
  }

  dadosPorHoraSegundoTurnoFunction(element: any, data: any) {
    if (element.DataIni.substring(0, 10) === data) {
      if (element.DataIni.substring(11, 19) >= "15:00:00" && element.DataIni.substring(11, 19) < "16:00:00") {
        this.dadosOSSegundoTurno[0] += 1;            
      }
      if (element.DataIni.substring(11, 19) >= "16:00:00" && element.DataIni.substring(11, 19) < "17:00:00") {
        this.dadosOSSegundoTurno[1] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "17:00:00" && element.DataIni.substring(11, 19) < "18:00:00") {
        this.dadosOSSegundoTurno[2] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "18:00:00" && element.DataIni.substring(11, 19) < "19:00:00") {
        this.dadosOSSegundoTurno[3] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "19:00:00" && element.DataIni.substring(11, 19) < "20:00:00") {
        this.dadosOSSegundoTurno[4] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "20:00:00" && element.DataIni.substring(11, 19) < "21:00:00") {
        this.dadosOSSegundoTurno[5] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "21:00:00" && element.DataIni.substring(11, 19) < "22:00:00") {
        this.dadosOSSegundoTurno[6] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "22:00:00" && element.DataIni.substring(11, 19) < "23:00:00") {
        this.dadosOSSegundoTurno[7] += 1;
      }
    }
  }
  
  dadosPorHoraTerceiroTurnoFunction(element: any, data: any) {
    if (element.DataIni.substring(0, 10) === data) {      
      if (element.DataIni.substring(11, 19) >= "23:00:00" || element.DataIni.substring(11, 19) < "00:00:00") {
        this.dadosOSTerceiroTurno[0] += 1;            
      }
      if (element.DataIni.substring(11, 19) >= "00:00:00" && element.DataIni.substring(11, 19) < "01:00:00") {
        this.dadosOSTerceiroTurno[1] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "01:00:00" && element.DataIni.substring(11, 19) < "02:00:00") {
        this.dadosOSTerceiroTurno[2] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "02:00:00" && element.DataIni.substring(11, 19) < "03:00:00") {
        this.dadosOSTerceiroTurno[3] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "03:00:00" && element.DataIni.substring(11, 19) < "04:00:00") {
        this.dadosOSTerceiroTurno[4] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "04:00:00" && element.DataIni.substring(11, 19) < "05:00:00") {
        this.dadosOSTerceiroTurno[5] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "05:00:00" && element.DataIni.substring(11, 19) < "06:00:00") {
        this.dadosOSTerceiroTurno[6] += 1;
      }
      if (element.DataIni.substring(11, 19) >= "06:00:00" && element.DataIni.substring(11, 19) < "07:00:00") {
        this.dadosOSTerceiroTurno[7] += 1;
      }
    }
  }

  voltarPrimFunction(event: any) {
    if (this.startDateGraficoPrimeiroTurno === null) {
      this.clearDatePrimeiroTurno(event);

    } else if(this.startDateGraficoPrimeiroTurno !== null) {
      this.voltarPrim = false;
      this.chartPrimeiro!.data.datasets[0].label = `Primeiro Turno`;
      this.dateRangePrimeiroTurno();
    
    } else if(this.maquinaSelecionadaPrimeiroTurno !== "") {
      this.onItemSelectPrimTurno();
    }
  }
  
  voltarSegFunction(event: any) {
    if (this.startDateGraficoSegundoTurno === null) {
      this.clearDateSegundoTurno(event);

    } else if(this.startDateGraficoSegundoTurno !== null) {
      this.voltarSeg = false;
      this.chartSegundo!.data.datasets[0].label = `Segundo Turno`;
      this.dateRangeSegundoTurno();
    
    } else if(this.maquinaSelecionadaSegundoTurno !== "") {
      this.onItemSelectSegTurno();
    }
  }

  voltarTercFunction(event: any) {
    if (this.startDateGraficoTerceiroTurno === null) {
      this.clearDateTerceiroTurno(event);
    } else {
      this.voltarTer = false;
      this.chartTerceiro!.data.datasets[0].label = `Terceiro Turno`;
      this.dateRangeTerceiroTurno();
    }
  }

  // * FUNÇÕES PARA SELECT DE FUNCIONÁRIO
  // *PRIMEIRO TURNO
  onItemSelectPrimTurno() {
    var arrayDatasFunc: any[] = [];
    var trintaDias:  any[] = [];
    var startDateFormatada: any;
    var endDateFormatada: any;

    this.dataLabelPrimeiroTurno = [];
    this.quantidadesOSPrimeiroTurno = [];
    this.chartPrimeiro!.data.datasets[0].data = [];
    this.chartPrimeiro!.data.datasets[0].label = "";
    this.chartPrimeiro!.data.labels = [];
    
    this.geralPrimeiroTurno.forEach(geral => {
      if (geral.maquina === this.maquinaSelecionadaPrimeiroTurno) {
        arrayDatasFunc.push(geral.data);
      }
    });
    
    // mando fazer o calculo de quantide de os's por dia
    this.datasEosPrimeiro = this.getQuantidadeOSFunction(arrayDatasFunc);

    //  ! caso nenhuma data selecionada
    if (this.startDateGraficoPrimeiroTurno === null) {    
      // pego os ultimos 7 dias
      this.datasEosPrimeiro.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(trintaDias, this.dataLabelPrimeiroTurno, this.quantidadesOSPrimeiroTurno);

    //  ! caso tenha data selecionada
    } else {
      startDateFormatada = this.datepipe.transform(this.startDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoPrimeiroTurno, 'yyyy-MM-dd');      

      this.datasEosPrimeiro = this.datasEosPrimeiro.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosPrimeiro.forEach(element => {
        
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
          this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });      
    }

    this.chartPrimeiro!.data.datasets[0].data = this.quantidadesOSPrimeiroTurno;
    this.chartPrimeiro!.data.datasets[0].label = `Primeiro Turno - ${this.maquinaSelecionadaPrimeiroTurno}`;
    this.chartPrimeiro!.data.labels = this.dataLabelPrimeiroTurno;

    this.chartPrimeiro?.update();
  }

  clearSelectPrimTurno(event: any) {
    event.stopPropagation();
    this.maquinaSelecionadaPrimeiroTurno = "";

    this.dataLabelPrimeiroTurno = [];
    this.quantidadesOSPrimeiroTurno = [];
    this.chartPrimeiro!.data.datasets[0].data = [];
    this.chartPrimeiro!.data.labels = [];

    // !se a data nao tiver sido preenchida
    if (this.startDateGraficoPrimeiroTurno === null) {
      this.primeiroTrintaDiasPrimeiroTurno = this.primeiroTrintaDiasPrimeiroTurno.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasPrimeiroTurno.forEach((element: any) => {
        this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
        this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
      });

    } else {
      var startDateFormatada: any;
      var endDateFormatada: any;
    
      startDateFormatada = this.datepipe.transform(this.startDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoPrimeiroTurno, 'yyyy-MM-dd');      

      this.quantidadeOsPorDiaPrimeiroTurno = this.quantidadeOsPorDiaPrimeiroTurno.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.quantidadeOsPorDiaPrimeiroTurno.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
          this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });
    }

    // passando os valores atualizados
    this.chartPrimeiro!.data.datasets[0].data = this.quantidadesOSPrimeiroTurno;
    this.chartPrimeiro!.data.labels = this.dataLabelPrimeiroTurno;
    this.chartPrimeiro!.data.datasets[0].label = `Primeiro Turno`;

    this.chartPrimeiro?.update();
  }

  onItemSelectSegTurno() {
    var arrayDatasFunc: any[] = [];
    var trintaDias:  any[] = [];
    var startDateFormatada: any;
    var endDateFormatada: any;

    this.dataLabelSegundoTurno = [];
    this.quantidadesOSSegundoTurno = [];
    this.chartSegundo!.data.datasets[0].data = [];
    this.chartSegundo!.data.datasets[0].label = "";
    this.chartSegundo!.data.labels = [];
    
    this.geralSegundoTurno.forEach(geral => {
      if (geral.maquina === this.maquinaSelecionadaSegundoTurno) {
        arrayDatasFunc.push(geral.data);
      }
    });
    
    // mando fazer o calculo de quantide de os's por dia
    this.datasEosSegundo = this.getQuantidadeOSFunction(arrayDatasFunc);

    //  ! caso nenhuma data selecionada
    if (this.startDateGraficoSegundoTurno === null) {    
      // pego os ultimos 7 dias
      this.datasEosSegundo.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(trintaDias, this.dataLabelSegundoTurno, this.quantidadesOSSegundoTurno);

    //  ! caso tenha data selecionada
    } else {
      startDateFormatada = this.datepipe.transform(this.startDateGraficoSegundoTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoSegundoTurno, 'yyyy-MM-dd');      

      this.datasEosSegundo = this.datasEosSegundo.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosSegundo.forEach(element => {
        
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelSegundoTurno.push(element.substring(0, 10));
          this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
        }
      });      
    }

    this.chartSegundo!.data.datasets[0].data = this.quantidadesOSSegundoTurno;
    this.chartSegundo!.data.datasets[0].label = `Segundo Turno - ${this.maquinaSelecionadaSegundoTurno}`;
    this.chartSegundo!.data.labels = this.dataLabelSegundoTurno;

    this.chartSegundo?.update();
  }

  clearSelectSegTurno(event: any) {
    event.stopPropagation();
    this.maquinaSelecionadaSegundoTurno = "";

    this.dataLabelSegundoTurno = [];
    this.quantidadesOSSegundoTurno = [];
    this.chartSegundo!.data.datasets[0].data = [];
    this.chartSegundo!.data.labels = [];

    // !se a data nao tiver sido preenchida
    if (this.startDateGraficoSegundoTurno === null) {
      this.primeiroTrintaDiasSegundoTurno = this.primeiroTrintaDiasSegundoTurno.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasSegundoTurno.forEach((element: any) => {
        this.dataLabelSegundoTurno.push(element.substring(0, 10));
        this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
      });

    } else {
      var startDateFormatada: any;
      var endDateFormatada: any;
    
      startDateFormatada = this.datepipe.transform(this.startDateGraficoSegundoTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoSegundoTurno, 'yyyy-MM-dd');      

      this.quantidadeOsPorDiaSegundoTurno = this.quantidadeOsPorDiaSegundoTurno.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.quantidadeOsPorDiaSegundoTurno.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelSegundoTurno.push(element.substring(0, 10));
          this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
        }
      });
    }

    // passando os valores atualizados
    this.chartSegundo!.data.datasets[0].data = this.quantidadesOSSegundoTurno;
    this.chartSegundo!.data.labels = this.dataLabelSegundoTurno;
    this.chartSegundo!.data.datasets[0].label = `Segundo Turno`;

    this.chartSegundo?.update();
  }
}
