import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { EtiquetasGerencialService } from 'src/app/pages/etiquetas/backend/services/etiquetas-gerencial.service';
import { ListaCarrosService } from 'src/app/pages/etiquetas/backend/services/lista-carros.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-cadastro-etiquetas',
  templateUrl: './cadastro-etiquetas.component.html',
  styleUrls: ['./cadastro-etiquetas.component.css']
})
export class CadastroEtiquetasComponent implements OnInit {
  filterEmbalagem: string = '';
  filterEtiqueta: string = '';
  filterManutencao: string = '';
  newWasClicked: boolean = false;
  isEditTrueIndex: number = -1;
  getEditSubscription!: Subscription;
  getDeleteSubscription!: Subscription;
  idCarro: number = 0;
  statusMaintenance: String = '';

  embalagensForm!: FormGroup;
  updateEmbalagensForm!: FormGroup;
  inactivateCartForm!: FormGroup;
  finishMaintenanceForm!: FormGroup;

  listaCarros: any[] = [];
  listaEtiquetas: any[] = []
  listaManutencao: any[] = []

  // paginação Manutencao
  currentPageManutencao = 1;
  itemsPerPageManutencao = 20;
  pageSizeManutencao!: number;

  // paginação Etiquetas
  currentPageEtiquetas = 1;
  itemsPerPageEtiquetas = 20;
  pageSizeEtiquetas!: number;

  // paginação Embalagens
  currentPageEmbalagens = 1;
  itemsPerPageEmbalagens = 15;
  pageSizeEmbalagens!: number;

  constructor(
    private listaCarrosService: ListaCarrosService, 
    private formBuilder: FormBuilder,
    private etiquetasService: EtiquetasGerencialService,
    private matDialog: MatDialog,
    private sharedService: SharedService
  ) {
    this.getEditSubscription = this.sharedService.getEditEmbalagemEvent()
    .subscribe(() => {
      this.editar(this.idCarro);
    });
    
    this.getDeleteSubscription = this.sharedService.getDeleteEmbalagemEvent()
    .subscribe(() => {
      this.deletar(this.idCarro);
    });
  }

  ngOnInit(): void {
    this.getListaEmbalagens();
    this.getListaEtiquetas();
    this.getListaMaintenances();

    this.embalagensForm = this.formBuilder.group({
      name: ['']
    })
    
    this.updateEmbalagensForm = this.formBuilder.group({
      name: ['']
    })
    
    this.inactivateCartForm = this.formBuilder.group({
      status: ['']
    })
    
    this.finishMaintenanceForm = this.formBuilder.group({
      finishedAt: ['']
    })
  }
  
  getListaEmbalagens() {
    this.listaCarrosService.getListaCarros().subscribe((carros: any) => {
      carros.forEach((carro: any) => {
        this.listaCarros.push(carro);
      });
    })
  }

  getListaMaintenances() {
    this.etiquetasService.getAllMaintenances().subscribe((manutencao: any) => {
      // cartIssues pode vir vazio, aqui preencho somente quanto tiver objeto em cartIssues
      manutencao.forEach((element: any) => {
        // console.log(element);
        this.listaManutencao.push(element);
      });
    },
    err => console.log(err)
    );
  }

  getListaEtiquetas() {
    this.etiquetasService.getEtiquetas().subscribe((etiquetas: any) => {
      // cartIssues pode vir vazio, aqui preencho somente quanto tiver objeto em cartIssues
      etiquetas.forEach((element: any) => {
        // if (element.cartIssues.length >= 1) {
          this.listaEtiquetas.push(element);
        // }        
      });
    },
    err => console.log(err)
    );
  }

  novaEmbalagem() {
    this.newWasClicked = !this.newWasClicked;
  }

  criarNovo() {
    const name = this.embalagensForm.getRawValue() as any;
    this.novaEmbalagem();
    
    this.etiquetasService.createEmbalagem(name).subscribe(
      data => {
        this.listaCarros = [];
        console.log(`Embalagem criada ${data}`);
        this.getListaEmbalagens();
        this.embalagensForm.get('name')?.setValue("");
      },
      err => console.log('Erro ao criar embalagem')
    )
  }

  deletar(id: number) {    
    this.etiquetasService.deleteEmbalagem(id).subscribe(
      data => {
        this.listaCarros = [];
        console.log(`Embalagem deletada com sucesso: ${data}`);
        this.getListaEmbalagens();
      },
      err => console.log('Erro ao deletar embalagem')
    )
  }
  
