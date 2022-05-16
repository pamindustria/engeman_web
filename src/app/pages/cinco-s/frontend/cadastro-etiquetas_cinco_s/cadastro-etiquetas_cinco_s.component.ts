import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { SessionService } from 'src/app/shared/session.service';
import { SharedService } from 'src/app/shared/shared.service';
import { EtiquetasGerencialCincoSService } from '../../backend/services/etiquetas-gerencial_cinco_s.service';
import { ListaCarrosCincoSService } from '../../backend/services/lista-carros_cinco_s.service';

@Component({
  selector: 'app-cadastro-etiquetas_cinco_s',
  templateUrl: './cadastro-etiquetas_cinco_s.component.html',
  styleUrls: ['./cadastro-etiquetas_cinco_s.component.css']
})
export class CadastroEtiquetasCincoSComponent implements OnInit {
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
  itemsPerPageManutencao: any = 20;
  totalRecordsManutencao!: number;

  // paginação Etiquetas
  currentPageEtiquetas = 1;
  itemsPerPageEtiquetas: any = 20;
  totalRecordsEtiquetas!: number;

  // paginação Embalagens
  currentPageEmbalagens = 1;
  itemsPerPageEmbalagens: any = 15;
  totalRecordsEmabalages!: number;

  constructor(
    private listaCarrosService: ListaCarrosCincoSService, 
    private formBuilder: FormBuilder,
    private etiquetasService: EtiquetasGerencialCincoSService,
    private matDialog: MatDialog,
    private sharedService: SharedService,
    private sessionService: SessionService,
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
    // valerá somente se existir sessao
    if(this.sessionService.getItemPerPageCadastroEmbalagem()) {
      this.itemsPerPageEmbalagens = this.sessionService.getItemPerPageCadastroEmbalagem();
    }
    // valerá somente se existir sessao
    if(this.sessionService.getItemPerPageCadastroEtiquetas()) {
      this.itemsPerPageEtiquetas = this.sessionService.getItemPerPageCadastroEtiquetas();
    }
    // valerá somente se existir sessao
    if(this.sessionService.getItemPerPageManutencao()) {
      this.itemsPerPageManutencao = this.sessionService.getItemPerPageManutencao();
    }

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
        this.totalRecordsEmabalages = this.listaCarros.length;
      });
    })
  }

  getListaMaintenances() {
    this.etiquetasService.getAllMaintenances().subscribe((manutencao: any) => {
      // cartIssues pode vir vazio, aqui preencho somente quanto tiver objeto em cartIssues
      manutencao.forEach((element: any) => {
        // console.log(element);
        this.listaManutencao.push(element);
        this.totalRecordsManutencao = this.listaManutencao.length;
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
          this.totalRecordsEtiquetas = this.listaEtiquetas.length;
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

  // salvando valor setado pelo usuario de numero de itens por pagina
  saveNumberOfItemsPerPageEmbalagens(num: number): void {
    this.sessionService.setItemPerPageCadastroEmbalagem(num);
  }
  
  // salvando valor setado pelo usuario de numero de itens por pagina
  saveNumberOfItemsPerPageEtiquetas(num: number): void {
    this.sessionService.setItemPerPageCadastroEtiquetas(num);
  }
  
  // salvando valor setado pelo usuario de numero de itens por pagina
  saveNumberOfItemsPerPageManutencao(num: number): void {
    this.sessionService.setItemPerPageManutencao(num);
  }
}
