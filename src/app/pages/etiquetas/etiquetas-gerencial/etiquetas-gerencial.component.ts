import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { SharedService } from 'src/app/shared/shared.service';
import { EtiquetasGerencialService } from '../../../services/etiquetas-gerencial.service';

@Component({
  selector: 'app-etiquetas-gerencial',
  templateUrl: './etiquetas-gerencial.component.html',
  styleUrls: ['./etiquetas-gerencial.component.css']
})
export class EtiquetasGerencialComponent implements OnInit {
  filterEtiqueta: string = '';
  filterCliente: string = '';
  filterStatus: string = '';
  filterEmbalagem: string = '';
  searchDateSaida: string = '';
  searchDateRetorno: string = '';
  
  dadosClientes: any[] = [];
  getEventsubscription!: Subscription;
  showFiltrosCliente: boolean = true;

  constructor(
    private etiquetasService: EtiquetasGerencialService,
    private sharedService: SharedService,
    private loadingService: LoadingService
  ) {
    this.getEventsubscription = this.sharedService.getMethodEvent().subscribe(isVazio => {
      this.mostrarFiltroCliente(isVazio);
    })
  }

  mostrarFiltroCliente(value: boolean) {
    this.showFiltrosCliente = value;
  }

  ngOnInit(): void {
    this.loadingService.start();
    this.etiquetasService.getEtiquetas().subscribe((etiquetas: any) => {
      // cartIssues pode vir vazio, aqui preencho somente quanto tiver objeto em cartIssues
      etiquetas.forEach((element: any) => {
        console.log(element.status);
        
        // if (element.cartIssues.length >= 1) {
        if (element.status === 'OUT') {
          this.dadosClientes.push(element);
          // console.log(this.dadosClientes);
          
        }        
      });
    },
    err => console.log(err)
    );
  } 
}
