import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
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
  dataAtualFormatada: String = "";

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

  datasSegundoTurno: any[] = [];
  quantidadeOsPorDiaSegundoTurno: any[] = [];
  primeiroTrintaDiasSegundoTurno: any[] = [];
  dataLabelSegundoTurno: String[] = [];
  quantidadesOSSegundoTurno: number[] = [];
  labelPorHoraSegundoTurno: String[] = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  dadosOSSegundoTurno: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  datasTerceiroTurno: any[] = [];
  quantidadeOsPorDiaTerceiroTurno: any[] = [];
  primeiroTrintaDiasTerceiroTurno: any[] = [];
  dataLabelTerceiroTurno: String[] = [];
  quantidadesOSTerceiroTurno: number[] = [];
  labelPorHoraTerceiroTurno: String[] = ['23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'];
  dadosOSTerceiroTurno: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  
  loadData: boolean = false;

  startDateGraficoPrimeiroTurno: any;
  endDateGraficoPrimeiroTurno: any;
  startDateGraficoSegundoTurno: any;
  endDateGraficoSegundoTurno: any;
  startDateGraficoTerceiroTurno: any;
  endDateGraficoTerceiroTurno: any;
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
    var dataAtual = new Date().toLocaleDateString();
    console.log(new Date().toLocaleDateString());
    this.dataAtualFormatada = dataAtual.split("/").reverse().join("-");
    console.log(this.dataAtualFormatada);

    this.engemanService.getEngemanList().subscribe((engeman: any) => {
      
      engeman.forEach((element: any) => {
        // * adiciona somente a data, sem a hora a array Datas
        this.datas.push(element.DataIni.substring(0, 10));        

        // * passando os valores de cada turno
        if (element.DataIni.substring(11, 19) >= "07:00:00" && element.DataIni.substring(11, 19) < "15:00:00") {
          this.datasPrimeiroTurno.push(element.DataIni.substring(0, 10));
          
        } else if(element.DataIni.substring(11, 19) >= "15:00:00" && element.DataIni.substring(11, 19) < "23:00:00") {
          this.datasSegundoTurno.push(element.DataIni.substring(0, 10));

        } else if(element.DataIni.substring(11, 19) >= "23:00:00" || element.DataIni.substring(11, 19) < "07:00:00") {
          this.datasTerceiroTurno.push(element.DataIni.substring(0, 10));          
        }        

        // * passando os valores por hora de cada turno
        this.dadosPorHoraPrimeiroTurnoFunction(element);
        this.dadosPorHoraSegundoTurnoFunction(element);
        this.dadosPorHoraTerceiroTurnoFunction(element);
      });

      setTimeout(() => {
        console.log('Primeiro Turno');
        console.log(this.dadosOSPrimeiroTurno);
        console.log('Segundo Turno');
        console.log(this.dadosOSSegundoTurno);
        console.log('Terceiro Turno');
        console.log(this.dadosOSTerceiroTurno);
      }, 1000);
      
      this.quantidadeOsPorDiaPrimeiroTurno = this.getQuantidadeOSFunction(this.datasPrimeiroTurno);    
      this.quantidadeOsPorDiaSegundoTurno = this.getQuantidadeOSFunction(this.datasSegundoTurno);    
      this.quantidadeOsPorDiaTerceiroTurno = this.getQuantidadeOSFunction(this.datasTerceiroTurno);    
      
      // console.log(this.quantidadeOsPorDiaPrimeiroTurno);
      // console.log(this.quantidadeOsPorDiaSegundoTurno);
      // console.log(this.quantidadeOsPorDiaTerceiroTurno);

      // * exibo somente os primeiros dias 30
      this.quantidadeOsPorDiaPrimeiroTurno.slice(0, 30).map((item: any, i: any) => {
        this.primeiroTrintaDiasPrimeiroTurno.push(item);
      });
      
      this.quantidadeOsPorDiaSegundoTurno.slice(0, 30).map((item: any, i: any) => {
        this.primeiroTrintaDiasSegundoTurno.push(item);
      });
      
      this.quantidadeOsPorDiaTerceiroTurno.slice(0, 30).map((item: any, i: any) => {
        this.primeiroTrintaDiasTerceiroTurno.push(item);
      });

      // * populando os dados para o grafico com os ultimos 30 dias
      setTimeout(() => {
        this.populaGrafico(this.primeiroTrintaDiasPrimeiroTurno, this.dataLabelPrimeiroTurno, this.quantidadesOSPrimeiroTurno);
        this.populaGrafico(this.primeiroTrintaDiasSegundoTurno, this.dataLabelSegundoTurno, this.quantidadesOSSegundoTurno);
        this.populaGrafico(this.primeiroTrintaDiasTerceiroTurno, this.dataLabelTerceiroTurno, this.quantidadesOSTerceiroTurno);
        
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

  populaGrafico(arrayDias: any, dataLabel: any, quantidadesOS: any) {
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

    this.quantidadeOsPorDiaPrimeiroTurno = this.quantidadeOsPorDiaPrimeiroTurno.sort((a, b) => a.localeCompare(b));
    
    // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
    this.quantidadeOsPorDiaPrimeiroTurno.forEach(element => {
      if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
        this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
        this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
      }
    });

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

    this.primeiroTrintaDiasPrimeiroTurno = this.primeiroTrintaDiasPrimeiroTurno.sort((a, b) => a.localeCompare(b));

    // populando os dados com os ultimos 30 dias
    this.primeiroTrintaDiasPrimeiroTurno.forEach((element: any) => {
      this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
      this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
    });

    // passando os valores atualizados
    this.chartPrimeiro!.data.datasets[0].data = this.quantidadesOSPrimeiroTurno;
    this.chartPrimeiro!.data.labels = this.dataLabelPrimeiroTurno;

    this.chartPrimeiro?.update();
  }

  // ? SEGUNDO TURNO
  dateRangeSegundoTurno(type: any, event: any) {
    console.log('hello');
    
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

    this.quantidadeOsPorDiaSegundoTurno = this.quantidadeOsPorDiaSegundoTurno.sort((a, b) => a.localeCompare(b));
    
    // populando o grafico com os dados que possuem a data entre startDateFormatada e endDateFormatada
    this.quantidadeOsPorDiaSegundoTurno.forEach(element => {
      if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
        this.dataLabelSegundoTurno.push(element.substring(0, 10));
        this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
      }
    });

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

    this.primeiroTrintaDiasSegundoTurno = this.primeiroTrintaDiasSegundoTurno.sort((a, b) => a.localeCompare(b));

    // populando os dados com os ultimos 30 dias
    this.primeiroTrintaDiasSegundoTurno.forEach((element: any) => {
      this.dataLabelSegundoTurno.push(element.substring(0, 10));
      this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
    });

    // passando os valores atualizados
    this.chartSegundo!.data.datasets[0].data = this.quantidadesOSSegundoTurno;
    this.chartSegundo!.data.labels = this.dataLabelSegundoTurno;

    this.chartSegundo?.update();
  }

  // ? TERCEIRO TURNO
  dateRangeTerceiroTurno(type: any, event: any) {
    console.log('hello');
    
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

    this.dataLabelTerceiroTurno = [];
    this.quantidadesOSTerceiroTurno = [];
    this.chartTerceiro!.data.datasets[0].data = [];
    this.chartTerceiro!.data.labels = [];

    this.primeiroTrintaDiasTerceiroTurno = this.primeiroTrintaDiasTerceiroTurno.sort((a, b) => a.localeCompare(b));

    // populando os dados com os ultimos 30 dias
    this.primeiroTrintaDiasTerceiroTurno.forEach((element: any) => {
      this.dataLabelTerceiroTurno.push(element.substring(0, 10));
      this.quantidadesOSTerceiroTurno.push(parseInt(element.substring(12, element.length)));
    });

    // passando os valores atualizados
    this.chartTerceiro!.data.datasets[0].data = this.quantidadesOSTerceiroTurno;
    this.chartTerceiro!.data.labels = this.dataLabelTerceiroTurno;

    this.chartTerceiro?.update();
  }

  dadosPorHoraPrimeiroTurnoFunction(element: any) {
    if (element.DataIni.substring(0, 10) === this.dataAtualFormatada) {
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

  dadosPorHoraSegundoTurnoFunction(element: any) {
    if (element.DataIni.substring(0, 10) === this.dataAtualFormatada) {
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
  
  dadosPorHoraTerceiroTurnoFunction(element: any) {
    if (element.DataIni.substring(0, 10) === this.dataAtualFormatada) {
      if (element.DataIni.substring(11, 19) >= "23:00:00" && element.DataIni.substring(11, 19) < "00:00:00") {
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
}
