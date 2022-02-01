import { Component, OnInit } from '@angular/core';
import { EngemanGerencialService } from 'src/app/pages/engeman-gerencial/backend/services/engeman-gerencial.service';

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

  constructor(
    private engemanService: EngemanGerencialService
  ) { }
  
  ngOnInit() {
    this.engemanService.getEngemanList().subscribe((engeman: any) => {
      engeman.forEach((os: any) => {
        this.engemanOS.push(os);
      });
    });
  }
}
