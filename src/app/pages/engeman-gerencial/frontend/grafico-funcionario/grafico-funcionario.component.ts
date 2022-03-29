import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EngemanGerencialService } from '../../backend/services/engeman-gerencial.service';

@Component({
  selector: 'app-grafico-funcionario',
  templateUrl: './grafico-funcionario.component.html',
  styleUrls: ['./grafico-funcionario.component.css']
})
export class GraficoFuncionarioComponent implements OnInit, AfterViewInit {
  @ViewChild('chartPrimeiroTurno') chartPrimeiroTurno!: ElementRef;
  @ViewChild('chartSegundoTurno') chartSegundoTurno!: ElementRef;
  @ViewChild('chartTerceiroTurno') chartTerceiroTurno!: ElementRef;
  chartPrimeiro: Chart | undefined;
  chartSegundo: Chart | undefined;
  chartTerceiro: Chart | undefined;
  datas: any[] = [];

  datasPrimeiroTurno: any[] = [];
  quantidadeOsPorDiaPrimeiroTurno: any[] = [];
  primeiroTrintaDiasPrimeiroTurno: any[] = [];
  dataLabelPrimeiroTurno: String[] = [];
  quantidadesOSPrimeiroTurno: number[] = [];
  funcionariosPrimeiroTurno: string[] = [];
  geralPrimeiroTurno: any[] = [];
  funcionarioPrimeiroTurnoSelecionado: String = '';
  datasEosPrimeiro: any[] = [];
  maquinasPrimeiroTurno: string[] = [];
  maquinaSelecionadaPrimeiroTurno: string = "";
  datasEosPrimeiroMaq: any[] = [];

  datasSegundoTurno: any[] = [];
  quantidadeOsPorDiaSegundoTurno: any[] = [];
  primeiroTrintaDiasSegundoTurno: any[] = [];
  dataLabelSegundoTurno: String[] = [];
  quantidadesOSSegundoTurno: number[] = [];
  funcionariosSegundoTurno: string[] = [];
  geralSegundoTurno: any[] = [];
  funcionarioSegundoTurnoSelecionado: String = '';
  datasEosSegundo: any[] = [];
  maquinasSegundoTurno: string[] = [];
  maquinaSelecionadaSegundoTurno: string = "";
  datasEosSegundoMaq: any[] = [];

  datasTerceiroTurno: any[] = [];
  quantidadeOsPorDiaTerceiroTurno: any[] = [];
  primeiroTrintaDiasTerceiroTurno: any[] = [];
  dataLabelTerceiroTurno: String[] = [];
  quantidadesOSTerceiroTurno: number[] = [];
  funcionariosTerceiroTurno: string[] = [];
  geralTerceiroTurno: any[] = [];
  funcionarioTerceiroTurnoSelecionado: String = '';
  datasEosTerceiro: any[] = [];
  maquinasTerceiroTurno: string[] = [];
  maquinaSelecionadaTerceiroTurno: string = "";
  datasEosTerceiroMaq: any[] = [];
  
  loadData: boolean = false;

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

