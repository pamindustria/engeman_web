import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EngemanGerencialService } from '../../backend/services/engeman-gerencial.service';

@Component({
  selector: 'app-grafico-os',
  templateUrl: './grafico-os.component.html',
  styleUrls: ['./grafico-os.component.css']
})
export class GraficoOsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  datas: any[] = [];
  datasPrimeiroTurno: any[] = [];
  quantidadeOsPorDiaPrimeiroTurno: any[] = [];
  primeiroTrintaDiasPrimeiroTurno: any[] = [];
  dataLabelPrimeiroTurno: String[] = [];
  quantidadesOSPrimeiroTurno: number[] = [];

  datasSegundoTurno: any[] = [];
  quantidadeOsPorDiaSegundoTurno: any[] = [];
  primeiroTrintaDiasSegundoTurno: any[] = [];
  dataLabelSegundoTurno: String[] = [];
  quantidadesOSSegundoTurno: number[] = [];

  datasTerceiroTurno: any[] = [];
  quantidadeOsPorDiaTerceiroTurno: any[] = [];
  primeiroTrintaDiasTerceiroTurno: any[] = [];
  dataLabelTerceiroTurno: String[] = [];
  quantidadesOSTerceiroTurno: number[] = [];
  
  loadData: boolean = false;

  startDateGraficoPrimeiroTurno: any;
  endDateGraficoPrimeiroTurno: any;
  startDateGraficoSegundoTurno: any;
  endDateGraficoSegundoTurno: any;
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
          
        } else if(element.DataIni.substring(11, 19) > "15:00:00" && element.DataIni.substring(11, 19) <= "23:00:00") {
          this.datasSegundoTurno.push(element.DataIni.substring(0, 10));

        } else if(element.DataIni.substring(11, 19) > "23:00:00" || element.DataIni.substring(11, 19) <= "07:00:00") {
          this.datasTerceiroTurno.push(element.DataIni.substring(0, 10));          
        }
        
      });

      console.log('this.datasPrimeiroTurno');
      
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

      // * populando os dados para o grafico com 30 dias
      setTimeout(() => {
        this.populaGrafico(this.primeiroTrintaDiasPrimeiroTurno, this.dataLabelPrimeiroTurno, this.quantidadesOSPrimeiroTurno);
        this.populaGrafico(this.primeiroTrintaDiasSegundoTurno, this.dataLabelSegundoTurno, this.quantidadesOSSegundoTurno);
        this.populaGrafico(this.primeiroTrintaDiasTerceiroTurno, this.dataLabelTerceiroTurno, this.quantidadesOSTerceiroTurno);
        
        this.loadData = true;
      }, 1000);
      
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
  public barChartOptionsPrimeiroTurno: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
      }
    },
    plugins: {
      legend: {
        display: true,
      },
    }
  };
  public barChartTypePrimeiroTurno: ChartType = 'bar';

  public barChartDataPrimeiroTurno: ChartData<'bar'> = {
    labels: this.dataLabelPrimeiroTurno,
    datasets: [{
      data: this.quantidadesOSPrimeiroTurno, 
      label: 'Primeiro Turno',
      // backgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],
      // hoverBackgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],
    }]
  };

  // ? SEGUNDO TURNO
  public barChartOptionsSegundoTurno: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
      }
    },
    plugins: {
      legend: {
        display: true,
      },
    }
  };
  public barChartTypeSegundoTurno: ChartType = 'bar';

  public barChartDataSegundoTurno: ChartData<'bar'> = {
    labels: this.dataLabelSegundoTurno,
    datasets: [{
      data: this.quantidadesOSSegundoTurno, 
      label: 'Segundo Turno',
      // backgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],
      // hoverBackgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],
    }]
  };

  // ? TERCEIRO TURNO
  public barChartOptionsTerceiroTurno: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
      }
    },
    plugins: {
      legend: {
        display: true,
      },
    }
  };
  public barChartTypeTerceiroTurno: ChartType = 'bar';

  public barChartDataTerceiroTurno: ChartData<'bar'> = {
    labels: this.dataLabelTerceiroTurno,
    datasets: [{
      data: this.quantidadesOSTerceiroTurno, 
      label: 'Terceiro Turno',
      // backgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],
      // hoverBackgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],
    }]
  };

  // ? PRIMEIRO TURNO
  dateRangePrimeiroTurno(type: any, event: any) {
    // resetando os valores do grafico
    this.dataLabelPrimeiroTurno = [];
    this.quantidadesOSPrimeiroTurno = [];
    this.barChartDataPrimeiroTurno.datasets[0].data = [];
    this.barChartDataPrimeiroTurno.labels = [];

    var startDateFormatada: any;
    var endDateFormatada: any;
    
    if (event.value) {
      startDateFormatada = this.datepipe.transform(this.startDateGraficoPrimeiroTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoPrimeiroTurno, 'yyyy-MM-dd');      
    }

    this.quantidadeOsPorDiaPrimeiroTurno = this.quantidadeOsPorDiaPrimeiroTurno.sort((a, b) => a.localeCompare(b));
    
    // populando com os dados do cliente escolhido
    this.quantidadeOsPorDiaPrimeiroTurno.forEach(element => {
      if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
        this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
        this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
      }
    });

    // passando os valores atualizados
    this.barChartDataPrimeiroTurno.labels = this.dataLabelPrimeiroTurno;
    this.barChartDataPrimeiroTurno.datasets[0].data = this.quantidadesOSPrimeiroTurno;

    this.chart.chart?.update();
  }

  clearDatePrimeiroTurno(event: any) {
    event.stopPropagation();
    this.startDateGraficoPrimeiroTurno = null;
    this.endDateGraficoPrimeiroTurno = null;

    this.dataLabelPrimeiroTurno = [];
    this.quantidadesOSPrimeiroTurno = [];
    this.barChartDataPrimeiroTurno.datasets[0].data = [];
    this.barChartDataPrimeiroTurno.labels = [];

    this.primeiroTrintaDiasPrimeiroTurno = this.primeiroTrintaDiasPrimeiroTurno.sort((a, b) => a.localeCompare(b));

    this.primeiroTrintaDiasPrimeiroTurno.forEach((element: any) => {
      this.dataLabelPrimeiroTurno.push(element.substring(0, 10));
      this.quantidadesOSPrimeiroTurno.push(parseInt(element.substring(12, element.length)));
    });

    // passando os valores atualizados
    this.barChartDataPrimeiroTurno.labels = this.dataLabelPrimeiroTurno;
    this.barChartDataPrimeiroTurno.datasets[0].data = this.quantidadesOSPrimeiroTurno;

    // this.chart2?.update();
  }

  // ? SEGUNDO TURNO
  dateRangeSegundoTurno(type: any, event: any) {
    console.log('hello');
    
    // resetando os valores do grafico
    this.dataLabelSegundoTurno = [];
    this.quantidadesOSSegundoTurno = [];
    this.barChartDataSegundoTurno.datasets[0].data = [];
    this.barChartDataSegundoTurno.labels = [];

    var startDateFormatada: any;
    var endDateFormatada: any;
    
    if (event.value) {
      startDateFormatada = this.datepipe.transform(this.startDateGraficoSegundoTurno, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGraficoSegundoTurno, 'yyyy-MM-dd');      
    }

    this.quantidadeOsPorDiaSegundoTurno = this.quantidadeOsPorDiaSegundoTurno.sort((a, b) => a.localeCompare(b));
    
    // populando com os dados do cliente escolhido
    this.quantidadeOsPorDiaSegundoTurno.forEach(element => {
      if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
        this.dataLabelSegundoTurno.push(element.substring(0, 10));
        this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
      }
    });

    // passando os valores atualizados
    this.barChartDataSegundoTurno.labels = this.dataLabelSegundoTurno;
    this.barChartDataSegundoTurno.datasets[0].data = this.quantidadesOSSegundoTurno;

    this.chart.chart?.update();
  }

  clearDateSegundoTurno(event: any) {
    event.stopPropagation();
    this.startDateGraficoSegundoTurno = null;
    this.endDateGraficoSegundoTurno = null;

    this.dataLabelSegundoTurno = [];
    this.quantidadesOSSegundoTurno = [];
    this.barChartDataSegundoTurno.datasets[0].data = [];
    this.barChartDataSegundoTurno.labels = [];

    this.primeiroTrintaDiasSegundoTurno = this.primeiroTrintaDiasSegundoTurno.sort((a, b) => a.localeCompare(b));

    this.primeiroTrintaDiasSegundoTurno.forEach((element: any) => {
      this.dataLabelSegundoTurno.push(element.substring(0, 10));
      this.quantidadesOSSegundoTurno.push(parseInt(element.substring(12, element.length)));
    });

    // passando os valores atualizados
    this.barChartDataSegundoTurno.labels = this.dataLabelSegundoTurno;
    this.barChartDataSegundoTurno.datasets[0].data = this.quantidadesOSSegundoTurno;

    // this.chartSegundoTurno?.update();
  }

  // graph events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }
}
