import { Component, OnInit } from '@angular/core';
import { EngemanGerencialService } from 'src/app/pages/engeman-gerencial/backend/services/engeman-gerencial.service';
import { SessionService } from 'src/app/shared/session.service';

declare var $ :any;

@Component({
  selector: 'app-engeman-gerencial',
  templateUrl: './engeman-gerencial.component.html',
  styleUrls: ['./engeman-gerencial.component.css']
})
export class EngemanGerencialComponent implements OnInit {
  filterOS: string = '';
  filterFuncionario: string = '';
  filterDescricao: string = '';
  filterEquipamento: string = '';
  filterCodigo: string = '';
  searchDateInicio: string = '';
  searchDateFim: string = '';
  engemanOS: any[] = [];

  // ngx-pagination
  itemsPerPage: any = 20;
  currentPage: number = 1;
  totalRecords!: number;

  constructor(
    private engemanService: EngemanGerencialService,
    private sessionService: SessionService,
  ) { }
  
  ngOnInit() {
    // valerá somente se existir sessao
    if(this.sessionService.getItemPerPageEngeman()) {
      this.itemsPerPage = this.sessionService.getItemPerPageEngeman();
    }

    this.engemanService.getEngemanList().subscribe((engeman: any) => {
      engeman.forEach((os: any) => {
        this.engemanOS.push(os);
        this.totalRecords = this.engemanOS.length;
      });
    });
  }

  // salvando valor setado pelo usuario de numero de itens por pagina
  saveNumberOfItemsPerPage(num: number): void {
    this.sessionService.setItemPerPageEngeman(num);
  }
}
