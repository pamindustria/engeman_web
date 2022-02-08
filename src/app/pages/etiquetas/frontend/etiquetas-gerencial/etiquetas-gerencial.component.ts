import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EtiquetasGerencialService } from 'src/app/pages/etiquetas/backend/services/etiquetas-gerencial.service';
import { SessionService } from 'src/app/shared/session.service';
import { SharedService } from 'src/app/shared/shared.service';

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

  // paginação
  currentPage = 1;
  itemsPerPage: any = 14;
  pageSize!: number;

  constructor(
    private etiquetasService: EtiquetasGerencialService,
    private sharedService: SharedService,
    private sessionService: SessionService,
  ) {
    this.getEventsubscription = this.sharedService.getMethodEvent().subscribe(isVazio => {
      this.mostrarFiltroCliente(isVazio);
    })
  }

  ngOnInit(): void {
    // valerá somente se existir sessao
    if(this.sessionService.getItemPerPageListaEtiqueta()) {
      this.itemsPerPage = this.sessionService.getItemPerPageListaEtiqueta();
    }

    this.etiquetasService.getEtiquetas().subscribe((etiquetas: any) => {
      // cartIssues pode vir vazio, aqui preencho somente quanto tiver objeto em cartIssues
      etiquetas.forEach((element: any) => {        
        // if (element.cartIssues.length >= 1) {
        if (element.status === 'OUT') {          
          this.dadosClientes.push(element);
          this.dadosClientes = this.dadosClientes.sort((a, b) => b.cartIssues[0].readAt.localeCompare(a.cartIssues[0].readAt));          
        }        
      });
    },
    err => console.log(err)
    );
  } 

  mostrarFiltroCliente(value: boolean) {
    this.showFiltrosCliente = value;
  }

  // paginacao
  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage*(pageNum - 1);
  }
  // paginacao
  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }
  
  // salvando valor setado pelo usuario de numero de itens por pagina
  saveNumberOfItemssPerPage(num: number): void {
    this.sessionService.setItemPerPageListaEtiqueta(num);
  }
}