  selectEdit(index: number, idCarro: number) {
    this.isEditTrueIndex = index;

    this.etiquetasService.getSingleEtiquetas(idCarro)
    .subscribe((data: any) => {
      this.updateEmbalagensForm = this.formBuilder.group({
        name: [data.name]
      })
    });
  }

  editar(idCarro: number) {
    const name = this.updateEmbalagensForm.getRawValue() as any;
    this.isEditTrueIndex = -1;

    this.etiquetasService.updateEmbalagens(idCarro, name).subscribe(
      data => {
        this.listaCarros = [];
        console.log(`Embalagem atualizada com sucesso.`);
        this.getListaEmbalagens();
      },
      err => console.log('Erro ao atualizar embalagem.')
    )
  }
  
  voltar() {
    this.isEditTrueIndex = -1;
  }

  openDialog(texto: String, id: number, idDialog: number) {    
    // idDialog para identificar quem esta usando o componente
    // 0 para quando atualizando/1 para quando deletando
    const dialogConfig = new MatDialogConfig();
    this.idCarro = id;

    dialogConfig.disableClose = true;
    dialogConfig.width = "250px";
    dialogConfig.height = "180px";
    dialogConfig.data = {
      titulo: texto,
      idDialog: idDialog
    }

    const dialog = this.matDialog.open(ConfirmationDialogComponent, dialogConfig);    
  }

  changeCartStatus(id: number) {
    const status = this.inactivateCartForm.getRawValue() as any;
    console.log(status);

    this.etiquetasService.inactivateEtiqueta(id, status)
    .subscribe(
      data => {
        this.listaEtiquetas = [];
        console.log(`Função realizada com sucesso. ${data}`);
        this.getListaEtiquetas();
      },
      err => console.log('Ocorreu um erro ao tentar ativar/desativar a etiqueta'),
    )
  }

  changeMaintenanceStatus(idManutencao: number, idCart: number) {
    console.log(this.statusMaintenance);
    console.log(idManutencao);
    console.log(idCart);
    var data = new Date().toISOString();
    const status = { "status": "INACTIVE" };
    const finishedAt = { "finishedAt": data };

    if (this.statusMaintenance === "IDLE") {

      this.etiquetasService.finishMaintenance(idManutencao, finishedAt)
      .subscribe(
        data => {
          this.listaManutencao = [];
          console.log(`Manuntenção finalizada. ${data}`);
          this.getListaMaintenances();
        },
        err => console.log(`Ocorreu um erro ao tentar finalizar manutencao. ${err}`),
      );

    } else {

      this.etiquetasService.finishMaintenance(idManutencao, finishedAt)
      .subscribe(
        data => {
          console.log(`Manuntenção finalizada. ${data}`);

          console.log('desativando carrinho');
          this.etiquetasService.inactivateEtiqueta(idCart, status)
          .subscribe(
            data => {
              this.listaManutencao = [];
              console.log(`Função realizada com sucesso. ${data}`);
              this.getListaMaintenances();
            },
            err => console.log(`Ocorreu um erro ao tentar ativar/desativar o carrinho. ${err}`),
          );
        },
        err => console.log(`Ocorreu um erro ao tentar finalizar manutencao. ${err}`),
      );
      
    }
  }

  // paginacao Manutencao
  public onPageManuntencaoChange(pageNum: number): void {
    this.pageSizeManutencao = this.itemsPerPageManutencao*(pageNum - 1);
  }
  // paginacao Manutencao
  public changeManutencaoPagesize(num: number): void {
    this.itemsPerPageManutencao = this.pageSizeManutencao + num;
  }
  
  // paginacao Etiquetas
  public onPageEtiquetasChange(pageNum: number): void {
    this.pageSizeEtiquetas = this.itemsPerPageEtiquetas*(pageNum - 1);
  }
  // paginacao Etiquetas
  public changeEtiquetasPagesize(num: number): void {
    this.itemsPerPageEtiquetas = this.pageSizeEtiquetas + num;
  }
  
  // paginacao Embalagens
  public onPageEmbalagensChange(pageNum: number): void {
    this.pageSizeEmbalagens = this.itemsPerPageEmbalagens*(pageNum - 1);
  }
  // paginacao Embalagens
  public changeEmbalagensPagesize(num: number): void {
    this.itemsPerPageEmbalagens = this.pageSizeEmbalagens + num;
  }
}
