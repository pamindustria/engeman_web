import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EngemanGerencialService } from '../../backend/services/engeman-gerencial.service';

@Component({
  selector: 'app-grafico-os',
  templateUrl: './grafico-os.component.html',
  styleUrls: ['./grafico-os.component.css']
})
export class GraficoOsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  datas: any[] = [];
  quantidadeOsPorDia: any[] = [];
  primeiroTrintaDias: any[] = [];
  dataLabel: String[] = [];
  quantidadesOS: number[] = [];
  loadData: boolean = false;

  startDateGrafico: any;
  endDateGrafico: any;
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
      });

      // * nessa função, verifico a quantidade de vezes em que o mesmo dia se repete,
      // * significa que mais de uma OS foi aberta no dia e armazeno os dias e a quantidade de OS na array
      this.quantidadeOsPorDia = Object.values(this.datas.reduce((c, v) => {
        c[v] = c[v] || [v, 0];
        c[v][1]++;
        return c;
      },{})).map((o: any)=>(`${[o[0]]}: ${o[1]}`));      
      
      // * exibo somente os primeiros dias 30
      this.quantidadeOsPorDia.slice(0, 30).map((item: any, i: any) => {
        this.primeiroTrintaDias.push(item);
      });

      // * populando os dados para o grafico com 30 dias
      setTimeout(() => {
        // ordem crescente
        this.primeiroTrintaDias = this.primeiroTrintaDias.sort((a, b) => a.localeCompare(b));

        this.primeiroTrintaDias.forEach((element: any) => {
          this.dataLabel.push(element.substring(0, 10));
          this.quantidadesOS.push(parseInt(element.substring(12, element.length)));

          this.loadData = true;
        });
      }, 1000);
    });    
  }


  public barChartOptions: ChartConfiguration['options'] = {
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
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: this.dataLabel,
    datasets: [{
      data: this.quantidadesOS, 
      label: 'OS por Dia',
      // backgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],
      // hoverBackgroundColor: [
      //   'rgba(153, 102, 255)',
      // ],
    }]
  };

  dateRange(type: any, event: any) {
    // resetando os valores do grafico
    this.dataLabel = [];
    this.quantidadesOS = [];
    this.barChartData.datasets[0].data = [];
    this.barChartData.labels = [];

    var startDateFormatada: any;
    var endDateFormatada: any;
    
    if (event.value) {
      startDateFormatada = this.datepipe.transform(this.startDateGrafico, 'yyyy-MM-dd');
      endDateFormatada = this.datepipe.transform(this.endDateGrafico, 'yyyy-MM-dd');      
    }

    this.quantidadeOsPorDia = this.quantidadeOsPorDia.sort((a, b) => a.localeCompare(b));
    
    // populando com os dados do cliente escolhido
    this.quantidadeOsPorDia.forEach(element => {
      if (element.substring(0, 10) >= startDateFormatada && element.substring(0, 10) <= endDateFormatada) {
        this.dataLabel.push(element.substring(0, 10));
        this.quantidadesOS.push(parseInt(element.substring(12, element.length)));
      }
    });

    // passando os valores atualizados
    this.barChartData.labels = this.dataLabel;
    this.barChartData.datasets[0].data = this.quantidadesOS;

    this.chart?.update();
  }

  clearDate(event: any) {
    event.stopPropagation();
    this.startDateGrafico = null;
    this.endDateGrafico = null;

    this.dataLabel = [];
    this.quantidadesOS = [];
    this.barChartData.datasets[0].data = [];
    this.barChartData.labels = [];

    this.primeiroTrintaDias = this.primeiroTrintaDias.sort((a, b) => a.localeCompare(b));

    this.primeiroTrintaDias.forEach((element: any) => {
      this.dataLabel.push(element.substring(0, 10));
      this.quantidadesOS.push(parseInt(element.substring(12, element.length)));
    });

    // passando os valores atualizados
    this.barChartData.labels = this.dataLabel;
    this.barChartData.datasets[0].data = this.quantidadesOS;

    this.chart?.update();
  }

  // graph events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }
}