        if (element.DataIni.substring(11, 19) >= "07:00:00" && element.DataIni.substring(11, 19) < "15:00:00") {
          this.datasPrimeiroTurno.push(element.DataIni.substring(0, 10));

          this.geralPrimeiroTurno.push({func: element.NomeFunc, maquina: element.APLICDescr, data: element.DataIni.substring(0, 10)});
          // para popular o select de funcionarios
          if (!this.funcionariosPrimeiroTurno.includes(element.NomeFunc)) {
            this.funcionariosPrimeiroTurno.push(element.NomeFunc);
          }
          // para popular o select de maquinas
          if (!this.maquinasPrimeiroTurno.includes(element.APLICDescr)) {
            this.maquinasPrimeiroTurno.push(element.APLICDescr);
          }
          
        } else if(element.DataIni.substring(11, 19) >= "15:00:00" && element.DataIni.substring(11, 19) < "23:00:00") {
          this.datasSegundoTurno.push(element.DataIni.substring(0, 10));

          this.geralSegundoTurno.push({func: element.NomeFunc, maquina: element.APLICDescr, data: element.DataIni.substring(0, 10)});
          // para popular o select de funcionarios
          if (!this.funcionariosSegundoTurno.includes(element.NomeFunc)) {
            this.funcionariosSegundoTurno.push(element.NomeFunc);
          }
          // para popular o select de maquinas
          if (!this.maquinasSegundoTurno.includes(element.APLICDescr)) {
            this.maquinasSegundoTurno.push(element.APLICDescr);
          }
          
        } else if(element.DataIni.substring(11, 19) >= "23:00:00" || element.DataIni.substring(11, 19) < "07:00:00") {
          this.datasTerceiroTurno.push(element.DataIni.substring(0, 10));  
          
          this.geralTerceiroTurno.push({func: element.NomeFunc, maquina: element.APLICDescr, data: element.DataIni.substring(0, 10)});
          // para popular o select de funcionarios
          if (!this.funcionariosTerceiroTurno.includes(element.NomeFunc)) {
            this.funcionariosTerceiroTurno.push(element.NomeFunc);
          }
          // para popular o select de maquinas
          if (!this.maquinasTerceiroTurno.includes(element.APLICDescr)) {
            this.maquinasTerceiroTurno.push(element.APLICDescr);
          }
        }
        
      });
      
      // fazendo o calculo geral de os por dia
      this.quantidadeOsPorDiaPrimeiroTurno = this.getQuantidadeOSFunction(this.datasPrimeiroTurno);    
      this.quantidadeOsPorDiaSegundoTurno = this.getQuantidadeOSFunction(this.datasSegundoTurno);    
      this.quantidadeOsPorDiaTerceiroTurno = this.getQuantidadeOSFunction(this.datasTerceiroTurno);

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
  dateRangePrimeiroTurno(type: any, event: any) {
    // resetando os valores do grafico
    this.dataLabelPrimeiroTurno = [];
    this.quantidadesOSPrimeiroTurno = [];
    this.chartPrimeiro!.data.datasets[0].data = [];
    this.chartPrimeiro!.data.labels = [];

    var startDateFormatada: any;
    var endDateFormatada: any;
    
    if (event.value) {
      startDateFormatada = this.datepipe.transform(this.startDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoPrimeiroTurno, 'yyyy-MM-dd');      
    }

    // !se funcionario vazio e maquina vazia
    if (this.funcionarioPrimeiroTurnoSelecionado === "" && this.maquinaSelecionadaPrimeiroTurno === "") {
      this.quantidadeOsPorDiaPrimeiroTurno = this.quantidadeOsPorDiaPrimeiroTurno.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.quantidadeOsPorDiaPrimeiroTurno.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
          this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });

    // !se funcionario preenchido e maquina vazia
    } else if(this.funcionarioPrimeiroTurnoSelecionado !== "" && this.maquinaSelecionadaPrimeiroTurno === "") {
      this.datasEosPrimeiro = this.datasEosPrimeiro.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosPrimeiro.forEach(element => {
        
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
          this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });  
    
    // !se funcionario vazio e maquina preenchida
    } else if(this.funcionarioPrimeiroTurnoSelecionado === "" && this.maquinaSelecionadaPrimeiroTurno !== "") {
      this.datasEosPrimeiroMaq = this.datasEosPrimeiroMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosPrimeiroMaq.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
          this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      }); 
    
    // !se funcionario preenchido e maquina preenchida
    } else if(this.funcionarioPrimeiroTurnoSelecionado !== "" && this.maquinaSelecionadaPrimeiroTurno !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosPrimeiroFuncMaq: any[] = [];
      
      this.geralPrimeiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaPrimeiroTurno && geral.func === this.funcionarioPrimeiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosPrimeiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      datasEosPrimeiroFuncMaq = datasEosPrimeiroFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosPrimeiroFuncMaq.forEach(element => {
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

    this.dataLabelPrimeiroTurno = [];
    this.quantidadesOSPrimeiroTurno = [];
    this.chartPrimeiro!.data.datasets[0].data = [];
    this.chartPrimeiro!.data.labels = [];
    var graficoDias:  any[] = [];

    // !se funcionario vazio e maquina vazia
    if (this.funcionarioPrimeiroTurnoSelecionado === "" && this.maquinaSelecionadaPrimeiroTurno === "") {
      this.primeiroTrintaDiasPrimeiroTurno = this.primeiroTrintaDiasPrimeiroTurno.sort((a, b) => a.localeCompare(b));
      
      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasPrimeiroTurno.forEach((element: any) => {
        this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
        this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se funcionario preenchido e maquina vazia
    } else if(this.funcionarioPrimeiroTurnoSelecionado !== "" && this.maquinaSelecionadaPrimeiroTurno === "") {
      
      this.datasEosPrimeiro = this.datasEosPrimeiro.sort((a, b) => b.localeCompare(a));
      
      // pego os ultimos 7 dias
      this.datasEosPrimeiro.slice(0, 7).map((item: any, i: any) => {
        graficoDias.push(item);
      });
      
      graficoDias = graficoDias.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      graficoDias.forEach((element: any) => {
        this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
        this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se funcionario vazio e maquina preenchida
    } else if(this.funcionarioPrimeiroTurnoSelecionado === "" && this.maquinaSelecionadaPrimeiroTurno !== "") {
      
      this.datasEosPrimeiroMaq = this.datasEosPrimeiroMaq.sort((a, b) => b.localeCompare(a));
      
      // pego os ultimos 7 dias
      this.datasEosPrimeiroMaq.slice(0, 7).map((item: any, i: any) => {
        graficoDias.push(item);
      });
      
      graficoDias = graficoDias.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      graficoDias.forEach((element: any) => {
        this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
        this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se funcionario preenchido e maquina preenchida
    } else if(this.funcionarioPrimeiroTurnoSelecionado !== "" && this.maquinaSelecionadaPrimeiroTurno !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosPrimeiroFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralPrimeiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaPrimeiroTurno && geral.func === this.funcionarioPrimeiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosPrimeiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);

      // pego os ultimos 7 dias
      datasEosPrimeiroFuncMaq.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      diasGrafico = diasGrafico.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      // populando os dados com os ultimos 7 dias
      diasGrafico.forEach((element: any) => {
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
  dateRangeSegundoTurno(type: any, event: any) {    
    // resetando os valores do grafico
    this.dataLabelSegundoTurno = [];
    this.quantidadesOSSegundoTurno = [];
    this.chartSegundo!.data.datasets[0].data = [];
    this.chartSegundo!.data.labels = [];

    var startDateFormatada: any;
    var endDateFormatada: any;
    
    if (event.value) {
      startDateFormatada = this.datepipe.transform(this.startDateGraficoSegundoTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoSegundoTurno, 'yyyy-MM-dd');      
    }

    // !se funcionario vazio e maquina vazia
    if (this.funcionarioSegundoTurnoSelecionado === "" && this.maquinaSelecionadaSegundoTurno === "") {
      this.quantidadeOsPorDiaSegundoTurno = this.quantidadeOsPorDiaSegundoTurno.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.quantidadeOsPorDiaSegundoTurno.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelSegundoTurno.push(element.substring(0, 10));
          this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
        }
      });

    // !se funcionario preenchido e maquina vazia
    } else if(this.funcionarioSegundoTurnoSelecionado !== "" && this.maquinaSelecionadaSegundoTurno === "") {
      this.datasEosSegundo = this.datasEosSegundo.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosSegundo.forEach(element => {
        
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelSegundoTurno.push(element.substring(0, 10));
          this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
        }
      });  
    
    // !se funcionario vazio e maquina preenchida
    } else if(this.funcionarioSegundoTurnoSelecionado === "" && this.maquinaSelecionadaSegundoTurno !== "") {
      this.datasEosSegundoMaq = this.datasEosSegundoMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosSegundoMaq.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelSegundoTurno.push(element.substring(0, 10));
          this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
        }
      }); 
    
    // !se funcionario preenchido e maquina preenchida
    } else if(this.funcionarioSegundoTurnoSelecionado !== "" && this.maquinaSelecionadaSegundoTurno !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosSegundoFuncMaq: any[] = [];
      
      this.geralSegundoTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaSegundoTurno && geral.func === this.funcionarioSegundoTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosSegundoFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      datasEosSegundoFuncMaq = datasEosSegundoFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosSegundoFuncMaq.forEach(element => {
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

    this.dataLabelSegundoTurno = [];
    this.quantidadesOSSegundoTurno = [];
    this.chartSegundo!.data.datasets[0].data = [];
    this.chartSegundo!.data.labels = [];
    var graficoDias:  any[] = [];

    // !se funcionario vazio e maquina vazia
    if (this.funcionarioSegundoTurnoSelecionado === "" && this.maquinaSelecionadaSegundoTurno === "") {
      this.primeiroTrintaDiasSegundoTurno = this.primeiroTrintaDiasSegundoTurno.sort((a, b) => a.localeCompare(b));
      
      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasSegundoTurno.forEach((element: any) => {
        this.dataLabelSegundoTurno.push(element.substring(0, 10));
        this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se funcionario preenchido e maquina vazia
    } else if(this.funcionarioSegundoTurnoSelecionado !== "" && this.maquinaSelecionadaSegundoTurno === "") {
      
      this.datasEosSegundo = this.datasEosSegundo.sort((a, b) => b.localeCompare(a));
      
      // pego os ultimos 7 dias
      this.datasEosSegundo.slice(0, 7).map((item: any, i: any) => {
        graficoDias.push(item);
      });
      
      graficoDias = graficoDias.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      graficoDias.forEach((element: any) => {
        this.dataLabelSegundoTurno.push(element.substring(0, 10));
        this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se funcionario vazio e maquina preenchida
    } else if(this.funcionarioSegundoTurnoSelecionado === "" && this.maquinaSelecionadaSegundoTurno !== "") {      
      this.datasEosSegundoMaq = this.datasEosSegundoMaq.sort((a, b) => b.localeCompare(a));
      
      // pego os ultimos 7 dias
      this.datasEosSegundoMaq.slice(0, 7).map((item: any, i: any) => {
        graficoDias.push(item);
      });
      
      graficoDias = graficoDias.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      graficoDias.forEach((element: any) => {
        this.dataLabelSegundoTurno.push(element.substring(0, 10));
        this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se funcionario preenchido e maquina preenchida
    } else if(this.funcionarioSegundoTurnoSelecionado !== "" && this.maquinaSelecionadaSegundoTurno !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosSegundoFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralSegundoTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaSegundoTurno && geral.func === this.funcionarioSegundoTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosSegundoFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);

      // pego os ultimos 7 dias
      datasEosSegundoFuncMaq.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      diasGrafico = diasGrafico.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      // populando os dados com os ultimos 7 dias
      diasGrafico.forEach((element: any) => {
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
  dateRangeTerceiroTurno(type: any, event: any) {    
    // resetando os valores do grafico
    this.dataLabelTerceiroTurno = [];
    this.quantidadesOSTerceiroTurno = [];
    this.chartTerceiro!.data.datasets[0].data = [];
    this.chartTerceiro!.data.labels = [];

    var startDateFormatada: any;
    var endDateFormatada: any;
    
    if (event.value) {
      startDateFormatada = this.datepipe.transform(this.startDateGraficoTerceiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoTerceiroTurno, 'yyyy-MM-dd');      
    }

    // !se funcionario vazio e maquina vazia
    if (this.funcionarioTerceiroTurnoSelecionado === "" && this.maquinaSelecionadaTerceiroTurno === "") {
      this.quantidadeOsPorDiaTerceiroTurno = this.quantidadeOsPorDiaTerceiroTurno.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.quantidadeOsPorDiaTerceiroTurno.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelTerceiroTurno.push(element.substring(0, 10));
          this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });

    // !se funcionario preenchido e maquina vazia
    } else if(this.funcionarioTerceiroTurnoSelecionado !== "" && this.maquinaSelecionadaTerceiroTurno === "") {
      this.datasEosTerceiro = this.datasEosTerceiro.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosTerceiro.forEach(element => {
        
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelTerceiroTurno.push(element.substring(0, 10));
          this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });  
    
    // !se funcionario vazio e maquina preenchida
    } else if(this.funcionarioTerceiroTurnoSelecionado === "" && this.maquinaSelecionadaTerceiroTurno !== "") {
      this.datasEosTerceiroMaq = this.datasEosTerceiroMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosTerceiroMaq.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelTerceiroTurno.push(element.substring(0, 10));
          this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      }); 
    
    // !se funcionario preenchido e maquina preenchida
    } else if(this.funcionarioTerceiroTurnoSelecionado !== "" && this.maquinaSelecionadaTerceiroTurno !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosTerceiroFuncMaq: any[] = [];
      
      this.geralTerceiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaTerceiroTurno && geral.func === this.funcionarioTerceiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosTerceiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      datasEosTerceiroFuncMaq = datasEosTerceiroFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosTerceiroFuncMaq.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelTerceiroTurno.push(element.substring(0, 10));
          this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });
    }

    // passando os valores atualizados
    this.chartTerceiro!.data.datasets[0].data = this.quantidadesOSTerceiroTurno;
    this.chartTerceiro!.data.labels = this.dataLabelTerceiroTurno;

    this.chartTerceiro?.update();
  }

  clearDateTerceiroTurno(event: any) {
    event.stopPropagation();
    this.startDateGraficoTerceiroTurno = null;
    this.endDateGraficoTerceiroTurno = null;

    this.dataLabelTerceiroTurno = [];
    this.quantidadesOSTerceiroTurno = [];
    this.chartTerceiro!.data.datasets[0].data = [];
    this.chartTerceiro!.data.labels = [];
    var graficoDias:  any[] = [];

    // !se funcionario vazio e maquina vazia
    if (this.funcionarioTerceiroTurnoSelecionado === "" && this.maquinaSelecionadaTerceiroTurno === "") {
      this.primeiroTrintaDiasTerceiroTurno = this.primeiroTrintaDiasTerceiroTurno.sort((a, b) => a.localeCompare(b));
      
      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasTerceiroTurno.forEach((element: any) => {
        this.dataLabelTerceiroTurno.push(element.substring(0, 10));
        this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se funcionario preenchido e maquina vazia
    } else if(this.funcionarioTerceiroTurnoSelecionado !== "" && this.maquinaSelecionadaTerceiroTurno === "") {
      
      this.datasEosTerceiro = this.datasEosTerceiro.sort((a, b) => b.localeCompare(a));
      
      // pego os ultimos 7 dias
      this.datasEosTerceiro.slice(0, 7).map((item: any, i: any) => {
        graficoDias.push(item);
      });
      
      graficoDias = graficoDias.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      graficoDias.forEach((element: any) => {
        this.dataLabelTerceiroTurno.push(element.substring(0, 10));
        this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se funcionario vazio e maquina preenchida
    } else if(this.funcionarioTerceiroTurnoSelecionado === "" && this.maquinaSelecionadaTerceiroTurno !== "") {      
      this.datasEosTerceiroMaq = this.datasEosTerceiroMaq.sort((a, b) => b.localeCompare(a));
      
      // pego os ultimos 7 dias
      this.datasEosTerceiroMaq.slice(0, 7).map((item: any, i: any) => {
        graficoDias.push(item);
      });
      
      graficoDias = graficoDias.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      graficoDias.forEach((element: any) => {
        this.dataLabelTerceiroTurno.push(element.substring(0, 10));
        this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se funcionario preenchido e maquina preenchida
    } else if(this.funcionarioTerceiroTurnoSelecionado !== "" && this.maquinaSelecionadaTerceiroTurno !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosTerceiroFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralTerceiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaTerceiroTurno && geral.func === this.funcionarioTerceiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosTerceiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);

      // pego os ultimos 7 dias
      datasEosTerceiroFuncMaq.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      diasGrafico = diasGrafico.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      // populando os dados com os ultimos 7 dias
      diasGrafico.forEach((element: any) => {
        this.dataLabelTerceiroTurno.push(element.substring(0, 10));
        this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
      });
    }

    // passando os valores atualizados
    this.chartTerceiro!.data.datasets[0].data = this.quantidadesOSTerceiroTurno;
    this.chartTerceiro!.data.labels = this.dataLabelTerceiroTurno;

    this.chartTerceiro?.update();
  }

  // * FUNÇÕES PARA SELECT DE FUNCIONÁRIO
  // *PRIMEIRO TURNO
  onFuncSelectPrimTurno(valor: any) {    
    // resetando os valores do grafico
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
      if (geral.func === valor.option.value) {
        arrayDatasFunc.push(geral.data);
      }
    });

    // mando fazer o calculo de quantide de os's por dia
    this.datasEosPrimeiro = this.getQuantidadeOSFunction(arrayDatasFunc);
    
    //  ! caso data nao selecionada e maquina vazia
    if (this.startDateGraficoPrimeiroTurno === null && this.maquinaSelecionadaPrimeiroTurno === "") {                
      // pego os ultimos 7 dias
      this.datasEosPrimeiro.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(trintaDias, this.dataLabelPrimeiroTurno, this.quantidadesOSPrimeiroTurno);

    //  ! caso tenha data selecionada e maquina vazia
    } else if(this.startDateGraficoPrimeiroTurno !== null && this.maquinaSelecionadaPrimeiroTurno === "") {            
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
    
    //  ! caso não tenha data selecionada e maquina foi preenchida
    } else if(this.startDateGraficoPrimeiroTurno === null && this.maquinaSelecionadaPrimeiroTurno !== "") {      
      var arrayDataFuncMaq: any[] = [];
      var datasEosPrimeiroFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralPrimeiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaPrimeiroTurno && geral.func === this.funcionarioPrimeiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosPrimeiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      // pego os ultimos 7 dias
      datasEosPrimeiroFuncMaq.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(diasGrafico, this.dataLabelPrimeiroTurno, this.quantidadesOSPrimeiroTurno);


    // ! caso tenha data selecionada e maquina preenchida
    } else if (this.startDateGraficoPrimeiroTurno !== null && this.maquinaSelecionadaPrimeiroTurno !== "") {      
      var arrayDataFuncMaq: any[] = [];
      var datasEosPrimeiroFuncMaq: any[] = [];
      
      this.geralPrimeiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaPrimeiroTurno && geral.func === this.funcionarioPrimeiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosPrimeiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      
      datasEosPrimeiroFuncMaq = datasEosPrimeiroFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosPrimeiroFuncMaq.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
          this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      }); 
      
    }
        
    this.chartPrimeiro!.data.datasets[0].data = this.quantidadesOSPrimeiroTurno;
    this.chartPrimeiro!.data.datasets[0].label = `Primeiro Turno - ${valor.option.value}`;
    this.chartPrimeiro!.data.labels = this.dataLabelPrimeiroTurno;

    this.chartPrimeiro?.update();
  }

  clearFuncSelectPrimTurno(event: any) {
    event.stopPropagation();
    this.funcionarioPrimeiroTurnoSelecionado = "";

    this.dataLabelPrimeiroTurno = [];
    this.quantidadesOSPrimeiroTurno = [];
    this.chartPrimeiro!.data.datasets[0].data = [];
    this.chartPrimeiro!.data.labels = [];

    // !se a data nao tiver sido preenchida e maquina vazia
    if (this.startDateGraficoPrimeiroTurno === null && this.maquinaSelecionadaPrimeiroTurno === "") {
      this.primeiroTrintaDiasPrimeiroTurno = this.primeiroTrintaDiasPrimeiroTurno.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasPrimeiroTurno.forEach((element: any) => {
        this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
        this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se data vazia e maquina preenchida
    } else if (this.startDateGraficoPrimeiroTurno === null && this.maquinaSelecionadaPrimeiroTurno !== "") {      
      var arrayDatasMaq: any[] = [];
      var graficosDias: any[] = [];

      this.geralPrimeiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaPrimeiroTurno) {
          arrayDatasMaq.push(geral.data);
        }
      });
      
      // mando fazer o calculo de quantide de os's por dia
      this.datasEosPrimeiroMaq = this.getQuantidadeOSFunction(arrayDatasMaq);      
  
      // pego os ultimos 7 dias
      this.datasEosPrimeiroMaq.slice(0, 7).map((item: any, i: any) => {
        graficosDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(graficosDias, this.dataLabelPrimeiroTurno, this.quantidadesOSPrimeiroTurno);
    
    // !se data preenchida e maquina vazia
    } else if (this.startDateGraficoPrimeiroTurno !== null && this.maquinaSelecionadaPrimeiroTurno === "") { 
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
    
    // !se data preenchida e maquina preenchida
    } else if (this.startDateGraficoPrimeiroTurno !== null && this.maquinaSelecionadaPrimeiroTurno !== "") {      
      var arrayDataMaq: any[] = [];
      var datasEosPrimeiroFuncMaq: any[] = [];
      
      this.geralPrimeiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaPrimeiroTurno) {
          // console.log(geral);
          arrayDataMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosPrimeiroFuncMaq = this.getQuantidadeOSFunction(arrayDataMaq);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      
      datasEosPrimeiroFuncMaq = datasEosPrimeiroFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosPrimeiroFuncMaq.forEach(element => {
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

  // *SEGUNDO TURNO
  onFuncSelectSegTurno(valor: any) {        
    // resetando os valores do grafico
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
      if (geral.func === valor.option.value) {
        arrayDatasFunc.push(geral.data);
      }
    });

    // mando fazer o calculo de quantide de os's por dia
    this.datasEosSegundo = this.getQuantidadeOSFunction(arrayDatasFunc);
    
    //  ! caso data nao selecionada e maquina vazia
    if (this.startDateGraficoSegundoTurno === null && this.maquinaSelecionadaSegundoTurno === "") {                
      // pego os ultimos 7 dias
      this.datasEosSegundo.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(trintaDias, this.dataLabelSegundoTurno, this.quantidadesOSSegundoTurno);

    //  ! caso tenha data selecionada e maquina vazia
    } else if(this.startDateGraficoSegundoTurno !== null && this.maquinaSelecionadaSegundoTurno === "") {            
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
    
    //  ! caso não tenha data selecionada e maquina foi preenchida
    } else if(this.startDateGraficoSegundoTurno === null && this.maquinaSelecionadaSegundoTurno !== "") {      
      var arrayDataFuncMaq: any[] = [];
      var datasEosSegundoFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralSegundoTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaSegundoTurno && geral.func === this.funcionarioSegundoTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosSegundoFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      // pego os ultimos 7 dias
      datasEosSegundoFuncMaq.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(diasGrafico, this.dataLabelSegundoTurno, this.quantidadesOSSegundoTurno);


    // ! caso tenha data selecionada e maquina preenchida
    } else if (this.startDateGraficoSegundoTurno !== null && this.maquinaSelecionadaSegundoTurno !== "") {      
      var arrayDataFuncMaq: any[] = [];
      var datasEosSegundoFuncMaq: any[] = [];
      
      this.geralSegundoTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaSegundoTurno && geral.func === this.funcionarioSegundoTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosSegundoFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoSegundoTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoSegundoTurno, 'yyyy-MM-dd');
      
      datasEosSegundoFuncMaq = datasEosSegundoFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosSegundoFuncMaq.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelSegundoTurno.push(element.substring(0, 10));
          this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
        }
      });  
    }
        
    this.chartSegundo!.data.datasets[0].data = this.quantidadesOSSegundoTurno;
    this.chartSegundo!.data.datasets[0].label = `Segundo Turno - ${valor.option.value}`;
    this.chartSegundo!.data.labels = this.dataLabelSegundoTurno;

    this.chartSegundo?.update();
  }

  clearFuncSelectSegTurno(event: any) {
    event.stopPropagation();
    this.funcionarioSegundoTurnoSelecionado = "";

    this.dataLabelSegundoTurno = [];
    this.quantidadesOSSegundoTurno = [];
    this.chartSegundo!.data.datasets[0].data = [];
    this.chartSegundo!.data.labels = [];

    // !se a data nao tiver sido preenchida e maquina vazia
    if (this.startDateGraficoSegundoTurno === null && this.maquinaSelecionadaSegundoTurno === "") {
      this.primeiroTrintaDiasSegundoTurno = this.primeiroTrintaDiasSegundoTurno.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasSegundoTurno.forEach((element: any) => {
        this.dataLabelSegundoTurno.push(element.substring(0, 10));
        this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se data vazia e maquina preenchida
    } else if (this.startDateGraficoSegundoTurno === null && this.maquinaSelecionadaSegundoTurno !== "") {      
      var arrayDatasMaq: any[] = [];
      var graficosDias: any[] = [];

      this.geralSegundoTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaSegundoTurno) {
          arrayDatasMaq.push(geral.data);
        }
      });
      
      // mando fazer o calculo de quantide de os's por dia
      this.datasEosSegundoMaq = this.getQuantidadeOSFunction(arrayDatasMaq);      
  
      // pego os ultimos 7 dias
      this.datasEosSegundoMaq.slice(0, 7).map((item: any, i: any) => {
        graficosDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(graficosDias, this.dataLabelSegundoTurno, this.quantidadesOSSegundoTurno);
    
    // !se data preenchida e maquina vazia
    } else if (this.startDateGraficoSegundoTurno !== null && this.maquinaSelecionadaSegundoTurno === "") { 
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
    
    // !se data preenchida e maquina preenchida
    } else if (this.startDateGraficoSegundoTurno !== null && this.maquinaSelecionadaSegundoTurno !== "") {      
      var arrayDataMaq: any[] = [];
      var datasEosSegundoFuncMaq: any[] = [];
      
      this.geralSegundoTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaSegundoTurno) {
          // console.log(geral);
          arrayDataMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosSegundoFuncMaq = this.getQuantidadeOSFunction(arrayDataMaq);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoSegundoTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoSegundoTurno, 'yyyy-MM-dd');
      
      datasEosSegundoFuncMaq = datasEosSegundoFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosSegundoFuncMaq.forEach(element => {
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

  // *TERCEIRO TURNO
  onFuncSelectTerTurno(valor: any) {        
    // resetando os valores do grafico
    var arrayDatasFunc: any[] = [];
    var trintaDias:  any[] = [];
    var startDateFormatada: any;
    var endDateFormatada: any;

    this.dataLabelTerceiroTurno = [];
    this.quantidadesOSTerceiroTurno = [];
    this.chartTerceiro!.data.datasets[0].data = [];
    this.chartTerceiro!.data.datasets[0].label = "";
    this.chartTerceiro!.data.labels = [];

    this.geralTerceiroTurno.forEach(geral => {
      if (geral.func === valor.option.value) {
        arrayDatasFunc.push(geral.data);
      }
    });

    // mando fazer o calculo de quantidade de os's por dia
    this.datasEosTerceiro = this.getQuantidadeOSFunction(arrayDatasFunc);
    
    //  ! caso data nao selecionada e maquina vazia
    if (this.startDateGraficoTerceiroTurno === null && this.maquinaSelecionadaTerceiroTurno === "") {                
      // pego os ultimos 7 dias
      this.datasEosTerceiro.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(trintaDias, this.dataLabelTerceiroTurno, this.quantidadesOSTerceiroTurno);

    //  ! caso tenha data selecionada e maquina vazia
    } else if(this.startDateGraficoTerceiroTurno !== null && this.maquinaSelecionadaTerceiroTurno === "") {            
      startDateFormatada = this.datepipe.transform(this.startDateGraficoTerceiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoTerceiroTurno, 'yyyy-MM-dd');      

      this.datasEosTerceiro = this.datasEosTerceiro.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosTerceiro.forEach(element => {
        
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelTerceiroTurno.push(element.substring(0, 10));
          this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });
    
    //  ! caso não tenha data selecionada e maquina foi preenchida
    } else if(this.startDateGraficoTerceiroTurno === null && this.maquinaSelecionadaTerceiroTurno !== "") {      
      var arrayDataFuncMaq: any[] = [];
      var datasEosTerceiroFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralTerceiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaTerceiroTurno && geral.func === this.funcionarioTerceiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosTerceiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      // pego os ultimos 7 dias
      datasEosTerceiroFuncMaq.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(diasGrafico, this.dataLabelTerceiroTurno, this.quantidadesOSTerceiroTurno);


    // ! caso tenha data selecionada e maquina preenchida
    } else if (this.startDateGraficoTerceiroTurno !== null && this.maquinaSelecionadaTerceiroTurno !== "") {      
      var arrayDataFuncMaq: any[] = [];
      var datasEosTerceiroFuncMaq: any[] = [];
      
      this.geralTerceiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaTerceiroTurno && geral.func === this.funcionarioTerceiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosTerceiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoTerceiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoTerceiroTurno, 'yyyy-MM-dd');
      
      datasEosTerceiroFuncMaq = datasEosTerceiroFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosTerceiroFuncMaq.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelTerceiroTurno.push(element.substring(0, 10));
          this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });  
    }
        
    this.chartTerceiro!.data.datasets[0].data = this.quantidadesOSTerceiroTurno;
    this.chartTerceiro!.data.datasets[0].label = `Terceiro Turno - ${valor.option.value}`;
    this.chartTerceiro!.data.labels = this.dataLabelTerceiroTurno;

    this.chartTerceiro?.update();
  }

  clearFuncSelectTerTurno(event: any) {
    event.stopPropagation();
    this.funcionarioTerceiroTurnoSelecionado = "";

    this.dataLabelTerceiroTurno = [];
    this.quantidadesOSTerceiroTurno = [];
    this.chartTerceiro!.data.datasets[0].data = [];
    this.chartTerceiro!.data.labels = [];

    // !se a data nao tiver sido preenchida e maquina vazia
    if (this.startDateGraficoTerceiroTurno === null && this.maquinaSelecionadaTerceiroTurno === "") {
      this.primeiroTrintaDiasTerceiroTurno = this.primeiroTrintaDiasTerceiroTurno.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasTerceiroTurno.forEach((element: any) => {
        this.dataLabelTerceiroTurno.push(element.substring(0, 10));
        this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
      });
    
    // !se data vazia e maquina preenchida
    } else if (this.startDateGraficoTerceiroTurno === null && this.maquinaSelecionadaTerceiroTurno !== "") {      
      var arrayDatasMaq: any[] = [];
      var graficosDias: any[] = [];

      this.geralTerceiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaTerceiroTurno) {
          arrayDatasMaq.push(geral.data);
        }
      });
      
      // mando fazer o calculo de quantide de os's por dia
      this.datasEosTerceiroMaq = this.getQuantidadeOSFunction(arrayDatasMaq);      
  
      // pego os ultimos 7 dias
      this.datasEosTerceiroMaq.slice(0, 7).map((item: any, i: any) => {
        graficosDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(graficosDias, this.dataLabelTerceiroTurno, this.quantidadesOSTerceiroTurno);
    
    // !se data preenchida e maquina vazia
    } else if (this.startDateGraficoTerceiroTurno !== null && this.maquinaSelecionadaTerceiroTurno === "") { 
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
    
    // !se data preenchida e maquina preenchida
    } else if (this.startDateGraficoTerceiroTurno !== null && this.maquinaSelecionadaTerceiroTurno !== "") {      
      var arrayDataMaq: any[] = [];
      var datasEosTerceiroFuncMaq: any[] = [];
      
      this.geralTerceiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaTerceiroTurno) {
          // console.log(geral);
          arrayDataMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosTerceiroFuncMaq = this.getQuantidadeOSFunction(arrayDataMaq);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoTerceiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoTerceiroTurno, 'yyyy-MM-dd');
      
      datasEosTerceiroFuncMaq = datasEosTerceiroFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosTerceiroFuncMaq.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelTerceiroTurno.push(element.substring(0, 10));
          this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      }); 
    }

    // passando os valores atualizados
    this.chartTerceiro!.data.datasets[0].data = this.quantidadesOSTerceiroTurno;
    this.chartTerceiro!.data.labels = this.dataLabelTerceiroTurno;
    this.chartTerceiro!.data.datasets[0].label = `Terceiro Turno`;

    this.chartTerceiro?.update();
  }

  // * FUNÇÕES PARA SELECT DE FUNCIONÁRIO
  // *PRIMEIRO TURNO
  onMaqSelectPrimTurno(valor: any) {    
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
    this.datasEosPrimeiroMaq = this.getQuantidadeOSFunction(arrayDatasFunc);

    //  ! caso nenhuma data selecionada e funcionario vazio
    if (this.startDateGraficoPrimeiroTurno === null && this.funcionarioPrimeiroTurnoSelecionado === "") {    
      // pego os ultimos 7 dias
      this.datasEosPrimeiroMaq.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(trintaDias, this.dataLabelPrimeiroTurno, this.quantidadesOSPrimeiroTurno);

    //  ! caso tenha data selecionada e funcionario vazio
    } else if (this.startDateGraficoPrimeiroTurno !== null && this.funcionarioPrimeiroTurnoSelecionado === "") {
      startDateFormatada = this.datepipe.transform(this.startDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoPrimeiroTurno, 'yyyy-MM-dd');      

      this.datasEosPrimeiroMaq = this.datasEosPrimeiroMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosPrimeiroMaq.forEach(element => {
        
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
          this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });      
    
      // !caso data nao selecionada e funcionario foi preenchido
    } else if(this.startDateGraficoPrimeiroTurno === null && this.funcionarioPrimeiroTurnoSelecionado !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosPrimeiroFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralPrimeiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaPrimeiroTurno && geral.func === this.funcionarioPrimeiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosPrimeiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      // pego os ultimos 7 dias
      datasEosPrimeiroFuncMaq.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(diasGrafico, this.dataLabelPrimeiroTurno, this.quantidadesOSPrimeiroTurno);

    // !caso data selecionada e funcionario foi preenchido
    } else if (this.startDateGraficoPrimeiroTurno !== null && this.funcionarioPrimeiroTurnoSelecionado !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosPrimeiroFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralPrimeiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaPrimeiroTurno && geral.func === this.funcionarioPrimeiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosPrimeiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      
      datasEosPrimeiroFuncMaq = datasEosPrimeiroFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosPrimeiroFuncMaq.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
          this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      }); 
    }

    this.chartPrimeiro!.data.datasets[0].data = this.quantidadesOSPrimeiroTurno;
    this.chartPrimeiro!.data.labels = this.dataLabelPrimeiroTurno;

    this.chartPrimeiro?.update();
  }

  clearMaqSelectPrimTurno(event: any) {
    event.stopPropagation();
    this.maquinaSelecionadaPrimeiroTurno = "";

    this.dataLabelPrimeiroTurno = [];
    this.quantidadesOSPrimeiroTurno = [];
    this.chartPrimeiro!.data.datasets[0].data = [];
    this.chartPrimeiro!.data.labels = [];

    // !se a data nao tiver sido preenchida e funcionario vazio
    if (this.startDateGraficoPrimeiroTurno === null && this.funcionarioPrimeiroTurnoSelecionado === "") {
      this.primeiroTrintaDiasPrimeiroTurno = this.primeiroTrintaDiasPrimeiroTurno.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasPrimeiroTurno.forEach((element: any) => {
        this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
        this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
      });

      //  ! caso tenha data selecionada e funcionario vazio
    } else if (this.startDateGraficoPrimeiroTurno !== null && this.funcionarioPrimeiroTurnoSelecionado === "") {
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

     //  ! caso data nao selecionada e funcionario preenchido
    } else if (this.startDateGraficoPrimeiroTurno === null && this.funcionarioPrimeiroTurnoSelecionado !== "") {      
      var arrayDataFunc: any[] = [];
      var datasEosPrimeiroFunc: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralPrimeiroTurno.forEach(geral => {
        if (geral.func === this.funcionarioPrimeiroTurnoSelecionado) {
          // console.log(geral);
         arrayDataFunc.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosPrimeiroFunc = this.getQuantidadeOSFunction(arrayDataFunc);      
      // pego os ultimos 7 dias
      datasEosPrimeiroFunc.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(diasGrafico, this.dataLabelPrimeiroTurno, this.quantidadesOSPrimeiroTurno);

     //  ! caso data selecionada e funcionario preenchido
    } else if (this.startDateGraficoPrimeiroTurno !== null && this.funcionarioPrimeiroTurnoSelecionado !== "") {
      
      var arrayDataFunc: any[] = [];
      var datasEosPrimeiroFunc: any[] = [];
      
      this.geralPrimeiroTurno.forEach(geral => {
        if (geral.func === this.funcionarioPrimeiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFunc.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosPrimeiroFunc = this.getQuantidadeOSFunction(arrayDataFunc);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      
      datasEosPrimeiroFunc = datasEosPrimeiroFunc.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosPrimeiroFunc.forEach(element => {
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

  // *SEGUNDO TURNO
  onMaqSelectSegTurno(valor: any) {    
    var arrayDatasFunc: any[] = [];
    var trintaDias: any[] = [];
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
    this.datasEosSegundoMaq = this.getQuantidadeOSFunction(arrayDatasFunc);    

    //  ! caso nenhuma data selecionada e funcionario vazio
    if (this.startDateGraficoSegundoTurno === null && this.funcionarioSegundoTurnoSelecionado === "") {    
      // pego os ultimos 7 dias
      this.datasEosSegundoMaq.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(trintaDias, this.dataLabelSegundoTurno, this.quantidadesOSSegundoTurno);

    //  ! caso tenha data selecionada e funcionario vazio
    } else if (this.startDateGraficoSegundoTurno !== null && this.funcionarioSegundoTurnoSelecionado === "") {
      startDateFormatada = this.datepipe.transform(this.startDateGraficoSegundoTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoSegundoTurno, 'yyyy-MM-dd');      

      this.datasEosSegundoMaq = this.datasEosSegundoMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosSegundoMaq.forEach(element => {
        
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelSegundoTurno.push(element.substring(0, 10));
          this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
        }
      });      
    
      // !caso data nao selecionada e funcionario foi preenchido
    } else if(this.startDateGraficoSegundoTurno === null && this.funcionarioSegundoTurnoSelecionado !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosSegundoFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralSegundoTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaSegundoTurno && geral.func === this.funcionarioSegundoTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosSegundoFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      // pego os ultimos 7 dias
      datasEosSegundoFuncMaq.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(diasGrafico, this.dataLabelSegundoTurno, this.quantidadesOSSegundoTurno);

    // !caso data selecionada e funcionario foi preenchido
    } else if (this.startDateGraficoSegundoTurno !== null && this.funcionarioSegundoTurnoSelecionado !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosSegundoFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralSegundoTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaSegundoTurno && geral.func === this.funcionarioSegundoTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosSegundoFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoSegundoTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoSegundoTurno, 'yyyy-MM-dd');
      
      datasEosSegundoFuncMaq = datasEosSegundoFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosSegundoFuncMaq.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelSegundoTurno.push(element.substring(0, 10));
          this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
        }
      }); 
    }

    this.chartSegundo!.data.datasets[0].data = this.quantidadesOSSegundoTurno;
    this.chartSegundo!.data.labels = this.dataLabelSegundoTurno;

    this.chartSegundo?.update();
  }

  clearMaqSelectSegTurno(event: any) {
    event.stopPropagation();
    this.maquinaSelecionadaSegundoTurno = "";

    this.dataLabelSegundoTurno = [];
    this.quantidadesOSSegundoTurno = [];
    this.chartSegundo!.data.datasets[0].data = [];
    this.chartSegundo!.data.labels = [];

    // !se a data nao tiver sido preenchida e funcionario vazio
    if (this.startDateGraficoSegundoTurno === null && this.funcionarioSegundoTurnoSelecionado === "") {
      this.primeiroTrintaDiasSegundoTurno = this.primeiroTrintaDiasSegundoTurno.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasSegundoTurno.forEach((element: any) => {
        this.dataLabelSegundoTurno.push(element.substring(0, 10));
        this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
      });

      //  ! caso tenha data selecionada e funcionario vazio
    } else if (this.startDateGraficoSegundoTurno !== null && this.funcionarioSegundoTurnoSelecionado === "") {
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

     //  ! caso data nao selecionada e funcionario preenchido
    } else if (this.startDateGraficoSegundoTurno === null && this.funcionarioSegundoTurnoSelecionado !== "") {      
      var arrayDataFunc: any[] = [];
      var datasEosSegundoFunc: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralSegundoTurno.forEach(geral => {
        if (geral.func === this.funcionarioSegundoTurnoSelecionado) {
          // console.log(geral);
         arrayDataFunc.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosSegundoFunc = this.getQuantidadeOSFunction(arrayDataFunc);      
      // pego os ultimos 7 dias
      datasEosSegundoFunc.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(diasGrafico, this.dataLabelSegundoTurno, this.quantidadesOSSegundoTurno);

     //  ! caso data selecionada e funcionario preenchido
    } else if (this.startDateGraficoSegundoTurno !== null && this.funcionarioSegundoTurnoSelecionado !== "") {
      
      var arrayDataFunc: any[] = [];
      var datasEosSegundoFunc: any[] = [];
      
      this.geralSegundoTurno.forEach(geral => {
        if (geral.func === this.funcionarioSegundoTurnoSelecionado) {
          // console.log(geral);
          arrayDataFunc.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosSegundoFunc = this.getQuantidadeOSFunction(arrayDataFunc);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoSegundoTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoSegundoTurno, 'yyyy-MM-dd');
      
      datasEosSegundoFunc = datasEosSegundoFunc.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosSegundoFunc.forEach(element => {
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

  // *TERCEIRO TURNO
  onMaqSelectTerTurno(valor: any) {    
    var arrayDatasFunc: any[] = [];
    var trintaDias: any[] = [];
    var startDateFormatada: any;
    var endDateFormatada: any;

    this.dataLabelTerceiroTurno = [];
    this.quantidadesOSTerceiroTurno = [];
    this.chartTerceiro!.data.datasets[0].data = [];
    this.chartTerceiro!.data.datasets[0].label = "";
    this.chartTerceiro!.data.labels = [];
    
    this.geralTerceiroTurno.forEach(geral => {
      if (geral.maquina === this.maquinaSelecionadaTerceiroTurno) {
        arrayDatasFunc.push(geral.data);
      }
    });
    
    // mando fazer o calculo de quantide de os's por dia
    this.datasEosTerceiroMaq = this.getQuantidadeOSFunction(arrayDatasFunc);    

    //  ! caso nenhuma data selecionada e funcionario vazio
    if (this.startDateGraficoTerceiroTurno === null && this.funcionarioTerceiroTurnoSelecionado === "") {    
      // pego os ultimos 7 dias
      this.datasEosTerceiroMaq.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(trintaDias, this.dataLabelTerceiroTurno, this.quantidadesOSTerceiroTurno);

    //  ! caso tenha data selecionada e funcionario vazio
    } else if (this.startDateGraficoTerceiroTurno !== null && this.funcionarioTerceiroTurnoSelecionado === "") {
      startDateFormatada = this.datepipe.transform(this.startDateGraficoTerceiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoTerceiroTurno, 'yyyy-MM-dd');      

      this.datasEosTerceiroMaq = this.datasEosTerceiroMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosTerceiroMaq.forEach(element => {
        
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelTerceiroTurno.push(element.substring(0, 10));
          this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });      
    
      // !caso data nao selecionada e funcionario foi preenchido
    } else if(this.startDateGraficoTerceiroTurno === null && this.funcionarioTerceiroTurnoSelecionado !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosTerceiroFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralTerceiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaTerceiroTurno && geral.func === this.funcionarioTerceiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosTerceiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      // pego os ultimos 7 dias
      datasEosTerceiroFuncMaq.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(diasGrafico, this.dataLabelTerceiroTurno, this.quantidadesOSTerceiroTurno);

    // !caso data selecionada e funcionario foi preenchido
    } else if (this.startDateGraficoTerceiroTurno !== null && this.funcionarioTerceiroTurnoSelecionado !== "") {
      var arrayDataFuncMaq: any[] = [];
      var datasEosTerceiroFuncMaq: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralTerceiroTurno.forEach(geral => {
        if (geral.maquina === this.maquinaSelecionadaTerceiroTurno && geral.func === this.funcionarioTerceiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFuncMaq.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosTerceiroFuncMaq = this.getQuantidadeOSFunction(arrayDataFuncMaq);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoTerceiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoTerceiroTurno, 'yyyy-MM-dd');
      
      datasEosTerceiroFuncMaq = datasEosTerceiroFuncMaq.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosTerceiroFuncMaq.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelTerceiroTurno.push(element.substring(0, 10));
          this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      }); 
    }

    this.chartTerceiro!.data.datasets[0].data = this.quantidadesOSTerceiroTurno;
    this.chartTerceiro!.data.labels = this.dataLabelTerceiroTurno;

    this.chartTerceiro?.update();
  }

  clearMaqSelectTerTurno(event: any) {
    event.stopPropagation();
    this.maquinaSelecionadaTerceiroTurno = "";

    this.dataLabelTerceiroTurno = [];
    this.quantidadesOSTerceiroTurno = [];
    this.chartTerceiro!.data.datasets[0].data = [];
    this.chartTerceiro!.data.labels = [];

    // !se a data nao tiver sido preenchida e funcionario vazio
    if (this.startDateGraficoTerceiroTurno === null && this.funcionarioTerceiroTurnoSelecionado === "") {
      this.primeiroTrintaDiasTerceiroTurno = this.primeiroTrintaDiasTerceiroTurno.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasTerceiroTurno.forEach((element: any) => {
        this.dataLabelTerceiroTurno.push(element.substring(0, 10));
        this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
      });

      //  ! caso tenha data selecionada e funcionario vazio
    } else if (this.startDateGraficoTerceiroTurno !== null && this.funcionarioTerceiroTurnoSelecionado === "") {
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

     //  ! caso data nao selecionada e funcionario preenchido
    } else if (this.startDateGraficoTerceiroTurno === null && this.funcionarioTerceiroTurnoSelecionado !== "") {      
      var arrayDataFunc: any[] = [];
      var datasEosTerceiroFunc: any[] = [];
      var diasGrafico: any[] = [];
      
      this.geralTerceiroTurno.forEach(geral => {
        if (geral.func === this.funcionarioTerceiroTurnoSelecionado) {
          // console.log(geral);
         arrayDataFunc.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosTerceiroFunc = this.getQuantidadeOSFunction(arrayDataFunc);      
      // pego os ultimos 7 dias
      datasEosTerceiroFunc.slice(0, 7).map((item: any, i: any) => {
        diasGrafico.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(diasGrafico, this.dataLabelTerceiroTurno, this.quantidadesOSTerceiroTurno);

     //  ! caso data selecionada e funcionario preenchido
    } else if (this.startDateGraficoTerceiroTurno !== null && this.funcionarioTerceiroTurnoSelecionado !== "") {
      
      var arrayDataFunc: any[] = [];
      var datasEosTerceiroFunc: any[] = [];
      
      this.geralTerceiroTurno.forEach(geral => {
        if (geral.func === this.funcionarioTerceiroTurnoSelecionado) {
          // console.log(geral);
          arrayDataFunc.push(geral.data);
        }
      });

      // mando fazer o calculo de quantide de os's por dia
      datasEosTerceiroFunc = this.getQuantidadeOSFunction(arrayDataFunc);
      
      startDateFormatada = this.datepipe.transform(this.startDateGraficoTerceiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoTerceiroTurno, 'yyyy-MM-dd');
      
      datasEosTerceiroFunc = datasEosTerceiroFunc.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      datasEosTerceiroFunc.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelTerceiroTurno.push(element.substring(0, 10));
          this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      }); 
    }

    // passando os valores atualizados
    this.chartTerceiro!.data.datasets[0].data = this.quantidadesOSTerceiroTurno;
    this.chartTerceiro!.data.labels = this.dataLabelTerceiroTurno;
    this.chartTerceiro!.data.datasets[0].label = `Terceiro Turno`;

    this.chartTerceiro?.update();
  }
}
