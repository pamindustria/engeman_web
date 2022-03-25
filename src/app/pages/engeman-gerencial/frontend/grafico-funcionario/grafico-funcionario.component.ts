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

  datasSegundoTurno: any[] = [];
  quantidadeOsPorDiaSegundoTurno: any[] = [];
  primeiroTrintaDiasSegundoTurno: any[] = [];
  dataLabelSegundoTurno: String[] = [];
  quantidadesOSSegundoTurno: number[] = [];
  funcionariosSegundoTurno: string[] = [];
  geralSegundoTurno: any[] = [];
  funcionarioSegundoTurnoSelecionado: String = '';
  datasEosSegundo: any[] = [];

  datasTerceiroTurno: any[] = [];
  quantidadeOsPorDiaTerceiroTurno: any[] = [];
  primeiroTrintaDiasTerceiroTurno: any[] = [];
  dataLabelTerceiroTurno: String[] = [];
  quantidadesOSTerceiroTurno: number[] = [];
  funcionariosTerceiroTurno: string[] = [];
  geralTerceiroTurno: any[] = [];
  funcionarioTerceiroTurnoSelecionado: String = '';
  datasEosTerceiro: any[] = [];
  
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

        if (element.DataIni.substring(11, 19) > "07:00:00" && element.DataIni.substring(11, 19) <= "15:00:00") {
          this.datasPrimeiroTurno.push(element.DataIni.substring(0, 10));

          this.geralPrimeiroTurno.push({func: element.NomeFunc, data: element.DataIni.substring(0, 10)});
          // para popular o select de funcionarios
          if (!this.funcionariosPrimeiroTurno.includes(element.NomeFunc)) {
            this.funcionariosPrimeiroTurno.push(element.NomeFunc);
          }
          
          
        } else if(element.DataIni.substring(11, 19) > "15:00:00" && element.DataIni.substring(11, 19) <= "23:00:00") {
          this.datasSegundoTurno.push(element.DataIni.substring(0, 10));

          this.geralSegundoTurno.push({func: element.NomeFunc, data: element.DataIni.substring(0, 10)});
          // para popular o select de funcionarios
          if (!this.funcionariosSegundoTurno.includes(element.NomeFunc)) {
            this.funcionariosSegundoTurno.push(element.NomeFunc);
          }
          
        } else if(element.DataIni.substring(11, 19) > "23:00:00" || element.DataIni.substring(11, 19) <= "07:00:00") {
          this.datasTerceiroTurno.push(element.DataIni.substring(0, 10));  
          
          this.geralTerceiroTurno.push({func: element.NomeFunc, data: element.DataIni.substring(0, 10)});
          // para popular o select de funcionarios
          if (!this.funcionariosTerceiroTurno.includes(element.NomeFunc)) {
            this.funcionariosTerceiroTurno.push(element.NomeFunc);
          }
        }
        
      });
      
      // fazendo o calculo geral de os por dia
      this.quantidadeOsPorDiaPrimeiroTurno = this.getQuantidadeOSFunction(this.datasPrimeiroTurno);    
      this.quantidadeOsPorDiaSegundoTurno = this.getQuantidadeOSFunction(this.datasSegundoTurno);    
      this.quantidadeOsPorDiaTerceiroTurno = this.getQuantidadeOSFunction(this.datasTerceiroTurno);

      // * exibo somente os primeiros dias 30
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

    // !se funcionario vazio
    if (this.funcionarioPrimeiroTurnoSelecionado === "") {
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

    this.dataLabelPrimeiroTurno = [];
    this.quantidadesOSPrimeiroTurno = [];
    this.chartPrimeiro!.data.datasets[0].data = [];
    this.chartPrimeiro!.data.labels = [];
    var trintaDias:  any[] = [];

    // !se funcionario vazio
    if (this.funcionarioPrimeiroTurnoSelecionado === "") {
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

    // !se funcionario vazio
    if (this.funcionarioSegundoTurnoSelecionado === "") {
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

    this.dataLabelSegundoTurno = [];
    this.quantidadesOSSegundoTurno = [];
    this.chartSegundo!.data.datasets[0].data = [];
    this.chartSegundo!.data.labels = [];
    var trintaDias:  any[] = [];

    // !se funcionario vazio
    if (this.funcionarioSegundoTurnoSelecionado === "") {
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

    // !se funcionario vazio
    if (this.funcionarioTerceiroTurnoSelecionado === "") {
      this.quantidadeOsPorDiaTerceiroTurno = this.quantidadeOsPorDiaTerceiroTurno.sort((a, b) => a.localeCompare(b));
  
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.quantidadeOsPorDiaTerceiroTurno.forEach(element => {
        if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
          this.dataLabelTerceiroTurno.push(element.substring(0, 10));
          this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
        }
      });

    } else {
      this.datasEosTerceiro = this.datasEosTerceiro.sort((a, b) => a.localeCompare(b));
    
      // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
      this.datasEosTerceiro.forEach(element => {
        
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
    var trintaDias:  any[] = [];

    // !se funcionario vazio
    if (this.funcionarioTerceiroTurnoSelecionado === "") {
      this.primeiroTrintaDiasTerceiroTurno = this.primeiroTrintaDiasTerceiroTurno.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      this.primeiroTrintaDiasTerceiroTurno.forEach((element: any) => {
        this.dataLabelTerceiroTurno.push(element.substring(0, 10));
        this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
      });

    } else {
      this.datasEosTerceiro = this.datasEosTerceiro.sort((a, b) => b.localeCompare(a));
      
      // pego os ultimos 7 dias
      this.datasEosTerceiro.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      trintaDias = trintaDias.sort((a, b) => a.localeCompare(b));

      // populando os dados com os ultimos 7 dias
      trintaDias.forEach((element: any) => {
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
  onItemSelectPrimTurno(valor: any) {    
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
    this.chartPrimeiro!.data.datasets[0].label = `Primeiro Turno - ${valor.option.value}`;
    this.chartPrimeiro!.data.labels = this.dataLabelPrimeiroTurno;

    this.chartPrimeiro?.update();
  }

  clearSelectPrimTurno(event: any) {
    event.stopPropagation();
    this.funcionarioPrimeiroTurnoSelecionado = "";

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

  // *SEGUNDO TURNO
  onItemSelectSegTurno(valor: any) {        
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
    this.chartSegundo!.data.datasets[0].label = `Segundo Turno - ${valor.option.value}`;
    this.chartSegundo!.data.labels = this.dataLabelSegundoTurno;

    this.chartSegundo?.update();
  }

  clearSelectSegTurno(event: any) {
    event.stopPropagation();
    this.funcionarioSegundoTurnoSelecionado = "";

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

  // *TERCEIRO TURNO
  onItemSelectTerTurno(valor: any) {        
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

    // mando fazer o calculo de quantide de os's por dia
    this.datasEosTerceiro = this.getQuantidadeOSFunction(arrayDatasFunc);
    
    //  ! caso nenhuma data selecionada
    if (this.startDateGraficoTerceiroTurno === null) {    
      // pego os ultimos 7 dias
      this.datasEosTerceiro.slice(0, 7).map((item: any, i: any) => {
        trintaDias.push(item);
      });
      
      // preencho o grafico com a informação dos ultimos 7 dias
      this.preencherDadosGrafico(trintaDias, this.dataLabelTerceiroTurno, this.quantidadesOSTerceiroTurno);

    //  ! caso tenha data selecionada
    } else {
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
    }
        
    this.chartTerceiro!.data.datasets[0].data = this.quantidadesOSTerceiroTurno;
    this.chartTerceiro!.data.datasets[0].label = `Terceiro Turno - ${valor.option.value}`;
    this.chartTerceiro!.data.labels = this.dataLabelTerceiroTurno;

    this.chartTerceiro?.update();
  }

  clearSelectTerTurno(event: any) {
    event.stopPropagation();
    this.funcionarioTerceiroTurnoSelecionado = "";

    this.dataLabelTerceiroTurno = [];
    this.quantidadesOSTerceiroTurno = [];
    this.chartTerceiro!.data.datasets[0].data = [];
    this.chartTerceiro!.data.labels = [];

    // !se a data nao tiver sido preenchida
    if (this.startDateGraficoTerceiroTurno === null) {
      this.primeiroTrintaDiasTerceiroTurno = this.primeiroTrintaDiasTerceiroTurno.sort((a, b) => a.localeCompare(b));

    // populando os dados com os ultimos 7 dias
    this.primeiroTrintaDiasTerceiroTurno.forEach((element: any) => {
      this.dataLabelTerceiroTurno.push(element.substring(0, 10));
      this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
    });

    } else {
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
    }

    // passando os valores atualizados
    this.chartTerceiro!.data.datasets[0].data = this.quantidadesOSTerceiroTurno;
    this.chartTerceiro!.data.labels = this.dataLabelTerceiroTurno;
    this.chartTerceiro!.data.datasets[0].label = `Terceiro Turno`;

    this.chartTerceiro?.update();
  }
}
